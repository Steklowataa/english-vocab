import ChooseDay from "../components/ChooseDay"
import SliderWords from "../components/Slider"
import { useFonts } from "expo-font"
import { StyleSheet, Text, View, StatusBar, ScrollView, Platform, ActivityIndicator } from "react-native"
import NotificationTimePicker from "../components/NotificationTimePicker"
import { useState, useEffect } from "react"
import { ImageBackground } from "react-native"
import NotificationEnd from "../components/NotificationEnd"
import Button from "../components/Button"
import { useRouter } from "expo-router"
import { auth, db } from "../../firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditSettings() {
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
        "KodchasanSemiBold": require("../../assets/fonts/Kodchasan-SemiBold.ttf"),
    })
    const router = useRouter();

    const formatTime = (time: any, defaultTime: string) => {
        const timeStr = String(time ?? defaultTime);
        return timeStr.includes(':') ? timeStr : `${timeStr}:00`;
    };

    const [loading, setLoading] = useState(true);
    const [initialSettings, setInitialSettings] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setInitialSettings(userDoc.data());
                    } else {
                        setError("Your user profile could not be found.");
                    }
                } else {
                    setError("Authentication error. Please try logging in again.");
                }
            } catch (e) {
                console.error("Failed to load settings: ", e);
                setError("A problem occurred while loading your settings. Please check your network connection.");
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);
    
    const handleSave = async() => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not found");

            const wordsPerDay = await AsyncStorage.getItem('wordsPerDay');
            const notificationDays = await AsyncStorage.getItem('notificationDays');
            const notificationStartTime = await AsyncStorage.getItem('notificationStartTime');
            const notificationEndTime = await AsyncStorage.getItem('notificationEndTime');

            console.log("Read from AsyncStorage:", { wordsPerDay, notificationDays, notificationStartTime, notificationEndTime });

            const settingsToUpdate: any = {};
            if (wordsPerDay) settingsToUpdate.wordsPerDay = parseInt(wordsPerDay, 10);
            if (notificationDays) settingsToUpdate.notificationDays = JSON.parse(notificationDays);
            if (notificationStartTime) settingsToUpdate.notificationStartTime = notificationStartTime;
            if (notificationEndTime) settingsToUpdate.notificationEndTime = notificationEndTime;

            console.log("Settings to update:", settingsToUpdate);

            if (Object.keys(settingsToUpdate).length > 0) {
                console.log("Updating settings in Firestore...");
                await updateDoc(doc(db, "users", user.uid), settingsToUpdate);
                console.log("Settings updated.");

                const d = new Date();
                const year = d.getFullYear();
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                const day = d.getDate().toString().padStart(2, '0');
                const today = `${year}-${month}-${day}`;

                const sessionId = `${user.uid}_${today}`;
                console.log(`Attempting to delete session with ID: ${sessionId}`);
                await deleteDoc(doc(db, "dailySessions", sessionId));
                console.log(`Session deletion attempted for ID: ${sessionId}`);

                await AsyncStorage.multiRemove([
                    'wordsPerDay',
                    'notificationDays', 
                    'notificationStartTime',
                    'notificationEndTime'
                ]);
                console.log("AsyncStorage cleared.");
            } else {
                console.log("No settings to update.");
            }

            if (router.canGoBack()) {
                router.back();
            } else {
                router.push('/Settings');
            }

        } catch (error) {
            console.error("Failed to save settings: ", error);
            alert("Could not save your settings. Please try again.");
        }
    }

    if (loading || !fontsLoading) {
        return (
            <View style={[style.wrapper, { justifyContent: 'center', alignItems: 'center' }]}>
                <ImageBackground
                    source={require('../../assets/app-images/background.png')}
                    style={style.backgroundImage}
                    resizeMode="cover"
                />
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (error || !initialSettings) {
        return (
            <View style={[style.wrapper, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
                 <ImageBackground
                    source={require('../../assets/app-images/background.png')}
                    style={style.backgroundImage}
                    resizeMode="cover"
                />
                <Text style={style.header}>Error</Text>
                <Text style={style.errorText}>
                    {error || "Could not load your settings data."}
                </Text>
                <Button title="Go Back" onPress={() => router.back()} />
            </View>
        );
    }
        
    return (
        <View style={style.wrapper}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <ImageBackground
                source={require('../../assets/app-images/background.png')}
                style={style.backgroundImage}
                resizeMode="cover"
            />
            
            <ScrollView 
                contentContainerStyle={style.container} 
                showsVerticalScrollIndicator={false}>
                <View style={style.textContainer}>
                    <Text style={style.header}>
                        Zmień swój plan nauki
                    </Text>
                </View>
                <SliderWords initialValue={Number(initialSettings.wordsPerDay ?? 10)} isEditMode={true} />
                {/* <SliderWords initialValue={Number(initialSettings.wordsPerDay ?? 10)} isEditMode={true} />
                <NotificationTimePicker initialStartTime={formatTime(initialSettings.notificationStartTime, '08:00')} />
                <ChooseDay initialDays={Array.isArray(initialSettings.notificationDays) ? initialSettings.notificationDays : []} />
                <View style={style.notif}>
                    <NotificationEnd initialEndTime={formatTime(initialSettings.notificationEndTime, '21:00')} />
                </View> */}
                <View style={style.btnContainer}>
                    <Button
                        title={"Zapisz"}
                        onPress={handleSave}
                        style={style.button}
                        textStyle='KodchasanRegular'
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        width: '170%',
        height: '100%',
        right: -90, 
        top: 0,
    },
    container: {
        flexGrow: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    header: {
        fontFamily: "KodchasanSemiBold",
        fontSize: 32,
        color: '#fff',
        textAlign: "center",
        lineHeight: 35
    },
    errorText: {
        fontFamily: "KodchasanRegular",
        fontSize: 16,
        color: '#fff',
        textAlign: "center",
        lineHeight: 24,
        marginVertical: 20,
    },
    button: {
    },
    btnContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30
    },
    notif: {
        marginTop: 20
    }
})
