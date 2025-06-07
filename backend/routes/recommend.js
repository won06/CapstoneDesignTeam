const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql2/promise 커넥션

const PREREQ_MAP = {
  "머신러닝을위한선형대수": ["AI융합기초수학"],
  "AI와재난현장": ["AI와재난과학"],
  "전자기학2": ["전자기학1"],
  "기초회로실험": ["회로이론1", "기초전기및실험"],
  "물리전자": ["전자기학1", "회로이론1"],
  "회로이론2": ["회로이론1"],
  "디지털공학2": ["디지털공학1", "디지털회로및실험"],
  "시퀀스제어": ["기초전기및실험", "회로이론1"],
  "디지털회로응용및실험": ["디지털회로및실험", "디지털공학1"],
  "JAVA프로그래밍": ["객체지향프로그래밍1"],
  "무선네트워크와응용": ["컴퓨터네트워크"],
  "AI와재난모델링": ["AI와재난과학", "AI와재난현장"],
  "전자회로실험1": ["기초회로실험", "전자기학1", "회로이론1"],
  "객체지향프로그래밍2": ["객체지향프로그래밍1"],
  "전자회로1": ["회로이론1", "회로이론2", "전자기학1", "전자기학2", "물리전자"],
  "제어공학1": ["시퀀스제어", "회로이론1", "회로이론2"],
  "마이크로프로세서": ["디지털공학2", "디지털회로응용및실험", "디지털회로및실험"],
  "전동기제어": ["전자회로1", "제어공학1"],
  "제어공학및실험": ["제어공학1", "기초회로실험"],
  "운영체제": ["컴퓨터프로그래밍", "데이터구조", "JAVA프로그래밍", "파이썬프로그래밍"],
  "데이터베이스언어": ["데이터베이스", "데이터베이스설계및관리"],
  "데이터전처리": ["데이터사이언스프로그래밍", "확률및통계", "머신러닝을위한통계학1"],
  "머신러닝1": ["머신러닝을위한선형대수", "머신러닝을위한통계학1", "확률및통계"],
  "웹프로그래밍": ["JAVA프로그래밍"],
  "컴퓨터구조": ["소프트웨어공학"],
  "마이크로프로세서설계": ["마이크로프로세서", "디지털회로응용및실험"],
  "인터넷이론및실습": ["컴퓨터네트워크"],
  "안드로이드프로그래밍": ["JAVA프로그래밍"],
  "운영체제와컴퓨터설계": ["JAVA프로그래밍"],
  "지능형센서및센서네트워크": ["사물인터넷프로그래밍", "컴퓨터네트워크"],
  "컴퓨터시스템": ["컴퓨터구조", "운영체제"],
  "반도체공학": ["물리전자", "전자기학2"],
  "전자회로실험2": ["전자회로실험1", "전자회로1"],
  "디지털시스템설계": ["디지털공학2", "디지털회로응용및실험"],
  "전자회로2": ["전자회로1", "회로이론2"],
  "제어공학2": ["제어공학1"],
  "데이터베이스": ["데이터베이스설계및관리", "데이터베이스언어"],
  "제어공학응용및실험": ["제어공학1", "제어공학및실험"],
  "전자회로응용및실험": ["전자회로1", "전자회로실험1"],
  "머신러닝2": ["머신러닝1"],
  "전력전자": ["회로이론1", "회로이론2", "전자기학1"],
  "사물인터넷": ["사물인터넷프로그래밍", "컴퓨터네트워크"],
  "스토리지시스템": ["컴퓨터구조"],
  "네트워크프로그래밍": ["컴퓨터네트워크"],
  "디지털신호처리실험": ["디지털시스템설계"],
  "디지털통신이론및실험": ["통신이론"],
  "LINUX운영체제": ["운영체제"],
  "사물인터넷설계": ["사물인터넷프로그래밍", "컴퓨터네트워크"],
  "웹서버프로그래밍": ["웹프로그래밍", "컴퓨터네트워크"],
  "컴퓨터알고리즘": ["데이터구조"],
  "SoC구조및설계": ["컴퓨터구조", "마이크로프로세서설계", "디지털시스템설계"],
  "ROS로봇프로그래밍": ["로봇공학", "제어공학2", "임베디드시스템"],
  "광전자공학": ["반도체공학", "전자회로2"],
  "광통신": ["통신이론", "디지털통신이론및실험"],
  "디지털신호처리": ["디지털시스템설계", "신호처리입문"],
  "마이크로파시스템실험": ["마이크로파공학"],
  "전자회로2": ["전자회로1", "회로이론2"],
  "신호및시스템": ["신호처리입문"],
  "로봇공학": ["제어공학2", "마이크로프로세서", "임베디드시스템"],
  "임베디드시스템": ["운영체제", "컴퓨터시스템", "마이크로프로세서"],
  "송배전공학": ["전력전자"],
  "태양광시스템공학": ["전력전자"],
  "전력전자및실험": ["전력전자"],
  "PLC": ["제어공학2", "제어공학응용및실험"],
  "패턴인식": ["영상처리"],
  "통계적학습": ["머신러닝2"],
  "데이터베이스이론및실습": ["데이터베이스", "데이터베이스설계및관리"],
  "디지털프로세서실험": ["컴퓨터구조", "마이크로프로세서설계"],
  "디지털트윈": ["SoC구조및설계", "컴퓨터알고리즘"],
  "딥러닝": ["머신러닝2", "통계적학습"],
  "변복조시스템실습": ["디지털통신이론및실험", "통신이론"],
  "신호해석및처리": ["신호처리입문", "디지털시스템설계"],
  "이동통신": ["통신이론", "디지털통신이론및실험"],
  "공정제어시스템": ["제어공학2", "제어공학응용및실험"],
  "AI와기후변화": ["AI와재난모델링"],
  "컴퓨터보안": ["보안코딩실습"],
  "차세대통신기술": ["통신이론", "디지털통신이론및실험"]
};

