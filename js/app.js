/**
 * Main Application Controller & UI View Layer
 * Updated with Grouped Build Sections, Radio Lube Select, Image Compression & Previews
 */

import { store } from './store.js?v=10';
import { googleDriveService } from './google-drive-service.js?v=10';
import {
  BUILD_SECTIONS,
  BUILD_STATUS_OPTIONS,
  KEYCAP_STATUS_OPTIONS,
  KEYCAP_PROFILES,
  KEYCAP_MATERIALS
} from './constants.js?v=10';

const DEFAULT_CLIENT_ID = '768836393887-m4tmfcg0t8f7q9o0gq0o2rgs50b8ms7j.apps.googleusercontent.com';

class App {
  constructor() {
    this.currentTab = 'keyboards';
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.activeKeyboardId = null;
    this.activeKeycapId = null;
    this.uploadedImages = [null, null]; // Max 2 base64 images

    this.initElements();
    this.attachEventListeners();
    this.initServices();
    this.render();
  }

  initElements() {
    // Nav elements
    this.tabKeyboardsBtn = document.getElementById('tab-keyboards-btn');
    this.tabKeycapsBtn = document.getElementById('tab-keycaps-btn');
    this.keyboardsCountBadge = document.getElementById('keyboards-count-badge');
    this.keycapsCountBadge = document.getElementById('keycaps-count-badge');

    // Controls
    this.sectionTitle = document.getElementById('section-title');
    this.sectionSubtitle = document.getElementById('section-subtitle');
    this.btnAddItem = document.getElementById('btn-add-item');
    this.searchInput = document.getElementById('search-input');
    this.statusFilterSelect = document.getElementById('status-filter-select');

    // Views
    this.cardsContainer = document.getElementById('cards-container');
    this.emptyState = document.getElementById('empty-state');

    // Cloud status
    this.cloudStatusBtn = document.getElementById('cloud-status-btn');
    this.cloudStatusDot = document.getElementById('cloud-status-dot');
    this.cloudStatusText = document.getElementById('cloud-status-text');

    // Modals
    this.keyboardModal = document.getElementById('keyboard-modal');
    this.keyboardForm = document.getElementById('keyboard-form');
    this.dynamicFieldsList = document.getElementById('dynamic-fields-list');
    this.btnAddDynamicField = document.getElementById('btn-add-dynamic-field');
    this.keycapSelectDropdown = document.getElementById('field-mountedKeycap');
    this.customKeycapGroup = document.getElementById('custom-keycap-group');
    this.fieldCustomKeycap = document.getElementById('field-customKeycap');
    this.fieldFormFactor = document.getElementById('field-formFactor');
    this.fieldCustomFormFactor = document.getElementById('field-customFormFactor');
    this.fieldLayout = document.getElementById('field-layout');
    this.fieldCustomLayout = document.getElementById('field-customLayout');

    // Image upload elements
    this.inputImg0 = document.getElementById('input-image-0');
    this.inputImg1 = document.getElementById('input-image-1');
    this.previewImg0 = document.getElementById('preview-img-0');
    this.previewImg1 = document.getElementById('preview-img-1');
    this.placeholder0 = document.getElementById('placeholder-0');
    this.placeholder1 = document.getElementById('placeholder-1');
    this.btnRemoveImg0 = document.getElementById('btn-remove-img-0');
    this.btnRemoveImg1 = document.getElementById('btn-remove-img-1');

    // Foam elements
    this.foamOptionsContainer = document.getElementById('foam-options-container');
    this.checkFoamPlate = document.getElementById('check-foam-plate');
    this.checkFoamBottom = document.getElementById('check-foam-bottom');

    // Switch custom tuning options container (스프링/필름 - 손윤 전용)
    this.switchTuningContainer = document.getElementById('switch-custom-tuning-options');

    this.keycapModal = document.getElementById('keycap-modal');
    this.keycapForm = document.getElementById('keycap-form');
    this.keycapDynamicFieldsList = document.getElementById('keycap-dynamic-fields-list');
    this.btnAddKeycapDynamicField = document.getElementById('btn-add-keycap-dynamic-field');
    this.kcStatusSelect = document.getElementById('kc-status-select');
    this.kcMountedKeyboardSelect = document.getElementById('kc-mounted-keyboard-select');

    this.specModal = document.getElementById('spec-modal');
    this.specModalBody = document.getElementById('spec-modal-body');
    this.btnCopySpec = document.getElementById('btn-copy-spec');

    // Lightbox modal
    this.imageLightboxModal = document.getElementById('image-lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');

    this.cloudModal = document.getElementById('cloud-modal');
    this.gdriveDisconnectedBox = document.getElementById('gdrive-disconnected-box');
    this.gdriveConnectedBox = document.getElementById('gdrive-connected-box');
    this.gdriveClientIdInput = document.getElementById('gdrive-client-id');
    this.btnToggleClientIdHelp = document.getElementById('btn-toggle-client-id-help');
    this.clientIdHelpBox = document.getElementById('client-id-help-box');
    this.btnGdriveLogin = document.getElementById('btn-gdrive-login');
    this.btnGdriveLogout = document.getElementById('btn-gdrive-logout');
    this.gdriveUserAvatar = document.getElementById('gdrive-user-avatar');
    this.gdriveUserName = document.getElementById('gdrive-user-name');
    this.gdriveUserEmail = document.getElementById('gdrive-user-email');
    this.gdriveLastSyncLabel = document.getElementById('gdrive-last-sync-label');
    this.btnGdriveUploadNow = document.getElementById('btn-gdrive-upload-now');
    this.btnGdriveDownloadNow = document.getElementById('btn-gdrive-download-now');
    this.rollbackSnapshotBadge = document.getElementById('rollback-snapshot-badge');
    this.rollbackSnapshotDesc = document.getElementById('rollback-snapshot-desc');
    this.btnRestoreRollback = document.getElementById('btn-restore-rollback');
    this.chkStartupSync = document.getElementById('chk-startup-sync');
    this.chkAutoSave = document.getElementById('chk-auto-save');

    // Sync Confirmation Modal elements
    this.syncConfirmModal = document.getElementById('sync-confirm-modal');
    this.syncModalTitle = document.getElementById('sync-modal-title');
    this.syncAlertBanner = document.getElementById('sync-alert-banner');
    this.syncAlertTitle = document.getElementById('sync-alert-title');
    this.syncAlertDesc = document.getElementById('sync-alert-desc');
    this.syncLocalTime = document.getElementById('sync-local-time');
    this.syncLocalCounts = document.getElementById('sync-local-counts');
    this.syncLocalAction = document.getElementById('sync-local-action');
    this.syncRemoteTime = document.getElementById('sync-remote-time');
    this.syncRemoteCounts = document.getElementById('sync-remote-counts');
    this.syncRemoteAction = document.getElementById('sync-remote-action');
    this.btnSyncConfirmProceed = document.getElementById('btn-sync-confirm-proceed');
    this.pendingRemoteSyncData = null;
    this.autoSaveTimer = null;

    this.backupModal = document.getElementById('backup-modal');
    this.btnExportJson = document.getElementById('btn-export-json');
    this.btnImportJson = document.getElementById('btn-import-json');
    this.importFileInput = document.getElementById('import-file-input');

    this.toastContainer = document.getElementById('toast-container');
  }

