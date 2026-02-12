import { collection, doc, getCountFromServer, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export interface UserSettings {
    category: string;
    wordsPerDay: number;
    notificationStartTime: string;
    notificationEndTime: string;
    silentStartTime?: string | null;
    silentEndTime?: string | null;
    selectedDays: string[];
}

export interface ProfileCompletionResult {
    success: boolean;
    error?: string;
}

export interface CategoryProgress {
    wordsLearned: number;
    totalWords: number;
    percentage: number;
    startedAt?: Timestamp;
    lastStudiedAt?: Timestamp;
}

export const completeUserProfile = async (userId: string, settings: UserSettings): Promise<ProfileCompletionResult> => {
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

            categoryProgress: {
                [settings.category]: {
                    wordsLearned: 0,
                    totalWords: totalWordsInCategory,
                    percentage: 0,
                }
            },

            onboardingCompleted: true,
            lastActiveAt: serverTimestamp()
        });

        console.log("User profile completed successfully!");
        return { success: true };

    } catch (error: any) {
        console.error("Error completing user profile:", error);
        return { success: false, error: error.message };
    }
};


async function getTotalWordsInCategory(categoryName: string): Promise<number> {
    try {
        const wordsRef = collection(db, "word");
        const q = query(wordsRef, where("categoryName", "==", categoryName));

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
