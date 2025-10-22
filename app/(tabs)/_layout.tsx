import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="LoginScreen" options={{headerShown: false}} />
    <Stack.Screen name="GreetingScreen" options={{headerShown: false}} />
    <Stack.Screen name="Settings" options={{headerShown: false}} />
    <Stack.Screen name="FinishSettings" options={{headerShown: false}} />
  </Stack>
  )
}