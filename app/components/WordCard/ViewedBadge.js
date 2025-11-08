import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function ViewedBadge({ isViewed }) {
    return (
        <View style={styles.viewedBadgeContainer}>
            <View style={[styles.viewedBadge, { opacity: isViewed ? 1 : 0 }]}>
                <Ionicons name="checkmark-circle" size={20} color="#9892FF" />
                <Text style={styles.viewedText}>Viewed</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewedBadgeContainer: {
    top: 5,
    right: -100,
  },
  viewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  viewedText: {
    color: '#9892FF',
    marginLeft: 5,
    fontSize: 14,
  },
})