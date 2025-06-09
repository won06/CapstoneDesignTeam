import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.45.78:3001/api';

export default function CompanyJobsScreen() {
  const navigation = useNavigation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) return;

      const response = await fetch(`${API_URL}/recommend/result?user_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        // 기업 데이터 가공
        const formattedCompanies = data.companies.map(company => ({
          id: company.company_code.toString(),
          title: company.job_name || '채용 중',
          company: company.company_name,
          location: company.location || '위치 정보 없음',
          dday: '채용 중',
        }));
        setCompanies(formattedCompanies);
      }
    } catch (error) {
      console.error('기업 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaraminPress = () => {
    Linking.openURL('https://www.saramin.co.kr/zf_user/?srsltid=AfmBOoowYzxYmkQl7PtfwcoHLCYLGlB9A9ujJhnYtjHuFOi4POxwSlfp');
  };

  const renderJobCard = (item) => (
    <View style={styles.jobCard}>
      <View style={styles.ddayBadge}>
        <Text style={styles.ddayText}>{item.dday}</Text>
      </View>
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobSub}>{item.company}</Text>
        <Text style={styles.jobSub}>{item.location}</Text>
        <TouchableOpacity>
          <Text style={styles.detailLink}>상세보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Logo />
          <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={styles.headerIcons}>
            <Ionicons name="settings-outline" size={20} color="#111" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>기업 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Logo />
        <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={styles.headerIcons}>
          <Ionicons name="settings-outline" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* 추천 기업 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>추천 기업</Text>
          </View>
          <FlatList
            data={companies}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderJobCard(item)}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* 사람인 버튼 */}
        <TouchableOpacity style={styles.saraminCard} onPress={handleSaraminPress}>
          <View style={{ flex: 1 }}>
            <Text style={styles.saraminTitle}>사람인 채용정보</Text>
            <Text style={styles.saraminDesc}>채용 정보 포털</Text>
          </View>
          <View style={styles.saraminIconCircle}>
            <Ionicons name="open-outline" size={28} color="#2563eb" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  headerIcons: { flexDirection: 'row' },

  section: { marginBottom: 24 },
  sectionHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  link: {
    fontSize: 13,
    color: '#2563eb',
  },

  jobCard: {
    width: 260,
    backgroundColor: '#fff',
    marginLeft: 20,
    marginRight: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  ddayBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#facc15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ddayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  jobInfo: {
    padding: 12,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111',
  },
  jobSub: {
    fontSize: 13,
    color: '#6b7280',
  },
  detailLink: {
    marginTop: 6,
    fontSize: 13,
    color: '#2563eb',
  },
  saraminCard: {
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
  saraminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222e39',
    marginBottom: 4,
  },
  saraminDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  saraminIconCircle: {
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
