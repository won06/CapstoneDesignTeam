// 개발 환경인지 프로덕션 환경인지 확인
const isDevelopment = process.env.NODE_ENV === 'development';

// API 기본 URL 설정
export const API_BASE_URL = isDevelopment 
  ? 'http://192.168.0.28:3001/api'  // 개발 환경 (로컬 IP)
  : 'https://your-deployed-server.onrender.com/api';  // 배포된 서버 URL (예시)

// API 엔드포인트들
export const API_ENDPOINTS = {
  careers: `${API_BASE_URL}/careers`,
  user: `${API_BASE_URL}/user`,
  recommend: `${API_BASE_URL}/recommend`,
  companies: `${API_BASE_URL}/companies`,
}; 