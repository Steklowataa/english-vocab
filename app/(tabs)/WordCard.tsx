import React from "react";
import {View, Text, StyleSheet, ActivityIndicator, ScrollView} from "react-native";
import WordCard from "../components/WordCard";
import { useWordSession } from "../hooks/useWordSession";
import { ImageBackground } from "expo-image";
import { useFonts } from "expo-font";
import ProgressContainer from "../components/WordCard/ProgressContainer"
import ButtonNavigation from "../components/WordCard/ButtonNavigation"

export default function WordCardScreen() {
  const {
    loading,
    session,
    words,
    currentIndex,
    bookmarkedIds,
    scrollViewRef,
    handleNext,
    handlePrevious,
    handleBookmark,
  } = useWordSession();

  const [fontsLoading] = useFonts({
    "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
    "KodchasanBold": require("../../assets/fonts/Kodchasan-Bold.ttf"),
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.loadingText}>Loading your words...</Text>
      </View>
    );
  }

  if (!session || words.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No words available</Text>
      </View>
    );
  }

  const currentWord = words[currentIndex];
  const isViewed = session.viewedWordIds.includes(currentWord.id);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/app-images/backgroundWordCard.png")}
        style={styles.backgroundImage}
      />
      {/* pasek */}
      <ProgressContainer session={session}/>

      {/* main paart */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <WordCard
          word={currentWord}
          isViewed={isViewed}
          onBookmark={handleBookmark}
          isBookmarked={bookmarkedIds.includes(currentWord.id)}/>
      </ScrollView>
      
      {/* przyciski */}
      <ButtonNavigation 
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        currentIndex={currentIndex}
        words={words}/>

      {currentWord.interview_question && (
        <WordCard
          word={currentWord}
          isViewed={isViewed}
          onBookmark={handleBookmark}
          isBookmarked={bookmarkedIds.includes(currentWord.id)}
          onlyInterviewSection={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    color: "black",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 18,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 220
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

});

