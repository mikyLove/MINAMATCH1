export {
  BASE_URL,
  apiFetch,
  ApiError,
  getLocalData,
  setLocalData,
  DB_KEYS,
  getToken,
  authHeaders,
} from './client';

export { loginRequest, verifyToken } from './auth';
export type { LoginResponse, UserProfile } from './auth';

export { fetchCandidates } from './candidates';

export { fetchStudents, toggleSyllabus } from './students';

export {
  fetchHistory,
  clearHistory,
  getChatHeaders,
  sendMessageStream,
} from './chat';
export type { ChatMessage } from './chat';
