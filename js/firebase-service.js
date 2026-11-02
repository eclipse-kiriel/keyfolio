/**
 * Firebase Firestore & Authentication Service
 * Uses Firebase v10 CDN ES Modules for zero-build, seamless PWA execution.
 */

import { STORAGE_KEYS } from './constants.js';
import { store } from './store.js';

class FirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.unsubscribeSnapshot = null;
    this.isConfigured = false;
    this.isSyncing = false;
    this.listeners = new Set();
    this.init();
  }

  getConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveConfig(config) {
    localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
    return this.initializeFirebase(config);
  }

  clearConfig() {
    localStorage.removeItem(STORAGE_KEYS.FIREBASE_CONFIG);
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
      this.unsubscribeSnapshot = null;
    }
    this.app = null;
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.isConfigured = false;
    this.notifyStatus();
  }

  subscribeStatus(callback) {
    this.listeners.add(callback);
    callback(this.getStatus());
    return () => this.listeners.delete(callback);
  }

  notifyStatus() {
    const status = this.getStatus();
    for (const listener of this.listeners) {
      try {
        listener(status);
      } catch (err) {
        console.error('Status listener error:', err);
      }
    }
  }

  getStatus() {
    return {
      isConfigured: this.isConfigured,
      isAuthenticated: !!this.currentUser,
      user: this.currentUser ? {
        displayName: this.currentUser.displayName,
        email: this.currentUser.email,
        photoURL: this.currentUser.photoURL,
        uid: this.currentUser.uid
      } : null,
      isSyncing: this.isSyncing
    };
  }

  async init() {
    const config = this.getConfig();
    if (config && config.apiKey && config.projectId) {
      await this.initializeFirebase(config);
    }
    // Hook store changes to automatically sync to cloud
    store.setCloudSyncCallback((event) => {
      if (['KEYBOARD_SAVED', 'KEYBOARD_DELETED', 'KEYCAP_SAVED', 'KEYCAP_DELETED', 'DATA_IMPORTED'].includes(event)) {
        this.pushToCloud();
      }
    });
  }

  async initializeFirebase(config) {
    try {
      // Dynamic import of Firebase v10 SDK via CDN
      const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
      const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
      const { getFirestore, doc, setDoc, onSnapshot, enableIndexedDbPersistence } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

      const existingApps = getApps();
      this.app = existingApps.length > 0 ? existingApps[0] : initializeApp(config);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.GoogleAuthProvider = GoogleAuthProvider;
      this.signInWithPopup = signInWithPopup;
      this.signOut = signOut;
      this.doc = doc;
      this.setDoc = setDoc;
      this.onSnapshot = onSnapshot;

      // Try enabling offline persistence
      try {
        await enableIndexedDbPersistence(this.db);
      } catch (persistenceErr) {
        // Multi-tab or already enabled is fine
        console.warn('Firestore offline persistence warning:', persistenceErr.code);
      }

      this.isConfigured = true;

      // Listen for auth state changes
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        this.notifyStatus();
        if (user) {
          this.listenToUserDocument(user.uid);
        } else {
          if (this.unsubscribeSnapshot) {
            this.unsubscribeSnapshot();
            this.unsubscribeSnapshot = null;
          }
        }
      });

      this.notifyStatus();
      return { success: true };
    } catch (err) {
      console.error('Firebase initialization error:', err);
      this.isConfigured = false;
      this.notifyStatus();
      return { success: false, error: err.message };
    }
  }

  listenToUserDocument(uid) {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }

    try {
      const userDocRef = this.doc(this.db, 'users', uid, 'data', 'vault');
      this.unsubscribeSnapshot = this.onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          // Merge / replace local with cloud if remote has content
          if (cloudData && (cloudData.keyboards || cloudData.keycaps)) {
            store.loadRemoteData(cloudData.keyboards || [], cloudData.keycaps || []);
          }
        } else {
          // If first time, push initial local data to cloud
          this.pushToCloud();
        }
      }, (err) => {
        console.error('Firestore snapshot listener error:', err);
      });
    } catch (err) {
      console.error('Failed to listen to Firestore doc:', err);
    }
  }

  async loginWithGoogle() {
    if (!this.auth) throw new Error('Firebase가 아직 설정되지 않았습니다.');
    const provider = new this.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await this.signInWithPopup(this.auth, provider);
      return { success: true, user: result.user };
    } catch (err) {
      console.error('Google login error:', err);
      return { success: false, error: err.message };
    }
  }

  async logout() {
    if (!this.auth) return;
    try {
      await this.signOut(this.auth);
      this.currentUser = null;
      if (this.unsubscribeSnapshot) {
        this.unsubscribeSnapshot();
        this.unsubscribeSnapshot = null;
      }
      this.notifyStatus();
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, error: err.message };
    }
  }

  async pushToCloud() {
    if (!this.currentUser || !this.db) return;
    this.isSyncing = true;
    this.notifyStatus();

    try {
      const userDocRef = this.doc(this.db, 'users', this.currentUser.uid, 'data', 'vault');
      const payload = {
        updatedAt: new Date().toISOString(),
        keyboards: store.getKeyboards(),
        keycaps: store.getKeycaps()
      };
      await this.setDoc(userDocRef, payload, { merge: true });
    } catch (err) {
      console.error('Failed to push data to Firestore:', err);
    } finally {
      this.isSyncing = false;
      this.notifyStatus();
    }
  }
}

export const firebaseService = new FirebaseService();
