const express = require('express');
const router = express.Router();
const db = require('../db');

// 모든 과목 목록 조회
router.get('/', async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT 
        c.course_id,
        c.title,
        c.description,
        c.credit,
        c.recommend_year,
        c.is_required,
        GROUP_CONCAT(DISTINCT f.field_id) as field_ids,
        GROUP_CONCAT(DISTINCT f.name) as field_names
      FROM courses c
      LEFT JOIN courses_has_fields chf ON c.course_id = chf.courses_course_id
      LEFT JOIN fields f ON chf.fields_field_id = f.field_id
      GROUP BY c.course_id, c.title, c.description, c.credit, c.recommend_year, c.is_required
      ORDER BY c.recommend_year ASC, c.course_id ASC
    `);
    
    console.log('Fetched courses:', courses); // 디버깅용 로그
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: '과목 목록을 불러오는데 실패했습니다.' });
  }
});

// 특정 직업에 대한 추천 과목 목록 조회
router.get('/career/:careerId', async (req, res) => {
  try {
    const { careerId } = req.params;
    const [courses] = await db.query(`
      SELECT DISTINCT 
        c.course_id,
        c.title,
        c.description,
        c.credit,
        c.recommend_year,
        c.is_required,
        GROUP_CONCAT(DISTINCT f.field_id) as field_ids,
        GROUP_CONCAT(DISTINCT f.name) as field_names,
        CASE 
          WHEN cc.courses_course_id IS NOT NULL THEN 1
          ELSE 0
        END as is_career_required
      FROM courses c
      LEFT JOIN courses_has_fields chf ON c.course_id = chf.courses_course_id
      LEFT JOIN fields f ON chf.fields_field_id = f.field_id
      LEFT JOIN careers_has_fields chf2 ON chf.fields_field_id = chf2.fields_field_id
      LEFT JOIN courses_careers cc ON c.course_id = cc.courses_course_id AND cc.careers_career_id = ?
      WHERE chf2.careers_career_id = ?
      GROUP BY c.course_id, c.title, c.description, c.credit, c.recommend_year, c.is_required
      ORDER BY c.recommend_year ASC, c.course_id ASC
    `, [careerId, careerId]);
    
    console.log('Fetched career courses:', courses); // 디버깅용 로그
    res.json(courses);
  } catch (error) {
    console.error('Error fetching career courses:', error);
    res.status(500).json({ error: '직업별 과목 목록을 불러오는데 실패했습니다.' });
  }
});

module.exports = router; 