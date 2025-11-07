import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WordCard({ word, isViewed, onBookmark, isBookmarked }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      {isViewed && (
        <View style={styles.viewedBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.viewedText}>Viewed</Text>
        </View>
      )}

      {/* Main Card */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={handleFlip}
        activeOpacity={0.9}
      >
        {!isFlipped ? (
          // Front side - English word
          <View style={styles.cardContent}>
            <Text style={styles.label}>Word</Text>
            <Text style={styles.mainText}>{word.word}</Text>
            <Text style={styles.hint}>Tap to see translation</Text>
          </View>
        ) : (
          // Back side - Translation
          <View style={styles.cardContent}>
            <Text style={styles.label}>Translation</Text>
            <Text style={styles.mainText}>{word.translation}</Text>
            
            {/* Bookmark button */}
            <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={() => onBookmark(word.id)}
            >
              <Ionicons 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={isBookmarked ? "#6C5CE7" : "#fff"} 
              />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* Example Sentence Card */}
      <View style={styles.exampleCard}>
        <Text style={styles.exampleLabel}>Example:</Text>
        <Text style={styles.exampleText}>{word.exampleSentence}</Text>
        <Text style={styles.exampleTranslation}>{word.exampleTranslation}</Text>
      </View>

      {/* Interview Question Card (if exists) */}
      {word.interviewQuestion && (
        <View style={styles.interviewCard}>
          <View style={styles.interviewHeader}>
            <Ionicons name="help-circle-outline" size={20} color="#6C5CE7" />
            <Text style={styles.interviewLabel}>Interview Question:</Text>
          </View>
          <Text style={styles.interviewText}>{word.interviewQuestion}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    alignItems: 'center',
    marginVertical: 20,
  },
  viewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  viewedText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontSize: 14,
  },
  card: {
    width: '100%',
    height: 250,
    backgroundColor: '#7C6CE0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.6,
    marginTop: 10,
  },
  bookmarkButton: {
    position: 'absolute',
    top: -10,
    right: 10,
    padding: 10,
  },
  exampleCard: {
    width: '100%',
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
  },
  exampleLabel: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 22,
  },
  exampleTranslation: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  interviewCard: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#6C5CE7',
  },
  interviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  interviewLabel: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
    marginLeft: 8,
  },
  interviewText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
});