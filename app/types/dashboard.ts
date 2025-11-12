export interface CategoryProgress {
  wordsLearned: number;
  totalWords: number;
  percentage: number;
  startedAt: any;
  lastStudiedAt: any;
}

export interface UserData {
  name: string;
  email: string;
  category: string;
  wordsPerDay: number;
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  level: string;
  categoryProgress?: {
    [key: string]: CategoryProgress;
  };
}

export interface TodayProgress {
  userId: string;
  date: string;
  category: string;
  totalWords: number;
  completedWords: number;
  pendingWords: number;
  wordIds: string[];
  viewedWordIds: string[];
  bookmarkedWordIds: string[];
  progressPercentage: number;
  testAvailable?: boolean;
  testCompleted?: boolean;
  testSkipped?: boolean;
  testScore?: number | null;
  isCompleted?: boolean;
}