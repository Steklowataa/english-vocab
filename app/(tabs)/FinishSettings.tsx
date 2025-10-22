import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { use, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import WordsContainer from "./FinishSettings/WordsContainer";
import NumberOfDay from "./FinishSettings/NumberOfDay";
import ChoosenCategory from "./FinishSettings/ChoosenCategory";
import { ImageBackground } from "expo-image";
import Button from "../components/Button";
import { useRouter } from "expo-router";


export default function FinishSettings() {
    const router = useRouter()
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
        "KodchasanMedium": require("../../assets/fonts/Kodchasan-Medium.ttf"),
        "KodchasanBold": require("../../assets/fonts/Kodchasan-Bold.ttf"),
    })
    if (!fontsLoading) {
        return null;
    }

    const Next = () => {
        router.push('/(tabs)/WordCard')
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/app-images/background.png")}
                style={styles.backgroundImage}/>
        <Text style={styles.header}>Super!</Text>
        <Text style={styles.header2}>Kiedy chcesz zacząć?</Text>
        <WordsContainer />
        <NumberOfDay />
        <ChoosenCategory />
        <View style={styles.headerBox}>
            <Text style={styles.header3}>Kiedy chcesz rozpocząć?</Text>
                <Button title="Zacznij teraz" style={styles.button} textStyle={styles.buttonText} onPress={Next}/>
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