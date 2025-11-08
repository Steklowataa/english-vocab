import { useState } from 'react';
import { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

export const useFlipAnimation = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const rotate = useDerivedValue(() => {
    return withTiming(isFlipped ? 180 : 0, { duration: 300 });
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotate.value}deg` }],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotate.value + 180}deg` }],
    };
  });

  return { isFlipped, setIsFlipped, frontAnimatedStyle, backAnimatedStyle };
};
