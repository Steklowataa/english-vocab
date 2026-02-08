import { Word } from "../types/word";
import { QuizQuestion } from '../types/quiz';


export const shuffleArray = <T>(array: T[]): T[] => { return [...array].sort(() => Math.random() - 0.5); };

export const generateQuiz = (
  allWords: Word[],
  todayWords: Word[],
  userSelectionCount: number
): QuizQuestion[] => {
  const totalQuestions = userSelectionCount + 3;

  const halfToday = Math.floor(totalQuestions / 2);
  const remaining = totalQuestions - halfToday;

  const selectedToday = shuffleArray(todayWords).slice(0, halfToday);
  const newWords = shuffleArray(allWords.filter(w => !todayWords.includes(w)));
  const selectedNew = newWords.slice(0, remaining);

  const quizWords = shuffleArray([...selectedToday, ...selectedNew]);

  return quizWords.map(correctWord => {
    const distractors = shuffleArray(
      allWords.filter(w => w.id !== correctWord.id)
    ).slice(0, 3);

    const options = shuffleArray([
      correctWord.translation,
      ...distractors.map(d => d.translation),
    ]);

    return {
      question: `Translate the word: "${correctWord.word}"`,
      options,
      correctAnswer: correctWord.translation,
      wordId: correctWord.id,
      example: correctWord.example_sentence,
    };
  });
};
