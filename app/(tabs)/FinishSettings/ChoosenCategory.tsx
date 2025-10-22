import { Text, View, StyleSheet } from "react-native"
import { useFonts } from "expo-font"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState, useEffect } from "react"

export default function ChoosenCategory() {
    const [fontsLoading] = useFonts({
        "KodchasanSemiBold": require("../../../assets/fonts/Kodchasan-SemiBold.ttf"),
    })

    const [value, setValue] = useState<string | null>('')

    useEffect(() => {
        const getData = async () => {
            try {
                const day: string | null = await AsyncStorage.getItem("selected-category")
                setValue(day)
            } catch (e) {
                console.error("Błąd podczas odczytu z AsyncStorage:", e)
            }
        }  
        getData() 
    })
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Wybrane kategorie</Text>
            <View style={styles.box}>
                <Text style={styles.header2}>{value}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: '100%',
    },
    header: {
        color: '#404040',
        fontSize: 20,
        fontFamily: "KodchasanSemiBold",
        marginTop:10,
    },
    header2: {
        color: '#4F46E5',
        fontSize: 20,
        fontFamily: "KodchasanSemiBold",
    },
    box: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#BEBAFF",
        width: 100,
        height: 50,
        borderColor: "#4F46E5",
        borderRadius: 10,
        borderWidth: 2
    }
})