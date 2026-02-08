import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type QuizOptionProps = {
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
  disabled: boolean;
  onPress: () => void;
};

export const QuizOption: React.FC<QuizOptionProps> = ({
  text,
  isCorrect,
  isSelected,
  disabled,
  onPress,
}) => {
  const getStyle = () => {
    if (!isSelected && !disabled) return styles.optionButton;
    if (isCorrect) return [styles.optionButton, styles.correctAnswer];
    if (isSelected && !isCorrect) return [styles.optionButton, styles.incorrectAnswer];
    return styles.optionButton;
  };

  return (
    <TouchableOpacity style={getStyle()} onPress={onPress} disabled={disabled}>
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  },
  correctAnswer: {
    backgroundColor: '#28a745',
  },
  incorrectAnswer: {
    backgroundColor: '#dc3545',
  },
});
