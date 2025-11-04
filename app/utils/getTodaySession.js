import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';


export const getTodaysSession = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "2025-10-30"
    const sessionId = `${userId}_${today}`;
    const sessionRef = doc(db, "dailySessions", sessionId);
    
    const sessionDoc = await getDoc(sessionRef);
    
    if (sessionDoc.exists()) {
      console.log("📚 Loading existing session for today");
      return { success: true, session: sessionDoc.data(), sessionId };
    }
    

    console.log("🆕 Creating new session for today");
    const newSession = await createTodaysSession(userId, sessionId);
    return { success: true, session: newSession, sessionId };
    
  } catch (error) {
    console.error("Error getting today's session:", error);
    return { success: false, error: error.message };
  }
};


async function createTodaysSession(userId, sessionId) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const category = userData.category;
    const wordsPerDay = userData.wordsPerDay || 10;
    
    console.log(`Fetching ${wordsPerDay} words for category: ${category}`);
    
    const todaysWords = await selectTodaysWords(userId, category, wordsPerDay);
    
    if (todaysWords.length === 0) {
      throw new Error("No words available for this category");
    }
    
    const wordIds = todaysWords.map(w => w.id);
    
    const sessionData = {
      userId: userId,
      date: new Date().toISOString().split('T')[0],
      category: category,
      
      totalWords: todaysWords.length,
      completedWords: 0,
      pendingWords: todaysWords.length,
      
      wordIds: wordIds,
      viewedWordIds: [],
      bookmarkedWordIds: [],
      
      testAvailable: false,
      testCompleted: false,
      testSkipped: false,
      testScore: null,
      
      startedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp(),
      completedAt: null,
      sessionDuration: 0,
      
      isCompleted: false,
      progressPercentage: 0
    };
    
    const sessionRef = doc(db, "dailySessions", sessionId);
    await setDoc(sessionRef, sessionData);
    
    console.log(`✅ Created session with ${todaysWords.length} words`);
    
    return sessionData;
    
  } catch (error) {
    console.error("Error creating today's session:", error);
    throw error;
  }
}


async function selectTodaysWords(userId, category, wordsPerDay) {
  try {
    const reviewWords = await getReviewWords(userId, category);
    console.log(`Found ${reviewWords.length} words for review`);
    
    const reviewCount = Math.min(reviewWords.length, 5);
    const newWordsNeeded = wordsPerDay - reviewCount;
    
    const newWords = await getNewWords(userId, category, newWordsNeeded);
    console.log(`Found ${newWords.length} new words`);
    
    const allWords = [...reviewWords.slice(0, reviewCount), ...newWords];
    
    return shuffleArray(allWords);
    
  } catch (error) {
    console.error("Error selecting today's words:", error);
    return [];
  }
}

async function getReviewWords(userId, category) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const userWordsRef = collection(db, "userWords");
    const q = query(
      userWordsRef,
      where("userId", "==", userId),
      where("category", "==", category),
      where("nextReviewDate", "<=", today),
      where("status", "!=", "mastered"),
      limit(5)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.data().wordId,
      ...doc.data()
    }));
    
  } catch (error) {
    console.error("Error getting review words:", error);
    return [];
  }
}


async function getNewWords(userId, category, count) {
  try {
    const userWordsRef = collection(db, "userWords");
    const userWordsQuery = query(
      userWordsRef,
      where("userId", "==", userId),
      where("category", "==", category)
    );
    
    const userWordsSnapshot = await getDocs(userWordsQuery);
    const learnedWordIds = userWordsSnapshot.docs.map(doc => doc.data().wordId);
    
    console.log(`User has learned ${learnedWordIds.length} words already`);
    
    const wordsRef = collection(db, "words");
    const wordsQuery = query(
      wordsRef,
      where("category", "==", category),
      limit(count + learnedWordIds.length + 50)
    );
    
    const wordsSnapshot = await getDocs(wordsQuery);
    const newWords = wordsSnapshot.docs
      .filter(doc => !learnedWordIds.includes(doc.id))
      .slice(0, count)
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    
    return newWords;
    
  } catch (error) {
    console.error("Error getting new words:", error);
    return [];
  }
}


function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


export const markWordAsViewed = async (sessionId, wordId) => {
  try {
    const sessionRef = doc(db, "dailySessions", sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error("Session not found");
    }
    
    const sessionData = sessionDoc.data();
    const viewedWordIds = sessionData.viewedWordIds || [];
    
    if (viewedWordIds.includes(wordId)) {
      return { success: true };
    }
    
    const newViewedWordIds = [...viewedWordIds, wordId];
    const completedWords = newViewedWordIds.length;
    const progressPercentage = Math.round((completedWords / sessionData.totalWords) * 100);
    
    await updateDoc(sessionRef, {
      viewedWordIds: newViewedWordIds,
      completedWords: completedWords,
      pendingWords: sessionData.totalWords - completedWords,
      progressPercentage: progressPercentage,
      lastActivityAt: serverTimestamp()
    });
    
    console.log(`✅ Marked word ${wordId} as viewed (${completedWords}/${sessionData.totalWords})`);
    
    return { success: true, completedWords, progressPercentage };
    
  } catch (error) {
    console.error("Error marking word as viewed:", error);
    return { success: false, error: error.message };
  }
};

export default getTodaysSession;