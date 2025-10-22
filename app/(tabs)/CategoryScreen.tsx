import CategoryButton from "../components/CategoryButton"
import { View, StyleSheet, ActivityIndicator} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {auth, db} from "../../firebaseConfig"
import { collection, getDocs, doc, setDoc} from "firebase/firestore";
import { useEffect, useState } from "react";


interface Category {
    title: string;
    color: string;
    icon: any;
}

export default function CategoryScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleCategories = async (title: string) => {
       try {
        const user = auth.currentUser;
        if(!user) {
            router.push("/(tabs)/LoginScreen");
            return;
        } 
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            category: title,
            email: user.email,
            updatedAt: new Date()
        }, { merge: true });


        await AsyncStorage.setItem("selected_category", title)
        router.push("/(tabs)/Settings")
        console.log("Saved category ", title)

       } catch (error) {
        console.log(error)
       }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesCollection = collection(db, 'category');
                const categorySnapshot = await getDocs(categoriesCollection);
                
                const fetchedCategories = categorySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        title: data.name || data.title || doc.id,
                        color: data.color || '#FA4B1E',
                        icon: require('../../assets/icons/technical-support1.png')
                    };
                });
                
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#FA4B1E" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {categories.map((category, index) => (
                <CategoryButton
                    key={index}
                    title={category.title}
                    color={category.color}
                    icon={category.icon}
                    onPress={() => handleCategories(category.title)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',       
        justifyContent: 'center',
        padding: 16,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    }
})