import { View, Text, StyleSheet} from "react-native"
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function SliderWords() {
    const [wordsPerDay, setWordsPerDay] = useState(10);
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
    });

    const STORAGE_KEY = 'wordsPerDay';
    
    useEffect(() => {
        const loadWordsPerDay = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists() && userDoc.data().wordsPerDay) {
                    const words = userDoc.data().wordsPerDay;
                    setWordsPerDay(words);

                    await AsyncStorage.setItem(STORAGE_KEY, words.toString());
                } else {
                    const existing = await AsyncStorage.getItem(STORAGE_KEY);
                    if (existing) {
                        setWordsPerDay(parseInt(existing));
                    } else {
                        await AsyncStorage.setItem(STORAGE_KEY, "10");
                        const userRef = doc(db, "users", user.uid);
                        await setDoc(userRef, { wordsPerDay: 10 }, { merge: true });
                    }
                }
            } catch (e) {
                console.warn("load words per day error", e);
            }
        };

        loadWordsPerDay();
    }, []);

    const handleValueChange = async (value: number) => {
        setWordsPerDay(value);
        
        try {
            const user = auth.currentUser;
            if (!user) {
                console.warn("No user logged in");
                return;
            }

            const userRef = doc(db, "users", user.uid);
            await setDoc(
                userRef,
                {
                    wordsPerDay: value,
                    updatedAt: new Date()
                },
                { merge: true }
            );

            await AsyncStorage.setItem(STORAGE_KEY, value.toString());
            
            console.log("Words per day saved:", value);
        } catch (e) {
            console.error('save words per day error', e);
        }
    };
   
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Ilość słówek dla nauki dziennie</Text>
            <Text style={styles.value}>{wordsPerDay}</Text>
            <Slider
                style={{ width: 200, height: 50 }}
                minimumValue={5}
                maximumValue={50}
                step={1}
                value={wordsPerDay}
                onValueChange={handleValueChange}
                minimumTrackTintColor="#9892FF"
                thumbTintColor="#5B3DF0"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"   
    },
    label: {
        color: "#fff",
        fontFamily: "KodchasanRegular",
        fontSize: 20
    },
    value: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "KodchasanRegular"
    }
});
