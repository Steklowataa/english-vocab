import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function ExampleCard({ word, setIsExampleFlipped, isExampleFlipped, frontAnimatedStyle, backAnimatedStyle }) {
  return (
    <TouchableOpacity
      onPress={() => setIsExampleFlipped(!isExampleFlipped)}
      activeOpacity={0.8}
    >
      <View style={styles.exampleCardContainer}>
        <Reanimated.View style={[styles.exampleCard, styles.cardFace, frontAnimatedStyle]}>
          <Ionicons name="arrow-redo-outline" size={24} color="#D9D9D9" style={[styles.arrowIcon, styles.arrowRight]} />
          <Text style={styles.exampleLabel}>Example:</Text>
          <Text style={styles.exampleText}>{word.example_sentence}</Text>
          <Text style={styles.hint}>Tap to see translation</Text>
        </Reanimated.View>
        <Reanimated.View style={[styles.exampleCard, styles.cardFace, backAnimatedStyle]}>
          <Ionicons name="arrow-undo-outline" size={24} color="#D9D9D9" style={[styles.arrowIcon, styles.arrowRight]} />
          <Text style={styles.exampleLabel}>Translation:</Text>
          <Text style={styles.exampleText}>{word.example_translation}</Text>
        </Reanimated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  exampleCardContainer: {
    width: 300,
    height: 180,
    marginTop: 15,
  },
  exampleCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
  },
  cardFace: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  exampleLabel: {
    fontSize: 16,
    color: '#9892FF',
    marginBottom: 8,
    fontFamily: "KodchasanSemiBold",
  },
  exampleText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: "KodchasanRegular",
  },
  hint: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.6,
    marginTop: 10,
  },
  arrowIcon: {
    position: 'absolute',
    top: 15,
  },
  arrowRight: {
    right: 15,
  },
  arrowLeft: {
    left: 15,
  },
});
