import ChooseDay from "../components/ChooseDay"
import SliderWords from "../components/Slider"
import { useFonts } from "expo-font"
import { StyleSheet, Text, View, StatusBar, ScrollView, Platform, ActivityIndicator } from "react-native"
import NotificationTimePicker from "../components/NotificationTimePicker"
import { ImageBackground } from "react-native"
import NotificationEnd from "../components/NotificationEnd"
import Button from "../components/Button"
import { useRouter } from "expo-router"

export default function Settings() {
    const [fontsLoading] = useFonts({
        "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
        "KodchasanSemiBold": require("../../assets/fonts/Kodchasan-SemiBold.ttf"),
    })
    const router = useRouter();
    
    const onNext = () => {
        router.push('/(tabs)/FinishSettings');
    }

    if (!fontsLoading) {
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
                <SliderWords />
                <ChooseDay />
                <NotificationTimePicker />
                <NotificationEnd />
                <View style={style.btnContainer}>
                    <Button
                        title={"Dalej"}
                        onPress={onNext}
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
    button: {
    },
    btnContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30
    }
})
