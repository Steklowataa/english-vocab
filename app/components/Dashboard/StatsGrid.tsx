import {View, Text, StyleSheet} from 'react-native'

export default function Statsgrid({ userData }: { userData: any }) {
    return (
        <>
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>🔥</Text>
                    <Text style={styles.statValue}>{userData?.currentStreak || 0}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
            
                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>📚</Text>
                    <Text style={styles.statValue}>{userData?.wordsPerDay || 0}</Text>
                    <Text style={styles.statLabel}>Words/Day</Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e1e1e',
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
    color: '#999',
  },
})