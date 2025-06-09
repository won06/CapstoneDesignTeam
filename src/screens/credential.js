import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
  Linking,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.45.78:3001/api';

export default function CredentialScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedTab, setSelectedTab] = useState('자격증');
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) return;

      const response = await fetch(`${API_URL}/recommend/result?user_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        // 자격증 데이터 가공
        const formattedCerts = data.certifications.map(cert => ({
          id: cert.cert_id.toString(),
          title: cert.jmfldnm,
          organization: cert.qualgbnm,
          level: cert.seriesnm,
          description: `${cert.qualgbnm} ${cert.seriesnm} 자격증입니다.`,
          validity: '영구',
          icon: 'ribbon',
          detail: {
            summary: `${cert.jmfldnm}은(는) ${cert.qualgbnm} ${cert.seriesnm} 자격증으로, 해당 분야의 전문성을 인증하는 국가공인 자격증입니다.`,
            examInfo: {
              format: '필기 + 실기',
              duration: '시험별 상이',
              questions: '시험별 상이',
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
              '취업 시 우대',
              '전문성 인정',
              '지속적인 교육 지원'
            ]
          }
        }));
        setCertificates(formattedCerts);
      }
    } catch (error) {
      console.error('자격증 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleQnetPress = () => {
    Linking.openURL('https://www.q-net.or.kr/man001.do?gSite=Q&gIntro=Y');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Logo />
          <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
            <Ionicons name="settings-outline" size={20} color="#111" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>자격증 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

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
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ flex: 1, marginBottom: 80 }}
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
            {/* 마지막 자격증 카드 아래에 큐넷 카드 추가 */}
            {item.id === certificates[certificates.length - 1].id && (
              <TouchableOpacity style={styles.cubeCard} onPress={handleQnetPress}>
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
  cubeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cubeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cubeDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  cubeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

