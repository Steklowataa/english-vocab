import { useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
 
export default function useDayStreak({ isFinished }: { isFinished: boolean }) {
  useEffect(() => {
    const updateUserStreak = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error("User not logged in, cannot update streak.");
          return;
        }
 
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
 
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const today = new Date().toISOString().split('T')[0];
          const lastStreakDate = userData.lastStreakDate;
 
          if (lastStreakDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            let newStreak = 1;
            if (lastStreakDate === yesterdayStr) {
              newStreak = (userData.currentStreak || 0) + 1;
            }
            
            await updateDoc(userRef, {
              currentStreak: newStreak,
              lastStreakDate: today,
            });
            console.log("Day streak updated.");
          } else {
            console.log("Streak already updated for today.");
          }
        }
      } catch (error) {
        console.error("Failed to update day streak:", error);
      }
    };
 
    if (isFinished) {
      updateUserStreak();
    }
  }, [isFinished]);
}
