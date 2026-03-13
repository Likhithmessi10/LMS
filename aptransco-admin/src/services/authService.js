import { OPENEDX_CONFIG } from '../config/openedx';

export const authService = {
  login: () => {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: OPENEDX_CONFIG.OAUTH_CLIENT_ID,
      redirect_uri: OPENEDX_CONFIG.REDIRECT_URI,
      scope: 'profile email openid'
    });
    window.location.href = `${OPENEDX_CONFIG.BASE_URL}/oauth2/authorize/?${params.toString()}`;
  },

  handleCallback: async (code) => {
    // In a production app, the token exchange happens on the backend or via PKCE
    // For local dev, we use client_id/secret or public client exchange
    const response = await fetch(`${OPENEDX_CONFIG.BASE_URL}/oauth2/access_token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: OPENEDX_CONFIG.OAUTH_CLIENT_ID,
        redirect_uri: OPENEDX_CONFIG.REDIRECT_URI
      })
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('openedx_access_token', data.access_token);
      localStorage.setItem('openedx_user', JSON.stringify(data.user));
      return data;
    }
    throw new Error('Failed to exchange token');
  },

  logout: () => {
    localStorage.removeItem('openedx_access_token');
    localStorage.removeItem('openedx_user');
    window.location.href = '/';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('openedx_access_token');
  }
};