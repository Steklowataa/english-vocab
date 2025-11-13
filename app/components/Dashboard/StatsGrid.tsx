import {View, Text, StyleSheet} from 'react-native'
import { BlurView} from 'expo-blur'

export default function Statsgrid({ userData }: { userData: any }) {
    return (
        <>
            <View style={styles.statsGrid}>
                <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                    <Text style={styles.statIcon}>🔥</Text>
                    <Text style={styles.statValue}>{userData?.currentStreak || 0}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </BlurView>
                <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                    <Text style={styles.statIcon}>📚</Text>
                    <Text style={styles.statValue}>{userData?.wordsPerDay || 0}</Text>
                    <Text style={styles.statLabel}>Words/Day</Text>
                </BlurView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
  blurContainer: {
    backgroundColor: "rgba(246, 115, 33, 0.1)",
    overflow: "hidden",
    borderRadius: 20,
    flex: 1,
    padding: 20,
    alignItems: 'center',
    borderColor: "rgba(246, 115, 33, 1)",
    borderWidth: 2,

  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#d4cfcfff',
  },
})