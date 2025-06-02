import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';

const certificates = [
  {
    id: '1',
    title: 'AWS 머신러닝 전문가 자격증',
    organization: 'Amazon Web Services',
    level: '전문가',
    description: 'AWS 클라우드 환경에서 머신러닝 솔루션을 설계, 구현, 배포하는 능력을 검증하는 자격증입니다.',
    requirements: ['AWS 기초 지식', '머신러닝 기초', 'Python 프로그래밍'],
    validity: '3년',
    icon: 'cloud',
    detail: {
      summary: 'AWS 머신러닝 전문가 자격증은 AWS 클라우드 환경에서 머신러닝 솔루션을 설계하고 구현하는 능력을 검증합니다. 데이터 전처리, 모델 학습, 배포까지 전체 ML 파이프라인을 다룰 수 있는 전문성을 보여줍니다.',
      examInfo: {
        format: '객관식 + 실습',
        duration: '180분',
        questions: '65문항',
        passingScore: '750/1000점',
      },
      preparation: [
        'AWS 공식 학습 자료',
        '실습 프로젝트 수행',
        '온라인 강의 수강',
        '모의고사 응시'
      ],
      benefits: [
        '클라우드 ML 전문가로서의 인정',
        '높은 연봉과 취업 기회',
        'AWS 파트너사 우대',
        '전문가 커뮤니티 참여'
      ]
    }
  },
  {
    id: '2',
    title: '구글 공인 머신러닝 엔지니어',
    organization: 'Google',
    level: '전문가',
    description: 'Google Cloud Platform을 활용한 머신러닝 모델 개발 및 배포 능력을 검증하는 자격증입니다.',
    requirements: ['GCP 기초', '머신러닝 기초', 'Python 프로그래밍'],
    validity: '2년',
    icon: 'logo-google',
    detail: {
      summary: '구글 공인 머신러닝 엔지니어 자격증은 GCP 환경에서 머신러닝 모델을 개발하고 배포하는 능력을 검증합니다. TensorFlow와 Google Cloud AI Platform을 활용한 실무 역량을 평가합니다.',
      examInfo: {
        format: '실습 위주',
        duration: '120분',
        tasks: '실무 과제',
        passingScore: '70% 이상',
      },
      preparation: [
        'Google Cloud 학습 자료',
        'TensorFlow 공식 튜토리얼',
        '실습 프로젝트',
        '스터디 그룹 참여'
      ],
      benefits: [
        '구글 공인 전문가 인증',
        '높은 시장 가치',
        '구글 파트너사 우대',
        '전문가 네트워크'
      ]
    }
  },
  {
    id: '3',
    title: '데이터 분석 전문가(ADP)',
    organization: '한국데이터산업진흥원',
    level: '국가공인',
    description: '데이터 분석의 기초부터 고급 분석까지 전 과정을 다루는 국가공인 자격증입니다.',
    requirements: ['통계학 기초', 'R/Python', '데이터베이스'],
    validity: '영구',
    icon: 'bar-chart',
    detail: {
      summary: '데이터 분석 전문가(ADP)는 데이터 분석의 전 과정을 다루는 국가공인 자격증입니다. 데이터 수집, 전처리, 분석, 시각화까지 데이터 분석의 모든 영역을 포괄합니다.',
      examInfo: {
        format: '필기 + 실기',
        duration: '필기 90분, 실기 180분',
        level: '필기 + 실기 통합',
        passingScore: '60점 이상',
      },
      preparation: [
        '공식 교재 학습',
        '실습 문제 풀이',
        '온라인 강의',
        '스터디 그룹'
      ],
      benefits: [
        '국가공인 자격증',
        '공공기관 채용 우대',
        '데이터 분석 전문가 인정',
        '지속적인 교육 지원'
      ]
    }
  }
];

export default function CredentialScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedTab, setSelectedTab] = useState('자격증');

  const openModal = (certificate) => {
    setSelectedCertificate(certificate);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCertificate(null);
  };

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    if (tab === '홈') {
      navigation.navigate('Home');
    } else if (tab === '강의') {
      navigation.navigate('Lecture');
    }
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
      <Text style={styles.pageTitle}>자격증</Text>
      <Text style={styles.subtitle}>
        AI/소프트웨어 분야에서 취득하면 좋은 자격증을 추천해드립니다.
      </Text>

      {/* 자격증 리스트 */}
      <FlatList
        data={certificates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        style={{ flex: 1, marginBottom: 64 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity onPress={() => openModal(item)}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name={item.icon} size={28} color="#60a5fa" />
                  <Feather name="star" size={20} color="#ccc" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.organization}>{item.organization}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.level}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>유효기간: {item.validity}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            {/* 데이터 분석 전문가(ADP) 카드 아래에 큐넷 카드 추가 */}
            {item.id === '3' && (
              <TouchableOpacity style={styles.cubeCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cubeTitle}>큐넷 자격증</Text>
                  <Text style={styles.cubeDesc}>국가기술자격 정보 포털</Text>
                </View>
                <View style={styles.cubeIconCircle}>
                  <Ionicons name="open-outline" size={28} color="#2563eb" />
                </View>
              </TouchableOpacity>
            )}
          </>
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
              <Text style={styles.modalTitle}>{selectedCertificate?.title}</Text>
              <Pressable onPress={closeModal} hitSlop={10}>
                <Ionicons name="close" size={24} color="#222" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSummary}>{selectedCertificate?.detail?.summary}</Text>
              
              {/* 시험 정보 */}
              <Text style={styles.modalSectionTitle}>시험 정보</Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>시험 형식</Text>
                  <Text style={styles.modalInfoValue}>{selectedCertificate?.detail?.examInfo?.format}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>시험 시간</Text>
                  <Text style={styles.modalInfoValue}>{selectedCertificate?.detail?.examInfo?.duration}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Text style={styles.modalInfoLabel}>합격 기준</Text>
                  <Text style={styles.modalInfoValue}>{selectedCertificate?.detail?.examInfo?.passingScore}</Text>
                </View>
              </View>

              {/* 준비 방법 */}
              <Text style={styles.modalSectionTitle}>준비 방법</Text>
              {selectedCertificate?.detail?.preparation?.map((item, idx) => (
                <View key={idx} style={styles.modalListItem}>
                  <Ionicons name="ellipse" size={8} color="#3b82f6" style={{ marginRight: 8 }} />
                  <Text style={styles.modalListText}>{item}</Text>
                </View>
              ))}

              {/* 취득 혜택 */}
              <Text style={styles.modalSectionTitle}>취득 혜택</Text>
              {selectedCertificate?.detail?.benefits?.map((item, idx) => (
                <View key={idx} style={styles.modalListItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#f59e42" style={{ marginRight: 8 }} />
                  <Text style={styles.modalListText}>{item}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>자격증 준비하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 80,
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
  modalInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  modalInfoItem: {
    width: '50%',
    marginBottom: 8,
  },
  modalInfoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  modalInfoValue: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
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
  cubeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6faff',
    borderWidth: 2,
    borderColor: '#c7e0ff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#c7e0ff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cubeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222e39',
    marginBottom: 4,
  },
  cubeDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  cubeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#c7e0ff',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

