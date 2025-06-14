const express = require('express');
const router = express.Router();
const db = require('../db');

// 전체 커리큘럼 조회
router.get('/courses', async (req, res) => {
    try {
        // 기존 코드...
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 커리큘럼 추천 API
router.post('/recommend', async (req, res) => {
    try {
        const { userGrade, completedCourses = [], careerId } = req.body;
        console.log('Request params:', { userGrade, completedCourses, careerId });
        
        // 먼저 직업과 관련된 분야 ID들을 조회
        let careerFieldsQuery = `
            SELECT fields_field_id 
            FROM careers_has_fields 
            WHERE careers_career_id = ?
        `;
        
        const [careerFields] = await db.query(careerFieldsQuery, [careerId]);
        const fieldIds = careerFields.map(f => f.fields_field_id);
        
        // 과목 조회 쿼리
        let query = `
            SELECT 
                c.*,
                GROUP_CONCAT(DISTINCT f.field_id) as field_ids,
                GROUP_CONCAT(DISTINCT f.name) as field_names,
                MAX(CASE 
                    WHEN cc.courses_course_id IS NOT NULL THEN 2  -- 직업 필수 과목
                    WHEN chf.fields_field_id IN (?) THEN 1  -- 직업 관련 분야 과목
                    ELSE 0  -- 기타 과목
                END) as career_relevance
            FROM courses c
            LEFT JOIN courses_has_fields chf ON c.course_id = chf.courses_course_id
            LEFT JOIN fields f ON chf.fields_field_id = f.field_id
            LEFT JOIN courses_careers cc ON c.course_id = cc.courses_course_id AND cc.careers_career_id = ?
            ${completedCourses.length > 0 ? 'WHERE c.course_id NOT IN (?)' : ''}
            GROUP BY 
                c.course_id, 
                c.title, 
                c.description, 
                c.credit, 
                c.recommend_year, 
                c.is_required
            ORDER BY career_relevance DESC, c.is_required DESC, c.recommend_year ASC
        `;

        const params = [
            fieldIds.length > 0 ? fieldIds : [0],
            careerId || null,
            ...(completedCourses.length > 0 ? [completedCourses] : [])
        ];

        console.log('SQL Query:', query);
        console.log('Query params:', params);

        const [courses] = await db.query(query, params);
        console.log(`Found ${courses.length} courses`);

        res.json(courses);
    } catch (error) {
        console.error('Error in curriculum recommendation:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sql: error.sql
        });
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router; 