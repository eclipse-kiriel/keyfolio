/**
 * Data Storage & State Management Layer
 * Handles LocalStorage/IndexedDB, Event subscriptions, Export/Import,
 * and future-proof hooks for E2EE encryption.
 */

import { STORAGE_KEYS, INITIAL_KEYBOARDS, INITIAL_KEYCAPS } from './constants.js';

class DataStore {
  constructor() {
    this.keyboards = [];
    this.keycaps = [];
    this.listeners = new Set();
    this.cloudSyncCallback = null;
    this.lastAction = null;
    this.init();
  }

  init() {
    try {
      localStorage.removeItem('kb_builds_v1');
      const savedKeyboards = localStorage.getItem(STORAGE_KEYS.KEYBOARDS);
      const savedKeycaps = localStorage.getItem(STORAGE_KEYS.KEYCAPS);

      if (savedKeyboards) {
        this.keyboards = JSON.parse(savedKeyboards).map(kb => {
          if (kb.customFields) {
            kb.customFields = kb.customFields.filter(cf => cf && cf.label && !cf.label.includes('래피드'));
          }
          if (kb.fields && kb.fields.soundLink === 'https://youtube.com/shorts/sample') {
            kb.fields.soundLink = '';
          }
          return kb;
        });
        this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
      } else {
        this.keyboards = [...INITIAL_KEYBOARDS];
        this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
      }

      if (savedKeycaps) {
        this.keycaps = JSON.parse(savedKeycaps);
      } else {
        this.keycaps = [...INITIAL_KEYCAPS];
        this.persistLocal(STORAGE_KEYS.KEYCAPS, this.keycaps);
      }
    } catch (err) {
      console.error('Error initializing store from local storage:', err);
      this.keyboards = [...INITIAL_KEYBOARDS];
      this.keycaps = [...INITIAL_KEYCAPS];
    }
  }

