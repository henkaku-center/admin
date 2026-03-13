/**
 * API client for Henkaku Registry — Admin panel
 * Subset of the shared ApiClient focused on auth and user management.
 */

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.accessToken = null;
        this.refreshToken = null;
        this._refreshPromise = null;
    }

    init() {
        this.accessToken = localStorage.getItem('registry_access_token');
        this.refreshToken = localStorage.getItem('registry_refresh_token');
    }

    // ── Auth ────────────────────────────────────────────────────

    async login(email, password) {
        const res = await this._fetch('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }, false);
        this._storeTokens(res.access_token, res.refresh_token);
        return res;
    }

    async refreshAuth() {
        if (!this.refreshToken) throw new Error('No refresh token');
        if (this._refreshPromise) return this._refreshPromise;
        this._refreshPromise = (async () => {
            try {
                const res = await this._fetch('/api/v1/auth/refresh', {
                    method: 'POST',
                    body: JSON.stringify({ refresh_token: this.refreshToken }),
                }, false);
                this._storeTokens(res.access_token, res.refresh_token);
                return res;
            } finally {
                this._refreshPromise = null;
            }
        })();
        return this._refreshPromise;
    }

    async me() {
        return this._fetch('/api/v1/auth/me');
    }

    logout() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('registry_access_token');
        localStorage.removeItem('registry_refresh_token');
    }

    get isAuthenticated() {
        return !!this.accessToken;
    }

    // ── Profile ───────────────────────────────────────────────

    async updateProfile(data) {
        return this._fetch('/api/v1/auth/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async changePassword(currentPassword, newPassword) {
        return this._fetch('/api/v1/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });
    }

    // ── Dietary Info ─────────────────────────────────────────

    async updateDietaryInfo(data) {
        return this._fetch('/api/v1/auth/me/dietary', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // ── Admin: Users ──────────────────────────────────────────

    async getUsers() {
        return this._fetch('/api/v1/auth/users');
    }

    async updateUserGovernance(userId, data) {
        return this._fetch(`/api/v1/auth/users/${userId}/governance`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async updateUserRole(userId, role) {
        return this._fetch(`/api/v1/auth/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    }

    async deleteUser(userId) {
        return this._fetch(`/api/v1/auth/users/${userId}`, { method: 'DELETE' });
    }

    async setTempPassword(userId, password) {
        return this._fetch(`/api/v1/auth/users/${userId}/temp-password`, {
            method: 'POST',
            body: JSON.stringify({ password }),
        });
    }

    // ── Admin: Invite Codes ───────────────────────────────────

    async createInviteCode(expiresAt = null) {
        return this._fetch('/api/v1/auth/invite-codes', {
            method: 'POST',
            body: JSON.stringify({ expires_at: expiresAt }),
        });
    }

    async getInviteCodes() {
        return this._fetch('/api/v1/auth/invite-codes');
    }

    async deleteInviteCode(code) {
        return this._fetch(`/api/v1/auth/invite-codes/${code}`, { method: 'DELETE' });
    }

    // ── Activity Log ─────────────────────────────────────────

    async getActivityLog(params = {}) {
        const qs = new URLSearchParams();
        if (params.limit) qs.set('limit', params.limit);
        if (params.offset) qs.set('offset', params.offset);
        if (params.user_id) qs.set('user_id', params.user_id);
        if (params.method) qs.set('method', params.method);
        if (params.path_contains) qs.set('path_contains', params.path_contains);
        const query = qs.toString() ? `?${qs}` : '';
        return this._fetch(`/api/v1/activity${query}`);
    }

    // ── Internal ──────────────────────────────────────────────

    _storeTokens(access, refresh) {
        this.accessToken = access;
        this.refreshToken = refresh;
        localStorage.setItem('registry_access_token', access);
        localStorage.setItem('registry_refresh_token', refresh);
    }

    async _fetch(path, opts = {}, withAuth = true) {
        const url = `${this.baseUrl}${path}`;
        const headers = opts.headers !== undefined ? { ...opts.headers } : { 'Content-Type': 'application/json' };

        if (withAuth && this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        let res = await fetch(url, { ...opts, headers });

        if (res.status === 401 && withAuth && this.refreshToken) {
            try {
                await this.refreshAuth();
                headers['Authorization'] = `Bearer ${this.accessToken}`;
                res = await fetch(url, { ...opts, headers });
            } catch {
                this.logout();
                throw new Error('Session expired. Please log in again.');
            }
        }

        if (res.status === 204) return null;

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            const err = new Error(body.detail || `API error ${res.status}`);
            err.status = res.status;
            err.body = body;
            throw err;
        }

        return res.json();
    }
}
