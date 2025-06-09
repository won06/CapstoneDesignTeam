const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');

// 회원가입
router.post('/register', async (req, res) => {
  const { user_id, password, name, grade, department } = req.body;
  // 이메일 형식 정규식
  const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
  if (!user_id || !password || !name || !grade) {
    return res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
  }
  if (!emailRegex.test(user_id)) {
    return res.status(400).json({ message: '올바른 이메일 주소를 입력하세요.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
      return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    }
    await pool.query(
      'INSERT INTO users (user_id, password, name, grade, department) VALUES (?, ?, ?, ?, ?)',
      [user_id, hashedPassword, name, grade, department || null]
    );
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 입력하세요.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (rows.length === 0) {
      return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    const token = jwt.sign({ user_id: user.user_id, name: user.name }, 'jwt-secret-key', { expiresIn: '1h' });
    const is_test_completed = (user.is_test_completed === undefined || user.is_test_completed === null || user.is_test_completed === '') ? 0 : user.is_test_completed;
    res.json({ message: '로그인 성공', token, is_test_completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 적성검사 완료 처리
router.post('/complete-test', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ message: 'user_id가 필요합니다.' });
  }
  try {
    await pool.query('UPDATE users SET is_test_completed = 1 WHERE user_id = ?', [user_id]);
    res.json({ message: '적성검사 완료' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 회원 탈퇴
router.delete('/delete', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ message: 'user_id가 필요합니다.' });
  }

  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. 사용자의 강의 평가 데이터 삭제
    await connection.query('DELETE FROM user_course_ratings WHERE user_id = ?', [user_id]);
    console.log('[회원 탈퇴] 강의 평가 데이터 삭제 완료');

    // 2. 추천 데이터 삭제
    await connection.query('DELETE FROM user_recommended_careers WHERE user_id = ?', [user_id]);
    await connection.query('DELETE FROM user_recommended_certifications WHERE user_id = ?', [user_id]);
    await connection.query('DELETE FROM user_recommended_companies WHERE user_id = ?', [user_id]);
    await connection.query('DELETE FROM user_recommended_courses WHERE user_id = ?', [user_id]);
    console.log('[회원 탈퇴] 추천 데이터 삭제 완료');

    // 3. 사용자 데이터 삭제
    const [userResult] = await connection.query('DELETE FROM users WHERE user_id = ?', [user_id]);
    
    if (userResult.affectedRows === 0) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    console.log('[회원 탈퇴] 사용자 데이터 삭제 완료');

    await connection.commit();
    res.json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (err) {
    await connection.rollback();
    console.error('[회원 탈퇴] 오류 발생:', err);
    res.status(500).json({ message: err.message || '회원 탈퇴 처리 중 오류가 발생했습니다.' });
  } finally {
    connection.release();
  }
});

module.exports = router; 