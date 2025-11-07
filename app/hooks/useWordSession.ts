import { useState, useEffect, useRef, useCallback } from "react";
import { Alert, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; 

import { auth } from "../../firebaseConfig";
import getTodaysSession, { getSessionWords, markWordAsViewed,} from "../utils/getTodaySession";
import { GetTodaysSessionResult, Session, Word } from "../types/session";


export function useWordSession() {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const scrollViewRef = useRef<ScrollView | null>(null);

  const initializeSession = useCallback(async () => {
    try {
      console.log("📚 Initializing session on focus...");
      setLoading(true);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "Please log in");
        return;
      }

      const result = (await getTodaysSession(userId)) as GetTodaysSessionResult;

      if (result.success && result.session && result.sessionId) {
        setSession(result.session as Session);
        setSessionId(result.sessionId);

        const wordsData = await getSessionWords(result.session as Session);
        setWords(wordsData);
        console.log("✅ Session loaded with", wordsData.length, "words");
      } else {
        Alert.alert("Error", result.error || "Failed to load session");
      }
    } catch (error) {
      console.error("Error initializing session:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []); 
  useFocusEffect(
    useCallback(() => {
        initializeSession();
        return () => {

        };
    }, [])
  );

  const handleNext = useCallback(async () => {
    if (!session || currentIndex >= words.length - 1) return;
    
    const currentWord = words[currentIndex];
    if (!session.viewedWordIds.includes(currentWord.id)) {
        const result = await markWordAsViewed(sessionId!, currentWord.id); 
        if (result.success) {
            setSession((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    viewedWordIds: [...prev.viewedWordIds, currentWord.id],
                    completedWords: result.completedWords ?? prev.completedWords,
                    progressPercentage:
                        result.progressPercentage ?? prev.progressPercentage,
                } as Session;
            });
        }
    }

    setCurrentIndex((prev) => prev + 1);
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    
  }, [currentIndex, words, session, sessionId]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [currentIndex]);

  const handleBookmark = useCallback((wordId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(wordId)
        ? prev.filter((id) => id !== wordId)
        : [...prev, wordId]
    );
  }, []); 

  return {
    loading,
    session,
    words,
    currentIndex,
    bookmarkedIds,
    scrollViewRef,
    handleNext,
    handlePrevious,
    handleBookmark,
  };
}