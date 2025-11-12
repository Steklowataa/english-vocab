import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

export default function TodaysProgress({ router, todayProgress }: { router: any; todayProgress: any }) {
  return (
    <BlurView intensity={20} tint="light" style={styles.blurContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today`s Progress</Text>

        {todayProgress ? (
          <>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${todayProgress.progressPercentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {todayProgress.completedWords}/{todayProgress.totalWords} words •{' '}
                {todayProgress.progressPercentage}%
              </Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push('/(tabs)/WordCard')}
            >
              <Text style={styles.continueButtonText}>
                {todayProgress.completedWords === 0
                  ? 'Start Learning'
                  : 'Continue Learning'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.noProgressText}>No session started today</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push('/(tabs)/WordCard')}
            >
              <Text style={styles.continueButtonText}>Start Today`s Session</Text>
              <Ionicons name="play" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderRadius: 20,
    padding: 20,
        borderColor: '#6C5CE7',
    borderWidth: 2,
    borderStyle: 'solid',
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
  },
  progressText: {
    fontSize: 14,
    color: '#b6b1b1ff',
    textAlign: 'center',
    fontFamily: 'KodchasanRegular'
  },
  continueButton: {
    backgroundColor: '#5d4be2ff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    fontFamily: 'KodchasanSemiBold'
  },
  noProgressText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'KodchasanRegular'
  },
})
