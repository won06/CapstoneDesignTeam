import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';

const jobData = {
  smes: [
    {
      id: '1',
      title: '데이터 분석가 (Data Analyst)',
      company: '테크스타트 (중소기업)',
      location: '서울 강남구',
      dday: 'D-7',
      image: require('./assets/sme1.png'),
    },
    {
      id: '2',
      title: '모바일 앱 개발자',
      company: '앱솔루션 (중소기업)',
      location: '서울 서초구',
      dday: 'D-12',
      image: require('./assets/sme2.png'),
    },
  ],
  large: [
    {
      id: '3',
      title: '시스템 소프트웨어 개발자',
      company: '삼성전자 (대기업)',
      location: '경기 수원시',
      dday: 'D-10',
      image: require('./assets/big1.png'),
    },
    {
      id: '4',
      title: 'AI 연구원',
      company: 'LG전자 (대기업)',
      location: '서울 서초구',
      dday: 'D-14',
      image: require('./assets/big2.png'),
    },
  ],
};

export default function CompanyJobsScreen() {
  const navigation = useNavigation();

  const renderJobCard = (item) => (
    <View style={styles.jobCard}>
      <Image source={item.image} style={styles.jobImage} />
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

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Logo />
        <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={styles.headerIcons}>
          <Ionicons name="settings-outline" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* 중소기업 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>중소기업 채용정보</Text>
            <TouchableOpacity>
              <Text style={styles.link}>전체보기</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={jobData.smes}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderJobCard(item)}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* 대기업 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>대기업 채용정보</Text>
            <TouchableOpacity>
              <Text style={styles.link}>전체보기</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={jobData.large}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderJobCard(item)}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* 사람인 버튼 */}
        <TouchableOpacity style={styles.saraminCard}>
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
  jobImage: {
    width: '100%',
    height: 120,
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
});
