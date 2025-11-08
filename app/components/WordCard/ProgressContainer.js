import {View, Text, StyleSheet} from 'react-native'


export default function ProgressContainer({session}) {
    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
                <View style={[ styles.progressFill, { width: `${session.progressPercentage}%` },]}/>
            </View>
            <Text style={styles.progressText}>{session.completedWords}/{session.totalWords} words •{" "}{session.progressPercentage}%</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    progressContainer: {
    paddingHorizontal: 38,
    paddingTop: 38,
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