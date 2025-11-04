import { auth, db } from "../../firebaseConfig"
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, } from 'firebase/auth';

const signUp = async ({ setLoading, setName, setEmail, router, name, email, password }) => {
    if (!name || !email) {
      alert("Please fill in name and email");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,

        category: null,
        wordsPerDay: 0,
        notificationStartTime: null,
        notificationEndTime: null,
        silentStartTime: null,
        silentEndTime: null,
        selectedDays: [],
        
        totalWordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        level: "🥉 Beginner",
        
        onboardingCompleted: false, 
        createdAt: serverTimestamp(),
        // lastActiveAt: serverTimestamp()
      });
      
      router.push("/GreetingScreen");
      setName("");
      setEmail("");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
};

export default signUp;