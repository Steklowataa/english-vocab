import React, { useEffect } from "react"
import { getTodaysSession } from "../utils/getTodaySession";
import { auth } from "../../firebaseConfig";
import {useRouter} from "expo-router"
import { Alert } from "react-native"
 
export default function useShowScore({ isFinished, quizLength}: {isFinished: boolean, quizLength: number}) {
    const router = useRouter();
 
    //sprawdzamy wynik

    const handleTitle = ({score, quizLength}: {score: number, quizLength: number}) => {
        if (quizLength === 0) {
            return "No questions to score!";
        }
        const result = (score * 100) / quizLength;
        if (result === 100) {
            return "Congratulations! You did it!";
        }
        if (result > 70) {
            return "Perfect! You hit it!";
        }
        if (result > 50) {
            return "Good! But I know you could do better!";
        }
        if (result > 25) {
            return "It's going better, but try one more time!";
        }
        return "Well... it looks like somebody didn't learn at all";
    }
 
    useEffect(() => {
    if (isFinished) {
      const fetchAndShowScore = async () => {
        try {
          const userId = auth.currentUser?.uid
          if (!userId) throw new Error("Uzytkownik nie jest zalogowany")
          const {session } = await getTodaysSession(userId)
          if (!session) throw new Error("")
          const score = session.testScore
        Alert.alert(handleTitle({score, quizLength}), 
              `Your score: ${score}/${quizLength}`, 
              [{ text: "Go back", onPress: () => router.push("/Dashboard")}])
 
        } catch (error) {
          console.error("Failed to get score:", error);
        Alert.alert("Error", 
            "Could not retrieve your score.", 
            [{ text: "Go back", onPress: () => router.push('/Dashboard') }
          ]);
        }
      }
      fetchAndShowScore()
    }
  }, [isFinished, router, quizLength]);
 
}