import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

let _store = null;

export const injectStore = (store) => {
  _store = store;
};

api.interceptors.request.use((config) => {
  const token = _store?.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && _store) {
      import('../store/slices/authSlice').then(({ logout }) => {
        _store.dispatch(logout());
      });
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;