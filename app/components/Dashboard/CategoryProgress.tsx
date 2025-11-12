import { View, Text, StyleSheet } from 'react-native'
import {BlurView} from 'expo-blur';

export default function CategoryProgress({ categoryProgress, userData }: { categoryProgress: any; userData: any; }) {
    return (
        <>
        <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            {categoryProgress && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Category Progress</Text>
                    <Text style={styles.categoryName}>{userData?.category}</Text>
                    <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                              styles.progressFill, 
                              { width: `${categoryProgress.percentage}%` }
                            ]} 
                          />
                        </View>
                    <Text style={styles.progressText}>
                    {categoryProgress.wordsLearned}/{categoryProgress.totalWords} words • {categoryProgress.percentage.toFixed(1)}%
                    </Text>
                    </View>
                </View>
            )}
        </BlurView>
        </>
    )
}

const styles = StyleSheet.create({
    blurContainer: {
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        height: 150,
        borderColor: '#6C5CE7',
        borderWidth: 2,
        borderStyle: 'solid',
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 15,
        fontFamily: 'KodchasanSemiBold'
    },
    progressBarContainer: {
        marginBottom: 15,
    },
    progressBar: {
        height: 10,
        backgroundColor: '#e5e0e0ff',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 8,
  },
    progressFill: {
        height: '100%',
        backgroundColor: '#6C5CE7',
        borderRadius: 5,
  },
   progressText: {
        fontSize: 14,
        color: '#b6b1b1ff',
        textAlign: 'center',
        fontFamily: 'KodchasanRegular'
  },
   categoryName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#9488eeff',
        marginBottom: 15,
        fontFamily: 'KodchasanBold'
  },
})