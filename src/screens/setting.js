import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL 수정
const API_URL = 'http://192.168.45.78:3001';

export default function SettingScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = () => {
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    if (isLoading) return; // 중복 실행 방지
    setIsLoading(true);
    setModalVisible(false);

    try {
      const user_id = await AsyncStorage.getItem('user_id');
      console.log('[회원 탈퇴] 시작 - user_id:', user_id);
      
      if (!user_id) {
        Alert.alert('오류', '로그인 정보가 없습니다.');
        return;
      }

      // 1. 먼저 추천 데이터 삭제
      console.log('[회원 탈퇴] 추천 데이터 삭제 시도');
      const recommendResponse = await fetch(`${API_URL}/recommend/delete`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ user_id })
      });
      console.log('[회원 탈퇴] 추천 데이터 삭제 응답:', recommendResponse.status);

      if (!recommendResponse.ok) {
        const errorData = await recommendResponse.json().catch(() => ({}));
        console.log('[회원 탈퇴] 추천 데이터 삭제 실패:', errorData);
        throw new Error(errorData.message || '추천 데이터 삭제 중 오류가 발생했습니다.');
      }

      // 2. 사용자 데이터 삭제
      console.log('[회원 탈퇴] 사용자 데이터 삭제 시도');
      const userResponse = await fetch(`${API_URL}/api/user/delete`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ user_id })
      });

      console.log('[회원 탈퇴] 사용자 데이터 삭제 응답:', userResponse.status);
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        console.log('[회원 탈퇴] 에러 데이터:', errorData);
        throw new Error(errorData.message || '회원 탈퇴 처리 중 오류가 발생했습니다.');
      }

      const data = await userResponse.json();
      console.log('[회원 탈퇴] 성공 응답:', data);

      // 3. 로컬 데이터 삭제
      console.log('[회원 탈퇴] 로컬 데이터 삭제 시도');
      await AsyncStorage.clear();
      console.log('[회원 탈퇴] 로컬 데이터 삭제 완료');

      // 4. 로그인 화면으로 이동
      Alert.alert(
        '탈퇴 완료',
        '회원 탈퇴가 완료되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              console.log('[회원 탈퇴] 로그인 화면으로 이동');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.error('[회원 탈퇴] 오류 발생:', err);
      Alert.alert(
        '오류',
        err.message || '네트워크 오류 또는 서버 오류가 발생했습니다.',
        [{ text: '확인' }],
        { cancelable: false }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={{ width: 28 }} /> {/* 오른쪽 여백용 */}
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Test')}>
          <Ionicons name="search" size={22} color="#2979ff" style={styles.menuIcon} />
          <Text style={styles.menuText}>직업재검색</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.menuArrow} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Login')}>
          <MaterialIcons name="logout" size={22} color="#ef4444" style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: '#ef4444' }]}>로그아웃</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.menuArrow} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={handleWithdraw}
          disabled={isLoading}
        >
          <Ionicons name="person-remove-outline" size={22} color="#888" style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: '#888' }]}>탈퇴</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.menuArrow} />
        </TouchableOpacity>
      </View>

      {/* 커스텀 모달 */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>정말로 탈퇴하시겠습니까?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleConfirm}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>예</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text style={[styles.modalButtonText, { color: '#222' }]}>아니요</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  menuList: {
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: '#fff',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
    color: '#222',
  },
  menuArrow: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 62,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  modalButton: {
    backgroundColor: '#2979ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginHorizontal: 8,
  },
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
