/**
 * Google Drive API v3 Service for Keyfolio
 * 
 * Features:
 * - Google Identity Services (GIS) OAuth 2.0 Token Client
 * - Stores data in user's hidden private App Data folder (appDataFolder)
 * - Zero developer server / zero DB liability / 100% user-owned storage
 * - Multipart JSON upload & download
 * - Remote file modifiedTime inspection for startup conflict resolution
 */

export const DEFAULT_GOOGLE_CLIENT_ID = '768836393887-m4tmfcg0t8f7q9o0gq0o2rgs50b8ms7j.apps.googleusercontent.com';

export class GoogleDriveService {
  constructor() {
    this.tokenClient = null;
    this.accessToken = localStorage.getItem('gdrive_access_token') || null;
    this.tokenExpiresAt = parseInt(localStorage.getItem('gdrive_token_expires_at') || '0', 10);
    this.clientId = localStorage.getItem('gdrive_client_id') || DEFAULT_GOOGLE_CLIENT_ID || '';
    this.userProfile = JSON.parse(localStorage.getItem('gdrive_user_profile') || 'null');
    
    // File metadata cache
    this.fileId = localStorage.getItem('gdrive_vault_file_id') || null;
    this.FILE_NAME = 'keyfolio_vault.json';

    this.onStatusChangeCallbacks = new Set();
  }

  // Subscribe to auth / sync status changes
  onStatusChange(callback) {
    this.onStatusChangeCallbacks.add(callback);
    return () => this.onStatusChangeCallbacks.delete(callback);
  }

  notifyStatus(status) {
    for (const cb of this.onStatusChangeCallbacks) {
      try { cb(status); } catch (e) { console.error('Status callback error:', e); }
    }
  }

  // Check if currently connected with a valid non-expired token
  isConnected() {
    return !!(this.accessToken && Date.now() < this.tokenExpiresAt);
  }

  getClientId() {
    return this.clientId || DEFAULT_GOOGLE_CLIENT_ID;
  }

  setClientId(clientId) {
    this.clientId = clientId.trim();
    localStorage.setItem('gdrive_client_id', this.clientId);
    this.initTokenClient();
  }

  // Initialize GIS token client
  initTokenClient() {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      console.warn('Google Identity Services SDK not loaded yet.');
      return false;
    }

    if (!this.clientId) {
      return false;
    }

    try {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (resp) => {
          if (resp.error) {
            console.error('Google Auth error:', resp);
            this.notifyStatus({ event: 'auth_error', error: resp.error });
            return;
          }

          this.accessToken = resp.access_token;
          // Expires in approx 3500 seconds (standard 1 hour)
          const expiresIn = (parseInt(resp.expires_in, 10) || 3600) * 1000;
          this.tokenExpiresAt = Date.now() + expiresIn - 60000; // 1 min buffer

          localStorage.setItem('gdrive_access_token', this.accessToken);
          localStorage.setItem('gdrive_token_expires_at', this.tokenExpiresAt.toString());

          // Fetch user profile
          await this.fetchUserProfile();

          this.notifyStatus({ event: 'login_success', user: this.userProfile });
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to initialize GIS TokenClient:', err);
      return false;
    }
  }

