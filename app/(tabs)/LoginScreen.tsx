import { KeyboardAvoidingView, Text, TextInput, View, StyleSheet, ActivityIndicator, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "expo-router";
import signUp from "../components/signUp";
import signIn from "../components/signIn";
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';

export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'KodchasanMedium': require('../../assets/fonts/Kodchasan-Bold.ttf'),
    'KodchasanRegular': require('../../assets/fonts/Kodchasan-Regular.ttf'),
    "LaoSansPro": require('../../assets/fonts/LaoSansPro-Regular.ttf')
  });

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
      password: password // Przekazujemy prawdziwe hasło wpisane przez użytkownika
    });
  };

  const handleSignIn = async () => {
    await signIn({ 
      setLoading, 
      setEmail, 
      setPassword, 
      router, 
      email, 
      password: password // Przekazujemy prawdziwe hasło wpisane przez użytkownika
    });
  };

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

            {/* IMIĘ - tylko przy rejestracji */}
            {isSignUp && (
              <BlurView intensity={20} tint="light" style={style.inputBox}>
                <TextInput
                  style={style.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
              </BlurView>
            )}

            {/* EMAIL - dla logowania i rejestracji */}
            <BlurView intensity={20} tint="light" style={style.inputBox}>
              <TextInput 
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={style.input}
              />
            </BlurView>

            {/* HASŁO - widoczne ZARÓWNO przy logowaniu, jak i rejestracji */}
            <BlurView intensity={20} tint="light" style={style.inputBox}>
              <TextInput 
                style={style.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Hasło"
                secureTextEntry={true}
                autoCapitalize="none"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </BlurView>

            {loading ? (
              <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
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
  buttonContainer: {
    paddingTop: 20,
    gap: 10,
    width: '100%',
    alignItems: "center"
  },
  btn: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  btnText: {
    color: "black",
    fontSize: 18,
    fontFamily: 'LaoSansPro',
    fontWeight: 'bold'
  },
  switchText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: 'LaoSansPro',
    textDecorationLine: 'underline',
    marginTop: 5
  }
});