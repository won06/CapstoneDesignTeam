import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const recommendedCourses = [
  {
    id: '1',
    title: '고급데이터구조',
    type: '필수과목',
    status: '수강완료',
    prereqs: ['자료구조', '알고리즘'],
  },
  {
    id: '2',
    title: '딥러닝',
    type: '선택과목',
    prereqs: ['인공지능개론', '확률과통계'],
  },
  {
    id: '3',
    title: '인공지능개론',
    type: '필수과목',
    status: '수강완료',
    prereqs: ['파이썬프로그래밍'],
  },
];

// 과목명에서 괄호와 괄호 안 영어 제거 함수
const getKoreanTitle = (title) => title ? title.replace(/\s*\([^)]*\)/g, '').trim() : '';

export default function LectureScreen({ navigation }) {
  const [selectedSemester, setSelectedSemester] = useState('2학년 1학기');
  const [courses, setCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState('강의');

  useEffect(() => {
    const fetchCourses = async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) return;
      const res = await fetch(`http://192.168.45.78:3001/api/recommend/result?user_id=${user_id}`);
      if (!res.ok) return;
      const data = await res.json();
      setCourses(data.courses || []);
    };
    fetchCourses();
  }, []);

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    if (tab === '홈') {
      navigation.navigate('Home');
    }
    // 필요시 다른 탭도 navigation 추가
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Logo />
          <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
            <Ionicons name="settings-outline" size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Page Title */}
        <Text style={styles.pageTitle}>강의</Text>
        <Text style={styles.subtitle}>
          AI/소프트웨어 분야에서 추천하는 강의 목록입니다.
        </Text>

        {/* 강의 리스트 */}
        <FlatList
          data={courses}
          keyExtractor={(item) => (item.course_id ? item.course_id.toString() : (item.id ? item.id.toString() : Math.random().toString()))}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="book" size={28} color="#60a5fa" />
                <Feather name="star" size={20} color="#ccc" />
              </View>
              <Text style={styles.cardTitle}>{getKoreanTitle(item.title || item.course_name)}</Text>
              <Text style={styles.organization}>{item.type}</Text>
              <Text style={styles.cardDesc}>{item.description || ''}</Text>
              <View style={styles.tagsContainer}>
                {/* 선수과목 태그 스타일로 표시 */}
                {Array.isArray(item.prereqs) && item.prereqs.length > 0 && (
                  <View style={styles.prereqTagContainer}>
                    <Text style={styles.prereqLabel}>선수과목:</Text>
                    <View style={styles.prereqTagRow}>
                      {item.prereqs.map((prereq, idx) => (
                        <View key={idx} style={styles.prereqTag}>
                          <Text style={styles.prereqTagText}>{prereq}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 90, // 네비게이션 바 높이 + 여유 공간
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  organization: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#2563eb',
  },
  prereqTagContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  prereqLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  prereqTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  prereqTag: {
    backgroundColor: '#e0edff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  prereqTagText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
