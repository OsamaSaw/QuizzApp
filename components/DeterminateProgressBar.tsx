import React, { useEffect, useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const HEIGHT = 15;

type DeterminateProgressBarProps = {
  color?: string;
  style?: StyleProp<ViewStyle>;
  progress: number;
  retrigger?: boolean;
};
export const DeterminateProgressBar = ({
  color = "#0000FF",
  style,
  progress,
  retrigger,
}: DeterminateProgressBarProps) => {
  const { backgroundColor, foregroundColor } = useMemo(() => {
    return {
      backgroundColor: "#EEECEE",
      foregroundColor: color,
    };
  }, [color]);

  const progressWidth = useSharedValue(0);
  const containerWidth = useSharedValue(0);

  useEffect(() => {
    if (progress > 1 || progress < 0) {
      throw new Error("Invalid range (progress should be between 0 and 1)");
    }
    progressWidth.value = 0;
    progressWidth.value = withSpring(progress * containerWidth.value);
  }, [progress, retrigger, containerWidth]);

  const onLayout = (event: LayoutChangeEvent) => {
    containerWidth.value = event.nativeEvent.layout.width;
  };

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: progressWidth.value,
      height: HEIGHT,
    };
  });

  return (
    <View
      style={[style, styles.container, { backgroundColor }]}
      onLayout={onLayout}
    >
      <Animated.View
        style={[
          progressStyle,
          { backgroundColor: foregroundColor, borderRadius: 20 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    borderRadius: 20,
  },
});
