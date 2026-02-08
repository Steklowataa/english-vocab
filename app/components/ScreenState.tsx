import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

type ScreenStateProps = {
  text?: string; // jeśli brak → loading
};

export const ScreenState = ({ text }: ScreenStateProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/app-images/background.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      <View style={styles.content}>
        {text ? (
          <Text style={styles.text}>{text}</Text>
        ) : (
          <ActivityIndicator size="large" color="#fff" />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'KodchasanRegular',
  },
});
