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
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.45.78:3001/api';

export default function CompanyJobsScreen() {
  const navigation = useNavigation();
  const [companies, setCompanies] = useState({
    대기업: [],
    중견: [],
    중소: []
  });
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
        console.log('API 응답 데이터:', data);

        // 기업 데이터 가공 및 규모별 분류
        const formattedCompanies = {
          대기업: [],
          중견: [],
          중소: []
        };

        if (data.companies && Array.isArray(data.companies)) {
          // 각 기업의 상세 정보를 가져옵니다
          for (const company of data.companies) {
            const companyDetailResponse = await fetch(`${API_URL}/companies/${company.company_code}`);
            if (companyDetailResponse.ok) {
              const companyDetail = await companyDetailResponse.json();
              const formattedCompany = {
                id: company.company_code.toString(),
                title: company.job_name || company.company_name,
                company: company.company_name,
                location: companyDetail.location || '위치 정보 없음',
                dday: '채용 중',
                scale: companyDetail.company_scale,
                job_name: company.job_name || '채용 중'
              };
              formattedCompanies[companyDetail.company_scale].push(formattedCompany);
            }
          }
        }

        console.log('가공된 기업 데이터:', formattedCompanies);
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
      <View style={styles.cardHeader}>
        <Ionicons name="business" size={28} color="#60a5fa" />
      </View>
      <Text style={styles.cardTitle}>{item.job_name}</Text>
      <Text style={styles.organization}>{item.company}</Text>
      <Text style={styles.cardDesc}>{item.location}</Text>
      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.dday}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.scale}</Text>
        </View>
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
      <View style={styles.header}>
        <Logo />
        <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={styles.headerIcons}>
          <Ionicons name="settings-outline" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* 대기업 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>대기업</Text>
          </View>
          {companies.대기업.length > 0 ? (
            <FlatList
              data={companies.대기업}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderJobCard(item)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.jobListContainer}
              horizontal={true}
            />
          ) : (
            <Text style={styles.emptyText}>추천 기업이 없습니다.</Text>
          )}
        </View>

        {/* 중견기업 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>중견기업</Text>
          </View>
          {companies.중견.length > 0 ? (
            <FlatList
              data={companies.중견}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderJobCard(item)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.jobListContainer}
              horizontal={true}
            />
          ) : (
            <Text style={styles.emptyText}>추천 기업이 없습니다.</Text>
          )}
        </View>

        {/* 중소기업 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>중소기업</Text>
          </View>
          {companies.중소.length > 0 ? (
            <FlatList
              data={companies.중소}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderJobCard(item)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.jobListContainer}
              horizontal={true}
            />
          ) : (
            <Text style={styles.emptyText}>추천 기업이 없습니다.</Text>
          )}
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

  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  link: {
    fontSize: 13,
    color: '#2563eb',
  },

  jobCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111',
  },
  organization: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#4b5563',
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
    width: '90%',
    height: 80,
    alignSelf: 'center',
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
  jobListContainer: {
    paddingBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 16,
  },
});
