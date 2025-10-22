import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

export default function Button({ title, onPress, style, textStyle }) {
   const [fontsLoading] = useFonts({
          "KodchasanBold": require("../../assets/fonts/Kodchasan-Bold.ttf"),
      })
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={["#5b3df0", "#9500FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, style]} 
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: "center",
    width: 140,
    height: 50,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: "KodchasanBold",
  },
});
