import React from "react";
import {View,Text,StyleSheet,ActivityIndicator,ScrollView,TouchableOpacity,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WordCard from "../components/WordCard";
import { useWordSession } from "../hooks/useWordSession";

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
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${session.progressPercentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {session.completedWords}/{session.totalWords} words •{" "}
          {session.progressPercentage}%
        </Text>
      </View>

      {/* Word Card */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WordCard
          word={currentWord}
          isViewed={isViewed}
          onBookmark={handleBookmark}
          isBookmarked={bookmarkedIds.includes(currentWord.id)}
        />
      </ScrollView>
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentIndex === 0 ? "#555" : "#fff"}
          />
          <Text
            style={[styles.navText, currentIndex === 0 && styles.navTextDisabled]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <Text style={styles.counterText}>
          {currentIndex + 1} / {words.length}
        </Text>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === words.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentIndex === words.length - 1}
        >
          <Text
            style={[
              styles.navText,
              currentIndex === words.length - 1 && styles.navTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentIndex === words.length - 1 ? "#555" : "#fff"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#2C2C2C",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C5CE7",
    borderRadius: 4,
  },
  progressText: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 100,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#1e1e1e",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#6C5CE7",
    borderRadius: 25,
  },
  navButtonDisabled: {
    backgroundColor: "#2C2C2C",
  },
  navText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 5,
  },
  navTextDisabled: {
    color: "#555",
  },
  counterText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
