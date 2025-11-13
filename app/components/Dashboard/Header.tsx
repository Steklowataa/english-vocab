import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function Header({ router, userData }: { router: any; userData: any; }) {
    return (
        <View style={styles.header}>
          <View>
            {/* <Text style={styles.greeting}>Witam,</Text> */}
            <Text style={styles.userName}>{userData?.name || 'Learner'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/Settings')}>
          <Ionicons name="person-circle-outline" size={40} color="#6C5CE7" />
          </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
  },
    greeting: {
        fontSize: 18,
        color: '#999',
        fontFamily: "KodchasanRegular"
  },
    userName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: "KodchasanSemiBold"
  },
    profileButton: {
        padding: 5,
  },
})
