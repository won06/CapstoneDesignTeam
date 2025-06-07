import { Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
// 또는 Jua, NanumSquareRound 등

export default function Logo({ style }) {
  const [fontsLoaded] = useFonts({
    OwnglyphDahyun: require('../screens/assets/fonts/OwnglyphDahyun.ttf'),
  });
  if (!fontsLoaded) return null;

  return (
    <Text style={[styles.logo, style, { fontFamily: 'OwnglyphDahyun' }]}>
      어영부영
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 50,
    color: '#2980ff',
    fontWeight: 'bold',
    letterSpacing: 2.5,
    textAlign: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    overflow: 'hidden',
  },
});