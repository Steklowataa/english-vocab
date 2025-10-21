import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';

export default function CategoryButton({ title, onPress, color, icon, textStyle }: {title: string, onPress: () => void, color: string, icon?: any, textStyle?: any}) {
   const [fontsLoading] = useFonts({
          "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
      })
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.button, { backgroundColor: color }]}>
            {icon && <Image source={icon} style={styles.icon}/>}
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    width: 160,
    height: 50,
    margin: 8,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'KodchasanRegular',
    paddingRight: 20
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
});