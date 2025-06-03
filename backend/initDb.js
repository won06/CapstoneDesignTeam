const pool = require('./db');

async function initializeDatabase() {
  try {
    // 예시 데이터 삽입 (중복 방지)
    const [rows] = await pool.query(
      "SELECT * FROM careers WHERE jobdic_seq = ?",
      [10001]
    );
    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO careers (jobdic_seq, job_name, summary, salary)
         VALUES (?, ?, ?, ?)`,
        [
          10001,
          'AI 엔지니어',
          '기업 운영과 사람들의 삶을 변화시키는 AI 시스템을 구축하고 배포합니다.',
          '연봉 1억2천 ~ 1억8천'
        ]
      );
      console.log('샘플 데이터가 추가되었습니다.');
    } else {
      console.log('이미 데이터가 존재합니다.');
    }
    process.exit(0);
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류 발생:', error);
    process.exit(1);
  }
}

initializeDatabase(); 