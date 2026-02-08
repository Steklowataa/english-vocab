import { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { Word } from '../types/word';
import { QuizQuestion } from '../types/quiz';

const filterValidWords = (words: Word[]): Word[] => {
  return words.filter(w => w.word && w.translation);
};
export const useQuiz = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

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
          collection(db, 'dailySession'),
          where('userId', '==', user.uid),
          where('date', '==', today)
        );
        const dailySnapshot = await getDocs(dailyQuery);

        let todayWords: Word[] = [];
        let todayWordIds: string[] = [];
        if (!dailySnapshot.empty) {
          const dailyData = dailySnapshot.docs[0].data();
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
  };

  const next = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
    } else {
      setCurrentIndex(0);
      setSelectedAnswer(null);
      alert('Quiz finished!');
      // Tutaj możesz np. wracać do ekranu głównego:
      // navigation.navigate('Home');
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
  };
};
