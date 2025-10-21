import { KeyboardAvoidingView, Text, TextInput, View, Button, StyleSheet, ActivityIndicator, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig"
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "expo-router";
import signUp from "../components/signUp";
import signIn from "../components/signIn";
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font'
import {DEV_MODE, DEV_EMAIL, DEV_PASSWORD, DEFAULT_PASSWORD} from "../components/loginData"


export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(DEV_MODE ? DEV_EMAIL : "");
  const [password, setPassword] = useState(DEV_MODE ? DEV_PASSWORD : "");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
    const [fontsLoaded] = useFonts({
        'KodchasanMedium': require('../../assets/fonts/Kodchasan-Bold.ttf'),
        'KodchasanRegular': require('../../assets/fonts/Kodchasan-Regular.ttf'),
        "LaoSansPro": require('../../assets/fonts/LaoSansPro-Regular.ttf')
    })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);


  const handleSignUp = async () => {
    await signUp({ 
      setLoading, 
      setName, 
      setEmail, 
      router, 
      name, 
      email,
      password: DEFAULT_PASSWORD
    });
  };

  const handleSignIn = async () => {
    await signIn({ 
      setLoading, 
      setEmail, 
      setPassword, 
      router, 
      email, 
      password: password || DEFAULT_PASSWORD
    });
  }

  const switchToSignUp = () => {
    setIsSignUp(true);
    setName("");
    setEmail("");
    setPassword("");
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <View style={style.container}>
      <ImageBackground 
        source={require("../../assets/app-images/background.png")} 
        style={style.bgImg}
      />
      <ScrollView contentContainerStyle={style.scrollContent}>
        <KeyboardAvoidingView behavior="padding" style={style.keyboardAvoidingView}>
          <View style={style.contentWrapper}>
            <Text style={style.title}>
              {isSignUp ? "Utwórz konto" : "Welcome Back"}
            </Text>

            {isSignUp && (
            <BlurView intensity={20} tint="light" style={style.inputBox}>
                <TextInput
                    style={style.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Full name"
                    placeholderTextColor="rgba(255,255,255,0.6)"/>
            </BlurView>
            )}
            <BlurView intensity={20} tint="light" style={style.inputBox}>
                <TextInput 
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    style={style.input}/>
            </BlurView>

            {!isSignUp && (
                <BlurView intensity={20} tint="light" style={style.inputBox}>
                    <TextInput 
                        style={style.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Hasło"
                        secureTextEntry={true}
                        placeholderTextColor="rgba(255,255,255,0.6)"/>
                </BlurView>
            )}

            {isSignUp && (
              <Text style={style.passwordNote}>
                Hasło zostanie ustawione na domyślne. Możesz je później zmienić.
              </Text>
            )}

            {loading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <View style={style.buttonContainer}>
                <TouchableOpacity style={style.btn} onPress={isSignUp ? handleSignUp : handleSignIn}>
                    <Text style={style.btnText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
                </TouchableOpacity>

                {!isSignUp ? (
                  <TouchableOpacity onPress={switchToSignUp}>
                    <Text style={style.switchText}>Nie masz konta? Zarejestruj się</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={switchToSignIn}>
                    <Text style={style.switchText}>Masz już konto? Zaloguj się</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
    inputBox: {
        borderRadius: 12,
        overflow: 'hidden',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(217, 217, 217, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        width: 250,
        height: 50,
        justifyContent: 'center',
        marginBottom: 10,
  },
  container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
  },
  bgImg: {
        position: 'absolute',
        width: '150%',
        height: '110%',
        right: 20,
        bottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: "center",
  },
  contentWrapper: {
    width: '100%',
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontFamily: 'KodchasanMedium'
  },
  input: {
    color: "white",
    fontSize: 16,
    fontFamily: 'KodchasanRegular'
  },
  passwordNote: {
    fontSize: 12,
    color: "white",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "LaoSansPro"
  },
  buttonContainer: {
    paddingTop: 20,
    gap: 10,
    width: '100%',
    alignItems: "center"
  },
  btn: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'KodchasanRegular'
  },
  btnText: {
    color: "blue",
    fontSize: 18,
    fontFamily: 'LaoSansPro'
  },
  switchText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: 'LaoSansPro',
    textDecorationLine: 'underline'
  }
})