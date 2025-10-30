// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Alert } from "react-native";
// import { auth } from "../../firebaseConfig";

// const Next = async ({ setLoading, router,  }) => {
//     setLoading(true);
    
//     try {
//         const userId = auth.currentUser?.uid;
        
//         if (!userId) {
//             Alert.alert("Error", "User not authenticated");
//             setLoading(false);
//             return;
//         }
      
//         const categoryFromStorage = await AsyncStorage.getItem("selected_category");
//         const wordsPerDayFromStorage = await AsyncStorage.getItem("wordsPerDay");
        

//         const notifStartRaw = await AsyncStorage.getItem("notifStart");
//         const notifEndRaw = await AsyncStorage.getItem("notifEnd");
//         const notifSilentStartRaw = await AsyncStorage.getItem("notifSilentStart");
//         const notifSilentEndRaw = await AsyncStorage.getItem("notifSilentEnd");
        
//         const notificationStartTime = notifStartRaw ? parseInt(notifStartRaw.split(':')[0]) : null;
//         const notificationEndTime = notifEndRaw ? parseInt(notifEndRaw.split(':')[0]) : null;
//         const silentStartTime = notifSilentStartRaw ? parseInt(notifSilentStartRaw.split(':')[0]) : null;
//         const silentEndTime = notifSilentEndRaw ? parseInt(notifSilentEndRaw.split(':')[0]) : null;
        
//         const chooseDayJson = await AsyncStorage.getItem("choose_day");
//         const selectedDays = chooseDayJson ? JSON.parse(chooseDayJson) : [];
        
//         console.log("Retrieved from AsyncStorage:", {
//             categoryFromStorage,
//             wordsPerDayFromStorage,
//             notificationStartTime,
//             notificationEndTime,
//             silentStartTime,
//             silentEndTime,
//             selectedDays
//         });
        
//         if (!categoryFromStorage) {
//             Alert.alert("Error", "Please select a category");
//             setLoading(false);
//             return;
//         }
        
//         if (!wordsPerDayFromStorage) {
//             Alert.alert("Error", "Please select words per day");
//             setLoading(false);
//             return;
//         }
        
//         if (!notificationStartTime || !notificationEndTime) {
//             Alert.alert("Error", "Please set notification times");
//             setLoading(false);
//             return;
//         }
        
//         const result = await completeUserProfile(userId, {
//             category: categoryFromStorage,                   
//             wordsPerDay: parseInt(wordsPerDayFromStorage),
//             notificationStartTime: notificationStartTime,    
//             notificationEndTime: notificationEndTime,        
//             silentStartTime: silentStartTime,                
//             silentEndTime: silentEndTime,                    
//             selectedDays: selectedDays                      
//         });
        
//         if (result.success) {
//             console.log("✅ Profile completed, navigating to WordCard");
//             router.push('/(tabs)/WordCard');
//         } else {
//             Alert.alert("Error", result.error || "Failed to save settings");
//         }
        
//     } catch (error) {
//         console.error("❌ Error in Next function:", error);
//         Alert.alert("Error", "Something went wrong. Please try again.");
//     } finally {
//         setLoading(false);
//     }
// };

// export default Next;