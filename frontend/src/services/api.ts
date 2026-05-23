import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post('/api/v1/auth/refresh', {
            refresh_token: refreshToken,
          });
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
          // Update user in store if returned
          if (res.data.user) {
            const { useAuthStore } = await import('../stores');
            useAuthStore.setState({ user: res.data.user });
          }
          return api(error.config);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Vocabulary API
export const vocabAPI = {
  getWords: (params: { page?: number; limit?: number; search?: string; difficulty?: string; pos?: string; category?: string }) =>
    api.get('/vocabulary/words', { params }),
  getWord: (id: string) => api.get(`/vocabulary/words/${id}`),
  explainWord: (id: string) => api.get(`/vocabulary/words/${id}/explain`),
  generateSentences: (id: string, count?: number) =>
    api.get(`/vocabulary/words/${id}/sentences`, { params: { count } }),
  getStats: () => api.get('/vocabulary/stats'),
};

// SRS API
export const srsAPI = {
  getDueWords: (params?: { limit?: number; category?: string }) =>
    api.get('/srs/due-words', { params }),
  submitReview: (data: { word_id: string; quality: number; response_time_ms?: number; review_mode?: string }) =>
    api.post('/srs/review', data),
  getStats: () => api.get('/srs/stats'),
  getHistory: (days?: number) => api.get('/srs/history', { params: { days } }),
};

// Learning API
export const learningAPI = {
  getFlashcards: (params?: { limit?: number; category?: string; mode?: string }) =>
    api.get('/learning/flashcards', { params }),
  generateQuiz: (params?: { count?: number; category?: string; quiz_type?: string }) =>
    api.get('/learning/quiz', { params }),
  submitQuizResults: (results: { results: any[] }) =>
    api.post('/learning/quiz/submit', results),
};

// Games API
export const gamesAPI = {
  getRandom: (params: { count?: number; need_synonyms?: boolean; min_length?: number; max_length?: number }) =>
    api.get('/games/random', { params }),
  getDistractors: (exclude: string, count = 3) =>
    api.get('/games/distractors', { params: { exclude, count } }),
};

export default api;
