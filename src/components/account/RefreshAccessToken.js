import axios from 'axios';
const refreshAccessToken = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
refreshAccessToken.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
refreshAccessToken.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(process.env.REACT_APP_API_BASE_URL +'/api/Account/refresh-token', {
            token: localStorage.getItem('token'),
            refreshToken: refreshToken
          });
          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return refreshAccessToken(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed', refreshError);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default refreshAccessToken;