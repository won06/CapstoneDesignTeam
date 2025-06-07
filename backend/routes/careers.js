const express = require('express');
const router = express.Router();
const pool = require('../db');

// 모든 직업 목록 조회
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT career_id, jobdic_seq, job_name, summary, salary FROM careers WHERE career_id IN (SELECT careers_career_id FROM courses_careers)');
    res.json(rows);
  } catch (error) {
    console.error('직업 목록 조회 실패:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 특정 직업 상세 정보 조회
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT career_id, jobdic_seq, job_name, summary, salary FROM careers WHERE career_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '해당 직업을 찾을 수 없습니다.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('직업 상세 정보 조회 실패:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 