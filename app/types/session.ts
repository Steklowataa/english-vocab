export interface Word {
  id: string;
  [key: string]: any;
}

export interface Session {
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

export interface GetTodaysSessionResult {
  success: boolean;
  session?: Session;
  sessionId?: string;
  error?: string;
}