  // Subscribe to changes (UI reactive updates)
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, data) {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    }
    // Trigger cloud sync if active
    if (this.cloudSyncCallback) {
      this.cloudSyncCallback(event, data);
    }
  }

  setCloudSyncCallback(fn) {
    this.cloudSyncCallback = fn;
  }

  setLastAction(description, type = 'info') {
    const action = {
      description,
      type,
      timestamp: new Date().toISOString()
    };
    this.lastAction = action;
    try {
      localStorage.setItem('keyvault_last_action', JSON.stringify(action));
      localStorage.setItem('keyvault_last_local_modified', action.timestamp);
    } catch (_) {}
  }

  getLastAction() {
    if (!this.lastAction) {
      try {
        const raw = localStorage.getItem('keyvault_last_action');
        if (raw) this.lastAction = JSON.parse(raw);
      } catch (_) {}
    }
    return this.lastAction;
  }

  persistLocal(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem('keyvault_last_local_modified', new Date().toISOString());
    } catch (err) {
      console.error(`Failed to persist to ${key}:`, err);
    }
  }

  // ==================== KEYBOARDS CRUD ====================
  getKeyboards() {
    return [...this.keyboards];
  }

  getKeyboardById(id) {
    return this.keyboards.find(kb => kb.id === id) || null;
  }

  saveKeyboard(keyboardData) {
    const now = new Date().toISOString();
    const isNew = !keyboardData.id;
    const id = keyboardData.id || 'kb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    const prevKb = this.getKeyboardById(id);
    const oldKeycapName = prevKb?.fields?.mountedKeycap?.trim().toLowerCase() || '';

    const keyboard = {
      ...keyboardData,
      id,
      updatedAt: now,
      createdAt: keyboardData.createdAt || now,
      fields: keyboardData.fields || {},
      customFields: Array.isArray(keyboardData.customFields) ? keyboardData.customFields : [],
      status: keyboardData.status || 'completed'
    };

    if (isNew) {
      this.keyboards.unshift(keyboard);
    } else {
      const idx = this.keyboards.findIndex(kb => kb.id === id);
      if (idx !== -1) {
        this.keyboards[idx] = keyboard;
      } else {
        this.keyboards.unshift(keyboard);
      }
    }

    const newKeycapName = keyboard.fields?.mountedKeycap?.trim().toLowerCase() || '';

    // 1. 이전 키캡이 변경되었거나 해제된 경우: 이전 키캡을 'stored' (미사용) 상태로 복원
    let keycapsModified = false;
    if (oldKeycapName && oldKeycapName !== newKeycapName) {
      this.keycaps.forEach(kc => {
        if (kc.name.trim().toLowerCase() === oldKeycapName || kc.mountedOnKeyboardId === id) {
          kc.status = 'stored';
          kc.mountedOnKeyboardId = '';
          kc.mountedOnKeyboardName = '';
          keycapsModified = true;
        }
      });
    }

    // 2. 새로운 키캡이 지정된 경우: 해당 키캡을 'mounted' (장착 중)으로 설정
    if (newKeycapName) {
      this.keycaps.forEach(kc => {
        if (kc.name.trim().toLowerCase() === newKeycapName) {
          kc.status = 'mounted';
          kc.mountedOnKeyboardId = keyboard.id;
          kc.mountedOnKeyboardName = keyboard.name;
          keycapsModified = true;
        }
      });
    }

    if (keycapsModified) {
      this.persistLocal(STORAGE_KEYS.KEYCAPS, this.keycaps);
    }

    this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
    this.setLastAction(isNew ? `"${keyboard.name || '새 키보드'}" 등록` : `"${keyboard.name || '키보드'}" 수정`);
    this.notify('KEYBOARD_SAVED', keyboard);
    return keyboard;
  }

  deleteKeyboard(id) {
    const kb = this.getKeyboardById(id);
    this.keyboards = this.keyboards.filter(k => k.id !== id);

    // Unmount keycaps attached to this keyboard
    let changedKeycap = false;
    this.keycaps.forEach(kc => {
      if (kc.mountedOnKeyboardId === id) {
        kc.status = 'stored';
        kc.mountedOnKeyboardId = '';
        kc.mountedOnKeyboardName = '';
        changedKeycap = true;
      }
    });

    if (changedKeycap) {
      this.persistLocal(STORAGE_KEYS.KEYCAPS, this.keycaps);
    }

    this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
    this.setLastAction(`"${kb ? kb.name : '키보드'}" 삭제`);
    this.notify('KEYBOARD_DELETED', { id, kb });
  }

  // ==================== KEYCAPS CRUD ====================
  getKeycaps() {
    return [...this.keycaps];
  }

  getKeycapById(id) {
    return this.keycaps.find(kc => kc.id === id) || null;
  }

  saveKeycap(keycapData) {
    const now = new Date().toISOString();
    const isNew = !keycapData.id;
    const id = keycapData.id || 'kc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    const prevKc = this.getKeycapById(id);
    const prevMountedKbId = prevKc?.mountedOnKeyboardId || '';

    const keycap = {
      ...keycapData,
      id,
      updatedAt: now,
      createdAt: keycapData.createdAt || now,
      customFields: Array.isArray(keycapData.customFields) ? keycapData.customFields : [],
      status: keycapData.status || 'stored',
      mountedOnKeyboardId: keycapData.mountedOnKeyboardId || '',
      mountedOnKeyboardName: keycapData.mountedOnKeyboardName || ''
    };

    let keyboardsModified = false;

    // 만약 상태가 'mounted'가 아니면 (보관함, 공제대기, 대여 등)
    if (keycap.status !== 'mounted') {
      // 기존에 장착되어 있던 키보드가 있다면 해당 키보드의 mountedKeycap 해제
      const targetKbId = prevMountedKbId || keycap.mountedOnKeyboardId;
      if (targetKbId) {
        this.keyboards.forEach(kb => {
          if (kb.id === targetKbId && kb.fields?.mountedKeycap?.trim().toLowerCase() === keycap.name.trim().toLowerCase()) {
            kb.fields.mountedKeycap = '';
            keyboardsModified = true;
          }
        });
      }
      keycap.mountedOnKeyboardId = '';
      keycap.mountedOnKeyboardName = '';
    } else {
      // 상태가 'mounted'인 경우
      const newMountedKbId = keycap.mountedOnKeyboardId;
      if (newMountedKbId) {
        // 1) 대상 키보드의 mountedKeycap을 이 키캡 이름으로 설정
        const targetKb = this.getKeyboardById(newMountedKbId);
        if (targetKb) {
          const oldMountedKeycapName = targetKb.fields?.mountedKeycap?.trim().toLowerCase();
          targetKb.fields.mountedKeycap = keycap.name;
          keycap.mountedOnKeyboardName = targetKb.name;
          keyboardsModified = true;

          // 2) 만약 해당 키보드에 기존에 다른 키캡이 장착되어 있었다면 그 키캡은 'stored'로 해제
          if (oldMountedKeycapName && oldMountedKeycapName !== keycap.name.trim().toLowerCase()) {
            this.keycaps.forEach(kc => {
              if (kc.id !== id && kc.name.trim().toLowerCase() === oldMountedKeycapName) {
                kc.status = 'stored';
                kc.mountedOnKeyboardId = '';
                kc.mountedOnKeyboardName = '';
              }
            });
          }
        }
      }

      // 3) 만약 이전 장착 키보드와 다른 키보드로 변경되었다면, 이전 키보드의 mountedKeycap 해제
      if (prevMountedKbId && prevMountedKbId !== newMountedKbId) {
        const prevKb = this.getKeyboardById(prevMountedKbId);
        if (prevKb && prevKb.fields?.mountedKeycap?.trim().toLowerCase() === keycap.name.trim().toLowerCase()) {
          prevKb.fields.mountedKeycap = '';
          keyboardsModified = true;
        }
      }
    }

    if (isNew) {
      this.keycaps.unshift(keycap);
    } else {
      const idx = this.keycaps.findIndex(kc => kc.id === id);
      if (idx !== -1) {
        this.keycaps[idx] = keycap;
      } else {
        this.keycaps.unshift(keycap);
      }
    }

    if (keyboardsModified) {
      this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
    }

    this.persistLocal(STORAGE_KEYS.KEYCAPS, this.keycaps);
    this.setLastAction(isNew ? `"${keycap.name || '새 키캡'}" 등록` : `"${keycap.name || '키캡'}" 수정`);
    this.notify('KEYCAP_SAVED', keycap);
    return keycap;
  }

  deleteKeycap(id) {
    const kc = this.getKeycapById(id);
    this.keycaps = this.keycaps.filter(k => k.id !== id);

    // 해당 키캡이 장착되어 있던 키보드의 mountedKeycap 해제
    if (kc) {
      let kbModified = false;
      this.keyboards.forEach(kb => {
        if (kb.fields?.mountedKeycap?.trim().toLowerCase() === kc.name.trim().toLowerCase() || kb.id === kc.mountedOnKeyboardId) {
          kb.fields.mountedKeycap = '';
          kbModified = true;
        }
      });
      if (kbModified) {
        this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
      }
    }

    this.persistLocal(STORAGE_KEYS.KEYCAPS, this.keycaps);
    this.setLastAction(`"${kc ? kc.name : '키캡'}" 삭제`);
    this.notify('KEYCAP_DELETED', { id });
  }

  getKeycapByName(name) {
    if (!name) return null;
    const target = name.trim().toLowerCase();
    return this.keycaps.find(kc => kc.name.trim().toLowerCase() === target) || null;
  }

  // ==================== CLOUD SYNC & MERGE ====================
  loadRemoteData(remoteKeyboards, remoteKeycaps) {
    if (Array.isArray(remoteKeyboards)) {
      this.keyboards = remoteKeyboards;
      this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
    }
    if (Array.isArray(remoteKeycaps)) {
      this.keycaps = remoteKeycaps;
      this.persistLocal(STORAGE_KEYS.KEYCAPS, this.keycaps);
    }
    this.notify('DATA_SYNCED', { keyboards: this.keyboards, keycaps: this.keycaps });
  }

  // ==================== EXPORT & IMPORT ====================
  exportJSON() {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'Keyfolio',
      lastAction: this.getLastAction() || {
        description: '키보드 및 키캡 데이터 저장',
        timestamp: new Date().toISOString()
      },
      data: {
        keyboards: this.keyboards,
        keycaps: this.keycaps
      }
    };
    return JSON.stringify(payload, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      let incomingKbs = [];
      let incomingKcs = [];

      if (parsed.data) {
        incomingKbs = parsed.data.keyboards || [];
        incomingKcs = parsed.data.keycaps || [];
      } else if (Array.isArray(parsed.keyboards) || Array.isArray(parsed.keycaps)) {
        incomingKbs = parsed.keyboards || [];
        incomingKcs = parsed.keycaps || [];
      } else {
        throw new Error('올바르지 않은 백업 파일 형식입니다.');
      }

      this.keyboards = incomingKbs;
      this.keycaps = incomingKcs;

      this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
      this.persistLocal(STORAGE_KEYS.KEYCAPS, this.keycaps);

      if (parsed.lastAction) {
        this.lastAction = parsed.lastAction;
        try {
          localStorage.setItem('keyvault_last_action', JSON.stringify(parsed.lastAction));
        } catch (_) {}
      } else {
        this.setLastAction('클라우드 / 백업 파일 동기화');
      }

      this.notify('DATA_IMPORTED', { keyboards: this.keyboards, keycaps: this.keycaps });
      return { success: true, keyboardCount: this.keyboards.length, keycapCount: this.keycaps.length };
    } catch (err) {
      console.error('Import error:', err);
      return { success: false, error: err.message };
    }
  }

  // ==================== ROLLBACK SNAPSHOT MANAGEMENT ====================
  saveRollbackSnapshot(label = '동기화 직전 자동 백업') {
    try {
      const snapshot = {
        label,
        timestamp: new Date().toISOString(),
        keyboardCount: this.keyboards.length,
        keycapCount: this.keycaps.length,
        keyboards: JSON.parse(JSON.stringify(this.keyboards)),
        keycaps: JSON.parse(JSON.stringify(this.keycaps))
      };
      localStorage.setItem('keyvault_rollback_snapshot', JSON.stringify(snapshot));
      return snapshot;
    } catch (err) {
      console.error('Failed to save rollback snapshot:', err);
      return null;
    }
  }

  getRollbackSnapshot() {
    try {
      const raw = localStorage.getItem('keyvault_rollback_snapshot');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  restoreRollbackSnapshot() {
    const snapshot = this.getRollbackSnapshot();
    if (!snapshot || !Array.isArray(snapshot.keyboards)) {
      throw new Error('복원할 수 있는 이전 동기화 백업이 없습니다.');
    }

    this.keyboards = snapshot.keyboards;
    this.keycaps = Array.isArray(snapshot.keycaps) ? snapshot.keycaps : [];

    this.persistLocal(STORAGE_KEYS.KEYBOARDS, this.keyboards);
    this.persistLocal(STORAGE_KEYS.KEYCAPS, this.keycaps);
    this.setLastAction('롤백 스냅샷 복원');

    this.notify('DATA_RESTORED', { keyboards: this.keyboards, keycaps: this.keycaps });
    return {
      success: true,
      timestamp: snapshot.timestamp,
      keyboardCount: this.keyboards.length,
      keycapCount: this.keycaps.length
    };
  }

  exportAllData() {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'Keyfolio',
      lastAction: this.getLastAction() || {
        description: '키보드 및 키캡 데이터 저장',
        timestamp: new Date().toISOString()
      },
      data: {
        keyboards: this.keyboards,
        keycaps: this.keycaps
      }
    };
  }
}

export const store = new DataStore();
