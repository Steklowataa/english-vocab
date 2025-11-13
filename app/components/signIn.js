import { auth, db } from "../../firebaseConfig"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const signIn = async ({ email, password, setLoading, router, setEmail, setPassword }) => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Sprawdź, czy użytkownik ma wybraną kategorię
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.category) {
          router.push("/Dashboard");
        } else {
          router.push("/GreetingScreen");
        }
      } else {
        router.push("/GreetingScreen");
      }
      
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
};

export default signIn;
