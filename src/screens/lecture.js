import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';

// 화면 너비 가져오기
const windowWidth = Dimensions.get('window').width;

// 학년/학기별 커리큘럼 데이터
const curriculumData = {
  '1학년 1학기': [
    { id: '3151042', title: '전자AI시스템공학개론', type: '필수', credits: 3, description: '전자AI시스템공학과 관련된 다양한 분야에 대한 역가, 현재의 기술동향 미래의 트랜드를 소개' },
    { id: '3151052', title: '진로탐색과꿈-설계', type: '선택', credits: 1, description: '체계적인 진로 교육을 통해 자기이해와 진로정보를 바탕으로 진로 설정과 계획 수립을 도움' },
  ],
  '1학년 2학기': [
    { id: '3151050', title: 'AI자율주행탱크설계', type: '선택', credits: 2, description: '자율주행 탱크를 설계하고 시험·경연을 통해 소프트웨어와 하드웨어의 상호작용 및 AI 작용 개념을 학습' },
  ],
  '2학년 1학기': [
    { id: '3151027', title: 'AI융합기초수학', type: '선택', credits: 2, description: '공학-AI 융합에 필수적인 선형대수와 다변수 미적분 개념을 학습해 문제 해결 역량을 기름' },
    { id: '3151088', title: 'AI와재난과학', type: '선택', credits: 3, description: '다양한 재난 사례를 분석하고 관련 AI 기술을 학습하여 재난에 대한 이해와 분석 능력을 향상함' },
    { id: '3151089', title: '머신러닝을위한선형대수', type: '선택', credits: 3, description: '기계학습 구현에 필수적인 선형대수 개념과 최소제곱법, 주성분 분석 등을 학습하여 데이터 처리 및 분석 능력을 함양함' },
    { id: '3151092', title: '머신러닝을위한통계학1', type: '선택', credits: 3, description: '제조현장의 생산 및 품질 관리 데이터를 통계적으로 분석하고 해석하는 능력을 학습' },
  ],
  '2학년 2학기': [
    { id: '3151028', title: '객체지향프로그래밍1', type: '선택', credits: 3, description: '객체지향프로그래밍 개념을 이해하고, 자바 문법부터 GUI, 스윙, 네트워크, DB까지 다양한 자바 응용기술을 학습' },
    { id: '3151083', title: 'AI와사운드', type: '선택', credits: 3, description: '음향 이론과 기기, 시스템 등 사운드 기초를 학습하고, AI 사운드의 다양한 활용과 음성인식·자연어 처리 기술을 학습' },
    { id: '3151097', title: '확률및통계', type: '선택', credits: 3, description: '컴퓨터공학에 필요한 통계 이론과 기법을 바탕으로 현실문제를 통계 소프트웨어로 분석하고 전략적 해석 능력을 학습' },
    { id: '3151143', title: '확률과인공지능', type: '선택', credits: 3, description: '통신, 정보처리, 인공지능에 필요한 확률 개념과 베이즈 추론, 확률적 판정 방법 등을 학습' },
  ],
  '3학년 1학기': [
    { id: '3151104', title: '데이터전처리', type: '선택', credits: 3, description: '모델 적용 전 데이터를 이해하고 다양한 전처리 방법을 익혀 새로운 문제에 적용하는 능력을 학습' },
    { id: '3151105', title: '머신러닝1', type: '선택', credits: 3, description: '데이터 기반 분석을 통해 수학적 모델을 개발·적용하고, 통찰력과 패턴을 추출해 문제 해결에 활용하는 방법을 학습' },
    { id: '3151115', title: '취업·창업과꿈-설계', type: '선택', credits: 1, description: '전공에 대한 이해를 바탕으로 적성과 흥미에 맞는 진로를 탐색·설정·준비하는 과정을 학습' },
  ],
  '3학년 2학기': [
    { id: '3151112', title: '머신러닝2', type: '선택', credits: 3, description: '데이터 기반 문제 해결을 위해 수학적 모델을 개발·적용하고, 통찰력과 패턴을 추출하는 머신러닝 기법을 학습' },
    { id: '3151120', title: '통계적학습', type: '선택', credits: 3, description: '통계적 학습 이론을 통해 데이터 기반 예측함수 탐색을 학습' },
    { id: '3151130', title: '딥러닝', type: '선택', credits: 3, description: '지능시스템 기초 개념과 딥러닝 기본을 학습하고, 데이터 가공 및 적용 역량을 배양' },
  ],
  '4학년 1학기': [
    { id: '3151119', title: '현장실습', type: '선택', credits: 3, description: '현장 실무 지식과 기술을 습득하여 기술적 사고력과 문제 해결력으로 작업을 수행' },
    { id: '3151133', title: '벤처캡스톤디자인', type: '선택', credits: 3, description: '창의 설계를 통해 종합 설계 및 구현 프로젝트를 팀으로 수행하며 평가' },
  ],
  '4학년 2학기': [
    { id: '3151121', title: 'AI와기후변화', type: '선택', credits: 3, description: '기후변화 원인과 통계, 물리, AI 기법을 활용한 영향평가 및 재해위기관리 방법을 심층 학습' },
    { id: '3151139', title: '차세대통신기술', type: '선택', credits: 3, description: '무선 통신과 RFID 기술의 기본 원리와 응용을 학습' },
  ],
};

