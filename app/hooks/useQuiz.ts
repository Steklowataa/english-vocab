import { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Word } from '../types/word';
import { QuizQuestion } from '../types/quiz';
import { doc, getDoc, collection, query, where, getDocs, documentId, runTransaction, increment, serverTimestamp } from 'firebase/firestore';


const filterValidWords = (words: Word[]): Word[] => {
  return words.filter(w => w.word && w.translation);
};
export const useQuiz = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionTotalWords, setSessionTotalWords] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) {
        setError('You need to be logged in to take a quiz.');
        setLoading(false);
        return;
      }

      try {
        // Pobieramy użytkownika
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          setError('User profile not found.');
          return;
        }

        const { category, wordsPerDay } = userDoc.data() as any;

        if (!category || !wordsPerDay) {
          setError('Please select category and words per day first.');
          return;
        }

        // Pobieramy dzisiejszą sesję użytkownika
        const today = new Date().toISOString().slice(0, 10);
        const dailyQuery = query(
          collection(db, 'dailySessions'),
          where('userId', '==', user.uid),
          where('date', '==', today)
        );
        const dailySnapshot = await getDocs(dailyQuery);

        let todayWords: Word[] = [];
        let todayWordIds: string[] = [];
        if (!dailySnapshot.empty) {
          const dailyDoc = dailySnapshot.docs[0];
          const dailyData = dailyDoc.data();
          setSessionId(dailyDoc.id);
          setSessionTotalWords(dailyData.totalWords || 0);
          todayWordIds = dailyData.wordIds || [];

          if (todayWordIds.length > 0) {
            // Firestore 'in' query is limited to 30 elements, so we chunk the array.
            const chunks = [];
            for (let i = 0; i < todayWordIds.length; i += 30) {
                chunks.push(todayWordIds.slice(i, i + 30));
            }
        
            const wordPromises = chunks.map(chunk => 
                getDocs(query(collection(db, 'word'), where(documentId(), 'in', chunk)))
            );
        
            const wordSnapshots = await Promise.all(wordPromises);
            wordSnapshots.forEach(snapshot => {
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data?.word && data?.translation) {
                        todayWords.push({
                            id: doc.id,
                            word: data.word,
                            translation: data.translation,
                            example_sentence: data.example_sentence || "",
                        });
                    }
                });
            });
          }
        }

        // Pobieramy wszystkie słowa w kategorii, aby znaleźć inne słowa do quizu
        const wordsQuery = query(collection(db, 'word'), where('categoryName', '==', category));
        const snapshot = await getDocs(wordsQuery);

        const allWords: Word[] = [];
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data?.word && data?.translation) {
                allWords.push({
                    id: doc.id,
                    word: data.word,
                    translation: data.translation,
                    example_sentence: data.example_sentence || "",
                });
            }
        });

        if (allWords.length < 4) {
          setError('Not enough words to create a quiz.');
          return;
        }

        // Generujemy quiz
        const wordsForQuiz: Word[] = [];
        const todayWordsCount = Math.min(todayWords.length, 4);
        const shuffledTodayWords = [...todayWords].sort(() => 0.5 - Math.random());
        wordsForQuiz.push(...shuffledTodayWords.slice(0, todayWordsCount));

        const otherWords = allWords.filter(w => !todayWordIds.includes(w.id));
        const otherWordsCount = 8 - wordsForQuiz.length;

        if (otherWords.length > 0 && otherWordsCount > 0) {
            const shuffledOtherWords = [...otherWords].sort(() => 0.5 - Math.random());
            wordsForQuiz.push(...shuffledOtherWords.slice(0, otherWordsCount));
        }

        if (wordsForQuiz.length < 4) {
          setError('Not enough words to create a quiz.');
          return;
        }

        const quizQuestions: QuizQuestion[] = wordsForQuiz.map(correctWord => {
            const otherOptions = wordsForQuiz
                .filter(w => w.id !== correctWord.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(w => w.translation);

            const options = [correctWord.translation, ...otherOptions].sort(() => 0.5 - Math.random());

            return {
                question: correctWord.word,
                options: options,
                correctAnswer: correctWord.translation,
            };
        });

        setQuiz(quizQuestions.sort(() => 0.5 - Math.random()));
      } catch (err) {
        console.error(err);
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const answer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === quiz[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const next = async () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
    } else {
      setLoading(true);
      try {
        const userId = auth.currentUser?.uid;
        if (!userId || !sessionId) {
          throw new Error("User or session not found to save progress.");
        }

        const userRef = doc(db, 'users', userId);
        const sessionRef = doc(db, 'dailySessions', sessionId);

        await runTransaction(db, async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists()) {
            throw new Error("User document does not exist!");
          }
          const category = userDoc.data().category;
          if (!category) {
            throw new Error("User category not set!");
          }

          // 1. Update daily session
          transaction.update(sessionRef, {
            isCompleted: true,
            testCompleted: true,
            testScore: score,
          });

          // 2. Update user document
          const categoryProgressField = `categoryProgress.${category}.wordsLearned`;
          const categoryLastStudiedField = `categoryProgress.${category}.lastStudiedAt`;

          transaction.update(userRef, {
            totalWordsLearned: increment(sessionTotalWords),
            [categoryProgressField]: increment(sessionTotalWords),
            [categoryLastStudiedField]: serverTimestamp(),
          });
        });

        setIsFinished(true);

      } catch (err) {
        console.error("Failed to save quiz results:", err);
        setError('Failed to save quiz results.');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    error,
    quiz,
    currentQuestion: quiz[currentIndex],
    selectedAnswer,
    answer,
    next,
    isFinished,
  };
};
