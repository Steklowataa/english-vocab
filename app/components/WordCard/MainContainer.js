import {Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';


export default function MainContainer({onBookmark, isBookmarked, word, isFlipped, setIsFlipped}) {
    return (
        <BlurView intensity={20} style={styles.cardBlur} tint="light">
            <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => onBookmark(word.id)}>
                <Ionicons
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color={isBookmarked ? "#6C5CE7" : "#fff"}/>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => setIsFlipped(!isFlipped)}
            activeOpacity={0.9}
            style={styles.cardContent}>
                <Text style={styles.label}>{word.translation}</Text>
                <Text style={styles.mainText}>{word.word}</Text>
            </TouchableOpacity>
      </BlurView>
    )
}

const styles = StyleSheet.create({
    cardBlur: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
    width: 300,
    height: 160,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  label: {
    fontFamily: "KodchasanRegular",
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainText: {
    fontFamily: "KodchasanBold",
    fontSize: 32,
    color: "#4F46E5",
    textAlign: 'center',
  },
})