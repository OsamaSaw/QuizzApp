import { StyleSheet, Dimensions, Pressable, TextInput, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type IssueType = 'question' | 'technical' | 'other' | null;

export default function AboutScreen() {
  const [selectedIssue, setSelectedIssue] = useState<IssueType>(null);
  const [message, setMessage] = useState('');
  const [questionRef, setQuestionRef] = useState('');
  const [email, setEmail] = useState('');
  const [allowContact, setAllowContact] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* About Section */}
      <View style={styles.section}>
        <View style={styles.headerContainer}>
          <FontAwesome5 name="book-reader" size={SCREEN_HEIGHT * 0.03} color="#6212B1" />
          <Text style={styles.title}>About QuizApp</Text>
        </View>
        <View style={styles.aboutCard}>
          <View style={styles.missionContainer}>
            <FontAwesome5 name="lightbulb" size={SCREEN_HEIGHT * 0.025} color="#FFD700" solid />
            <Text style={styles.missionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.description}>
            QuizApp was born from a passion for learning and the belief that education should be engaging and accessible to everyone. Our mission is to make learning fun and interactive while challenging users to expand their knowledge across various topics.
          </Text>
          <View style={styles.separator} />
          <View style={styles.missionContainer}>
            <FontAwesome5 name="rocket" size={SCREEN_HEIGHT * 0.025} color="#6212B1" solid />
            <Text style={styles.missionTitle}>Our Journey</Text>
          </View>
          <Text style={styles.description}>
            Started in 2024, we're committed to providing high-quality, verified questions and a seamless learning experience for our growing community of knowledge seekers.
          </Text>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <View style={styles.headerContainer}>
          <FontAwesome5 name="headset" size={SCREEN_HEIGHT * 0.03} color="#6212B1" />
          <Text style={styles.title}>Contact Us</Text>
        </View>
        <View style={styles.contactCard}>
          <Text style={styles.subtitle}>Having issues? Let us know!</Text>

          <Text style={styles.sectionLabel}>Select Issue Type</Text>
          <View style={styles.issueTypes}>
            <Pressable 
              style={[
                styles.issueButton,
                selectedIssue === 'question' && styles.issueButtonActive
              ]}
              onPress={() => setSelectedIssue('question')}
            >
              <FontAwesome5 
                name="question-circle" 
                size={SCREEN_HEIGHT * 0.02} 
                color={selectedIssue === 'question' ? '#6212B1' : '#666'} 
              />
              <Text style={[
                styles.issueText,
                selectedIssue === 'question' && styles.issueTextActive
              ]}>Question Issue</Text>
            </Pressable>

            <Pressable 
              style={[
                styles.issueButton,
                selectedIssue === 'technical' && styles.issueButtonActive
              ]}
              onPress={() => setSelectedIssue('technical')}
            >
              <FontAwesome5 
                name="tools" 
                size={SCREEN_HEIGHT * 0.02} 
                color={selectedIssue === 'technical' ? '#6212B1' : '#666'} 
              />
              <Text style={[
                styles.issueText,
                selectedIssue === 'technical' && styles.issueTextActive
              ]}>Technical Issue</Text>
            </Pressable>

            <Pressable 
              style={[
                styles.issueButton,
                selectedIssue === 'other' && styles.issueButtonActive
              ]}
              onPress={() => setSelectedIssue('other')}
            >
              <FontAwesome5 
                name="comment-dots" 
                size={SCREEN_HEIGHT * 0.02} 
                color={selectedIssue === 'other' ? '#6212B1' : '#666'} 
              />
              <Text style={[
                styles.issueText,
                selectedIssue === 'other' && styles.issueTextActive
              ]}>Other</Text>
            </Pressable>
          </View>

          {selectedIssue && (
            <View style={styles.messageContainer}>
              {selectedIssue === 'question' && (
                <TextInput
                  style={[styles.input, { marginBottom: SCREEN_HEIGHT * 0.015 }]}
                  placeholder="Question Reference ID"
                  placeholderTextColor="#666"
                  value={questionRef}
                  onChangeText={setQuestionRef}
                  cursorColor="#6212B1"
                  selectionColor="rgba(98,18,177,0.3)"
                />
              )}

              <TextInput
                style={styles.messageInput}
                multiline
                numberOfLines={6}
                placeholder="Describe your issue here..."
                placeholderTextColor="#666"
                value={message}
                onChangeText={setMessage}
                cursorColor="#6212B1"
                selectionColor="rgba(98,18,177,0.3)"
              />

              <View style={styles.emailSection}>
                <TextInput
                  style={[styles.input, { marginBottom: SCREEN_HEIGHT * 0.01 }]}
                  placeholder="Your email (optional)"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  cursorColor="#6212B1"
                  selectionColor="rgba(98,18,177,0.3)"
                />
                
                <Pressable 
                  style={styles.checkboxContainer}
                  onPress={() => setAllowContact(!allowContact)}
                >
                  <View style={[
                    styles.checkbox,
                    allowContact && styles.checkboxChecked
                  ]}>
                    {allowContact && (
                      <FontAwesome5 name="check" size={12} color="white" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Allow us to contact you about this issue
                  </Text>
                </Pressable>
              </View>

              <Pressable style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
                <FontAwesome5 name="paper-plane" size={16} color="white" />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* Version Info */}
      <View style={styles.versionCard}>
        <FontAwesome5 name="code-branch" size={SCREEN_HEIGHT * 0.02} color="#666" />
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.04,
  },
  section: {
    marginBottom: SCREEN_HEIGHT * 0.04,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.03,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  title: {
    fontSize: SCREEN_HEIGHT * 0.03,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
    lineHeight: SCREEN_HEIGHT * 0.024,
  },
  subtitle: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#444',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  aboutCard: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 15,
    padding: SCREEN_HEIGHT * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  missionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  missionTitle: {
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: '600',
    color: '#444',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(150,150,150,0.2)',
    marginVertical: SCREEN_HEIGHT * 0.02,
  },
  contactCard: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 15,
    padding: SCREEN_HEIGHT * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionLabel: {
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: '500',
    color: '#444',
    marginTop: SCREEN_HEIGHT * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  issueTypes: {
    gap: SCREEN_HEIGHT * 0.01,
  },
  issueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SCREEN_HEIGHT * 0.015,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    gap: SCREEN_WIDTH * 0.02,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  issueButtonActive: {
    borderColor: '#6212B1',
    backgroundColor: 'rgba(98,18,177,0.1)',
  },
  issueText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
  },
  issueTextActive: {
    color: '#6212B1',
    fontWeight: '500',
  },
  messageContainer: {
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    borderRadius: 12,
    padding: SCREEN_HEIGHT * 0.015,
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  submitButton: {
    backgroundColor: '#6212B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SCREEN_HEIGHT * 0.015,
    borderRadius: 12,
    marginTop: SCREEN_HEIGHT * 0.02,
    gap: SCREEN_WIDTH * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: '500',
  },
  versionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SCREEN_WIDTH * 0.02,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: SCREEN_HEIGHT * 0.015,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
  },
  versionText: {
    color: '#666',
    fontSize: SCREEN_HEIGHT * 0.014,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    borderRadius: 8,
    padding: SCREEN_HEIGHT * 0.012,
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
  },
  emailSection: {
    marginTop: SCREEN_HEIGHT * 0.015,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.02,
  },
  checkbox: {
    width: SCREEN_HEIGHT * 0.024,
    height: SCREEN_HEIGHT * 0.024,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6212B1',
    borderColor: '#6212B1',
  },
  checkboxLabel: {
    fontSize: SCREEN_HEIGHT * 0.014,
    color: '#666',
  },
});
