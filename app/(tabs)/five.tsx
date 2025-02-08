import { StyleSheet, TextInput, Dimensions, Pressable, LogBox } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

// Ignore the specific warning
// LogBox.ignoreLogs([
//   'Warning: CountryItem: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.',
// ]);

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Simple mapping of country codes to flag emojis
const countries = {
  'PS': '🇵🇸',
  'US': '🇺🇸',
  'GB': '🇬🇧',
  'FR': '🇫🇷',
  'DE': '🇩🇪',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  // Add more countries as needed
};

export default function SettingsScreen() {
  const [name, setName] = useState('Marilyn');
  const [gender, setGender] = useState('F'); // 'M' for male, 'F' for female
  const [countryCode, setCountryCode] = useState<CountryCode>('PS');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const getFlag = (code: string) => countries[code as keyof typeof countries] || '🏳️';

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setShowCountryPicker(false);
  };

  const commonPickerProps = {
    countryCode,
    theme: {
      primaryColor: '#6212B1',
      primaryColorVariant: 'rgba(98,18,177,0.1)',
      backgroundColor: 'transparent',
      onBackgroundTextColor: '#666',
      fontSize: SCREEN_HEIGHT * 0.016,
      fontFamily: undefined,
      filterPlaceholderTextColor: '#666',
      activeOpacity: 0.7,
    },
    containerButtonStyle: styles.countryPickerButton,
    closeButtonImageStyle: { tintColor: '#666' },
    withCloseButton: true,
    placeholder: '',
    preferredCountries: ['PS', 'US', 'GB'],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingsContainer}>
        {/* Name Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            cursorColor="#6212B1"
            selectionColor="rgba(98,18,177,0.3)"
          />
        </View>

        {/* Gender Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Gender</Text>
          <View style={styles.genderContainer}>
            <Pressable 
              style={[
                styles.genderButton,
                gender === 'M' && styles.genderButtonActive
              ]}
              onPress={() => setGender('M')}
            >
              <FontAwesome5 
                name="mars" 
                size={SCREEN_HEIGHT * 0.02} 
                color={gender === 'M' ? '#6212B1' : '#666'} 
              />
              <Text style={[
                styles.genderText,
                gender === 'M' && styles.genderTextActive
              ]}>Male</Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.genderButton,
                gender === 'F' && styles.genderButtonActive
              ]}
              onPress={() => setGender('F')}
            >
              <FontAwesome5 
                name="venus" 
                size={SCREEN_HEIGHT * 0.02} 
                color={gender === 'F' ? '#6212B1' : '#666'} 
              />
              <Text style={[
                styles.genderText,
                gender === 'F' && styles.genderTextActive
              ]}>Female</Text>
            </Pressable>
          </View>
        </View>

        {/* Country Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Country</Text>
          <Pressable 
            style={styles.countryPicker}
            onPress={() => setShowCountryPicker(true)}
          >
            <CountryPicker
              {...commonPickerProps}
              withFilter
              withFlag
              withEmoji
              onSelect={onSelect}
              visible={showCountryPicker}
              onClose={() => setShowCountryPicker(false)}
              renderFlagButton={() => (
                <View style={styles.flagButton}>
                  <CountryPicker
                    {...commonPickerProps}
                    withFlag
                    withEmoji
                    withFilter={false}
                    visible={false}
                    onSelect={() => {}}
                  />
                  <FontAwesome5 name="chevron-down" size={SCREEN_HEIGHT * 0.016} color="#666" />
                </View>
              )}
            />
          </Pressable>
        </View>

        {/* Development Notice */}
        <View style={styles.developmentNotice}>
          <FontAwesome5 name="tools" size={SCREEN_HEIGHT * 0.02} color="#666" />
          <Text style={styles.developmentText}>
            More settings are under development
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.04,
  },
  title: {
    fontSize: SCREEN_HEIGHT * 0.03,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  settingsContainer: {
    width: '100%',
  },
  settingItem: {
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  settingLabel: {
    fontSize: SCREEN_HEIGHT * 0.018,
    marginBottom: SCREEN_HEIGHT * 0.01,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    borderRadius: 8,
    padding: SCREEN_HEIGHT * 0.012,
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#666',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.03,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SCREEN_HEIGHT * 0.012,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    flex: 1,
    justifyContent: 'center',
    gap: SCREEN_WIDTH * 0.02,
  },
  genderButtonActive: {
    borderColor: '#6212B1',
    backgroundColor: 'rgba(98,18,177,0.1)',
  },
  genderText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
  },
  genderTextActive: {
    color: '#6212B1',
    fontWeight: '500',
  },
  countryPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    borderRadius: 8,
    padding: SCREEN_HEIGHT * 0.012,
  },
  flagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  developmentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.04,
    padding: SCREEN_HEIGHT * 0.02,
    backgroundColor: 'rgba(150,150,150,0.1)',
    borderRadius: 8,
    gap: SCREEN_WIDTH * 0.02,
  },
  developmentText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
  },
  countryPickerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN_HEIGHT * 0.05,
  },
});
