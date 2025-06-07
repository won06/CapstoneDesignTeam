import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIELD_MAP } from '../fields';
import { COURSE_MAP } from '../courses';

const API_URL = 'http://192.168.45.78:3001/api';

export default function CareerRecommendationScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careers, setCareers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendedCareers();
  }, []);

  const fetchRecommendedCareers = async () => {
    setLoading(true);
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) throw new Error('로그인 정보가 없습니다.');

      // 1. 추천 생성(최초 1회만 필요, 이미 생성된 경우 생략 가능)
      await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
      });

      // 2. 추천 결과 조회
      const response = await fetch(`${API_URL}/recommend/result?user_id=${user_id}`);
      if (!response.ok) {
        throw new Error('추천 결과를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setCareers(data.careers || []);
      // 강의 추천 관련 UI 및 상태 제거
      // setCourses(data.courses || []); // courses 상태 제거
      // 강의 추천 FlatList 및 텍스트 제거
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const openModal = (career) => {
    setSelectedCareer(career);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCareer(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>에러: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <Logo />
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Feather name="settings" size={20} color="#222" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>직업 추천</Text>
      <Text style={styles.subtitle}>
        기술과 관심사를 바탕으로 최적의 직업 경로를 추천해드립니다.
      </Text>

      {/* 경력 리스트 */}
      <FlatList
        data={careers}
        keyExtractor={(item) => item.career_id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.card}>
              {/* 직업명 및 설명 */}
              <View style={styles.cardHeader}>
                <Ionicons name={'briefcase'} size={28} color="#60a5fa" />
                <Feather name="star" size={20} color="#ccc" />
              </View>
              <Text style={styles.cardTitle}>{item.job_name}</Text>
              <Text style={styles.cardDesc}>{item.summary}</Text>
              {/* 연봉 */}
              <Text style={styles.salary}>
                💰 {item.salary}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* 상세 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCareer?.job_name}</Text>
              <Pressable onPress={closeModal} hitSlop={10}>
                <Ionicons name="close" size={24} color="#222" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSummary}>{selectedCareer?.summary}</Text>
              {/* 연봉 */}
              <Text style={styles.modalSectionTitle}>연봉</Text>
              <Text style={styles.modalListText}>{selectedCareer?.salary}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 스타일
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
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
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
  cardDesc: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
  },
  salary: {
    fontSize: 13,
    color: '#1e3a8a',
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
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  modalSummary: {
    fontSize: 14,
    color: '#222',
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#2563eb',
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalListText: {
    fontSize: 13,
    color: '#222',
  },
  modalCompanyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 16,
  },
  modalCompanyBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  modalCompanyText: {
    fontSize: 12,
    color: '#374151',
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
