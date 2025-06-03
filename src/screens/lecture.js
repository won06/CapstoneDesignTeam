import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';

const recommendedCourses = [
  {
    id: '1',
    title: '고급데이터구조',
    type: '필수과목',
    status: '수강완료',
    prereqs: ['자료구조', '알고리즘'],
    bookmarked: false,
  },
  {
    id: '2',
    title: '딥러닝',
    type: '선택과목',
    prereqs: ['인공지능개론', '확률과통계'],
    bookmarked: false,
  },
  {
    id: '3',
    title: '인공지능개론',
    type: '필수과목',
    status: '수강완료',
    prereqs: ['파이썬프로그래밍'],
    bookmarked: false,
  },
];

export default function LectureScreen({ navigation }) {
  const [selectedSemester, setSelectedSemester] = useState('2학년 1학기');
  const [courses, setCourses] = useState(recommendedCourses);
  const [selectedTab, setSelectedTab] = useState('강의');

  const toggleBookmark = (id) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, bookmarked: !c.bookmarked } : c
      )
    );
  };

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    if (tab === '홈') {
      navigation.navigate('Home');
    }
    // 필요시 다른 탭도 navigation 추가
  };

  return (
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

      {/* 학기 선택 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {/* semesters 배열 제거 */}
      </ScrollView>

      {/* 추천 강의 */}
      <Text style={styles.sectionTitle}>추천강의</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                {item.bookmarked ? (
                  <Ionicons name="bookmark" size={20} color="#2563eb" />
                ) : (
                  <Feather name="bookmark" size={20} color="#cbd5e1" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.courseMeta}>
              <Text style={styles.courseType}>{item.type}</Text>
              {item.status && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              )}
            </View>

            <Text style={styles.prereq}>
              선수과목: {item.prereqs.join(', ')}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontFamily: 'cursive',
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  semBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 36,
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  semBtnSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f6ff',
  },
  semText: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  semTextSelected: {
    color: '#2563eb',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  courseType: {
    fontSize: 13,
    color: '#3b82f6',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#2563eb',
  },
  prereq: {
    fontSize: 13,
    color: '#6b7280',
  },
});
