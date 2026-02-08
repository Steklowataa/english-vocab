import { View, Text, StyleSheet} from "react-native"
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SliderWordsProps {
    initialValue?: number;
    isEditMode?: boolean; 
}

export default function SliderWords({ initialValue, isEditMode = false }: SliderWordsProps) {
    const [wordsPerDay, setWordsPerDay] = useState(initialValue || 10);
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
    });

    const STORAGE_KEY = 'wordsPerDay';
    
    useEffect(() => {
        if (initialValue !== undefined) {
            setWordsPerDay(initialValue);
        }
    }, [initialValue]);

    const handleValueChange = async (value: number) => {
        setWordsPerDay(value);
        
        try {
            if (isEditMode) {
                await AsyncStorage.setItem(STORAGE_KEY, value.toString());
                console.log("Words per day stored in AsyncStorage:", value);
            }
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