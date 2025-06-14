const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL 연결 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: 'dlrbgus123@',
  database: 'capstone_test_db4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// /api/companies/:companyCode 경로 (companies 테이블 사용)
router.get('/:companyCode', async (req, res) => {
  try {
    const { companyCode } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM companies WHERE company_code = ?',
      [companyCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '회사를 찾을 수 없습니다.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('회사 정보 조회 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 