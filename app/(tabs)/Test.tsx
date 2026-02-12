import React, { useEffect } from "react";
import { ImageBackground, SafeAreaView, Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useQuiz } from "../hooks/useQuiz";
import { QuizOption } from "../components/QuizOption";
import { ScreenState } from "../components/ScreenState";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";


export default function TestScreen() {
  const {
    loading,
    error,
    quiz,
    currentQuestion,
    selectedAnswer,
    answer,
    next,
    isFinished,
  } = useQuiz();

  const router = useRouter();

  useEffect(() => {
    if (isFinished) {
      Alert.alert("Congratulations!", "You've completed today's session.", [
        { text: "OK", onPress: () => router.push('/Dashboard') }
      ]);
    }
  }, [isFinished, router]);

  if (loading) return <ScreenState />;
  if (error) return <ScreenState text={error} />;
  if (!currentQuestion) return <ScreenState text="No quiz available." />;

  const isAnswered = !!selectedAnswer;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/app-images/background.png")}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Dashboard')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <QuizOption
              key={index}
              text={option}
              disabled={isAnswered}
              isCorrect={option === currentQuestion.correctAnswer}
              isSelected={option === selectedAnswer}
              onPress={() => answer(option)}
            />
          ))}
        </View>

        {isAnswered && (
          <TouchableOpacity style={styles.nextButton} onPress={next}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(147, 141, 240, 0.5)',
    borderRadius: 29,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '170%',
    height: '100%',
    right: -90, 
    top: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: "KodchasanBold",
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: "KodchasanRegular",
    zIndex: 2
  },
  correctAnswer: {
    backgroundColor: '#28a745', // green
  },
  incorrectAnswer: {
    backgroundColor: '#dc3545', // red
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#6C5CE7',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: "KodchasanSemiBold",
  },
});
