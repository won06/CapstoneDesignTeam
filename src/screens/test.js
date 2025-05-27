import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
  Pressable
} from 'react-native';

export default function AssessmentScreen({ navigation }) {
  const [grade, setGrade] = useState('');
  const [jobStatus, setJobStatus] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const gradeOptions = ['1학년', '2학년', '3학년', '4학년'];

  return (
    <View style={styles.container}>
      {/* 로고와 닫기 아이콘 */}
      <View style={styles.header}>
        <Text style={styles.logo}>eoyeongbujeong</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>적성 검사</Text>
      <Text style={styles.description}>정확한 진로 추천을 위해 몇 가지 질문에 답해주세요.</Text>

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
      <Text style={[styles.label, { marginTop: 24 }]}>현재 직업을 가지고 계신가요?</Text>
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
      <TouchableOpacity
        style={[
          styles.nextButton,
          grade ? styles.nextButtonActive : styles.nextButtonDisabled
        ]}
        disabled={!grade}
        onPress={() => {
          if (jobStatus === '있음') {
            navigation.navigate('Job');
          } else {
            navigation.navigate('Test2');
          }
        }}
      >
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#3b82f6' },
  closeIcon: { fontSize: 20, color: '#6b7280' },

  title: { fontSize: 20, fontWeight: 'bold', marginTop: 24 },
  description: { fontSize: 14, color: '#6b7280', marginTop: 4 },

  label: { fontSize: 16, fontWeight: '600', marginTop: 24 },
  subLabel: { fontSize: 12, color: '#6b7280', marginBottom: 8 },

  dropdown: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 8
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    backgroundColor: 'white',
    width: 240,
    borderRadius: 10,
    padding: 16
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },

  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12
  },
  selectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  selectedButton: {
    backgroundColor: '#e0edff',
    borderColor: '#3b82f6'
  },
  selectText: {
    color: '#111827'
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#2563eb'
  },

  nextButton: {
    marginTop: 40,
    borderRadius: 8,
    paddingVertical: 14
  },
  nextButtonDisabled: {
    backgroundColor: '#d1d5db'
  },
  nextButtonActive: {
    backgroundColor: '#3b82f6'
  },
  nextText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  }
});
