import { View, Text, StyleSheet } from 'react-native'
import getLevelEmoji from './getLevelEmoji';
import getLevelName from './getLevelName';
import {BlurView} from 'expo-blur';

export default function LevelBadge({ totalWords }: { totalWords: number; }) {
    return (
        <BlurView intensity={20} tint="light" style={styles.levelCard1}>
            <View style={styles.levelCard}>
                <Text style={styles.levelEmoji}>{getLevelEmoji(totalWords)}</Text>
                <Text style={styles.levelText}>{getLevelName(totalWords)}</Text>
                <Text style={styles.levelSubtext}>{totalWords} words learned</Text>
            </View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    levelCard: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelCard1: {
        backgroundColor: 'rgba(30, 30, 30, 0.6)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#6C5CE7',
        overflow: 'hidden',
        height: 180
    },
    levelEmoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    levelText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        fontFamily: 'KodchasanSemiBold'
    },
    levelSubtext: {
        fontSize: 14,
        color: '#999',
        fontFamily: 'KodchasanRegular'
  },
})