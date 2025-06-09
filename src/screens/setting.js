import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

// API URL 설정
const API_URL = 'http://192.168.45.78:3001/api';

export default function SettingScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const goToLogin = useCallback(() => {
    console.log('로그인 화면으로 이동 시도...');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
          },
        ],
      })
    );
  }, [navigation]);

  const handleWithdraw = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setModalVisible(false);

    try {
      console.log('회원 탈퇴 처리 시작...');
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert('오류', '로그인 정보가 없습니다.');
        return;
      }

      console.log('회원 탈퇴 API 호출...');
      const userResponse = await fetch(`${API_URL}/user/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id })
      });

      if (!userResponse.ok) {
        throw new Error('회원 탈퇴 처리 중 오류가 발생했습니다.');
      }

      console.log('로컬 데이터 삭제 중...');
      await AsyncStorage.clear();
      console.log('로컬 데이터 삭제 완료');

      goToLogin();

      setTimeout(() => {
        Alert.alert(
          '탈퇴 완료',
          '회원 탈퇴가 완료되었습니다.',
          [{ text: '확인' }],
          { cancelable: false }
        );
      }, 100);

    } catch (err) {
      console.error('회원 탈퇴 중 오류:', err);
      Alert.alert('오류', err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, goToLogin]);

  const handleCancel = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await AsyncStorage.clear();
    goToLogin();
  }, [goToLogin]);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={{ width: 28 }}><Text> </Text></View>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Test')}>
          <Ionicons name="search" size={22} color="#2979ff" style={styles.menuIcon} />
          <Text style={styles.menuText}>직업재검색</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.menuArrow} />
        </TouchableOpacity>
        <View style={styles.separator}><Text> </Text></View>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color="#ef4444" style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: '#ef4444' }]}>로그아웃</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.menuArrow} />
        </TouchableOpacity>
        <View style={styles.separator}><Text> </Text></View>

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

      {/* 탈퇴 확인 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>정말로 탈퇴하시겠습니까?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#ef4444' }]} 
                onPress={handleConfirm}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>예</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]} 
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text style={[styles.modalButtonText, { color: '#222' }]}>아니요</Text>
              </TouchableOpacity>
            </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  menuList: {
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  menuArrow: {
    marginLeft: 'auto',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
