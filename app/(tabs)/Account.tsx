import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { ImageBackground } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

export default function Account() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ Wylogowano pomyślnie");
      router.replace("/");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require('../../assets/app-images/background.png')}
        style={styles.backgroundImage}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Konto</Text>
        
        {/* Przycisk wylogowania */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Wyloguj się</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '140%',
    height: '120%',
    right: 10,
    bottom: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginBottom: 30,
  },
  logoutBtn: {
    backgroundColor: "rgba(255, 75, 75, 0.9)", 
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});