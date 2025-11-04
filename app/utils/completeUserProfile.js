import { doc, updateDoc, serverTimestamp, collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const completeUserProfile = async (userId, settings) => {
  try {
    const userRef = doc(db, "users", userId);
    
    const totalWordsInCategory = await getTotalWordsInCategory(settings.category);
    
    await updateDoc(userRef, {
      category: settings.category,
      wordsPerDay: settings.wordsPerDay,
      notificationStartTime: settings.notificationStartTime,
      notificationEndTime: settings.notificationEndTime,
      silentStartTime: settings.silentStartTime || null,
      silentEndTime: settings.silentEndTime || null,
      selectedDays: settings.selectedDays,
      // startLearningDate: serverTimestamp(),
      
      categoryProgress: {
        [settings.category]: {
          wordsLearned: 0,
          totalWords: totalWordsInCategory,
          percentage: 0,
          // startedAt: serverTimestamp(),
          // lastStudiedAt: serverTimestamp()
        }
      },
      
      onboardingCompleted: true,
      lastActiveAt: serverTimestamp()
    });
    
    console.log("User profile completed successfully!");
    return { success: true };
    
  } catch (error) {
    console.error("Error completing user profile:", error);
    return { success: false, error: error.message };
  }
};


async function getTotalWordsInCategory(categoryName) {
  try {
    const wordsRef = collection(db, "words");
    const q = query(wordsRef, where("category", "==", categoryName));
    
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    
    console.log(`Total words in "${categoryName}": ${count}`);
    return count;
    
  } catch (error) {
    console.error("Error getting words count:", error);
    return 1000;
  }
}

export default completeUserProfile;