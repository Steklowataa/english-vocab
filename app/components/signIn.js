import { auth } from "../../firebaseConfig"
import { signInWithEmailAndPassword } from 'firebase/auth';

const signIn = async ({ email, password, setLoading, router, setEmail, setPassword }) => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Clear form fields after successful sign in
      setEmail("");
      setPassword("");
      router.push("/GreetingScreen");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
};

export default signIn;