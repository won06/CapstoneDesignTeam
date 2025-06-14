import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/Logo';

const API_URL = 'http://192.168.45.78:3001/api';

export default function SelectJobScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/careers`);
      if (!response.ok) throw new Error('직업 목록을 불러오지 못했습니다.');
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSelectJob = async (job) => {
    try {
      // 1. 선택한 직업 저장
      await AsyncStorage.setItem('selectedJob', JSON.stringify(job));
      
      // 2. 필요한 데이터 가져오기
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }
      
      const selectedCourses = JSON.parse(await AsyncStorage.getItem('selectedCourses') || '[]');
      console.log('Selected Courses:', selectedCourses);
      
      // 3. keyword_based_recommender 기반 과목 추천 요청
      const recommendResponse = await fetch(`${API_URL}/recommend/course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careers: [job.career_id],
          target_id: job.career_id
        })
      });

      const responseText = await recommendResponse.text();
      console.log('Server Response:', responseText);

      if (!recommendResponse.ok) {
        throw new Error(`추천 생성 실패: ${responseText}`);
      }

      let recommendData;
      try {
        recommendData = JSON.parse(responseText);
        console.log('Parsed recommend data:', recommendData);
      } catch (e) {
        throw new Error('서버 응답을 파싱할 수 없습니다.');
      }

      // 4. 추천 데이터 유효성 검사
      if (!recommendData) {
        throw new Error('추천 데이터가 없습니다.');
      }

      // recommendations 배열이 없는 경우 빈 배열로 초기화
      if (!recommendData.recommendations) {
        recommendData.recommendations = [];
      }

      // 이미 선택한 과목들을 제외한 추천 데이터 필터링
      const filteredRecommendData = {
        ...recommendData,
        recommendations: recommendData.recommendations.filter(courseId => {
          // 선택한 과목 목록에 없는 과목만 포함 (courseId가 이름이 아닌 id임에 주의)
          return !selectedCourses.includes(courseId);
        })
      };

      console.log('Filtered recommend data:', filteredRecommendData);

      // 필터링된 추천 데이터 저장
      await AsyncStorage.setItem('recommendCourses', JSON.stringify(filteredRecommendData.recommendations));

      // 5. 적성검사 완료 플래그 업데이트
      const completeResponse = await fetch(`${API_URL}/user/complete-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id })
      });

      if (!completeResponse.ok) {
        const completeText = await completeResponse.text();
        throw new Error(`적성검사 완료 상태 업데이트 실패: ${completeText}`);
      }

      // 6. 모든 처리가 성공적으로 완료되면 메인 화면으로 이동
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('Error in handleSelectJob:', error);
      alert(`오류가 발생했습니다: ${error.message}\n다시 시도해주세요.`);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.job_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}><ActivityIndicator size="large" color="#2563eb" /></View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}><Text>에러: {error}</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Logo style={{ marginLeft: 12 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Ionicons name="settings-outline" size={24} color="#222" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>희망 직업 선택</Text>
      <Text style={styles.subtitle}>희망하는 직업을 선택해 주세요.</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9ca3af" style={{ marginLeft: 8, marginRight: 4 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="직업명 검색"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
        />
      </View>
      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.career_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelectJob(item)}>
            <View style={styles.cardHeader}>
              <Ionicons name="briefcase" size={24} color="#60a5fa" />
              <Text style={styles.cardTitle}>{item.job_name}</Text>
            </View>
            <Text style={styles.cardDesc}>{item.summary}</Text>
            <Text style={styles.salary}>💰 {item.salary}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: '#222',
    paddingVertical: 0,
    paddingHorizontal: 4,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
  },
  salary: {
    fontSize: 13,
    color: '#10b981',
  },
}); 