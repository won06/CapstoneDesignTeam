export const FIELD_MAP = {
  "119 구조대원": "24611",
  "1차 금속 제조업": "24",
  // ... (전체 데이터 자동 변환 필요)
};
 
export function getFieldIdByName(name) {
  return FIELD_MAP[name];
} 