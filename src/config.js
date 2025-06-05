// API 서버 URL 설정
export const API_URL = 'http://192.168.45.78:3001';

// 환경별 설정
const ENV = {
  dev: {
    API_URL: 'http://192.168.45.78:3001',
  },
  prod: {
    API_URL: 'https://your-production-api.com',
  },
};

// 현재 환경 설정
const getEnvVars = () => {
  // 개발 환경인지 프로덕션 환경인지 확인
  const isDev = __DEV__;
  return isDev ? ENV.dev : ENV.prod;
};

export default getEnvVars(); 