// 학기 목록 정의 (1-4학년)
const semesters = [
  '1학년 1학기',
  '1학년 2학기',
  '2학년 1학기',
  '2학년 2학기',
  '3학년 1학기',
  '3학년 2학기',
  '4학년 1학기',
  '4학년 2학기'
];

// recommend_year를 학기로 변환하는 함수
const getSemesterFromRecommendYear = (recommendYear) => {
  const year = Math.ceil(recommendYear / 2);
  const semester = recommendYear % 2 === 0 ? '2학기' : '1학기';
  return `${year}학년 ${semester}`;
};

// 직업별 추천 커리큘럼 데이터
const careerCurriculumData = {
  'AI 엔지니어': {
    description: '인공지능 시스템을 설계하고 개발하는 전문가',
    requiredCourses: [
      { id: '3151104', title: '데이터전처리', type: '필수', credits: 3 },
      { id: '3151105', title: '머신러닝1', type: '필수', credits: 3 },
      { id: '3151112', title: '머신러닝2', type: '필수', credits: 3 },
      { id: '3151130', title: '딥러닝', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151089', title: '머신러닝을위한선형대수', type: '선택', credits: 3 },
      { id: '3151092', title: '머신러닝을위한통계학1', type: '선택', credits: 3 },
      { id: '3151120', title: '통계적학습', type: '선택', credits: 3 },
    ]
  },
  '데이터 사이언티스트': {
    description: '데이터를 분석하고 인사이트를 도출하는 전문가',
    requiredCourses: [
      { id: '3151104', title: '데이터전처리', type: '필수', credits: 3 },
      { id: '3151105', title: '머신러닝1', type: '필수', credits: 3 },
      { id: '3151092', title: '머신러닝을위한통계학1', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151089', title: '머신러닝을위한선형대수', type: '선택', credits: 3 },
      { id: '3151120', title: '통계적학습', type: '선택', credits: 3 },
      { id: '3151130', title: '딥러닝', type: '선택', credits: 3 },
    ]
  },
  '소프트웨어 개발자': {
    description: '소프트웨어 시스템을 설계하고 개발하는 전문가',
    requiredCourses: [
      { id: '3151028', title: '객체지향프로그래밍1', type: '필수', credits: 3 },
      { id: '3151104', title: '데이터전처리', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151105', title: '머신러닝1', type: '선택', credits: 3 },
      { id: '3151130', title: '딥러닝', type: '선택', credits: 3 },
    ]
  },
  '네트워크 엔지니어': {
    description: '네트워크 시스템을 설계하고 관리하는 전문가',
    requiredCourses: [
      { id: '3151098', title: '컴퓨터네트워크', type: '필수', credits: 3 },
      { id: '3151101', title: '네트워크프로그래밍', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151102', title: '무선네트워크와응용', type: '선택', credits: 3 },
      { id: '3151108', title: '통신이론', type: '선택', credits: 3 },
    ]
  },
  '임베디드 시스템 엔지니어': {
    description: '임베디드 시스템을 설계하고 개발하는 전문가',
    requiredCourses: [
      { id: '3151107', title: '마이크로프로세서', type: '필수', credits: 3 },
      { id: '3151123', title: '마이크로프로세서설계', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151124', title: '디지털회로및실험', type: '선택', credits: 3 },
      { id: '3151131', title: '디지털회로응용및실험', type: '선택', credits: 3 },
    ]
  },
  '로봇공학 엔지니어': {
    description: '로봇 시스템을 설계하고 개발하는 전문가',
    requiredCourses: [
      { id: '3151103', title: 'ROS로봇프로그래밍', type: '필수', credits: 3 },
      { id: '3151116', title: '로봇공학', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151117', title: 'AI자율주행탱크설계', type: '선택', credits: 2 },
      { id: '3151135', title: '제어공학1', type: '선택', credits: 3 },
    ]
  },
  '신호처리 엔지니어': {
    description: '신호처리 시스템을 설계하고 개발하는 전문가',
    requiredCourses: [
      { id: '3151094', title: '디지털신호처리', type: '필수', credits: 3 },
      { id: '3151110', title: '디지털신호처리실험', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151125', title: '신호해석및처리', type: '선택', credits: 3 },
      { id: '3151136', title: '신호처리입문', type: '선택', credits: 3 },
    ]
  },
  'IoT 엔지니어': {
    description: 'IoT 시스템을 설계하고 개발하는 전문가',
    requiredCourses: [
      { id: '3151047', title: '사물인터넷프로그래밍', type: '필수', credits: 3 },
      { id: '3151063', title: '사물인터넷', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151070', title: '사물인터넷설계', type: '선택', credits: 3 },
      { id: '3151075', title: '지능형센서및센서네트워크', type: '선택', credits: 3 },
    ]
  },
  '멀티미디어 엔지니어': {
    description: '멀티미디어 시스템을 설계하고 개발하는 전문가',
    requiredCourses: [
      { id: '3151121', title: '미디어개론', type: '필수', credits: 3 },
      { id: '3151122', title: '미디어콘텐츠설계', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151137', title: '디지털시스템설계', type: '선택', credits: 3 },
      { id: '3151140', title: '디지털트윈', type: '선택', credits: 3 },
    ]
  },
  '통신 엔지니어': {
    description: '통신 시스템을 설계하고 개발하는 전문가',
    requiredCourses: [
      { id: '3151108', title: '통신이론', type: '필수', credits: 3 },
      { id: '3151112', title: '디지털통신이론및실험', type: '필수', credits: 3 },
    ],
    recommendedCourses: [
      { id: '3151130', title: '이동통신', type: '선택', credits: 3 },
      { id: '3151139', title: '차세대통신기술', type: '선택', credits: 3 },
    ]
  }
};

// 과목 간의 선수 관계 정의
const prerequisites = {
  '머신러닝1': ['머신러닝을위한선형대수', '머신러닝을위한통계학1'],
  '머신러닝2': ['머신러닝1'],
  '딥러닝': ['머신러닝1'],
  '통계적학습': ['머신러닝을위한통계학1'],
};

export default function LectureScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('학기별');
  const [selectedSemester, setSelectedSemester] = useState('1학년 1학기');
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchRecommendations();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://192.168.45.78:3001/api/courses');
      if (!response.ok) throw new Error('과목 목록을 불러오지 못했습니다.');
      const data = await response.json();
      console.log('Fetched courses:', data); // 디버깅용 로그
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('오류', '과목 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      // AsyncStorage에서 추천 과목 id 리스트 불러오기
      const recommended = await AsyncStorage.getItem('recommendCourses');
      let recommendedIds = [];
      if (recommended) {
        recommendedIds = JSON.parse(recommended);
      }
      setRecommendedCourses(recommendedIds);
    } catch (error) {
      console.error('추천 과목 조회 오류:', error);
      setRecommendedCourses([]); // 오류 시 빈 배열로 설정
    } finally {
      setIsLoading(false);
    }
  };

  const renderSemesterSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.semesterSelector}
    >
      {semesters.map((semester) => (
        <TouchableOpacity
          key={semester}
          style={[
            styles.semesterButton,
            selectedSemester === semester && styles.selectedSemesterButton,
          ]}
          onPress={() => setSelectedSemester(semester)}
        >
          <Text
            style={[
              styles.semesterButtonText,
              selectedSemester === semester && styles.selectedSemesterButtonText,
            ]}
          >
            {semester}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderCourseCard = (item) => {
    console.log('Rendering course:', item.title, 'Career Relevance:', item.career_relevance); // 디버깅 로그
    const isRecommended = item.career_relevance > 0;
    const isCareerRequired = item.career_relevance === 2;
    
    return (
      <View key={item.course_id.toString()} style={[
        styles.card,
        item.is_required === 1 && styles.requiredCard,
        isRecommended && styles.recommendedCard,
        isCareerRequired && styles.careerRequiredCard
      ]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Ionicons name="book" size={28} color="#60a5fa" />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          <View style={styles.badgeContainer}>
            {item.is_required === 1 && (
              <View style={styles.requiredBadge}>
                <Text style={styles.badgeText}>필수</Text>
              </View>
            )}
            {isRecommended && (
              <View style={[styles.recommendBadge, isCareerRequired && styles.careerRequiredBadge]}>
                <Text style={styles.badgeText}>추천</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.creditText}>학점: {item.credit}</Text>
        </View>
      </View>
    );
  };

  const renderFlowChart = () => {
    const coursesByYear = semesters.reduce((acc, semester) => {
      acc[semester] = courses.filter(
        course => getSemesterFromRecommendYear(course.recommend_year) === semester
      ).sort((a, b) => {
        // 필수 과목을 먼저 정렬
        if (a.is_required !== b.is_required) {
          return b.is_required - a.is_required;
        }
        // 그 다음 추천 과목 정렬
        const aRecommended = recommendedCourses.includes(a.course_id);
        const bRecommended = recommendedCourses.includes(b.course_id);
        return bRecommended - aRecommended;
      });
      return acc;
    }, {});

    return (
      <ScrollView 
        style={styles.flowChartContainer}
        contentContainerStyle={styles.flowChartContent}
      >
        {semesters.map((semester) => (
          <View key={semester} style={styles.semesterSection}>
            <View style={styles.semesterHeader}>
              <Text style={styles.semesterTitle}>{semester}</Text>
            </View>
            <View style={styles.coursesRow}>
              {coursesByYear[semester].map((course) => {
                const isRecommended = recommendedCourses.includes(course.course_id);
                return (
                  <View key={course.course_id} style={[
                    styles.flowChartCard,
                    course.is_required && styles.requiredFlowCard,
                    isRecommended && styles.recommendedFlowCard
                  ]}>
                    <View style={styles.flowChartCardHeader}>
                      <Text style={styles.flowChartCardTitle}>{course.title}</Text>
                      <View style={styles.flowChartBadgeContainer}>
                        {course.is_required && (
                          <View style={styles.requiredBadge}>
                            <Text style={styles.badgeText}>필수</Text>
                          </View>
                        )}
                        {isRecommended && (
                          <View style={styles.recommendBadge}>
                            <Text style={styles.badgeText}>추천</Text>
                          </View>
                        )}
                        <View style={styles.creditBadge}>
                          <Text style={styles.creditText}>{course.credit}학점</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.connector} />
          </View>
        ))}
      </ScrollView>
    );
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
        <Text style={styles.pageTitle}>커리큘럼</Text>
        <Text style={styles.subtitle}>
          AI/소프트웨어 전공 커리큘럼을 확인하세요.
        </Text>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === '학기별' && styles.selectedTab]}
            onPress={() => setSelectedTab('학기별')}
          >
            <Text style={[styles.tabText, selectedTab === '학기별' && styles.selectedTabText]}>
              학기별 보기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === '전체' && styles.selectedTab]}
            onPress={() => setSelectedTab('전체')}
          >
            <Text style={[styles.tabText, selectedTab === '전체' && styles.selectedTabText]}>
              커리큘럼 흐름도
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : (
          <>
            {selectedTab === '학기별' && (
              <FlatList
                data={courses
                  .filter(course => getSemesterFromRecommendYear(course.recommend_year) === selectedSemester)
                  .sort((a, b) => {
                    if (a.is_required !== b.is_required) {
                      return b.is_required - a.is_required;
                    }
                    const aRecommended = recommendedCourses.includes(a.course_id);
                    const bRecommended = recommendedCourses.includes(b.course_id);
                    return bRecommended - aRecommended;
                  })}
                keyExtractor={item => item.course_id.toString()}
                contentContainerStyle={{ paddingBottom: 90, flexGrow: 1 }}
                ListHeaderComponent={renderSemesterSelector}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => renderCourseCard(item)}
              />
            )}
            {selectedTab === '전체' && renderFlowChart()}
          </>
        )}
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
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedTabText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  // 기존 학기별 보기 스타일
  semesterSelector: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  semesterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  selectedSemesterButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  semesterButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedSemesterButtonText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  // 새로운 플로우차트 스타일
  flowChartContainer: {
    flex: 1,
  },
  flowChartContent: {
    paddingBottom: 90,
  },
  semesterSection: {
    marginBottom: 24,
  },
  semesterHeader: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  coursesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 4,
  },
  flowChartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: (windowWidth - 56) / 2, // 2열로 표시
  },
  flowChartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  flowChartCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  flowChartBadgeContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  requiredBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  requiredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  recommendedCard: {
    backgroundColor: '#dbeafe',
  },
  creditBadge: {
    backgroundColor: '#e0edff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  creditText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  connector: {
    height: 24,
    width: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requiredFlowCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  recommendedFlowCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  fieldContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  fieldBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fieldText: {
    fontSize: 12,
    color: '#4b5563',
  },
  cardHeader: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  careerRequiredCard: {
    backgroundColor: '#bfdbfe',
  },
  careerRequiredBadge: {
    backgroundColor: '#2563eb',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  yearText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
