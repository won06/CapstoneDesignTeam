import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  SafeAreaView
} from 'react-native';
import Logo from '../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AssessmentScreen({ navigation }) {
  const [grade, setGrade] = useState('');
  const [jobStatus, setJobStatus] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const gradeOptions = ['1학년', '2학년', '3학년', '4학년'];

  useEffect(() => {
    const checkTestCompleted = async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) return;
      const res = await fetch(`http://192.168.45.78:3001/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, password: 'dummy' }) // 비밀번호는 실제로 사용되지 않으므로 dummy 값
      });
      const data = await res.json();
      if (data.is_test_completed === 1) {
        navigation.replace('MainTabs');
      }
    };
    checkTestCompleted();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Logo style={{ marginLeft: 12 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="close" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>적성 검사</Text>
      <Text style={styles.subtitle}>정확한 진로 추천을 위해 몇 가지 질문에 답해주세요.</Text>

      {/* 학년 선택 */}
      <Text style={styles.label}>현재 학년이 어떻게 되시나요?</Text>
      <Text style={styles.subLabel}>정확한 진로 추천을 위해 필요해요</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownVisible(true)}
      >
        <Text style={{ color: grade ? '#000' : '#9ca3af' }}>
          {grade || '학년을 선택해주세요'}
        </Text>
      </TouchableOpacity>

      {/* 학년 선택 모달 */}
      <Modal visible={dropdownVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <FlatList
              data={gradeOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    setGrade(item);
                    setDropdownVisible(false);
                  }}
                >
                  <Text>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* 직업 유무 */}
      <Text style={[styles.label, { marginTop: 24 }]}>현재 희망하는 직업이 있나요?</Text>
      <Text style={styles.subLabel}>맞춤형 진로 제안을 위한 질문이에요</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            jobStatus === '있음' && styles.selectedButton
          ]}
          onPress={() => {
            setJobStatus('있음');
          }}
        >
          <Text
            style={[
              styles.selectText,
              jobStatus === '있음' && styles.selectedText
            ]}
          >
            직업이 있다
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectButton,
            jobStatus === '없음' && styles.selectedButton
          ]}
          onPress={() => setJobStatus('없음')}
        >
          <Text
            style={[
              styles.selectText,
              jobStatus === '없음' && styles.selectedText
            ]}
          >
            직업이 없다
          </Text>
        </TouchableOpacity>
      </View>

      {/* 다음 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            grade && jobStatus ? styles.nextButtonActive : styles.nextButtonDisabled
          ]}
          disabled={!grade || !jobStatus}
          onPress={() => {
            if (jobStatus === '있음') {
              navigation.navigate('SelectJob');
            } else {
              navigation.navigate('Test2', { fromJob12: true });
            }
          }}
        >
          <Text style={[
            styles.nextText,
            (!grade || !jobStatus) && styles.nextTextDisabled
          ]}>다음</Text>
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
    marginBottom: 16,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logo: {
    fontFamily: 'cursive',
    fontSize: 32,
    color: '#2979ff',
    fontWeight: 'bold',
    marginBottom: 0,
  },
  closeBtn: {
    position: 'absolute',
    right: 24,
    top: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
    paddingHorizontal: 24,
    textAlign: 'left',
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  subLabel: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    width: 240,
    borderRadius: 10,
    padding: 16,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 24,
  },
  selectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#e0edff',
    borderColor: '#3b82f6',
  },
  selectText: {
    color: '#111827',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#2563eb',
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
    borderRadius: 8,
    paddingVertical: 14,
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
  nextTextDisabled: {
    color: '#9ca3af',
  },
});
