import { Text, View, StyleSheet } from "react-native"
import { useFonts } from "expo-font"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState, useEffect } from "react"

export default function NumberOfDay() {
    const [fontsLoading] = useFonts({
        "KodchasanSemiBold": require("../../../assets/fonts/Kodchasan-SemiBold.ttf"), 
        "LaoSansPro": require("../../../assets/fonts/LaoSansPro-Regular.ttf"),
    })

    const [value, setValue] = useState<string[]>([])
    useEffect(() => {
        const getData = async () => {
            try {
                const day = await AsyncStorage.getItem("choose_day")
                const start = await AsyncStorage.getItem("notifStart")
                const end = await AsyncStorage.getItem("notifEnd")
                setValue([day, start, end] as string[])
            } catch (e) {
                console.error("Błąd podczas odczytu z AsyncStorage:", e)
            }
        }  
        getData() 
    })

     const countDays = (daystring: string | undefined): number => {
        if (!daystring) return 0
        try {
            const daysArray: string[] = JSON.parse(daystring)
            return daysArray.length
        } catch (e) {
            console.error("Błąd podczas parsowania JSON:", e)
            return 0
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.header}>Dni tygodnia: </Text>
                <Text style={styles.header2}>{countDays(value[0])}</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.header}>Czas nauki:</Text>
                <Text style={styles.header2}>{value[1]} - {value[2]}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 10,
        marginTop: 10
    },
    box: {
        backgroundColor: "#FA4B1E",
        width: 170,
        height: 70,
        borderRadius: 15,

    },
    header: {
        fontFamily: "LaoSansPro",
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
        marginLeft: 10
    },
    header2: {
        fontFamily: "KodchasanSemiBold",
        color: '#4F46E5',
        fontSize: 18,
        marginLeft: 10,
    }
})
