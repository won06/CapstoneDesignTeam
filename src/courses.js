export const COURSE_MAP = {
  "전공기초수학": 3151026,
  "AI융합기초수학": 3151027,
  // ... (전체 데이터 자동 변환 필요)
};
 
export function getCourseIdByName(name) {
  return COURSE_MAP[name];
} 