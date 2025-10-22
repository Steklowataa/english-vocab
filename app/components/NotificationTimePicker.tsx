import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface NotificationTimePickerProps {
  initialStartTime?: string;
  initialEndTime?: string;
  onTimeChange?: (startTime: string, endTime: string) => void;
}

const NotificationTimePicker: React.FC<NotificationTimePickerProps> = ({
  initialStartTime = '12:00',
  initialEndTime = '21:00',
  onTimeChange,
}) => {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [showPicker, setShowPicker] = useState(false);
  const [editingTime, setEditingTime] = useState<'start' | 'end' | null>(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [fontsLoading] = useFonts({
    "KodchasanRegular": require("../../assets/fonts/Kodchasan-Regular.ttf"),
  });
  
  const STORAGE_KEY_START = 'notifStart';
  const STORAGE_KEY_END = 'notifEnd';

  useEffect(() => {
    const loadSavedTimes = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data().notificationStartTime && userDoc.data().notificationEndTime) {
          const savedStart = userDoc.data().notificationStartTime;
          const savedEnd = userDoc.data().notificationEndTime;
          setStartTime(savedStart);
          setEndTime(savedEnd);
          await AsyncStorage.setItem(STORAGE_KEY_START, savedStart);
          await AsyncStorage.setItem(STORAGE_KEY_END, savedEnd);
        } else {
          const savedStart = await AsyncStorage.getItem(STORAGE_KEY_START);
          const savedEnd = await AsyncStorage.getItem(STORAGE_KEY_END);
          
          if (savedStart && savedEnd) {
            setStartTime(savedStart);
            setEndTime(savedEnd);
          } else {
            await AsyncStorage.setItem(STORAGE_KEY_START, initialStartTime);
            await AsyncStorage.setItem(STORAGE_KEY_END, initialEndTime);
            setStartTime(initialStartTime);
            setEndTime(initialEndTime);
            
            await setDoc(userRef, {
              notificationStartTime: initialStartTime,
              notificationEndTime: initialEndTime
            }, { merge: true });
          }
        }
      } catch (error) {
        console.error('Error loading saved times:', error);
      }
    };
    
    loadSavedTimes();
  }, []);

  const timeToDate = (time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const dateToTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimePress = (type: 'start' | 'end') => {
    setEditingTime(type);
    const currentTime = type === 'start' ? startTime : endTime;
    setTempDate(timeToDate(currentTime));
    
    if (Platform.OS === 'ios') {
      setShowPicker(true);
    } else {
      setShowPicker(true);
    }
  };

  const handleTimeConfirm = async (selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate && editingTime) {
      const newTime = dateToTime(selectedDate);
      
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn("No user logged in");
          return;
        }

        const userRef = doc(db, "users", user.uid);

        if (editingTime === 'start') {
          setStartTime(newTime);
          
          // Zapisz do Firestore
          await setDoc(userRef, {
            notificationStartTime: newTime,
            updatedAt: new Date()
          }, { merge: true });
          
          // Zapisz lokalnie
          await AsyncStorage.setItem(STORAGE_KEY_START, newTime);
          
          onTimeChange?.(newTime, endTime);
          console.log("Start time saved:", newTime);
        } else {
          setEndTime(newTime);
          
          // Zapisz do Firestore
          await setDoc(userRef, {
            notificationEndTime: newTime,
            updatedAt: new Date()
          }, { merge: true });
          
          // Zapisz lokalnie
          await AsyncStorage.setItem(STORAGE_KEY_END, newTime);
          
          onTimeChange?.(startTime, newTime);
          console.log("End time saved:", newTime);
        }
      } catch (error) {
        console.error("Error saving notification time:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowPicker(false);
    setEditingTime(null);
  };

  const handleDone = () => {
    handleTimeConfirm(tempDate);
    setShowPicker(false);
    setEditingTime(null);
  };

  const TimeButton = ({ time, onPress }: { time: string; onPress: () => void }) => (
    <BlurView intensity={10} tint="dark">
      <TouchableOpacity style={styles.timeButton} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.timeText}>{time}</Text>
        <Ionicons name="time-outline" size={20} color="#333" />
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        W których godzinach chcesz{'\n'}otrzymać powiadomienia?
      </Text>

      <View style={styles.timeContainer}>
        <TimeButton time={startTime} onPress={() => handleTimePress('start')} />
        
        <View style={styles.separator} />
        
        <TimeButton time={endTime} onPress={() => handleTimePress('end')} />
      </View>

      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalBackground} 
              activeOpacity={1}
              onPress={handleCancel}
            />
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelButton}>Anuluj</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Wybierz godzinę</Text>
                <TouchableOpacity onPress={handleDone}>
                  <Text style={styles.doneButton}>Gotowe</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="time"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setTempDate(date);
                }}
                style={styles.picker}
                locale="pl-PL"
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display="default"
          is24Hour={true}
          onChange={(event, date) => {
            if (event.type === 'set') {
              handleTimeConfirm(date);
            } else {
              handleCancel();
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'KodchasanRegular',
    marginBottom: 20
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  timeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7B68EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    height: 50,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#7B68EE',
    marginRight: 4,
  },
  separator: {
    width: 30,
    height: 2,
    backgroundColor: '#7B68EE',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'black',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  doneButton: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  picker: {
    height: 200,
  },
});

export default NotificationTimePicker;