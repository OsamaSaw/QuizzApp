import { Pressable, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTENT_HEIGHT = SCREEN_HEIGHT - 100; // Accounting for tab bar and status bar

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const openModal = () => {
    // @ts-ignore
    navigation.navigate('six');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FontAwesome 
          name="question-circle" 
          size={SCREEN_HEIGHT * 0.08} 
          color="#6212B1" 
          style={styles.icon} 
        />
        
        <Text style={styles.title}>Quiz Mode</Text>
        <Text style={styles.subtitle}>Challenge yourself and test your knowledge!</Text>

        <View style={styles.cardsContainer}>
          {/* Quick Quiz Card */}
          <Pressable onPress={openModal} style={styles.card}>
            <View style={styles.cardContent}>
              <FontAwesome
                name="bolt"
                size={32}
                color="#6212B1"
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Quick Quiz</Text>
              <Text style={styles.cardDescription}>
                Jump right into a quiz with all categories.
              </Text>
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Now</Text>
                <FontAwesome name="arrow-right" size={16} color="white" style={{ marginLeft: 8 }} />
              </View>
            </View>
          </Pressable>

          {/* Custom Quiz Card */}
          <Pressable 
            onPress={() => {
              // @ts-ignore
              navigation.navigate('seven')
            }} 
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <FontAwesome
                name="sliders"
                size={32}
                color="#6212B1"
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Custom Quiz</Text>
              <Text style={styles.cardDescription}>
                Select specific categories to include.
              </Text>
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>Customize</Text>
                <FontAwesome name="gear" size={16} color="white" style={{ marginLeft: 8 }} />
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Quiz Tips:</Text>
          <View style={styles.tipItem}>
            <FontAwesome name="lightbulb-o" size={20} color="#FFD700" style={styles.tipIcon} />
            <Text style={styles.tipText}>Take regular breaks between quizzes</Text>
          </View>
          <View style={styles.tipItem}>
            <FontAwesome name="clock-o" size={20} color="#FFD700" style={styles.tipIcon} />
            <Text style={styles.tipText}>Manage your time wisely per question</Text>
          </View>
          <View style={styles.tipItem}>
            <FontAwesome name="star-o" size={20} color="#FFD700" style={styles.tipIcon} />
            <Text style={styles.tipText}>Review your answers before submitting</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    height: CONTENT_HEIGHT,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: SCREEN_HEIGHT * 0.02,
    justifyContent: 'space-between',
  },
  icon: {
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  title: {
    fontSize: SCREEN_HEIGHT * 0.035,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  subtitle: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#666',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  cardsContainer: {
    width: '100%',
    paddingHorizontal: SCREEN_HEIGHT * 0.01,
    flex: 0.7, // Increased to give more space to cards
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: SCREEN_HEIGHT * 0.02,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)', // Subtle border that works in both modes
  },
  cardContent: {
    padding: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    width: '100%', // Ensure content takes full width
  },
  cardIcon: {
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  cardTitle: {
    fontSize: SCREEN_HEIGHT * 0.022,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.008,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: SCREEN_HEIGHT * 0.016,
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_HEIGHT * 0.02,
    opacity: 0.8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6212B1',
    paddingVertical: SCREEN_HEIGHT * 0.01,
    paddingHorizontal: SCREEN_HEIGHT * 0.02,
    borderRadius: 25,
  },
  startButtonText: {
    color: 'white',
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: 'bold',
  },
  tipsContainer: {
    width: '100%',
    padding: SCREEN_HEIGHT * 0.012,
    borderRadius: 15,
    flex: 0.2,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)', // Keep the same subtle border as cards
  },
  tipsTitle: {
    fontSize: SCREEN_HEIGHT * 0.018,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.008,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.006, // Reduced spacing between tips
  },
  tipIcon: {
    width: SCREEN_HEIGHT * 0.025, // Slightly smaller icons
    marginRight: SCREEN_HEIGHT * 0.008,
  },
  tipText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    opacity: 0.8,
  },
});