// 과목명에서 괄호와 괄호 안 영어 제거 함수
function getKoreanTitle(title) {
  return title ? title.replace(/\s*\([^)]*\)/g, '').trim() : '';
}

// 추천 API (분야+과목 기반)
router.post('/', async (req, res) => {
  const { user_id, career_id, selected_courses, selected_fields } = req.body;

  let fields = selected_fields;
  let courses = selected_courses;

  // career_id가 있으면 DB에서 관련 field_id, course_id 조회
  if (career_id) {
    try {
      const [fieldRows] = await db.query(
        'SELECT fields_field_id FROM careers_has_fields WHERE careers_career_id = ?',
        [career_id]
      );
      fields = fieldRows.map(row => row.fields_field_id);

      const [courseRows] = await db.query(
        'SELECT courses_course_id FROM courses_careers WHERE careers_career_id = ?',
        [career_id]
      );
      courses = courseRows.map(row => row.courses_course_id);
    } catch (err) {
      return res.status(500).json({ error: 'career_id 기반 추천 데이터 조회 중 오류 발생' });
    }
  }

  if (!user_id || (!courses && !fields)) {
    return res.status(400).json({ error: 'user_id와 selected_courses 또는 selected_fields가 필요합니다.' });
  }

  // 빈 배열 방지
  const coursesArr = Array.isArray(courses) && courses.length > 0 ? courses : [-1];
  const fieldsArr = Array.isArray(fields) && fields.length > 0 ? fields : [-1];

  try {
    // 1. 직업 추천 (분야+과목 기반)
    const [careers] = await db.query(
      `SELECT c.career_id, c.job_name,
        SUM(IF(fc.fields_field_id IN (?), 1, 0)) AS field_score,
        SUM(IF(cc.courses_course_id IN (?), 1, 0)) AS course_score,
        (SUM(IF(fc.fields_field_id IN (?), 1, 0)) + SUM(IF(cc.courses_course_id IN (?), 1, 0))) AS total_score
      FROM careers c
      LEFT JOIN careers_has_fields fc ON c.career_id = fc.careers_career_id
      LEFT JOIN courses_careers cc ON c.career_id = cc.careers_career_id
      WHERE (fc.fields_field_id IN (?) OR cc.courses_course_id IN (?))
        AND c.career_id IN (SELECT careers_career_id FROM courses_careers)
      GROUP BY c.career_id
      ORDER BY total_score DESC, c.career_id ASC
      LIMIT 10`, [fieldsArr, coursesArr, fieldsArr, coursesArr, fieldsArr, coursesArr]
    );

    // 2. 자격증 추천 (분야 기반)
    const [certs] = await db.query(
      `SELECT cert.cert_id, cert.jmfldnm, COUNT(*) as match_score
       FROM certificates_has_fields cf
       JOIN certificates cert ON cf.certificates_cert_id = cert.cert_id
       WHERE cf.fields_field_id IN (?)
       GROUP BY cert.cert_id
       ORDER BY match_score DESC
       LIMIT 10`, [fieldsArr]
    );

    // 3. 기업 추천 (분야 기반)
    const [companies] = await db.query(
      `SELECT co.company_code, co.company_name, COUNT(*) as match_score
       FROM companies_has_fields cf
       JOIN companies co ON cf.companies_company_code = co.company_code
       WHERE cf.fields_field_id IN (?)
       GROUP BY co.company_code
       ORDER BY match_score DESC
       LIMIT 10`, [fieldsArr]
    );

    // 4. 강의(과목) 추천 (분야 기반)
    const [coursesResult] = await db.query(
      `SELECT c.course_id, c.title, COUNT(*) as match_score
       FROM courses_has_fields cf
       JOIN courses c ON cf.courses_course_id = c.course_id
       WHERE cf.fields_field_id IN (?)
       GROUP BY c.course_id
       ORDER BY match_score DESC
       LIMIT 10`, [fieldsArr]
    );

    // 각 강의에 선수과목(prereqs) 정보 추가 (과목명 정제 후 PREREQ_MAP 조회)
    for (let course of coursesResult) {
      const korTitle = getKoreanTitle(course.title);
      course.prereqs = PREREQ_MAP[korTitle] || [];
    }

    // 5. 추천 결과 테이블에 저장 (기존 추천 삭제 후 삽입)
    await db.query('DELETE FROM user_recommended_careers WHERE user_id = ?', [user_id]);
    await db.query('DELETE FROM user_recommended_certifications WHERE user_id = ?', [user_id]);
    await db.query('DELETE FROM user_recommended_companies WHERE user_id = ?', [user_id]);
    await db.query('DELETE FROM user_recommended_courses WHERE user_id = ?', [user_id]);

    for (let i = 0; i < careers.length; i++) {
      await db.query(
        `INSERT INTO user_recommended_careers (user_id, career_id, match_score, \`rank\`)
         VALUES (?, ?, ?, ?)`,
        [user_id, careers[i].career_id, careers[i].total_score, i + 1]
      );
    }
    for (let i = 0; i < certs.length; i++) {
      await db.query(
        `INSERT INTO user_recommended_certifications (user_id, cert_id, match_score, \`rank\`)
         VALUES (?, ?, ?, ?)`,
        [user_id, certs[i].cert_id, certs[i].match_score, i + 1]
      );
    }
    for (let i = 0; i < companies.length; i++) {
      await db.query(
        `INSERT INTO user_recommended_companies (user_id, company_code, match_score, \`rank\`)
         VALUES (?, ?, ?, ?)`,
        [user_id, companies[i].company_code, companies[i].match_score, i + 1]
      );
    }
    for (let i = 0; i < coursesResult.length; i++) {
      await db.query(
        `INSERT INTO user_recommended_courses (user_id, course_id, match_score, \`rank\`, semester_order)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, coursesResult[i].course_id, coursesResult[i].match_score, i + 1, 1]
      );
    }

    // 6. 결과 반환
    res.json({
      recommended_careers: careers,
      recommended_certifications: certs,
      recommended_companies: companies,
      recommended_courses: coursesResult
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '추천 처리 중 오류 발생' });
  }
});

// 추천 결과 조회 API (모든 추천)
router.get('/result', async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id가 필요합니다.' });
  }
  try {
    // 직업 추천
    const [careers] = await db.query(
      `SELECT c.career_id, c.job_name, c.summary, c.salary, urc.match_score, urc.rank
       FROM user_recommended_careers urc
       JOIN careers c ON urc.career_id = c.career_id
       WHERE urc.user_id = ?
       ORDER BY urc.rank ASC`,
      [user_id]
    );
    // 자격증 추천
    const [certifications] = await db.query(
      `SELECT cert.cert_id, cert.jmfldnm, cert.qualgbnm, cert.seriesnm, cert.jmcd, urc.match_score, urc.rank
       FROM user_recommended_certifications urc
       JOIN certificates cert ON urc.cert_id = cert.cert_id
       WHERE urc.user_id = ?
       ORDER BY urc.rank ASC`,
      [user_id]
    );
    // 강의 추천
    const [courses] = await db.query(
      `SELECT co.course_id, co.title, co.description, co.credit, co.recommend_year, co.is_required, urco.match_score, urco.rank, urco.semester_order
       FROM user_recommended_courses urco
       JOIN courses co ON urco.course_id = co.course_id
       WHERE urco.user_id = ?
       ORDER BY urco.rank ASC`,
      [user_id]
    );
    // 각 강의에 선수과목(prereqs) 정보 추가 (과목명 정제 후 PREREQ_MAP 조회)
    for (let course of courses) {
      const korTitle = getKoreanTitle(course.title);
      course.prereqs = PREREQ_MAP[korTitle] || [];
    }
    // 기업 추천
    const [companies] = await db.query(
      `SELECT cp.company_code, cp.company_name, urcp.match_score, urcp.rank
       FROM user_recommended_companies urcp
       JOIN companies cp ON urcp.company_code = cp.company_code
       WHERE urcp.user_id = ?
       ORDER BY urcp.rank ASC`,
      [user_id]
    );
    res.json({
      careers,
      certifications,
      courses,
      companies
    });
  } catch (err) {
    res.status(500).json({ error: '추천 결과 조회 중 오류 발생' });
  }
});

module.exports = router; 