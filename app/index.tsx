import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";


export default function RootScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/Dashboard");
      } else {
        router.replace("/(tabs)/LoginScreen");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return null;
}