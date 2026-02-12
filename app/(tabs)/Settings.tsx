import ChooseDay from "../components/ChooseDay"
import SliderWords from "../components/Slider"
import { useFonts } from "expo-font"
import { StyleSheet, Text, View, StatusBar, ScrollView, Platform, ActivityIndicator, Alert } from "react-native"
import NotificationTimePicker from "../components/NotificationTimePicker"
import { ImageBackground } from "react-native"
import NotificationEnd from "../components/NotificationEnd"
import Button from "../components/Button"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../firebaseConfig';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

export default function Settings() {
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
        "KodchasanSemiBold": require("../../assets/fonts/Kodchasan-SemiBold.ttf"),
    })
    const router = useRouter();
    const { from } = useLocalSearchParams();
    const [isSaving, setIsSaving] = useState(false);
    const [userSettings, setUserSettings] = useState(null);
    const [loadingUserSettings, setLoadingUserSettings] = useState(true);

    useEffect(() => {
        const loadUserSettings = async () => {
            if (from === 'dashboard') {
                try {
                    const userId = auth.currentUser?.uid;
                    if (!userId) {
                        setLoadingUserSettings(false);
                        return;
                    }
                    const userRef = doc(db, 'users', userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        setUserSettings(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error loading user settings: ", error);
                } finally {
                    setLoadingUserSettings(false);
                }
            } else {
                setLoadingUserSettings(false);
            }
        };
        loadUserSettings();
    }, [from]);
    
    const onNext = async () => {
        if (from === 'dashboard') {
            setIsSaving(true);
            try {
                const userId = auth.currentUser?.uid;
                if (!userId) {
                    Alert.alert('Błąd', 'Musisz być zalogowany, aby zaktualizować ustawienia.');
                    return;
                }
    
                const wordsPerDayStr = await AsyncStorage.getItem('wordsPerDay');
                const selectedDaysStr = await AsyncStorage.getItem('selectedDays');
    
                const settingsToUpdate: { [key: string]: any } = {};
                let wordsPerDayChanged = false;

                if (wordsPerDayStr) {
                    const newWordsPerDay = JSON.parse(wordsPerDayStr);
                    settingsToUpdate.wordsPerDay = newWordsPerDay;
                    if (!userSettings || !userSettings.hasOwnProperty('wordsPerDay') || Number(userSettings.wordsPerDay) !== Number(newWordsPerDay)) {
                        wordsPerDayChanged = true;
                    }
                }
                if (selectedDaysStr) {
                    settingsToUpdate.selectedDays = JSON.parse(selectedDaysStr);
                }
                
                if (Object.keys(settingsToUpdate).length > 0) {
                     const userRef = doc(db, 'users', userId);
                     await updateDoc(userRef, settingsToUpdate);
                     Alert.alert('Sukces!', 'Twój plan nauki został zaktualizowany.');
                }
    
                if (wordsPerDayChanged) {
                    const today = new Date().toISOString().split('T')[0];
                    const sessionId = `${userId}_${today}`;
                    const sessionRef = doc(db, "dailySessions", sessionId);
                    await deleteDoc(sessionRef);
                }

                router.push('/(tabs)/Dashboard');
            } catch (error) {
                console.error("Błąd podczas aktualizacji ustawień: ", error);
                Alert.alert('Błąd', 'Nie można zaktualizować ustawień.');
            } finally {
                setIsSaving(false);
            }
        } else {
            router.push('/(tabs)/FinishSettings');
        }
    }

    if (!fontsLoading || loadingUserSettings) {
        return (
            <View style={[style.wrapper, { justifyContent: 'center', alignItems: 'center' }]}>
                <ImageBackground
                    source={require('../../assets/app-images/background.png')}
                    style={style.backgroundImage}
                    resizeMode="cover"
                />
                <ActivityIndicator size="large" color="#fff" />
            </View>
        )
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
                showsVerticalScrollIndicator={false}
            >
                <View style={style.textContainer}>
                    <Text style={style.header}>
                        Teraz wybierzemy dla {'\n'} Ciebie idealny plan {'\n'} nauki!
                    </Text>
                </View>
                <SliderWords isEditMode={from === 'dashboard'} initialValue={userSettings?.wordsPerDay} />
                <ChooseDay isEditMode={from === 'dashboard'} initialValue={userSettings?.selectedDays} />
                {/* <NotificationTimePicker /> */}
                {/* <NotificationEnd /> */}
                <View style={style.btnContainer}>
                    {isSaving ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : (
                        <Button
                            title={from === 'dashboard' ? "Zapisz zmiany" : "Dalej"}
                            onPress={onNext}
                            style={style.button}
                            textStyle='KodchasanRegular'
                        />
                    )}
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
    button: {
    },
    btnContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30
    }
})
