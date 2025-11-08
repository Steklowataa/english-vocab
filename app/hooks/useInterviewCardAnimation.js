import { useRef } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const useInterviewCardAnimation = () => {
  const COLLAPSED_Y = height - 150;
  const EXPANDED_Y = height - 340;
  const animatedInterviewY = useRef(new Animated.Value(COLLAPSED_Y)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        const newPos = animatedInterviewY._value + gesture.dy;
        if (newPos >= EXPANDED_Y && newPos <= COLLAPSED_Y) {
          animatedInterviewY.setValue(newPos);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -40) {
          Animated.spring(animatedInterviewY, {
            toValue: EXPANDED_Y,
            useNativeDriver: false,
            friction: 7,
            tension: 80,
          }).start();
        } else {
          Animated.spring(animatedInterviewY, {
            toValue: COLLAPSED_Y,
            useNativeDriver: false,
            friction: 7,
            tension: 80,
          }).start();
        }
      },
    })
  ).current;

  return { animatedInterviewY, panResponder };
};
