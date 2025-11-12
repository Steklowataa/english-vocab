import { useRouter } from 'expo-router'
import { useState, useEffect } from "react"
import { UserData, TodayProgress } from "../types/dashboard"
import { auth, db } from "../../firebaseConfig"
import { View, ScrollView, StyleSheet, ActivityIndicator, } from 'react-native'
import { doc, getDoc } from 'firebase/firestore';
import Header from '../components/Dashboard/Header';
import LevelBadge from '../components/Dashboard/LevelBadge';
import TodaysProgress from '../components/Dashboard/TodaysProgress';
import CategoryProgress from '../components/Dashboard/CategoryProgress';
import Statsgrid from '../components/Dashboard/StatsGrid';
import QuickAction from '../components/Dashboard/QuickAction';
import { ImageBackground } from 'expo-image';

export default function Dashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [todayProgress, setTodayProgress] = useState<TodayProgress | null>(null);

    useEffect(() => {
        loadDashboardData()
    }, [])


    const loadDashboardData = async (): Promise<void> => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUserData(userDoc.data() as UserData);
            }
            const today = new Date().toISOString().split('T')[0];
            const sessionDoc = await getDoc(doc(db, 'dailySessions', `${userId}_${today}`));
            if (sessionDoc.exists()) {
                setTodayProgress(sessionDoc.data() as TodayProgress);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  const categoryProgress = userData?.categoryProgress?.[userData?.category || ''];
  const totalWords = userData?.totalWordsLearned || 0;

  return (
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    <ImageBackground
      source={require('../../assets/app-images/background.png')}
      style={styles.backgroundImage}/>
      {/* Header */}
        <Header router={router} userData={userData} />
      {/* Level Badge */}
        <LevelBadge totalWords={totalWords} />
      {/* Today's Progress */}
        <TodaysProgress router={router} todayProgress={todayProgress} />

      {/* Category Progress */}
        <CategoryProgress categoryProgress={categoryProgress} userData={userData} />

      {/* Stats Grid */}
        <Statsgrid userData={userData} />

      {/* Quick Actions */}
        <QuickAction router={router} />
    </ScrollView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: '140%',
    height: '120%',
    right: 10,
    bottom: 10,
  },

});