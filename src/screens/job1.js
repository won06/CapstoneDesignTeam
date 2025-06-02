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

const jobCategories = [
  { id: '1', title: 'AI 엔지니어', icon: 'cpu' },
  { id: '2', title: '머신러닝 엔지니어', icon: 'activity' },
  { id: '3', title: '데이터 사이언티스트', icon: 'bar-chart-2' },
  { id: '4', title: '소프트웨어 개발자', icon: 'code' },
  { id: '5', title: '연구원', icon: 'book-open' },
  { id: '6', title: '기타', icon: 'more-horizontal' },
];

export default function Job1Screen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
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
        onPress={() => navigation.navigate('Test2')}
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedCategory: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 1,
  },
  categoryTitle: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  selectedCategoryText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  nextButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  nextButtonDisabled: {
    backgroundColor: '#e5e7eb',
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