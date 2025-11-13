import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {BlurView} from "expo-blur"


export default function QuiclAction({ router }: { router: any }) {
    return (
        <View style={styles.actionsContainer}>
          <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
             <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/Dictionary')}>
              <Ionicons name="bookmarks" size={24} color="#6C5CE7" />
              <Text style={styles.actionButtonText}>My Dictionary</Text>
              <Ionicons name="chevron-forward" size={20} color="#b3b2b2ff" />
            </TouchableOpacity>
          </BlurView>
        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
           <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/EditSettings')}>
              <Ionicons name="settings" size={24} color="#6C5CE7" />
              <Text style={styles.actionButtonText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#b3b2b2ff" />
            </TouchableOpacity>
        </BlurView>
        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/Profile')}>
              <Ionicons name="person" size={24} color="#6C5CE7" />
              <Text style={styles.actionButtonText}>Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#b3b2b2ff" />
            </TouchableOpacity>
        </BlurView>
      </View>
    )
}

const styles = StyleSheet.create({
    actionsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffffff',
    marginLeft: 15,
    fontFamily: "KodchasanSemiBold"
  },
  blurContainer: {
    backgroundColor: "rgba(30, 30, 30, 0.5)",
    overflow: "hidden",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
})
