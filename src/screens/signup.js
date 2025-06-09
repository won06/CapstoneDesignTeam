import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Logo from '../components/Logo';
import DropDownPicker from 'react-native-dropdown-picker';

function showAlert(title, message, onOk) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
    if (onOk) onOk();
  } else {
    Alert.alert(
      title,
      message,
      [
        {
          text: '확인',
          onPress: onOk,
        },
      ],
      { cancelable: false }
    );
  }
}

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gradeOpen, setGradeOpen] = useState(false);
  const [grade, setGrade] = useState('');
  const [gradeItems, setGradeItems] = useState([
    { label: '1학년', value: '1' },
    { label: '2학년', value: '2' },
    { label: '3학년', value: '3' },
    { label: '4학년', value: '4' },
  ]);
  const [department, setDepartment] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password || !grade) {
      showAlert('입력 오류', '이름, 이메일, 학년, 비밀번호를 모두 입력하세요.');
      return;
    }
    try {
      // 회원가입 요청
      const registerRes = await fetch('http://192.168.45.78:3001/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: email,
          password,
          name,
          grade: Number(grade),
          department: department || null
        })
      });
      const registerData = await registerRes.json();
      if (registerRes.ok) {
        // 회원가입 성공 시, 완료 안내 후 로그인 화면 이동
        showAlert(
          '회원가입 완료',
          '회원가입이 성공적으로 완료되었습니다!',
          () => navigation.navigate('Login')
        );
      } else {
        showAlert('회원가입 실패', registerData.message);
      }
    } catch (err) {
      showAlert('에러 발생', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Logo style={{ marginBottom: 32 }} />
      <Text style={styles.title}>계정 만들기</Text>
      <Text style={styles.subtitle}>개인정보를 입력해주세요</Text>

      <TextInput
        placeholder="이름"
        value={name}
        onChangeText={setName}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      <TextInput
        placeholder="학번"
        value={studentId}
        onChangeText={setStudentId}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      <TextInput
        placeholder="이메일 주소"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      {/* 학년 입력란 (커스텀 드롭다운) */}
      <DropDownPicker
        open={gradeOpen}
        value={grade}
        items={gradeItems}
        setOpen={setGradeOpen}
        setValue={setGrade}
        setItems={setGradeItems}
        placeholder="학년 선택"
        style={{
          borderColor: '#d1d5db',
          borderRadius: 8,
          marginBottom: 12,
          height: 48,
        }}
        textStyle={{ fontSize: 16 }}
        dropDownContainerStyle={{ borderColor: '#d1d5db', borderRadius: 8 }}
      />
      <TextInput
        placeholder="학과 (선택)"
        value={department}
        onChangeText={setDepartment}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 32,
    color: '#3b82f6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#3b82f6',
    fontWeight: '500',
    marginLeft: 6,
  },
});
