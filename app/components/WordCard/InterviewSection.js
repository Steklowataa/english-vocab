import { useInterviewCardAnimation } from '../../hooks/useInterviewCardAnimation';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';


const InterviewSection = ({ word }) => {
  const { animatedInterviewY, panResponder } = useInterviewCardAnimation();
  return (
    <Animated.View style={[styles.interviewContainer, { top: animatedInterviewY }]}>
      <BlurView intensity={25} tint="dark" style={styles.blurContainer}>
        <View style={styles.grabberWrapper} {...panResponder.panHandlers}>
          <View style={styles.grabber} />
        </View>

        <View style={styles.interviewCard}>
          <View style={styles.interviewHeader}>
            <Ionicons name="help-circle-outline" size={20} color="#6C5CE7" style={{ marginLeft: 12 }} />
            <Text style={styles.interviewLabel}>Interview Question:</Text>
          </View>
          <Text style={styles.interviewText}>{word.interview_question}</Text>

          <View style={styles.whyImportant}>
            <Ionicons name="alert-circle-outline" size={20} color="#6C5CE7" style={{ marginLeft: 12 }} />
            <Text style={styles.interviewLabel}>Why important:</Text>
          </View>
          <Text style={styles.interviewText}>{word.why_important}</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
    interviewContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 340,
    borderRadius: 40
  },
  grabberWrapper: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grabber: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  interviewCard: {
    padding: 10,
    height: 300,
  },
  interviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  interviewLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: "KodchasanBold",
    marginLeft: 5
  },
  interviewText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: "KodchasanRegular",
    marginLeft: 20
  },
  whyImportant: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 10,
  },
  blurContainer: {
    color: 'rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    borderRadius: 40,
  }
})

export default InterviewSection;