import React, { useState } from 'react';
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

const careers = [
  {
    id: '1',
    title: 'AI 엔지니어',
    description: '기업 운영과 사람들의 삶을 변화시키는 AI 시스템을 구축하고 배포합니다.',
    salary: '연봉 1억2천 ~ 1억8천',
    tags: ['머신러닝', '파이썬', '딥러닝', '텐서플로우'],
    icon: 'cloud',
    detail: {
      summary: 'AI 엔지니어는 데이터를 기반으로 학습하고 지능적인 의사결정이 가능한 AI 모델과 시스템을 설계, 개발하고 배포합니다. 소프트웨어 개발과 데이터 과학이 만나는 지점에서 머신러닝 기술을 활용한 서비스 구축을 담당합니다.',
      courses: ['머신러닝 기초 과정', '딥러닝 전문가 과정', '자연어 처리 실무', '컴퓨터 비전 시스템 개발'],
      certificates: ['AWS 머신러닝 전문가 자격증', '구글 공인 머신러닝 엔지니어', '텐서플로우 개발자 인증'],
      companies: ['구글 딥마인드', '오픈AI', '마이크로소프트', '엔비디아', '메타 AI 연구소']
    }
  },
  {
    id: '2',
    title: '데이터 사이언티스트',
    description: '복잡한 데이터에서 인사이트를 도출하여 비즈니스 문제를 해결하고 전략적 의사결정을 지원합니다.',
    salary: '연봉 1억1천 ~ 1억6천',
    tags: ['통계', 'R', 'SQL', '데이터 시각화'],
    icon: 'bar-chart',
    detail: {
      summary: '데이터 사이언티스트는 대규모 데이터에서 의미 있는 패턴을 찾아내고, 분석 결과를 바탕으로 비즈니스 전략을 수립합니다. 통계, 프로그래밍, 데이터 시각화 역량이 중요합니다.',
      courses: ['통계적 데이터 분석', 'R 프로그래밍', 'SQL 데이터 처리', '데이터 시각화 실습'],
      certificates: ['데이터 분석 전문가(ADP)', 'SQLD', '구글 데이터 애널리틱스 자격증'],
      companies: ['카카오', '네이버', '쿠팡', '삼성 SDS', '라인']
    }
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    description: '사용자를 만족시키고 비즈니스 목표를 달성하는 직관적이고 매력적인 디지털 경험을 설계합니다.',
    salary: '연봉 9천 ~ 1억4천',
    tags: ['사용자 리서치', '피그마', '프로토타이핑', '디자인 시스템'],
    icon: 'color-palette',
    detail: {
      summary: 'UX/UI 디자이너는 사용자 경험을 최우선으로 고려하여 웹, 앱 등 디지털 제품의 인터페이스를 설계합니다. 사용자 리서치, 프로토타이핑, 디자인 시스템 구축 역량이 요구됩니다.',
      courses: ['UX 리서치 방법론', '피그마 실습', '프로토타이핑 워크숍', '디자인 시스템 구축'],
      certificates: ['구글 UX 디자인 자격증', 'Adobe Certified Expert'],
      companies: ['네이버', '토스', '배달의민족', '라인', '카카오']
    }
  },
];

export default function CareerRecommendationScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedTab, setSelectedTab] = useState('홈');

  const openModal = (career) => {
    setSelectedCareer(career);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedCareer(null);
  };

  const handleTabPress = (tab) => {
    console.log('Tab pressed:', tab);
    setSelectedTab(tab);
    
    switch(tab) {
      case '강의':
        console.log('Navigating to Lecture');
        navigation.navigate('Lecture');
        break;
      case '자격증':
        console.log('Navigating to Credential');
        navigation.navigate('Credential');
        break;
      case '홈':
        console.log('Already on Home');
        break;
      case '회사':
        console.log('Company tab not implemented yet');
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <Logo />
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Feather name="settings" size={20} color="#222" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>경력 추천</Text>
      <Text style={styles.subtitle}>
        귀하의 기술과 관심사를 바탕으로 최적의 경력 경로를 추천해드립니다.
      </Text>

      {/* 경력 리스트 */}
      <FlatList
        data={careers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.card}>
              {/* 직업명 및 설명 */}
              <View style={styles.cardHeader}>
                <Ionicons name={item.icon} size={28} color="#60a5fa" />
                <Feather name="star" size={20} color="#ccc" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              {/* 연봉 */}
              <Text style={styles.salary}>
                💰 {item.salary}
              </Text>
              {/* 태그 */}
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
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
              <Text style={styles.modalTitle}>{selectedCareer?.title}</Text>
              <Pressable onPress={closeModal} hitSlop={10}>
                <Ionicons name="close" size={24} color="#222" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSummary}>{selectedCareer?.detail?.summary}</Text>
              {/* 추천 강좌 */}
              <Text style={styles.modalSectionTitle}>추천 강좌</Text>
              {selectedCareer?.detail?.courses?.map((course, idx) => (
                <View key={idx} style={styles.modalListItem}>
                  <Ionicons name="ellipse" size={8} color="#3b82f6" style={{ marginRight: 8 }} />
                  <Text style={styles.modalListText}>{course}</Text>
                </View>
              ))}
              {/* 추천 자격증 */}
              <Text style={styles.modalSectionTitle}>추천 자격증</Text>
              {selectedCareer?.detail?.certificates?.map((cert, idx) => (
                <View key={idx} style={styles.modalListItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#f59e42" style={{ marginRight: 8 }} />
                  <Text style={styles.modalListText}>{cert}</Text>
                </View>
              ))}
              {/* 주요 기업 */}
              <Text style={styles.modalSectionTitle}>주요 기업</Text>
              <View style={styles.modalCompanyRow}>
                {selectedCareer?.detail?.companies?.map((company, idx) => (
                  <View key={idx} style={styles.modalCompanyBadge}>
                    <Text style={styles.modalCompanyText}>{company}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>이 경력 경로 탐색하기</Text>
            </TouchableOpacity>
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
