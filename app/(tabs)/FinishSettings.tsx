import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import WordsContainer from "./FinishSettings/WordsContainer";
import NumberOfDay from "./FinishSettings/NumberOfDay";
import ChoosenCategory from "./FinishSettings/ChoosenCategory";
import { ImageBackground } from "expo-image";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { auth } from "../../firebaseConfig";
import completeUserProfile from "../utils/completeUserProfile";

export default function FinishSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
        "KodchasanMedium": require("../../assets/fonts/Kodchasan-Medium.ttf"),
        "KodchasanBold": require("../../assets/fonts/Kodchasan-Bold.ttf"),
    });
    
    if (!fontsLoading) {
        return null;
    }

    const Next = async () => {
    setLoading(true);
    
    try {
        const userId = auth.currentUser?.uid;
        
        if (!userId) {
            Alert.alert("Error", "User not authenticated");
            setLoading(false);
            return;
        }
      
        const categoryFromStorage = await AsyncStorage.getItem("selected_category");
        const wordsPerDayFromStorage = await AsyncStorage.getItem("wordsPerDay");
        

        const notifStartRaw = await AsyncStorage.getItem("notifStart");
        const notifEndRaw = await AsyncStorage.getItem("notifEnd");
        const notifSilentStartRaw = await AsyncStorage.getItem("notifSilentStart");
        const notifSilentEndRaw = await AsyncStorage.getItem("notifSilentEnd");
        
        const notificationStartTime = notifStartRaw ? parseInt(notifStartRaw.split(':')[0]) : null;
        const notificationEndTime = notifEndRaw ? parseInt(notifEndRaw.split(':')[0]) : null;
        const silentStartTime = notifSilentStartRaw ? parseInt(notifSilentStartRaw.split(':')[0]) : null;
        const silentEndTime = notifSilentEndRaw ? parseInt(notifSilentEndRaw.split(':')[0]) : null;
        
        const chooseDayJson = await AsyncStorage.getItem("choose_day");
        const selectedDays = chooseDayJson ? JSON.parse(chooseDayJson) : [];
        
        console.log("Retrieved from AsyncStorage:", {
            categoryFromStorage,
            wordsPerDayFromStorage,
            notificationStartTime,
            notificationEndTime,
            silentStartTime,
            silentEndTime,
            selectedDays
        });
        
        if (!categoryFromStorage) {
            Alert.alert("Error", "Please select a category");
            setLoading(false);
            return;
        }
        
        if (!wordsPerDayFromStorage) {
            Alert.alert("Error", "Please select words per day");
            setLoading(false);
            return;
        }
        
        if (!notificationStartTime || !notificationEndTime) {
            Alert.alert("Error", "Please set notification times");
            setLoading(false);
            return;
        }
        
        const result = await completeUserProfile(userId, {
            category: categoryFromStorage,                   
            wordsPerDay: parseInt(wordsPerDayFromStorage),
            notificationStartTime: notificationStartTime,    
            notificationEndTime: notificationEndTime,        
            silentStartTime: silentStartTime,                
            silentEndTime: silentEndTime,                    
            selectedDays: selectedDays                      
        });
        
        if (result.success) {
            console.log("✅ Profile completed, navigating to WordCard");
            router.push('./(tabs)/WordCard');
        } else {
            Alert.alert("Error", result.error || "Failed to save settings");
        }
        
    } catch (error) {
        console.error("❌ Error in Next function:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
};

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/app-images/background.png")}
                style={styles.backgroundImage}
            />
            <Text style={styles.header}>Super!</Text>
            <Text style={styles.header2}>Kiedy chcesz zacząć?</Text>
            <WordsContainer />
            <NumberOfDay />
            <ChoosenCategory />
            <View style={styles.headerBox}>
                <Text style={styles.header3}>Kiedy chcesz rozpocząć?</Text>
                <Button 
                    title={loading ? "Zapisywanie..." : "Zacznij teraz"} 
                    style={styles.button} 
                    textStyle={styles.buttonText} 
                    onPress={Next}
                    disabled={loading}
                />
                {loading && <ActivityIndicator color="#fff" style={{ marginTop: 10 }} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        fontFamily: "KodchasanMedium",
        fontSize: 32,
        color: '#fff',
        textAlign: "center",
        top: 100
    },
    header2: {
        position: "absolute",
        top: 140,
        fontFamily: "KodchasanRegular",
        fontSize: 26,
        color: '#fff',
        marginBottom: 20,
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#000",
        padding: 20,
        marginTop: 50,
    },
    backgroundImage: {
        width: 1000,
        height: 1000,
        position: "absolute"
    },
    header3: {
        fontFamily: "KodchasanMedium",
        fontSize: 20,
        color: '#404040',
        marginBottom: 10
    },
    headerBox: {
        alignItems: "center",
        position: "absolute",
        bottom: 20,
    },
    button: {
        width: 200
    },
    buttonText: {
        fontFamily: "KodchasanBold",
        fontSize: 18,
        color: "#fff",
        fontWeight: "800",
    }
});