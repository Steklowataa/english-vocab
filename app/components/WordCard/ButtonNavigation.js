import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {BlurView} from 'expo-blur';


export default function ButtonNavigation({ currentIndex, words, handlePrevious, handleNext }) {
    return (
        <View style={styles.navigation}>
            <TouchableOpacity 
                style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}>
                <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#8E8D8D" : "#fff"} />
                <Text style={[styles.navText, currentIndex === 0 && styles.navTextDisabled]}>Previous</Text>
            </TouchableOpacity>

            <BlurView intensity={25} tint="light" style={styles.blurContainer}>
                <TouchableOpacity 
                    style={[styles.navButton, currentIndex === words.length - 1 && styles.navButtonDisabled]}
                    onPress={handleNext}
                    disabled={currentIndex === words.length - 1}>
                    <Text style={[styles.navText, currentIndex === words.length - 1 && styles.navTextDisabled]}>Next</Text>
                    <Ionicons name="chevron-forward" size={24} color={currentIndex === words.length - 1 ? "#8E8D8D" : "#fff"} />
                </TouchableOpacity>
            </BlurView>
        </View>
    )
}

const styles = StyleSheet.create({
    navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: 'rgba(152, 146, 255, 0.6)',
    borderColor: "rgba(152, 146, 255, 1)",
    borderWidth: 2,
    borderStyle: "solid"
  },
  
  navButtonDisabled: {
    backgroundColor: "#2C2C2C",
  },
  navText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 5,
  },
  navTextDisabled: {
    color: "#8E8D8D",
  },
    navigation: {
    position: "absolute",
    bottom: 160,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
    paddingVertical: 5,
  },
    counterText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
})