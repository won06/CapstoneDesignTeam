import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import { FontAwesome, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Logo from '../components/Logo';

export default function App({ navigation }) {
  return (
    <View style={styles.container}>
      {/* 로고 */}
      <Logo style={{ marginBottom: 32 }} />

      {/* 로그인 폼 */}
      <Text style={styles.loginTitle}>로그인</Text>
      <Text style={styles.loginDesc}>계정에 로그인하여 시작하세요</Text>

      {/* 이메일 입력 */}
      <View style={styles.inputBox}>
        <Feather name="mail" size={20} color="#bdbdbd" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="이메일 주소"
          placeholderTextColor="#bdbdbd"
          keyboardType="email-address"
        />
      </View>

      {/* 비밀번호 입력 */}
      <View style={styles.inputBox}>
        <Feather name="lock" size={20} color="#bdbdbd" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#bdbdbd"
          secureTextEntry
        />
      </View>

      {/* 비밀번호 찾기 */}
      <TouchableOpacity style={styles.forgotBtn}>
        <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
      </TouchableOpacity>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Test')}
      >
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>계정이 없으신가요?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
           <Text style={styles.signupLink}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontFamily: 'cursive',
    fontSize: 32,
    color: '#2979ff',
    marginBottom: 32,
    fontWeight: 'bold',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 4,
    color: '#222',
  },
  loginDesc: {
    fontSize: 14,
    color: '#888',
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    width: '100%',
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  inputIcon: {
    marginRight: 8,
  },
  inputIconRight: {
    marginLeft: 8,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: '#2979ff',
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#2979ff',
    borderRadius: 8,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#bdbdbd',
    fontSize: 13,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    width: '100%',
    height: 48,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  socialIcon: {
    marginRight: 12,
  },
  socialText: {
    fontSize: 15,
    color: '#222',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  signupText: {
    color: '#888',
    fontSize: 14,
  },
  signupLink: {
    color: '#2979ff',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: 'bold',
  },
});