  attachEventListeners() {
    // Tabs
    this.tabKeyboardsBtn.addEventListener('click', () => this.switchTab('keyboards'));
    this.tabKeycapsBtn.addEventListener('click', () => this.switchTab('keycaps'));

    // Primary action
    this.btnAddItem.addEventListener('click', () => {
      if (this.currentTab === 'keyboards') {
        this.openKeyboardModal();
      } else {
        this.openKeycapModal();
      }
    });

    // Search & Filter
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.render();
    });

    this.statusFilterSelect.addEventListener('change', (e) => {
      this.statusFilter = e.target.value;
      this.render();
    });

    // Dynamic field buttons
    this.btnAddDynamicField.addEventListener('click', () => {
      this.appendDynamicFieldRow(this.dynamicFieldsList, '', '');
    });

    this.btnAddKeycapDynamicField.addEventListener('click', () => {
      this.appendDynamicFieldRow(this.keycapDynamicFieldsList, '', '');
    });

    // Image Upload Handlers with Automatic Canvas Resizing
    this.inputImg0.addEventListener('change', (e) => this.handleImageUpload(e, 0));
    this.inputImg1.addEventListener('change', (e) => this.handleImageUpload(e, 1));
    this.btnRemoveImg0.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeImage(0);
    });
    this.btnRemoveImg1.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeImage(1);
    });

    // Foam Radio Toggle Handler
    document.querySelectorAll('input[name="foamType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === '폼') {
          this.foamOptionsContainer.style.display = 'block';
        } else {
          this.foamOptionsContainer.style.display = 'none';
        }
      });
    });

    // Switch Lube Radio Toggle Handler (손윤일 때만 스프링/필름 노출)
    document.querySelectorAll('input[name="switchLubeType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === '손윤') {
          this.switchTuningContainer.style.display = 'grid';
        } else {
          this.switchTuningContainer.style.display = 'none';
        }
      });
    });

    // Keycap Select Change Handler (Toggle direct input field)
    this.keycapSelectDropdown.addEventListener('change', (e) => {
      if (e.target.value === '__custom__') {
        this.customKeycapGroup.style.display = 'block';
        this.fieldCustomKeycap.focus();
      } else {
        this.customKeycapGroup.style.display = 'none';
        this.fieldCustomKeycap.value = '';
      }
    });

    // Form Factor Select Change Handler (Toggle direct input field)
    if (this.fieldFormFactor && this.fieldCustomFormFactor) {
      this.fieldFormFactor.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          this.fieldCustomFormFactor.style.display = 'block';
          this.fieldCustomFormFactor.focus();
        } else {
          this.fieldCustomFormFactor.style.display = 'none';
          this.fieldCustomFormFactor.value = '';
        }
      });
    }

    // Layout Select Change Handler (Toggle direct input field)
    if (this.fieldLayout && this.fieldCustomLayout) {
      this.fieldLayout.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          this.fieldCustomLayout.style.display = 'block';
          this.fieldCustomLayout.focus();
        } else {
          this.fieldCustomLayout.style.display = 'none';
          this.fieldCustomLayout.value = '';
        }
      });
    }

    // Quick Preset Chips Handler (Mount, Plate, etc.)
    document.querySelectorAll('.preset-chips-wrap').forEach(wrap => {
      const targetId = wrap.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      if (!targetInput) return;

      wrap.querySelectorAll('.btn-preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-val');
          if (targetInput.value.trim() === val) {
            targetInput.value = '';
            btn.classList.remove('active');
          } else {
            targetInput.value = val;
            wrap.querySelectorAll('.btn-preset-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
        });
      });

      targetInput.addEventListener('input', () => {
        const current = targetInput.value.trim();
        wrap.querySelectorAll('.btn-preset-chip').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-val') === current);
        });
      });
    });

    // Keycap Modal: Status Select Change Handler (Toggle mounted keyboard field)
    this.kcStatusSelect.addEventListener('change', (e) => {
      if (e.target.value === 'mounted') {
        this.kcMountedKeyboardSelect.disabled = false;
      } else {
        this.kcMountedKeyboardSelect.value = '';
        this.kcMountedKeyboardSelect.disabled = true;
      }
    });

    // Form Submissions
    this.keyboardForm.addEventListener('submit', (e) => this.handleKeyboardSubmit(e));
    this.keycapForm.addEventListener('submit', (e) => this.handleKeycapSubmit(e));

    // Cloud Modal Triggers
    this.cloudStatusBtn.addEventListener('click', () => this.openCloudModal());
    document.getElementById('btn-open-cloud-modal').addEventListener('click', () => this.openCloudModal());
    document.getElementById('btn-open-backup-modal').addEventListener('click', () => this.openBackupModal());

    // Google Drive Auth & Actions
    if (this.btnToggleClientIdHelp) {
      this.btnToggleClientIdHelp.addEventListener('click', () => {
        const isHidden = this.clientIdHelpBox.style.display === 'none';
        this.clientIdHelpBox.style.display = isHidden ? 'block' : 'none';
      });
    }

    if (this.btnGdriveLogin) {
      this.btnGdriveLogin.addEventListener('click', async () => {
        const inputVal = this.gdriveClientIdInput ? this.gdriveClientIdInput.value.trim() : '';
        const clientId = inputVal || googleDriveService.getClientId() || DEFAULT_CLIENT_ID;
        googleDriveService.setClientId(clientId);

        try {
          this.showToast('구글 로그인 창을 여는 중...', 'info');
          const res = await googleDriveService.login();
          if (res.success) {
            this.showToast(`구글 드라이브 연결 성공! (${res.user?.name || '사용자'})`, 'success');
            this.updateGoogleDriveUI();
            this.handleFirstTimeSyncCheck();
          }
        } catch (err) {
          console.error(err);
          this.showToast('구글 로그인 실패: ' + err.message, 'error');
        }
      });
    }

    if (this.btnGdriveLogout) {
      this.btnGdriveLogout.addEventListener('click', () => {
        if (confirm('구글 드라이브 연동을 해제하시겠습니까? (로컬 데이터는 그대로 보존됩니다)')) {
          googleDriveService.logout();
          this.updateGoogleDriveUI();
          this.showToast('구글 드라이브 연결이 해제되었습니다.', 'info');
        }
      });
    }

    if (this.btnGdriveUploadNow) {
      this.btnGdriveUploadNow.addEventListener('click', () => this.handleGdriveUpload(true));
    }

    if (this.btnGdriveDownloadNow) {
      this.btnGdriveDownloadNow.addEventListener('click', () => this.requestGdriveDownload(false));
    }

    if (this.btnRestoreRollback) {
      this.btnRestoreRollback.addEventListener('click', () => this.handleRestoreRollback());
    }

    if (this.btnSyncConfirmProceed) {
      this.btnSyncConfirmProceed.addEventListener('click', () => this.confirmGdriveDownload());
    }

    if (this.chkStartupSync) {
      this.chkStartupSync.checked = localStorage.getItem('gdrive_pref_startup_sync') !== 'false';
      this.chkStartupSync.addEventListener('change', (e) => {
        localStorage.setItem('gdrive_pref_startup_sync', e.target.checked ? 'true' : 'false');
      });
    }

    if (this.chkAutoSave) {
      this.chkAutoSave.checked = localStorage.getItem('gdrive_pref_auto_save') !== 'false';
      this.chkAutoSave.addEventListener('change', (e) => {
        localStorage.setItem('gdrive_pref_auto_save', e.target.checked ? 'true' : 'false');
      });
    }

    // Backup & Restore
    this.btnExportJson.addEventListener('click', () => this.exportBackupFile());
    this.btnImportJson.addEventListener('click', () => this.importFileInput.click());
    this.importFileInput.addEventListener('change', (e) => this.handleFileImport(e));

    // Spec Sheet Copy
    this.btnCopySpec.addEventListener('click', () => this.copySpecToClipboard());

    // Generic Modal Close Buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-backdrop');
        if (modal) this.closeModal(modal);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeModal(backdrop);
      });
    });

    // Quick Theme Switcher
    const quickThemeSelect = document.getElementById('quick-theme-select');
    if (quickThemeSelect) {
      let activeTheme = localStorage.getItem('keyvault_theme') || 'warm-beige';
      if (activeTheme === 'midnight-dark') activeTheme = 'titanium';
      if (!['warm-beige', 'lavender-mist', 'titanium'].includes(activeTheme)) activeTheme = 'warm-beige';
      quickThemeSelect.value = activeTheme;
      quickThemeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        const selectedName = e.target.options[e.target.selectedIndex].text;
        localStorage.setItem('keyvault_theme', selectedTheme);
        document.documentElement.setAttribute('data-theme', selectedTheme);
        this.showToast(`테마가 '${selectedName}'(으)로 변경되었습니다.`, 'info');
      });
    }
  }

  // ==================== IMAGE COMPRESSION & RESIZING ====================
  handleImageUpload(e, index) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        // Resize to max 600px maintaining aspect ratio
        const maxDimension = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compact WebP (or JPEG fallback)
        const compressedBase64 = canvas.toDataURL('image/webp', 0.8) || canvas.toDataURL('image/jpeg', 0.8);
        this.uploadedImages[index] = compressedBase64;
        this.updateImageSlotUI(index, compressedBase64);
        this.showToast(`사진 ${index + 1}이 압축되어 첨부되었습니다.`, 'info');
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(index) {
    this.uploadedImages[index] = null;
    this.updateImageSlotUI(index, null);
    if (index === 0) this.inputImg0.value = '';
    if (index === 1) this.inputImg1.value = '';
  }

  updateImageSlotUI(index, base64) {
    const previewEl = index === 0 ? this.previewImg0 : this.previewImg1;
    const placeholderEl = index === 0 ? this.placeholder0 : this.placeholder1;
    const removeBtn = index === 0 ? this.btnRemoveImg0 : this.btnRemoveImg1;

    if (base64) {
      previewEl.src = base64;
      previewEl.style.display = 'block';
      placeholderEl.style.display = 'none';
      removeBtn.style.display = 'flex';
    } else {
      previewEl.src = '';
      previewEl.style.display = 'none';
      placeholderEl.style.display = 'flex';
      removeBtn.style.display = 'none';
    }
  }

  initServices() {
    store.subscribe(() => {
      this.render();
      this.updateBadges();
    });

    firebaseService.subscribeStatus((status) => {
      this.updateCloudStatusUI(status);
    });

    this.updateBadges();
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.searchQuery = '';
    this.searchInput.value = '';
    this.statusFilter = 'all';

    if (tab === 'keyboards') {
      this.tabKeyboardsBtn.classList.add('active');
      this.tabKeycapsBtn.classList.remove('active');
      this.sectionTitle.textContent = '키보드 빌드 보관함';
      this.sectionSubtitle.textContent = '완성된 커스텀 키보드와 빌드 사양, 옵션 정보 관리';
      this.btnAddItem.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 새 키보드 빌드 추가`;
      this.populateStatusFilterOptions(BUILD_STATUS_OPTIONS);
    } else {
      this.tabKeyboardsBtn.classList.remove('active');
      this.tabKeycapsBtn.classList.add('active');
      this.sectionTitle.textContent = '키캡 컬렉션 & 보관함';
      this.sectionSubtitle.textContent = '소장 중인 키캡셋, 킷 구성, 장착 상태 관리';
      this.btnAddItem.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 새 키캡 등록`;
      this.populateStatusFilterOptions(KEYCAP_STATUS_OPTIONS);
    }

    this.render();
  }

  populateStatusFilterOptions(options) {
    this.statusFilterSelect.innerHTML = '<option value="all">모든 상태 보기</option>';
    options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      this.statusFilterSelect.appendChild(optionEl);
    });
  }

  updateBadges() {
    const kbs = store.getKeyboards();
    const kcs = store.getKeycaps();
    this.keyboardsCountBadge.textContent = kbs.length;
    this.keycapsCountBadge.textContent = kcs.length;
  }

  updateCloudStatusUI(status) {
    if (status.isSyncing) {
      this.cloudStatusDot.className = 'pulse-dot syncing';
      this.cloudStatusText.textContent = '동기화 중...';
    } else if (status.isAuthenticated) {
      this.cloudStatusDot.className = 'pulse-dot online';
      this.cloudStatusText.textContent = status.user.displayName || '클라우드 연결됨';
    } else if (status.isConfigured) {
      this.cloudStatusDot.className = 'pulse-dot offline';
      this.cloudStatusText.textContent = '로그인 필요';
    } else {
      this.cloudStatusDot.className = 'pulse-dot';
      this.cloudStatusText.textContent = '로컬 모드';
    }

    if (status.isAuthenticated) {
      this.cloudUserSection.style.display = 'block';
      document.getElementById('cloud-user-name').textContent = status.user.displayName || 'Google User';
      document.getElementById('cloud-user-email').textContent = status.user.email || '';
      if (status.user.photoURL) {
        document.getElementById('cloud-user-avatar').src = status.user.photoURL;
      }
      this.btnGoogleLogin.style.display = 'none';
      this.btnGoogleLogout.style.display = 'inline-flex';
    } else {
      this.cloudUserSection.style.display = 'none';
      this.btnGoogleLogin.style.display = status.isConfigured ? 'inline-flex' : 'none';
      this.btnGoogleLogout.style.display = 'none';
    }

    const savedConfig = firebaseService.getConfig();
    if (savedConfig) {
      document.getElementById('firebase-config-json').value = JSON.stringify(savedConfig, null, 2);
    }
  }

  render() {
    this.cardsContainer.innerHTML = '';
    if (this.currentTab === 'keyboards') {
      this.renderKeyboards();
    } else {
      this.renderKeycaps();
    }
  }

  renderKeyboards() {
    let list = store.getKeyboards();

    if (this.statusFilter !== 'all') {
      list = list.filter(k => k.status === this.statusFilter);
    }

    if (this.searchQuery) {
      list = list.filter(k => {
        const text = [
          k.name,
          k.notes,
          ...Object.values(k.fields || {}),
          ...(k.customFields || []).map(cf => cf.label + ' ' + cf.value)
        ].join(' ').toLowerCase();
        return text.includes(this.searchQuery);
      });
    }

    if (list.length === 0) {
      this.cardsContainer.style.display = 'none';
      this.emptyState.style.display = 'flex';
      return;
    }

    this.cardsContainer.style.display = 'grid';
    this.emptyState.style.display = 'none';

    list.forEach(kb => {
      const card = this.createKeyboardCard(kb);
      this.cardsContainer.appendChild(card);
    });
  }

  createKeyboardCard(kb) {
    const card = document.createElement('div');
    card.className = 'kb-card';

    const statusObj = BUILD_STATUS_OPTIONS.find(s => s.value === kb.status) || BUILD_STATUS_OPTIONS[0];

    const housing = kb.fields?.housing || kb.name || '알 수 없는 키보드';
    const formFactor = kb.fields?.formFactor || '';
    const layout = kb.fields?.layout || '';
    const layoutSummary = [formFactor, layout].filter(Boolean).join(' · ');

    const topColor = kb.fields?.topColor || '';
    const bottomColor = kb.fields?.bottomColor || '';
    const colorsSummary = [topColor, bottomColor ? `하판: ${bottomColor}` : ''].filter(Boolean).join(' / ');

    let switchVal = kb.fields?.switches ? `${kb.fields.switches} (${kb.fields?.switchLubeType || '손윤'})` : '-';
    if (kb.fields?.extraSwitches) {
      switchVal += ` [추가: ${kb.fields.extraSwitches}]`;
    }

    const pcbVal = kb.fields?.pcb ? `${kb.fields.pcb} (${kb.fields?.pcbType || '핫스왑'})` : '-';
    let stabVal = kb.fields?.stabilizer || '-';
    if (kb.fields?.stabilizerSpbar) {
      stabVal += ` (슷바: ${kb.fields.stabilizerSpbar})`;
    }
    const keycapVal = kb.fields?.mountedKeycap || '-';

    // Photos preview
    let photosHtml = '';
    const validImgs = (kb.images || []).filter(Boolean);
    if (validImgs.length > 0) {
      const gridClass = validImgs.length === 1 ? 'single' : 'double';
      photosHtml = `
        <div class="card-photos-grid ${gridClass}">
          ${validImgs.map((img, idx) => `
            <div class="card-photo-box" data-img-idx="${idx}">
              <img src="${img}" class="card-photo-img" alt="키보드 사진">
            </div>
          `).join('')}
        </div>
      `;
    }

    // Custom fields chips
    let customChipsHtml = '';
    if (kb.customFields && kb.customFields.length > 0) {
      customChipsHtml = `
        <div class="custom-fields-chips">
          ${kb.customFields.map(cf => `
            <span class="custom-chip">
              <span class="custom-chip-label">${this.escape(cf.label)}:</span>
              <span class="custom-chip-val">${this.escape(cf.value)}</span>
            </span>
          `).join('')}
        </div>
      `;
    }

    // Sound test link badge - 타건음 링크가 실제로 저장되어 있을 때만 표시
    let soundBadgeHtml = '';
    const soundLinkVal = (kb.fields?.soundLink || '').trim();
    if (soundLinkVal && soundLinkVal !== 'https://youtube.com/shorts/sample') {
      soundBadgeHtml = `
        <a href="${this.escape(soundLinkVal)}" target="_blank" rel="noopener" class="sound-link-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          타건음 듣기
        </a>
      `;
    }

    card.innerHTML = `
      ${photosHtml}

      <div class="kb-card-header">
        <div class="kb-card-title-group">
          <h3 class="kb-card-title">${this.escape(kb.name || housing)}</h3>
          <span class="kb-housing-subtitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h12"></path></svg>
            ${layoutSummary ? `<strong style="color: var(--accent-secondary); margin-right: 0.35rem;">[${this.escape(layoutSummary)}]</strong>` : ''}${this.escape(colorsSummary || '색상 미지정')}
          </span>
        </div>
        <span class="status-badge ${statusObj.value}">${statusObj.label}</span>
      </div>

      <div class="kb-specs-list">
        <div class="spec-item">
          <span class="spec-label">스위치</span>
          <span class="spec-val">${this.escape(switchVal)}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">PCB / 스테빌</span>
          <span class="spec-val">${this.escape(pcbVal)} / ${this.escape(stabVal)}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">마운트/보강</span>
          <span class="spec-val">${this.escape(kb.fields?.mountType || '-')} / ${this.escape(kb.fields?.plate || '-')}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">장착 키캡</span>
          <span class="spec-val" style="color: var(--accent-secondary);">${this.escape(keycapVal)}</span>
        </div>
      </div>

      ${soundBadgeHtml ? `<div style="display: flex; gap: 0.5rem;">${soundBadgeHtml}</div>` : ''}

      <div class="kb-card-footer">
        <button class="btn btn-secondary btn-sm" data-action="view-spec" style="font-size: 0.8rem; padding: 0.4rem 0.75rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          빌드 명세표
        </button>

        <div class="card-actions-group">
          <button class="btn btn-icon btn-sm" data-action="edit" title="수정">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn btn-icon btn-sm btn-danger" data-action="delete" title="삭제">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Photo click event -> open lightbox
    card.querySelectorAll('.card-photo-box').forEach(box => {
      const idx = parseInt(box.getAttribute('data-img-idx'), 10);
      if (validImgs[idx]) {
        box.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openLightbox(validImgs[idx]);
        });
      }
    });

    card.querySelector('[data-action="view-spec"]').addEventListener('click', () => this.openSpecModal(kb));
    card.querySelector('[data-action="edit"]').addEventListener('click', () => this.openKeyboardModal(kb));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => {
      if (confirm(`'${kb.name}' 빌드 정보를 삭제하시겠습니까?`)) {
        store.deleteKeyboard(kb.id);
        this.showToast('키보드 빌드가 삭제되었습니다.', 'info');
      }
    });

    return card;
  }

  renderKeycaps() {
    let list = store.getKeycaps();

    if (this.statusFilter !== 'all') {
      list = list.filter(k => k.status === this.statusFilter);
    }

    if (this.searchQuery) {
      list = list.filter(k => {
        const text = [
          k.name,
          k.manufacturer,
          k.profile,
          k.material,
          k.notes,
          k.mountedOnKeyboardName,
          ...(k.customFields || []).map(cf => cf.label + ' ' + cf.value)
        ].join(' ').toLowerCase();
        return text.includes(this.searchQuery);
      });
    }

    if (list.length === 0) {
      this.cardsContainer.style.display = 'none';
      this.emptyState.style.display = 'flex';
      return;
    }

    this.cardsContainer.style.display = 'grid';
    this.emptyState.style.display = 'none';

    list.forEach(kc => {
      const card = this.createKeycapCard(kc);
      this.cardsContainer.appendChild(card);
    });
  }

  createKeycapCard(kc) {
    const card = document.createElement('div');
    card.className = 'keycap-card';

    const statusObj = KEYCAP_STATUS_OPTIONS.find(s => s.value === kc.status) || KEYCAP_STATUS_OPTIONS[0];

    let customChipsHtml = '';
    if (kc.customFields && kc.customFields.length > 0) {
      customChipsHtml = `
        <div class="custom-fields-chips">
          ${kc.customFields.map(cf => `
            <span class="custom-chip">
              <span class="custom-chip-label">${this.escape(cf.label)}:</span>
              <span class="custom-chip-val">${this.escape(cf.value)}</span>
            </span>
          `).join('')}
        </div>
      `;
    }

    let mountedInfo = '';
    if (kc.status === 'mounted' && kc.mountedOnKeyboardName) {
      mountedInfo = `
        <div class="mounted-indicator">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          장착 중: <strong>${this.escape(kc.mountedOnKeyboardName)}</strong>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="kb-card-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="keycap-icon-box">⌨️</div>
          <div class="kb-card-title-group">
            <h3 class="kb-card-title">${this.escape(kc.name)}</h3>
            <span class="kb-housing-subtitle">${this.escape(kc.manufacturer || '제조사 미지정')}</span>
          </div>
        </div>
        <span class="status-badge ${statusObj.value}">${statusObj.label}</span>
      </div>

      <div class="kb-specs-list">
        <div class="spec-item">
          <span class="spec-label">프로파일</span>
          <span class="spec-val">${this.escape(kc.profile || '-')}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">재질</span>
          <span class="spec-val">${this.escape(kc.material || '-')}</span>
        </div>
      </div>

      ${mountedInfo}
      ${customChipsHtml}

      <div class="kb-card-footer">
        <span style="font-size: 0.8rem; color: var(--text-muted);">
          ${kc.notes ? this.escape(kc.notes) : ''}
        </span>

        <div class="card-actions-group">
          <button class="btn btn-icon btn-sm" data-action="edit" title="수정">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn btn-icon btn-sm btn-danger" data-action="delete" title="삭제">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;

    card.querySelector('[data-action="edit"]').addEventListener('click', () => this.openKeycapModal(kc));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => {
      if (confirm(`'${kc.name}' 키캡 정보를 삭제하시겠습니까?`)) {
        store.deleteKeycap(kc.id);
        this.showToast('키캡이 삭제되었습니다.', 'info');
      }
    });

    return card;
  }

  // ==================== DYNAMIC FIELDS ====================
  appendDynamicFieldRow(container, label = '', value = '') {
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    const isKeycap = container === this.keycapDynamicFieldsList;
    const placeholderText = isKeycap ? '옵션명 (예: 추가 파츠, 구매처)' : '옵션명 (예: 추가 파츠, 구매처)';
    row.innerHTML = `
      <input type="text" class="form-input dynamic-label" placeholder="${placeholderText}" value="${this.escape(label)}">
      <input type="text" class="form-input dynamic-value" placeholder="내용" value="${this.escape(value)}">
      <button type="button" class="btn-remove-row" title="필드 삭제">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
  }

  collectDynamicFields(container) {
    const rows = container.querySelectorAll('.dynamic-row');
    const fields = [];
    rows.forEach(row => {
      const label = row.querySelector('.dynamic-label').value.trim();
      const value = row.querySelector('.dynamic-value').value.trim();
      if (label || value) {
        fields.push({ id: 'cf_' + Math.random().toString(36).substr(2, 6), label, value });
      }
    });
    return fields;
  }

  // ==================== KEYBOARD MODAL ====================
  openKeyboardModal(kb = null) {
    this.activeKeyboardId = kb ? kb.id : null;
    document.getElementById('keyboard-modal-title').textContent = kb ? '키보드 빌드 정보 수정' : '새 키보드 빌드 등록';

    // 1. 키캡 목록을 알파벳 / 한글 가나다순으로 정렬
    const sortedKeycaps = store.getKeycaps().slice().sort((a, b) => {
      return a.name.localeCompare(b.name, 'ko', { sensitivity: 'base' });
    });

    // Populate Keycap Dropdown
    this.keycapSelectDropdown.innerHTML = `
      <option value="">선택 안 함</option>
      <option value="__custom__">+ 직접 입력하기</option>
    `;
    
    sortedKeycaps.forEach(kc => {
      const opt = document.createElement('option');
      opt.value = kc.name;
      opt.textContent = `${kc.name} (${kc.profile || '체리'})`;
      this.keycapSelectDropdown.appendChild(opt);
    });

    document.getElementById('kb-name-input').value = kb ? kb.name : '';
    document.getElementById('kb-status-select').value = kb ? kb.status : 'completed';
    document.getElementById('kb-notes-input').value = kb ? (kb.notes || '') : '';

    // Populate grouped inputs
    const fields = kb?.fields || {};

    // Form factor matching
    const standardFormFactors = ['TKL', '75%', '65%', '60%', '40%', 'Full', '1800'];
    const formFactorVal = fields.formFactor || '';
    if (!formFactorVal) {
      if (this.fieldFormFactor) this.fieldFormFactor.value = '';
      if (this.fieldCustomFormFactor) {
        this.fieldCustomFormFactor.style.display = 'none';
        this.fieldCustomFormFactor.value = '';
      }
    } else if (standardFormFactors.includes(formFactorVal)) {
      if (this.fieldFormFactor) this.fieldFormFactor.value = formFactorVal;
      if (this.fieldCustomFormFactor) {
        this.fieldCustomFormFactor.style.display = 'none';
        this.fieldCustomFormFactor.value = '';
      }
    } else {
      if (this.fieldFormFactor) this.fieldFormFactor.value = '__custom__';
      if (this.fieldCustomFormFactor) {
        this.fieldCustomFormFactor.style.display = 'block';
        this.fieldCustomFormFactor.value = formFactorVal;
      }
    }

    // Layout matching
    const standardLayouts = ['WK', 'WKL', 'HHKB'];
    const layoutVal = fields.layout || '';
    if (!layoutVal) {
      if (this.fieldLayout) this.fieldLayout.value = '';
      if (this.fieldCustomLayout) {
        this.fieldCustomLayout.style.display = 'none';
        this.fieldCustomLayout.value = '';
      }
    } else if (standardLayouts.includes(layoutVal)) {
      if (this.fieldLayout) this.fieldLayout.value = layoutVal;
      if (this.fieldCustomLayout) {
        this.fieldCustomLayout.style.display = 'none';
        this.fieldCustomLayout.value = '';
      }
    } else {
      if (this.fieldLayout) this.fieldLayout.value = '__custom__';
      if (this.fieldCustomLayout) {
        this.fieldCustomLayout.style.display = 'block';
        this.fieldCustomLayout.value = layoutVal;
      }
    }

    document.getElementById('field-topColor').value = fields.topColor || fields.housingColor || '';
    document.getElementById('field-bottomColor').value = fields.bottomColor || '';
    document.getElementById('field-weight').value = fields.weight || '';
    document.getElementById('field-mountType').value = fields.mountType || '';
    document.getElementById('field-plate').value = fields.plate || '';
    this.syncPresetChips('field-mountType');
    this.syncPresetChips('field-plate');
    document.getElementById('field-pcb').value = fields.pcb || '';
    document.getElementById('field-pcbType').value = fields.pcbType || '핫스왑';
    this.syncPresetChips('field-pcbType');
    document.getElementById('field-stabilizer').value = fields.stabilizer || '';
    document.getElementById('field-stabilizerSpbar').value = fields.stabilizerSpbar || '';
    document.getElementById('field-switches').value = fields.switches || '';
    document.getElementById('field-extraSwitches').value = fields.extraSwitches || '';
    document.getElementById('field-switchSpring').value = fields.switchSpring || '';
    document.getElementById('field-switchFilm').value = fields.switchFilm || '';
    document.getElementById('field-soundLink').value = fields.soundLink || '';

    // Keycap matching logic (선택 안 함 / 기존 목록에 있음 / 직접 입력됨)
    const mountedKeycapName = fields.mountedKeycap || '';
    if (!mountedKeycapName) {
      this.keycapSelectDropdown.value = '';
      this.customKeycapGroup.style.display = 'none';
      this.fieldCustomKeycap.value = '';
    } else {
      const existsInList = sortedKeycaps.some(kc => kc.name.trim().toLowerCase() === mountedKeycapName.trim().toLowerCase());
      if (existsInList) {
        this.keycapSelectDropdown.value = mountedKeycapName;
        this.customKeycapGroup.style.display = 'none';
        this.fieldCustomKeycap.value = '';
      } else {
        this.keycapSelectDropdown.value = '__custom__';
        this.customKeycapGroup.style.display = 'block';
        this.fieldCustomKeycap.value = mountedKeycapName;
      }
    }

    // Switch Lube Radio & Tuning Container visibility
    const lubeType = fields.switchLubeType || '손윤';
    const lubeRadio = document.querySelector(`input[name="switchLubeType"][value="${lubeType}"]`);
    if (lubeRadio) lubeRadio.checked = true;
    if (this.switchTuningContainer) {
      this.switchTuningContainer.style.display = (lubeType === '손윤') ? 'grid' : 'none';
    }

    // Foam Radio & Checkboxes
    const foamType = fields.foamType || '노폼';
    const foamRadio = document.querySelector(`input[name="foamType"][value="${foamType}"]`);
    if (foamRadio) foamRadio.checked = true;

    if (foamType === '폼') {
      this.foamOptionsContainer.style.display = 'block';
      const items = fields.foamItems || [];
      this.checkFoamPlate.checked = items.includes('기보강폼');
      this.checkFoamBottom.checked = items.includes('하부폼');
    } else {
      this.foamOptionsContainer.style.display = 'none';
      this.checkFoamPlate.checked = false;
      this.checkFoamBottom.checked = false;
    }

    // Photos
    this.uploadedImages = [kb?.images?.[0] || null, kb?.images?.[1] || null];
    this.updateImageSlotUI(0, this.uploadedImages[0]);
    this.updateImageSlotUI(1, this.uploadedImages[1]);

    // Dynamic fields
    this.dynamicFieldsList.innerHTML = '';
    if (kb && kb.customFields && kb.customFields.length > 0) {
      kb.customFields.forEach(cf => {
        this.appendDynamicFieldRow(this.dynamicFieldsList, cf.label, cf.value);
      });
    }

    this.openModal(this.keyboardModal, '#kb-name-input');
  }

  syncPresetChips(targetId) {
    const input = document.getElementById(targetId);
    const wrap = document.querySelector(`.preset-chips-wrap[data-target="${targetId}"]`);
    if (!input || !wrap) return;
    const val = input.value.trim();
    wrap.querySelectorAll('.btn-preset-chip').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === val);
    });
  }

  handleKeyboardSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('kb-name-input').value.trim();
    if (!name) {
      this.showToast('키보드 이름을 입력해주세요.', 'error');
      return;
    }

    const status = document.getElementById('kb-status-select').value;
    const notes = document.getElementById('kb-notes-input').value.trim();
    const selectedLube = document.querySelector('input[name="switchLubeType"]:checked')?.value || '손윤';

    // Foam calculation
    const selectedFoamType = document.querySelector('input[name="foamType"]:checked')?.value || '노폼';
    const foamItems = [];
    if (selectedFoamType === '폼') {
      if (this.checkFoamPlate.checked) foamItems.push('기보강폼');
      if (this.checkFoamBottom.checked) foamItems.push('하부폼');
    }
    const foamSummary = selectedFoamType === '폼'
      ? (foamItems.length > 0 ? `폼 (${foamItems.join(', ')})` : '폼')
      : '노폼';

    // Keycap value resolution
    let resolvedKeycapName = '';
    const selectedDropdownVal = this.keycapSelectDropdown.value;
    if (selectedDropdownVal === '__custom__') {
      resolvedKeycapName = this.fieldCustomKeycap.value.trim();
    } else {
      resolvedKeycapName = selectedDropdownVal.trim();
    }

    // Auto-create Keycap in inventory if it does not exist
    let autoCreatedKeycap = false;
    if (resolvedKeycapName) {
      const existingKeycap = store.getKeycapByName(resolvedKeycapName);
      if (!existingKeycap) {
        store.saveKeycap({
          name: resolvedKeycapName,
          manufacturer: '',
          profile: 'Cherry (체리)',
          material: '기타',
          status: 'mounted',
          mountedOnKeyboardId: this.activeKeyboardId || '',
          mountedOnKeyboardName: name,
          notes: '키보드 빌드 등록 시 자동 추가된 키캡'
        });
        autoCreatedKeycap = true;
      }
    }

    // Form Factor & Layout resolution
    let resolvedFormFactor = '';
    if (this.fieldFormFactor) {
      resolvedFormFactor = this.fieldFormFactor.value === '__custom__'
        ? (this.fieldCustomFormFactor ? this.fieldCustomFormFactor.value.trim() : '')
        : this.fieldFormFactor.value.trim();
    }

    let resolvedLayout = '';
    if (this.fieldLayout) {
      resolvedLayout = this.fieldLayout.value === '__custom__'
        ? (this.fieldCustomLayout ? this.fieldCustomLayout.value.trim() : '')
        : this.fieldLayout.value.trim();
    }

    const fields = {
      housing: name,
      formFactor: resolvedFormFactor,
      layout: resolvedLayout,
      topColor: document.getElementById('field-topColor').value.trim(),
      bottomColor: document.getElementById('field-bottomColor').value.trim(),
      weight: document.getElementById('field-weight').value.trim(),
      mountType: document.getElementById('field-mountType').value.trim(),
      plate: document.getElementById('field-plate').value.trim(),
      foamType: selectedFoamType,
      foamItems: foamItems,
      foamSummary: foamSummary,
      pcb: document.getElementById('field-pcb').value.trim(),
      pcbType: document.getElementById('field-pcbType').value.trim(),
      stabilizer: document.getElementById('field-stabilizer').value.trim(),
      stabilizerSpbar: document.getElementById('field-stabilizerSpbar').value.trim(),
      switches: document.getElementById('field-switches').value.trim(),
      extraSwitches: document.getElementById('field-extraSwitches').value.trim(),
      switchLubeType: selectedLube,
      switchSpring: (selectedLube === '손윤') ? document.getElementById('field-switchSpring').value.trim() : '',
      switchFilm: (selectedLube === '손윤') ? document.getElementById('field-switchFilm').value.trim() : '',
      mountedKeycap: resolvedKeycapName,
      soundLink: document.getElementById('field-soundLink').value.trim()
    };

    const customFields = this.collectDynamicFields(this.dynamicFieldsList);

    const keyboardData = {
      id: this.activeKeyboardId,
      name,
      status,
      notes,
      fields,
      images: this.uploadedImages.filter(Boolean),
      customFields
    };

    store.saveKeyboard(keyboardData);
    this.closeModal(this.keyboardModal);

    let message = this.activeKeyboardId ? '키보드 빌드가 수정되었습니다.' : '새 키보드 빌드가 저장되었습니다.';
    if (autoCreatedKeycap) {
      message += ` ('${resolvedKeycapName}' 키캡이 보관함에 자동 등록됨)`;
    }
    this.showToast(message, 'success');
  }

  // ==================== KEYCAP MODAL ====================
  openKeycapModal(kc = null) {
    this.activeKeycapId = kc ? kc.id : null;
    document.getElementById('keycap-modal-title').textContent = kc ? '키캡 정보 수정' : '새 키캡 등록';

    document.getElementById('kc-name-input').value = kc ? kc.name : '';
    document.getElementById('kc-manufacturer-input').value = kc ? (kc.manufacturer || '') : '';
    document.getElementById('kc-profile-select').value = kc ? (kc.profile || 'Cherry (체리)') : 'Cherry (체리)';
    document.getElementById('kc-material-select').value = kc ? (kc.material || 'ABS 이중사출') : 'ABS 이중사출';
    document.getElementById('kc-status-select').value = kc ? kc.status : 'stored';
    document.getElementById('kc-notes-input').value = kc ? (kc.notes || '') : '';

    // Populate Keyboards Dropdown for Keycap
    this.kcMountedKeyboardSelect.innerHTML = '<option value="">선택 안 함 (미장착)</option>';
    store.getKeyboards().forEach(kb => {
      const opt = document.createElement('option');
      opt.value = kb.id;
      opt.textContent = kb.name;
      this.kcMountedKeyboardSelect.appendChild(opt);
    });

    this.kcMountedKeyboardSelect.value = kc?.mountedOnKeyboardId || '';
    this.kcMountedKeyboardSelect.disabled = (kc?.status !== 'mounted');

    this.keycapDynamicFieldsList.innerHTML = '';
    if (kc && kc.customFields && kc.customFields.length > 0) {
      kc.customFields.forEach(cf => {
        this.appendDynamicFieldRow(this.keycapDynamicFieldsList, cf.label, cf.value);
      });
    }

    this.openModal(this.keycapModal, '#kc-name-input');
  }

  handleKeycapSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('kc-name-input').value.trim();
    if (!name) {
      this.showToast('키캡 명칭을 입력해주세요.', 'error');
      return;
    }

    const manufacturer = document.getElementById('kc-manufacturer-input').value.trim();
    const profile = document.getElementById('kc-profile-select').value;
    const material = document.getElementById('kc-material-select').value;
    const status = document.getElementById('kc-status-select').value;
    const notes = document.getElementById('kc-notes-input').value.trim();

    const mountedOnKeyboardId = (status === 'mounted') ? this.kcMountedKeyboardSelect.value : '';
    const targetKb = mountedOnKeyboardId ? store.getKeyboardById(mountedOnKeyboardId) : null;
    const mountedOnKeyboardName = targetKb ? targetKb.name : '';

    const customFields = this.collectDynamicFields(this.keycapDynamicFieldsList);

    const keycapData = {
      id: this.activeKeycapId,
      name,
      manufacturer,
      profile,
      material,
      status,
      mountedOnKeyboardId,
      mountedOnKeyboardName,
      notes,
      customFields
    };

    store.saveKeycap(keycapData);
    this.closeModal(this.keycapModal);
    this.showToast(this.activeKeycapId ? '키캡 정보가 수정되었습니다.' : '새 키캡이 저장되었습니다.', 'success');
  }

  // ==================== SPEC SHEET MODAL ====================
  openSpecModal(kb) {
    this.activeSpecKeyboard = kb;
    document.getElementById('spec-kb-title').textContent = `${kb.name} 빌드 명세서`;

    const f = kb.fields || {};

    const validImgs = (kb.images || []).filter(Boolean);

    let html = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        
        <!-- Photos if available -->
        ${validImgs.length > 0 ? `
          <div class="card-photos-grid ${validImgs.length === 1 ? 'single' : 'double'}">
            ${validImgs.map((img, idx) => `
              <div class="card-photo-box" data-spec-img-idx="${idx}" style="height: 180px;">
                <img src="${img}" class="card-photo-img" alt="키보드 사진">
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 1. 하우징 -->
        <div class="spec-group-box">
          <div class="spec-group-title">하우징 (Housing)</div>
          <div class="spec-item"><span class="spec-label">키보드 이름</span><span class="spec-val">${this.escape(kb.name)}</span></div>
          ${f.formFactor ? `<div class="spec-item"><span class="spec-label">배열 (크기)</span><span class="spec-val" style="color: var(--accent-secondary); font-weight: 600;">${this.escape(f.formFactor)}</span></div>` : ''}
          ${f.layout ? `<div class="spec-item"><span class="spec-label">레이아웃</span><span class="spec-val" style="color: var(--accent-secondary); font-weight: 600;">${this.escape(f.layout)}</span></div>` : ''}
          ${f.topColor ? `<div class="spec-item"><span class="spec-label">상판 색상</span><span class="spec-val">${this.escape(f.topColor)}</span></div>` : ''}
          ${f.bottomColor ? `<div class="spec-item"><span class="spec-label">하판 색상</span><span class="spec-val">${this.escape(f.bottomColor)}</span></div>` : ''}
          ${f.weight ? `<div class="spec-item"><span class="spec-label">무게추</span><span class="spec-val">${this.escape(f.weight)}</span></div>` : ''}
        </div>

        <!-- 2. 마운트 & 보강판 -->
        <div class="spec-group-box">
          <div class="spec-group-title">마운트 & 보강판 / 흡음재</div>
          <div class="spec-item"><span class="spec-label">마운트</span><span class="spec-val">${this.escape(f.mountType || '-')}</span></div>
          <div class="spec-item"><span class="spec-label">보강판</span><span class="spec-val">${this.escape(f.plate || '-')}</span></div>
          <div class="spec-item"><span class="spec-label">흡음재</span><span class="spec-val" style="color: var(--accent-secondary);">${this.escape(f.foamSummary || f.foamType || '노폼')}</span></div>
        </div>

        <!-- 3. PCB & 스테빌라이저 -->
        <div class="spec-group-box">
          <div class="spec-group-title">PCB & 스테빌라이저</div>
          <div class="spec-item"><span class="spec-label">PCB</span><span class="spec-val">${this.escape(f.pcb || '-')}</span></div>
          <div class="spec-item"><span class="spec-label">타입</span><span class="spec-val">${this.escape(f.pcbType || '핫스왑')}</span></div>
          <div class="spec-item"><span class="spec-label">스테빌라이저</span><span class="spec-val">${this.escape(f.stabilizer || '-')}</span></div>
          ${f.stabilizerSpbar ? `<div class="spec-item"><span class="spec-label">스페이스바 스테빌</span><span class="spec-val" style="color: var(--accent-secondary);">${this.escape(f.stabilizerSpbar)}</span></div>` : ''}
        </div>

        <!-- 4. 스위치 세부 -->
        <div class="spec-group-box">
          <div class="spec-group-title">스위치 세부</div>
          <div class="spec-item"><span class="spec-label">메인 스위치</span><span class="spec-val">${this.escape(f.switches || '-')}</span></div>
          <div class="spec-item"><span class="spec-label">윤활 여부</span><span class="spec-val">${this.escape(f.switchLubeType || '손윤')}</span></div>
          ${f.switchSpring ? `<div class="spec-item"><span class="spec-label">스프링</span><span class="spec-val">${this.escape(f.switchSpring)}</span></div>` : ''}
          ${f.switchFilm ? `<div class="spec-item"><span class="spec-label">필름</span><span class="spec-val">${this.escape(f.switchFilm)}</span></div>` : ''}
          ${f.extraSwitches ? `<div class="spec-item"><span class="spec-label">추가/포인트 스위치</span><span class="spec-val" style="color: var(--accent-secondary);">${this.escape(f.extraSwitches)}</span></div>` : ''}
        </div>

        <!-- 5. 키캡 & 미디어 -->
        <div class="spec-group-box">
          <div class="spec-group-title">키캡 & 미디어</div>
          <div class="spec-item"><span class="spec-label">장착된 키캡</span><span class="spec-val" style="color: var(--accent-secondary);">${this.escape(f.mountedKeycap || '-')}</span></div>
          ${f.soundLink && f.soundLink.trim() && f.soundLink !== 'https://youtube.com/shorts/sample' ? `<div class="spec-item"><span class="spec-label">타건음 링크</span><span class="spec-val"><a href="${this.escape(f.soundLink.trim())}" target="_blank" rel="noopener" style="color: var(--accent-primary); font-weight: 600;">${this.escape(f.soundLink.trim())}</a></span></div>` : ''}
        </div>

        <!-- 6. 추가 옵션 필드 -->
        ${kb.customFields && kb.customFields.length > 0 ? `
          <div class="spec-group-box">
            <div class="spec-group-title">추가 옵션</div>
            ${kb.customFields.map(cf => `
              <div class="spec-item"><span class="spec-label">${this.escape(cf.label)}</span><span class="spec-val">${this.escape(cf.value)}</span></div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 7. 메모 -->
        ${kb.notes ? `
          <div class="spec-group-box">
            <div class="spec-group-title">메모</div>
            <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${this.escape(kb.notes)}</div>
          </div>
        ` : ''}

      </div>
    `;

    this.specModalBody.innerHTML = html;

    // Spec modal photo click
    this.specModalBody.querySelectorAll('.card-photo-box').forEach(box => {
      const idx = parseInt(box.getAttribute('data-spec-img-idx'), 10);
      if (validImgs[idx]) {
        box.addEventListener('click', () => {
          this.openLightbox(validImgs[idx]);
        });
      }
    });

    this.openModal(this.specModal);
  }

  openLightbox(imgSrc) {
    if (!imgSrc) return;
    this.lightboxImg.src = imgSrc;
    this.openModal(this.imageLightboxModal);
  }

  copySpecToClipboard() {
    if (!this.activeSpecKeyboard) return;
    const kb = this.activeSpecKeyboard;
    const f = kb.fields || {};

    let text = `⌨️ [${kb.name}] 빌드 명세서\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `• 키보드이름 : ${kb.name}\n`;
    if (f.formFactor) text += `  - 배열 : ${f.formFactor}\n`;
    if (f.layout) text += `  - 레이아웃 : ${f.layout}\n`;
    if (f.topColor) text += `  - 상판색상 : ${f.topColor}\n`;
    if (f.bottomColor) text += `  - 하판색상 : ${f.bottomColor}\n`;
    if (f.weight) text += `  - 무게추 : ${f.weight}\n`;
    text += `• 마운트 : ${f.mountType || '-'}\n`;
    text += `• 보강판 : ${f.plate || '-'}\n`;
    text += `• 흡음재 : ${f.foamSummary || f.foamType || '노폼'}\n`;
    text += `• PCB : ${f.pcb || '-'}\n`;
    text += `  - 타입 : ${f.pcbType || '핫스왑'}\n`;
    text += `  - 스테빌라이저 : ${f.stabilizer || '-'}\n`;
    if (f.stabilizerSpbar) text += `  - 스페이스바 스테빌 : ${f.stabilizerSpbar}\n`;
    text += `• 스위치 : ${f.switches || '-'}\n`;
    text += `  - 윤활여부 : ${f.switchLubeType || '손윤'}\n`;
    if (f.switchSpring) text += `  - 스프링 : ${f.switchSpring}\n`;
    if (f.switchFilm) text += `  - 필름 : ${f.switchFilm}\n`;
    if (f.extraSwitches) text += `  - 추가/포인트 스위치 : ${f.extraSwitches}\n`;
    text += `• 장착된 키캡 : ${f.mountedKeycap || '-'}\n`;

    if (f.soundLink && f.soundLink.trim() && f.soundLink !== 'https://youtube.com/shorts/sample') {
      text += `• 타건음 링크 : ${f.soundLink.trim()}\n`;
    }

    if (kb.customFields && kb.customFields.length > 0) {
      kb.customFields.forEach(cf => {
        text += `• ${cf.label} : ${cf.value}\n`;
      });
    }

    if (kb.notes) {
      text += `• 메모 : ${kb.notes}\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
      this.showToast('클립보드에 빌드 스펙이 복사되었습니다!', 'success');
    });
  }

  // ==================== CLOUD & GOOGLE DRIVE SYNC ====================
  initServices() {
    // 1. Initialize Google Drive UI & Status listener
    const savedClientId = googleDriveService.getClientId();
    if (this.gdriveClientIdInput && savedClientId) {
      this.gdriveClientIdInput.value = savedClientId;
    }

    // Try initializing token client if GIS is loaded
    googleDriveService.initTokenClient();

    googleDriveService.onStatusChange((status) => {
      this.updateGoogleDriveUI();
      if (status.event === 'sync_start') {
        this.updateCloudStatus('syncing', '동기화 중...');
      } else if (status.event === 'sync_success') {
        this.updateCloudStatus('connected', '동기화 완료');
      } else if (status.event === 'sync_error') {
        this.updateCloudStatus('error', '동기화 오류');
      } else if (status.event === 'logout') {
        this.updateCloudStatus('local', '로컬 모드');
      }
    });

    this.updateGoogleDriveUI();

    // 2. Startup Sync Check (PC에서 저장한 최신 데이터가 드라이브에 있는지 검사)
    setTimeout(() => {
      this.checkStartupSyncConflict();
    }, 1200);

    // 3. Debounced Auto-Save on Store Changes
    store.subscribe((event) => {
      this.render();
      if (['KEYBOARD_SAVED', 'KEYBOARD_DELETED', 'KEYCAP_SAVED', 'KEYCAP_DELETED'].includes(event)) {
        this.triggerDebouncedAutoSave();
      }
    });
  }

  updateCloudStatus(state, text) {
    if (!this.cloudStatusDot || !this.cloudStatusText) return;
    this.cloudStatusText.textContent = text;
    this.cloudStatusDot.className = 'pulse-dot';
    if (state === 'connected') {
      this.cloudStatusDot.style.background = '#10b981'; // Green
    } else if (state === 'syncing') {
      this.cloudStatusDot.style.background = '#f59e0b'; // Amber
    } else if (state === 'error') {
      this.cloudStatusDot.style.background = '#ef4444'; // Red
    } else {
      this.cloudStatusDot.style.background = '#94a3b8'; // Gray
    }
  }

  updateGoogleDriveUI() {
    const isConn = googleDriveService.isConnected();
    if (this.gdriveDisconnectedBox) this.gdriveDisconnectedBox.style.display = isConn ? 'none' : 'flex';
    if (this.gdriveConnectedBox) this.gdriveConnectedBox.style.display = isConn ? 'flex' : 'none';

    if (isConn) {
      const user = googleDriveService.getUserProfile();
      if (user) {
        if (this.gdriveUserAvatar) this.gdriveUserAvatar.src = user.picture || '';
        if (this.gdriveUserName) this.gdriveUserName.textContent = user.name || 'Google User';
        if (this.gdriveUserEmail) this.gdriveUserEmail.textContent = user.email || '';
      }
      const lastSync = localStorage.getItem('gdrive_last_synced_at');
      if (this.gdriveLastSyncLabel) {
        this.gdriveLastSyncLabel.textContent = lastSync ? new Date(lastSync).toLocaleString('ko-KR') : '아직 없음';
      }
      this.updateCloudStatus('connected', '드라이브 연결됨');
    } else {
      this.updateCloudStatus('local', '로컬 모드');
    }

    // Update Rollback snapshot display
    const snapshot = store.getRollbackSnapshot();
    if (this.rollbackSnapshotBadge && this.rollbackSnapshotDesc) {
      if (snapshot) {
        this.rollbackSnapshotBadge.textContent = `보관됨 (${new Date(snapshot.timestamp).toLocaleTimeString('ko-KR')})`;
        this.rollbackSnapshotBadge.style.background = 'var(--bg-tertiary)';
        this.rollbackSnapshotBadge.style.color = 'var(--text-primary)';
        this.rollbackSnapshotDesc.textContent = `동기화 전 백업: 키보드 ${snapshot.keyboardCount}개, 키캡 ${snapshot.keycapCount}개 (${new Date(snapshot.timestamp).toLocaleString('ko-KR')})`;
        if (this.btnRestoreRollback) this.btnRestoreRollback.disabled = false;
      } else {
        this.rollbackSnapshotBadge.textContent = '스냅샷 없음';
        this.rollbackSnapshotDesc.textContent = '드라이브에서 데이터를 내려받아 덮어쓰기 전 기존 데이터가 자동으로 보관됩니다.';
        if (this.btnRestoreRollback) this.btnRestoreRollback.disabled = true;
      }
    }
  }

  async checkStartupSyncConflict() {
    const isEnabled = localStorage.getItem('gdrive_pref_startup_sync') !== 'false';
    if (!isEnabled || !googleDriveService.isConnected()) return;

    try {
      const remote = await googleDriveService.checkRemoteFileStatus();
      if (!remote || !remote.modifiedTime) return;

      const remoteTime = new Date(remote.modifiedTime).getTime();
      const lastSyncedTime = new Date(localStorage.getItem('gdrive_last_synced_at') || '2000-01-01').getTime();
      const localModifiedTime = new Date(localStorage.getItem('keyvault_last_local_modified') || '2000-01-01').getTime();

      // If remote modified is newer than last local edit by more than 3 seconds
      if (remoteTime > lastSyncedTime + 3000 && remoteTime > localModifiedTime + 3000) {
        await this.requestGdriveDownload(true);
      }
    } catch (err) {
      console.warn('Startup sync check skipped:', err);
    }
  }

  async handleGdriveUpload(isManual = false) {
    if (!googleDriveService.isConnected()) {
      if (isManual) this.showToast('먼저 Google 드라이브에 로그인해주세요.', 'error');
      return;
    }

    try {
      if (isManual) this.showToast('구글 드라이브에 저장 중...', 'info');
      const dataPayload = store.exportAllData();
      await googleDriveService.uploadVaultData(dataPayload);
      this.updateGoogleDriveUI();
      if (isManual) this.showToast('구글 드라이브에 성공적으로 저장되었습니다!', 'success');
    } catch (err) {
      console.error(err);
      this.showToast('구글 드라이브 저장 실패: ' + err.message, 'error');
    }
  }

  async requestGdriveDownload(isStartup = false) {
    if (!googleDriveService.isConnected()) {
      if (!isStartup) this.showToast('먼저 Google 드라이브에 로그인해주세요.', 'error');
      return;
    }

    try {
      if (!isStartup) this.showToast('구글 드라이브 데이터 확인 중...', 'info');
      const res = await googleDriveService.downloadVaultData();
      if (!res || !res.data) {
        throw new Error('드라이브에서 데이터를 가져올 수 없습니다.');
      }

      const remoteData = res.data;
      this.pendingRemoteSyncData = remoteData;

      // Extract Remote Info
      const remoteTimeStr = remoteData.exportedAt || res.fileInfo.modifiedTime;
      const remoteTime = new Date(remoteTimeStr).getTime();
      const remoteKbs = remoteData.data?.keyboards || remoteData.keyboards || [];
      const remoteKcs = remoteData.data?.keycaps || remoteData.keycaps || [];
      const remoteActionDesc = remoteData.lastAction?.description || (remoteData.exportedAt ? '구글 드라이브 백업' : '상세 기록 없음');

      // Extract Local Info
      const localTimeStr = localStorage.getItem('keyvault_last_local_modified') || new Date().toISOString();
      const localTime = new Date(localTimeStr).getTime();
      const localKbs = store.getKeyboards();
      const localKcs = store.getKeycaps();
      const localAction = store.getLastAction();
      const localActionDesc = localAction?.description || '최근 작업 내역 없음';

      // Compare timestamps
      const isRemoteOlder = (localTime - remoteTime) > 3000;
      const isRemoteNewer = (remoteTime - localTime) > 3000;

      // If called from startup check and remote is not newer, skip modal
      if (isStartup && !isRemoteNewer) {
        return;
      }

      // Populate Modal Fields
      if (this.syncLocalTime) {
        this.syncLocalTime.textContent = new Date(localTimeStr).toLocaleString('ko-KR');
      }
      if (this.syncLocalCounts) {
        this.syncLocalCounts.textContent = `키보드 ${localKbs.length}개 · 키캡 ${localKcs.length}개`;
      }
      if (this.syncLocalAction) {
        this.syncLocalAction.textContent = localActionDesc;
      }

      if (this.syncRemoteTime) {
        this.syncRemoteTime.textContent = new Date(remoteTimeStr).toLocaleString('ko-KR');
      }
      if (this.syncRemoteCounts) {
        this.syncRemoteCounts.textContent = `키보드 ${remoteKbs.length}개 · 키캡 ${remoteKcs.length}개`;
      }
      if (this.syncRemoteAction) {
        this.syncRemoteAction.textContent = remoteActionDesc;
      }

      // Style Alert Banner & Buttons based on whether remote is older
      if (this.syncAlertBanner && this.syncAlertTitle && this.syncAlertDesc && this.btnSyncConfirmProceed) {
        if (isRemoteOlder) {
          if (this.syncModalTitle) this.syncModalTitle.textContent = '구글 드라이브 데이터 덮어쓰기 주의';
          this.syncAlertBanner.style.background = 'rgba(239, 68, 68, 0.08)';
          this.syncAlertBanner.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          this.syncAlertBanner.style.color = '#dc2626';
          this.syncAlertTitle.textContent = '주의: 구글 드라이브 데이터가 현재 기기보다 과거 시점입니다!';
          this.syncAlertDesc.textContent = '구글 드라이브 데이터로 덮어쓰면, 현재 기기에서 최근에 수정한 내용이 이전 시점으로 되돌아갑니다. 마지막 작업 내역을 확인한 후 신중히 진행해주세요.';
          this.btnSyncConfirmProceed.textContent = '과거 데이터로 덮어쓰기';
          this.btnSyncConfirmProceed.className = 'btn btn-secondary';
          this.btnSyncConfirmProceed.style.borderColor = '#dc2626';
          this.btnSyncConfirmProceed.style.color = '#dc2626';
        } else {
          if (this.syncModalTitle) this.syncModalTitle.textContent = '구글 드라이브 데이터 동기화 확인';
          this.syncAlertBanner.style.background = 'rgba(16, 185, 129, 0.08)';
          this.syncAlertBanner.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          this.syncAlertBanner.style.color = 'var(--text-primary)';
          this.syncAlertTitle.textContent = isRemoteNewer ? '구글 드라이브에 더 최신 데이터가 있습니다' : '구글 드라이브 데이터 불러오기';
          this.syncAlertDesc.textContent = '구글 드라이브에 저장된 빌드 데이터를 현재 기기로 불러와 덮어씁니다. 진행 전 마지막 작업을 확인해주세요.';
          this.btnSyncConfirmProceed.textContent = '구글 데이터로 덮어쓰기';
          this.btnSyncConfirmProceed.className = 'btn btn-primary';
          this.btnSyncConfirmProceed.style.borderColor = '';
          this.btnSyncConfirmProceed.style.color = '';
        }
      }

      this.openModal(this.syncConfirmModal);
    } catch (err) {
      console.error(err);
      if (!isStartup) this.showToast('불러오기 준비 실패: ' + err.message, 'error');
    }
  }

  confirmGdriveDownload() {
    if (!this.pendingRemoteSyncData) return;

    try {
      // 1. Create safety rollback snapshot BEFORE overwriting
      store.saveRollbackSnapshot('동기화 직전 자동 백업');

      // 2. Overwrite local data with remote data
      store.importJSON(JSON.stringify(this.pendingRemoteSyncData));

      // 3. Mark as synced
      googleDriveService.markSynced();
      this.updateGoogleDriveUI();

      this.closeModal(this.syncConfirmModal);
      if (this.cloudModal && this.cloudModal.classList.contains('active')) {
        this.closeModal(this.cloudModal);
      }

      this.showToast('구글 드라이브 데이터를 성공적으로 불러왔습니다! (언제든 롤백 가능)', 'success');
    } catch (err) {
      console.error(err);
      this.showToast('덮어쓰기 실패: ' + err.message, 'error');
    } finally {
      this.pendingRemoteSyncData = null;
    }
  }

  handleRestoreRollback() {
    const snapshot = store.getRollbackSnapshot();
    if (!snapshot) {
      this.showToast('복원할 수 있는 롤백 스냅샷이 없습니다.', 'error');
      return;
    }

    const confirmMsg = `동기화 직전의 로컬 상태로 복원하시겠습니까?\n(백업 시점: ${new Date(snapshot.timestamp).toLocaleString('ko-KR')}, 키보드 ${snapshot.keyboardCount}개)`;
    if (confirm(confirmMsg)) {
      try {
        store.restoreRollbackSnapshot();
        this.updateGoogleDriveUI();
        this.showToast('동기화 이전 로컬 데이터로 완벽히 복원되었습니다.', 'success');
      } catch (err) {
        this.showToast('롤백 복원 오류: ' + err.message, 'error');
      }
    }
  }

  triggerDebouncedAutoSave() {
    const isAutoSave = localStorage.getItem('gdrive_pref_auto_save') !== 'false';
    if (!isAutoSave || !googleDriveService.isConnected()) return;

    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    this.updateCloudStatus('syncing', '변경사항 저장 대기 중...');

    this.autoSaveTimer = setTimeout(async () => {
      try {
        await this.handleGdriveUpload(false);
      } catch (err) {
        console.warn('Auto-save to drive failed:', err);
      }
    }, 3000); // 3 seconds debounce
  }

  async handleFirstTimeSyncCheck() {
    try {
      const remote = await googleDriveService.checkRemoteFileStatus();
      if (!remote) {
        // No remote file yet, ask to upload local data
        if (confirm('구글 드라이브에 기존 저장된 데이터가 없습니다. 현재 기기의 데이터를 지금 드라이브에 최초 업로드하시겠습니까?')) {
          await this.handleGdriveUpload(true);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  openCloudModal() {
    this.openModal(this.cloudModal);
  }

  openBackupModal() {
    this.openModal(this.backupModal);
  }

  exportBackupFile() {
    const jsonStr = store.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('JSON 백업 파일이 다운로드되었습니다.', 'success');
  }

  handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      const res = store.importJSON(content);
      if (res.success) {
        this.showToast(`복원 성공! 키보드 ${res.keyboardCount}개, 키캡 ${res.keycapCount}개가 로드되었습니다.`, 'success');
        this.closeModal(this.backupModal);
      } else {
        this.showToast('복원 실패: ' + res.error, 'error');
      }
      this.importFileInput.value = '';
    };
    reader.readAsText(file);
  }

  openModal(modalEl, focusTarget = null) {
    modalEl.classList.add('active');

    // 모달 및 스크롤 영역 최상단 리셋
    modalEl.scrollTop = 0;
    const modalContainer = modalEl.querySelector('.modal-container');
    if (modalContainer) modalContainer.scrollTop = 0;
    const modalBody = modalEl.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;

    requestAnimationFrame(() => {
      if (modalBody) modalBody.scrollTop = 0;
      if (modalContainer) modalContainer.scrollTop = 0;

      if (focusTarget) {
        const el = typeof focusTarget === 'string' ? modalEl.querySelector(focusTarget) : focusTarget;
        if (el) {
          el.focus({ preventScroll: true });
        }
      }
      if (modalBody) modalBody.scrollTop = 0;
    });
  }

  closeModal(modalEl) {
    modalEl.classList.remove('active');
    const modalBody = modalEl.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
    const modalContainer = modalEl.querySelector('.modal-container');
    if (modalContainer) modalContainer.scrollTop = 0;
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  escape(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
