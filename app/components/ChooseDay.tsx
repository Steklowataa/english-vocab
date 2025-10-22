import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ChooseDay() {
  const [selectedDays, setSelectedDays] = useState(["Pn", "Wt", "Sr", "Cz", "Pt"]);
  const STORAGE_KEY_CHOOSE_DAY = "choose_day"

  const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
  })

  useEffect(() => {
    const loadSavedDays = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          return;
        }
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().selectedDays) {
          const userData = userDoc.data().selectedDays;
          setSelectedDays(userData);
          await AsyncStorage.setItem(STORAGE_KEY_CHOOSE_DAY, JSON.stringify(userData));
        } else {
            const savedDays = await AsyncStorage.getItem(STORAGE_KEY_CHOOSE_DAY);
            if (savedDays) {
              setSelectedDays(JSON.parse(savedDays));
            }
        }
      } catch (e) {
        console.warn("load saved days error", e);
      }
      };
  
    loadSavedDays();
  }, [])

  const toggleDay = async (day) => {
    const newDate = selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day];
    setSelectedDays(newDate);
    try {
        const user = auth.currentUser;
        if(!user) {
            console.warn("No user logged in")
            return;
        }
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            selectedDays: newDate,
            updatedAt: new Date()
        }, { merge: true });
      await AsyncStorage.setItem(STORAGE_KEY_CHOOSE_DAY, JSON.stringify(newDate));
      console.log("save selected days", newDate);
    } catch (e) {
      console.warn("save selected days error", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz dni tygodnia</Text>
      <View style={styles.daysContainer}>
        {["Pn", "Wt", "Sr", "Cz", "Pt", "Sb", "Nd"].map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => toggleDay(day)}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.daySelected,
            ]} >
            <Text
              style={[
                styles.dayText,
                selectedDays.includes(day) && styles.dayTextSelected,
              ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },
  title: { fontSize: 20, color: "#fff", marginBottom: 12, fontFamily: "KodchasanRegular" },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#9892FF",
    alignItems: "center",
    justifyContent: "center",
  },

  daySelected: {
    backgroundColor: "#5B3DF0",
  },

  dayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  dayTextSelected: {
    color: "#fff",
  },
});
