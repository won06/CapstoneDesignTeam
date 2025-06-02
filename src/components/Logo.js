import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function Logo({ style }) {
  return (
    <Text style={[styles.logo, style]}>
      EoyeongBuyeong
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 28,
    color: '#2979ff',
    fontWeight: 'bold',
    fontFamily: 'cursive',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
}); 