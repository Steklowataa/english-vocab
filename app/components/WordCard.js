import React, { useState } from 'react';
import { View, StyleSheet, Dimensions,  } from 'react-native';
import { useFonts } from 'expo-font';
import InterviewSection from './WordCard/InterviewSection.js';
import { useFlipAnimation } from './WordCard/useFlipAnimation.js';
import ViewedBadge from './WordCard/ViewedBadge.js';
import MainContainer from './WordCard/MainContainer.js';
import ExampleCard from './WordCard/ExampleCard.js';

const { width } = Dimensions.get('window');

export default function WordCard({ word, isViewed, onBookmark, isBookmarked, onlyInterviewSection = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { 
    isFlipped: isExampleFlipped, 
    setIsFlipped: setIsExampleFlipped, 
    frontAnimatedStyle, 
    backAnimatedStyle 
  } = useFlipAnimation();

  const [fontsLoading] = useFonts({
    "KodchasanBold": require("../../assets/fonts/Kodchasan-SemiBold.ttf"),
    "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
  });

  if (onlyInterviewSection) {
    return <InterviewSection word={word} />;
  }

  return (
    <View style={styles.container}>
      <InterviewSection word={word} />
      <ViewedBadge isViewed={isViewed} />

      {/* Main word card */}
      <MainContainer
        onBookmark={onBookmark}
        isBookmarked={isBookmarked}
        word={word}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />

      {/* Example card */}
      <ExampleCard
        word={word}
        setIsExampleFlipped={setIsExampleFlipped}
        isExampleFlipped={isExampleFlipped}
        frontAnimatedStyle={frontAnimatedStyle}
        backAnimatedStyle={backAnimatedStyle}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
});
