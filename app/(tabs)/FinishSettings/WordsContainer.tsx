import { Text, View, StyleSheet} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState, useEffect } from "react"
import { useFonts } from "expo-font"

export default function WordsContainer() {
    const [value, setValue] = useState<string[]>([])
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../../assets/fonts/Kodchasan-Regular.ttf"),
        "KodchasanBold": require("../../../assets/fonts/Kodchasan-SemiBold.ttf"),
        "LaoSansPro": require("../../../assets/fonts/LaoSansPro-Regular.ttf"),
    
    }) 
    
    useEffect(() => {
        const getData = async () => {
            try {
                const day = await AsyncStorage.getItem("choose_day")
                const words = await AsyncStorage.getItem("wordsPerDay")
                setValue([day, words] as string[])
            } catch (e) {
                console.error("Błąd podczas odczytu z AsyncStorage:", e)
            }
        }  
        getData() 
    }, [])

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

    const dayPerWeek = countDays(value[0]) * parseInt(value[1])
    
    return (
        <View style={styles.container}>
            <Text style={styles.plan}>Twój plan nauki:</Text>
            <Text style={styles.words}>{dayPerWeek} słówek</Text>
            <Text style={styles.header3}>Tygodniowo    {value[1]} dziennie</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 350,
        height: 150,
        backgroundColor: "#4F46E5",
        borderRadius: 20,
    },
    plan: {
        fontFamily: "LaoSansPro",
        color: '#fff',
        fontSize: 20,
        marginLeft: 20,
        marginTop: 20
    },
    words: {
        fontFamily: "KodchasanBold",
        color: '#fff',
        fontSize: 30,
        marginLeft: 20,
    },
    header3: {
        fontFamily: "LaoSansPro",
        color: '#fff',
        fontSize: 18,
        marginLeft: 20,
        marginTop: 10,
    },
})

