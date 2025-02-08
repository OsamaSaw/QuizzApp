import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FontAwesome name="trophy" size={80} color="#FFD700" style={styles.icon} />
        
        <Text style={styles.title}>Leaderboard</Text>
        
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
          <Text style={styles.subText}>
            We're working hard to bring you an amazing leaderboard experience!
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Future Features:</Text>
          <View style={styles.featureItem}>
            <FontAwesome name="trophy" size={20} color="#FFD700" style={[styles.featureIcon, { width: 30 }]} />
            <Text style={styles.featureText}>Global Rankings</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="map-marker" size={20} color="#FFD700" style={[styles.featureIcon, { width: 30 }]} />
            <Text style={styles.featureText}>Local Rankings</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="users" size={20} color="#FFD700" style={[styles.featureIcon, { width: 30 }]} />
            <Text style={styles.featureText}>Compete with Friends</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="certificate" size={20} color="#FFD700" style={[styles.featureIcon, { width: 30 }]} />
            <Text style={styles.featureText}>Achievement Badges</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comingSoonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6212B1', // Matching the purple from the profile progress bar
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#444',
  },
});
