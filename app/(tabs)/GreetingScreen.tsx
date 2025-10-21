import { View, Text, StyleSheet, ImageBackground, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, SafeAreaView, Platform} from "react-native";
import { useState, useEffect } from "react";
import { useFonts } from 'expo-font';
import CategoryScreen from "./CategoryScreen";
import { useRouter } from "expo-router";
import {auth, db} from "../../firebaseConfig"
import { doc, getDoc} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";



export default function GreetingScreen() {
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
        "KodchasanSemiBold": require("../../assets/fonts/Kodchasan-SemiBold.ttf"),
    })
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if(userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setName(userData.name || "User");
                    } else {
                        console.log("User document does not exist")
                        setName("User");
                    }
                } catch( error) {
                    console.log(error)
                    setName("User");
                }
            } else {
                setName('')
                router.push("/(tabs)/LoginScreen")
            }
            setLoading(false);
    })
    return unsubscribe;
}, [])
    
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.innerContainer}>
          <ImageBackground   
            source={require('../../assets/app-images/background.png')}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
          <View style={styles.centerContent}>
            <Text style={styles.text}>Witam, {name}!</Text>
            <Text style={styles.textHeader2}>Z jakich kategorii</Text>
            <Text style={styles.textHeader2}>chcesz zacząć?</Text>
            <CategoryScreen />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1 },
  backgroundImage: {
    position: 'absolute',
    width: '150%',
    height: '140%',
    right: 0,
    bottom: 0,
  },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: {
    color: "#fff",
    fontSize: 32,
    marginBottom: 15,
    fontFamily: "KodchasanSemiBold"
  },
  textHeader2: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "KodchasanRegular"
  }
})
