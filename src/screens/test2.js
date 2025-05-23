import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { title: '개론', courses: ['전자AI시스템공학개론'] },
  { title: '수학·통계', courses: ['전공기초수학', 'AI융합기초수학', '공업수학', '확률및통계', '확률과인공지능'] },
  { title: '기초전자·물리 실험', courses: ['전자기학1', '전자기학2', '물리전자', '기초회로실험', '기초전기및실험', '전자회로실험1', '전자회로실험2'] },
  { title: '회로·디지털공학', courses: ['회로이론1', '회로이론2', '디지털공학1', '디지털공학2', '디지털회로및실험', '디지털회로응용및실험'] },
  { title: '제어·로봇·자율시스템', courses: ['제어공학1', '제어공학2', '제어공학및실험', '제어공학응용및실험', '전동기제어', '마이크로프로세서', '마이크로프로세서설계', 'ROS로봇프로그래밍', '로봇공학', 'AI자율주행탱크설계', 'PLC'] },
  { title: '통신·네트워크', courses: ['컴퓨터네트워크', '무선네트워크와응용', '네트워크프로그래밍', '통신이론', '디지털통신이론및실험', '이동통신', '차세대통신기술'] },
  { title: '컴퓨터시스템·운영체제', courses: ['운영체제와컴퓨터설계', '운영체제', 'LINUX운영체제', '컴퓨터시스템', '컴퓨터구조'] },
  { title: '프로그래밍·SW 개발', courses: ['객체지향프로그래밍1', '객체지향프로그래밍2', '컴퓨터프로그래밍', '문제해결프로그래밍', '파이썬프로그래밍', 'JAVA프로그래밍', '안드로이드프로그래밍', '모바일프로그래밍', '소프트웨어공학', '보안코딩실습', '웹서버프로그래밍', '컴퓨터알고리즘', '창의공학'] },
  { title: '데이터·DB', courses: ['데이터사이언스프로그래밍', '데이터구조', '데이터베이스언어', '데이터베이스', '데이터베이스설계및관리', '데이터베이스이론및실습', '기상기후빅데이터'] },
  { title: '인공지능·머신러닝', courses: ['AI와재난과학', 'AI와재난현장', 'AI와재난모델링', 'AI와사운드', '머신러닝을위한선형대수', '머신러닝을위한통계학1', '머신러닝1', '머신러닝2', '통계적학습', '딥러닝', '신호처리입문'] },
  { title: 'IoT·스마트시스템·센서', courses: ['사물인터넷프로그래밍', '사물인터넷', '사물인터넷설계', '지능형센서및센서네트워크', '마이크로파시스템실험', '디지털트윈'] },
  { title: '멀티미디어·신호처리', courses: ['미디어개론', '미디어콘텐츠설계', '디지털시스템설계', '디지털신호처리', '디지털신호처리실험', '신호해석및처리'] },
  { title: '진로·창업·캡스톤·실습', courses: ['진로탐색과꿈-설계', '취업·창업과꿈-설계', '벤처캡스톤디자인', '현장실습'] },
];

export default function CourseSelectionScreen({ navigation }) {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const toggleCourse = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Test')}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>수업 선택</Text>
        <Ionicons name="close" size={20} color="#888" />
      </View>

      {/* Scroll 영역 */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true} // ← 마우스 휠 작동 위해 필요
      >
        <Text style={styles.title}>어떤 수업을 들었나요?</Text>
        <Text style={styles.subtitle}>
          직업과 관련된 수업을 모두 선택해주세요. 여러 개 선택할 수 있어요.
        </Text>

        {categories.map((cat) => (
          <View key={cat.title} style={{ marginTop: 24 }}>
            <Text style={styles.category}>{cat.title}</Text>
            <View style={styles.courseGrid}>
              {cat.courses.map((course) => {
                const selected = selectedCourses.includes(course);
                return (
                  <TouchableOpacity
                    key={course}
                    style={[
                      styles.courseBtn,
                      selected && styles.courseBtnSelected,
                    ]}
                    onPress={() => toggleCourse(course)}
                  >
                    <Text
                      style={[
                        styles.courseText,
                        selected && styles.courseTextSelected,
                      ]}
                    >
                      {course}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            selectedCourses.length > 0
              ? styles.nextBtnActive
              : styles.nextBtnDisabled,
          ]}
          disabled={selectedCourses.length === 0}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.nextText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollArea: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 200, // 하단 버튼 가리지 않게
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 16,
  },
  headerTitle: { fontSize: 16, fontWeight: '500' },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  courseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  courseBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  courseBtnSelected: {
    backgroundColor: '#dbeafe',
  },
  courseText: {
    color: '#374151',
    fontSize: 13,
  },
  courseTextSelected: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  nextBtn: {
    paddingVertical: 14,
    borderRadius: 10,
  },
  nextBtnDisabled: {
    backgroundColor: '#e5e7eb',
  },
  nextBtnActive: {
    backgroundColor: '#3b82f6',
  },
  nextText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
