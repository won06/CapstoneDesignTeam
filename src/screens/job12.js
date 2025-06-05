import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Logo from '../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const interests = [
  { title: '개론', items: ['전자AI시스템공학개론','AI소프트웨어개론'] },
  { title: '수학·통계', items: ['전공기초수학', 'AI융합기초수학','AI응용수학', '공업수학', '확률및통계', '확률과인공지능'] },
  { title: '기초전자·물리 실험', items: ['전자기학1', '전자기학2', '물리전자', '기초회로실험', '기초전기및실험', '전자회로실험1', '전자회로실험2'] },
  { title: '회로·디지털공학', items: ['회로이론1', '회로이론2', '디지털공학1', '디지털공학2', '디지털회로및실험', '디지털회로응용및실험'] },
  { title: '제어·로봇·자율시스템', items: ['제어공학1', '제어공학2', '제어공학및실험', '제어공학응용및실험', '전동기제어', '마이크로프로세서', '마이크로프로세서설계', 'ROS로봇프로그래밍', '로봇공학', 'AI자율주행탱크설계', 'PLC'] },
  { title: '통신·네트워크', items: ['컴퓨터네트워크', '무선네트워크와응용', '네트워크프로그래밍', '통신이론', '디지털통신이론및실험', '이동통신', '차세대통신기술'] },
  { title: '컴퓨터시스템·운영체제', items: ['운영체제와컴퓨터설계', '운영체제', 'LINUX운영체제', '컴퓨터시스템', '컴퓨터구조'] },
  { title: '프로그래밍·SW 개발', items: ['객체지향프로그래밍1', '객체지향프로그래밍2', '컴퓨터프로그래밍', '문제해결프로그래밍', '파이썬프로그래밍', 'JAVA프로그래밍', '안드로이드프로그래밍', '모바일프로그래밍', '소프트웨어공학', '보안코딩실습', '웹서버프로그래밍', '컴퓨터알고리즘', '창의공학'] },
  { title: '데이터·DB', items: ['데이터사이언스프로그래밍', '데이터구조', '데이터베이스언어', '데이터베이스', '데이터베이스설계및관리', '데이터베이스이론및실습', '기상기후빅데이터'] },
  { title: '인공지능·머신러닝', items: ['AI와재난과학', 'AI와재난현장', 'AI와재난모델링', 'AI와사운드', '머신러닝을위한선형대수', '머신러닝을위한통계학1', '머신러닝1', '머신러닝2', '통계적학습', '딥러닝', '신호처리입문'] },
  { title: 'IoT·스마트시스템·센서', items: ['사물인터넷프로그래밍', '사물인터넷', '사물인터넷설계', '지능형센서및센서네트워크', '마이크로파시스템실험', '디지털트윈'] },
  { title: '멀티미디어·신호처리', items: ['미디어개론', '미디어콘텐츠설계', '디지털시스템설계', '디지털신호처리', '디지털신호처리실험', '신호해석및처리'] },
  { title: '진로·창업·캡스톤·실습', items: ['진로탐색과꿈-설계', '취업·창업과꿈-설계', '벤처캡스톤디자인', '현장실습'] },
];

export default function Job12({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Logo />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>어떤 분야에 관심이 있나요?</Text>
      <Text style={styles.subtitle}>
        관심 있는 분야를 모두 선택해주세요. 여러 개 선택할 수 있어요.
      </Text>

      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {interests.map((category) => (
          <View key={category.title} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.interestGrid}>
              {category.items.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.interestBtn,
                      selected && styles.interestBtnSelected,
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text
                      style={[
                        styles.interestText,
                        selected && styles.interestTextSelected,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedInterests.length > 0 ? styles.nextButtonActive : styles.nextButtonDisabled,
          ]}
          disabled={selectedInterests.length === 0}
          onPress={handleCompleteTest}
        >
          <Text style={styles.nextText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  closeIcon: {
    fontSize: 20,
    color: '#6b7280',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestBtnSelected: {
    backgroundColor: '#d6f3fa',
  },
  interestText: {
    color: '#374151',
    fontSize: 13,
  },
  interestTextSelected: {
    color: '#007a99',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: 8,
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
