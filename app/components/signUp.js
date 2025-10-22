import { auth, db } from "../../firebaseConfig"
import { collection, setDoc, doc } from 'firebase/firestore';
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
        createdAt: new Date()
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