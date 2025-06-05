import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const jobCategories = [
  { id: '1', title: 'AI 엔지니어', icon: 'cpu' },
  { id: '2', title: '머신러닝 엔지니어', icon: 'activity' },
  { id: '3', title: '데이터 사이언티스트', icon: 'bar-chart-2' },
  { id: '4', title: '소프트웨어 개발자', icon: 'code' },
  { id: '5', title: '연구원', icon: 'book-open' },
  { id: '6', title: '기타', icon: 'more-horizontal' },
];

export default function JobSelectionScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCompleteTest = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    try {
      await fetch('http://192.168.45.78:3001/api/user/complete-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
      });
    } catch (e) {}
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Logo />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>AI/소프트웨어 직군 선택</Text>
      <Text style={styles.subtitle}>
        현재 종사하고 계신 AI/소프트웨어 관련 직군을 선택해주세요.
      </Text>

      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="직업 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 직업 카테고리 */}
      <ScrollView style={styles.categoriesContainer}>
        {jobCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => {
              setSelectedCategory(category.id);
            }}
          >
            <Feather
              name={category.icon}
              size={24}
              color={selectedCategory === category.id ? '#3b82f6' : '#6b7280'}
            />
            <Text
              style={[
                styles.categoryTitle,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedCategory ? styles.nextButtonActive : styles.nextButtonDisabled
        ]}
        disabled={!selectedCategory}
        onPress={handleCompleteTest}
      >
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCategory: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  categoryTitle: {
    fontSize: 16,
    marginLeft: 12,
    color: '#1f2937',
  },
  selectedCategoryText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  nextButton: {
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 12,
    paddingVertical: 16,
  },
  nextButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  nextButtonActive: {
    backgroundColor: '#3b82f6',
  },
  nextText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
