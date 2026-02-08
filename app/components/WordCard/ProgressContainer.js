import {View, Text, StyleSheet} from 'react-native'


export default function ProgressContainer({session, currentIndex, variant}) {
    const total = session?.totalWords || 0;
    let completed = currentIndex !== undefined ? (currentIndex + 1) : (session?.completedWords || 0);

    if (session?.isCompleted) {
        completed = total;
    }

    if (total === 0) {
        completed = 0;
    } else if (completed > total) {
        completed = total;
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <View style={[styles.progressContainer, variant === 'dashboard' && { paddingTop: 10 }]}>
            <View style={styles.progressBar}>
                <View style={[ styles.progressFill, { width: `${percentage}%` },]}/>
            </View>
            <Text style={styles.progressText}>{completed}/{total} words •{" "}{percentage}%</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    progressContainer: {
    paddingHorizontal: 38,
    paddingTop: 58,
    paddingBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#9892FF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C5CE7",
    borderRadius: 4,
  },
  progressText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
    fontFamily: "KodchasanBold",
  },
})