  // Trigger Google Login popup
  async login() {
    if (!this.clientId) {
      this.clientId = DEFAULT_GOOGLE_CLIENT_ID;
    }

    if (!this.tokenClient) {
      const initialized = this.initTokenClient();
      if (!initialized) {
        throw new Error('Google Identity SDK를 불러오는 중입니다. 2초 후 다시 시도해주세요.');
      }
    }

    return new Promise((resolve, reject) => {
      try {
        // Request token (triggers Google OAuth popup)
        this.tokenClient.requestAccessToken({ prompt: '' });
        
        // Listen once for outcome
        const unsub = this.onStatusChange((status) => {
          if (status.event === 'login_success') {
            unsub();
            resolve({ success: true, user: status.user });
          } else if (status.event === 'auth_error') {
            unsub();
            reject(new Error(status.error));
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // Logout & revoke token
  logout() {
    if (this.accessToken && window.google?.accounts?.oauth2?.revoke) {
      try {
        window.google.accounts.oauth2.revoke(this.accessToken, () => {});
      } catch (e) {
        console.warn('Revoke error:', e);
      }
    }

    this.accessToken = null;
    this.tokenExpiresAt = 0;
    this.userProfile = null;
    localStorage.removeItem('gdrive_access_token');
    localStorage.removeItem('gdrive_token_expires_at');
    localStorage.removeItem('gdrive_user_profile');

    this.notifyStatus({ event: 'logout' });
  }

  // Fetch basic user profile (name, email, avatar)
  async fetchUserProfile() {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      if (res.ok) {
        this.userProfile = await res.json();
        localStorage.setItem('gdrive_user_profile', JSON.stringify(this.userProfile));
        return this.userProfile;
      }
    } catch (err) {
      console.error('Failed to fetch Google user profile:', err);
    }
    return null;
  }

  getUserProfile() {
    return this.userProfile;
  }

  // Helper to extract detailed error message from Google API responses
  async _extractError(res, defaultMsg) {
    try {
      const json = await res.json();
      if (json && json.error && json.error.message) {
        if (json.error.message.includes('API has not been used') || json.error.message.includes('it is disabled')) {
          return 'Google Cloud Console에서 Google Drive API가 활성화되어 있지 않습니다. [API 및 서비스 > 라이브러리]에서 Google Drive API를 [사용] 설정해주세요.';
        }
        return `${defaultMsg}: ${json.error.message}`;
      }
    } catch (_) {}
    return `${defaultMsg}: ${res.statusText || res.status || '네트워크 오류'}`;
  }

  // ==================== GOOGLE DRIVE FILE OPERATIONS ====================

  // Locate Keyfolio file in appDataFolder (supports backward compatibility for legacy keyvault_vault.json)
  async findVaultFile() {
    if (!this.isConnected()) throw new Error('구글 드라이브에 로그인되어 있지 않습니다.');

    const query = encodeURIComponent(`(name = '${this.FILE_NAME}' or name = 'keyvault_vault.json') and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime desc`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!res.ok) {
      if (res.status === 401) {
        this.logout();
        throw new Error('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      }
      const errMsg = await this._extractError(res, '파일 목록 조회 실패');
      throw new Error(errMsg);
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      this.fileId = data.files[0].id;
      localStorage.setItem('gdrive_vault_file_id', this.fileId);
      return data.files[0];
    }

    this.fileId = null;
    localStorage.removeItem('gdrive_vault_file_id');
    return null;
  }

  // Upload Vault Data to appDataFolder (Create or Update)
  async uploadVaultData(vaultObject) {
    if (!this.isConnected()) throw new Error('구글 드라이브에 로그인되어 있지 않습니다.');

    this.notifyStatus({ event: 'sync_start', direction: 'upload' });

    try {
      const existingFile = await this.findVaultFile();
      const fileContent = JSON.stringify(vaultObject, null, 2);

      let res;
      if (existingFile) {
        // Update existing file content (simple media upload)
        const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`;
        res = await fetch(uploadUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: fileContent
        });
      } else {
        // Multipart upload to create file in appDataFolder
        const metadata = {
          name: this.FILE_NAME,
          parents: ['appDataFolder'],
          mimeType: 'application/json'
        };

        const boundary = '-------314159265358979323846';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const multipartBody =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          fileContent +
          closeDelimiter;

        const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        res = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartBody
        });
      }

      if (!res.ok) {
        const errMsg = await this._extractError(res, '구글 드라이브 업로드 실패');
        throw new Error(errMsg);
      }

      const resultFile = await res.json();
      this.fileId = resultFile.id;
      localStorage.setItem('gdrive_vault_file_id', this.fileId);

      const syncTime = new Date().toISOString();
      localStorage.setItem('gdrive_last_synced_at', syncTime);

      this.notifyStatus({ event: 'sync_success', direction: 'upload', timestamp: syncTime });
      return { success: true, timestamp: syncTime, file: resultFile };
    } catch (err) {
      this.notifyStatus({ event: 'sync_error', error: err.message });
      throw err;
    }
  }

  // Download Vault Data from appDataFolder
  async downloadVaultData() {
    if (!this.isConnected()) throw new Error('구글 드라이브에 로그인되어 있지 않습니다.');

    this.notifyStatus({ event: 'sync_start', direction: 'download' });

    try {
      const fileInfo = await this.findVaultFile();
      if (!fileInfo) {
        throw new Error('구글 드라이브에 저장된 Keyfolio 데이터 파일이 없습니다. 먼저 현재 기기 데이터를 업로드해주세요.');
      }

      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileInfo.id}?alt=media`;
      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (!res.ok) {
        const errMsg = await this._extractError(res, '파일 다운로드 실패');
        throw new Error(errMsg);
      }

      const vaultData = await res.json();
      const syncTime = new Date().toISOString();
      return { success: true, timestamp: syncTime, data: vaultData, fileInfo };
    } catch (err) {
      this.notifyStatus({ event: 'sync_error', error: err.message });
      throw err;
    }
  }

  // Mark local sync state as up to date with cloud
  markSynced(timestamp = new Date().toISOString()) {
    localStorage.setItem('gdrive_last_synced_at', timestamp);
    this.notifyStatus({ event: 'sync_success', direction: 'download', timestamp });
  }

  // Inspect Remote File Metadata for Startup Conflict Resolution
  async checkRemoteFileStatus() {
    if (!this.isConnected()) return null;

    try {
      const fileInfo = await this.findVaultFile();
      if (!fileInfo) return null;

      return {
        id: fileInfo.id,
        name: fileInfo.name,
        modifiedTime: fileInfo.modifiedTime, // ISO string
        size: fileInfo.size
      };
    } catch (err) {
      console.warn('Failed to check remote file status:', err);
      return null;
    }
  }
}

export const googleDriveService = new GoogleDriveService();
