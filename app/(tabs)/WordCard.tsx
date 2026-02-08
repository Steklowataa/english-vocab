import React from "react";
import {View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, SafeAreaView} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WordCard from "../components/WordCard";
import { useWordSession } from "../hooks/useWordSession";
import { ImageBackground } from "expo-image";
import { useFonts } from "expo-font";
import ProgressContainer from "../components/WordCard/ProgressContainer"
import ButtonNavigation from "../components/WordCard/ButtonNavigation"
import { useRouter } from "expo-router"
import Button from "../components/Button"

export default function WordCardScreen() {
  const router = useRouter();
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

  if (session.completedWords === session.totalWords && session.totalWords > 0) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/app-images/backgroundWordCard.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.centeredContent}>
          <Text style={styles.completionTitle}>Great job!</Text>
          <Text style={styles.completionText}>You`ve completed your words for today.</Text>
          <Text style={styles.completionText}>Ready to test your knowledge?</Text>
          <Button
            title="Start Test"
            onPress={() => router.push('/Test')}
            style={styles.testButton}
            textStyle="KodchasanSemiBold"
          />
        </View>
      </View>
    );
  }

  const currentWord = words[currentIndex];
  const isViewed = session.viewedWordIds.includes(currentWord.id);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/app-images/backgroundWordCard.png")}
        style={styles.backgroundImage}
      />
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Dashboard')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {/* pasek */}
      <ProgressContainer session={session} currentIndex={currentIndex}/>

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
          {currentIndex === words.length - 1 ? (
        <View style={styles.testButtonContainer}>
          <Button
            title="Go to test"
            onPress={() => {
              handleNext();
              router.push('/Test');
            }}
            textStyle={{fontFamily: "KodchasanSemiBold", fontSize: 16}}
            style={styles.testButton}
          />
        </View>
      ) : (
        <ButtonNavigation
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          currentIndex={currentIndex}
          words={words}
        />
      )}
      </ScrollView>

      {currentWord.interview_question && (
        <WordCard
          word={currentWord}
          isViewed={isViewed}
          onBookmark={handleBookmark}
          isBookmarked={bookmarkedIds.includes(currentWord.id)}
          onlyInterviewSection={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // 👈 shadow intensity
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 29,
  },
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
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 32,
    fontFamily: "KodchasanBold",
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  completionText: {
    fontSize: 18,
    fontFamily: "KodchasanRegular",
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  testButton: {
  },
  testButtonContainer: {
    position: "relative"

  },
});

