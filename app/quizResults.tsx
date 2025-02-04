import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  score: number;
  perfectAnswers: number;
  goodAnswers: number;
  okayAnswers: number;
  failedAnswers: number;
  questionsDetails: {
    question: string;
    status: 'perfect' | 'good' | 'okay' | 'failed' | 'skipped';
    attempts: number;
    correctAnswer?: string;
    explanation?: string;
    A?: string;
    B?: string;
    C?: string;
    D?: string;
  }[];
}

const STATUS_STYLES = {
  perfect: {
    color: '#4CAF50', // Green
    icon: 'star',
    backgroundColor: '#E8F5E9'
  },
  good: {
    color: '#2196F3', // Blue
    icon: 'check-circle',
    backgroundColor: '#E3F2FD'
  },
  okay: {
    color: '#FFC107', // Amber
    icon: 'check',
    backgroundColor: '#FFF8E1'
  },
  failed: {
    color: '#F44336', // Red
    icon: 'times-circle',
    backgroundColor: '#FFEBEE'
  },
  skipped: {
    color: '#757575', // Grey
    icon: 'circle-o',
    backgroundColor: '#F5F5F5'
  }
};

export default function QuizResultsScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (params.results) {
      setResults(JSON.parse(params.results as string));
    }
  }, [params.results]);

  if (!results) return null;

  const toggleQuestion = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz Results</Text>
        <Text style={styles.score}>Final Score: {results.score}</Text>
        <Text style={styles.totalQuestions}>
          Total Questions: {results.totalQuestions} / 20
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: STATUS_STYLES.perfect.backgroundColor }]}>
            <Text style={[styles.statNumber, { color: STATUS_STYLES.perfect.color }]}>
              {results.perfectAnswers}
            </Text>
            <Text style={styles.statLabel}>Perfect</Text>
            <Text style={styles.statPoints}>(First Try)</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: STATUS_STYLES.good.backgroundColor }]}>
            <Text style={[styles.statNumber, { color: STATUS_STYLES.good.color }]}>
              {results.goodAnswers}
            </Text>
            <Text style={styles.statLabel}>Good</Text>
            <Text style={styles.statPoints}>(Second Try)</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: STATUS_STYLES.okay.backgroundColor }]}>
            <Text style={[styles.statNumber, { color: STATUS_STYLES.okay.color }]}>
              {results.okayAnswers}
            </Text>
            <Text style={styles.statLabel}>Okay</Text>
            <Text style={styles.statPoints}>(Third Try)</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: STATUS_STYLES.failed.backgroundColor }]}>
            <Text style={[styles.statNumber, { color: STATUS_STYLES.failed.color }]}>
              {results.failedAnswers}
            </Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: STATUS_STYLES.skipped.backgroundColor }]}>
            <Text style={[styles.statNumber, { color: STATUS_STYLES.skipped.color }]}>
              {results.skippedQuestions}
            </Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>
        </View>

        <View style={styles.questionsContainer}>
          <Text style={styles.sectionTitle}>Questions Summary</Text>
          {results.questionsDetails.map((detail, index) => (
            <Pressable 
              key={index} 
              onPress={() => toggleQuestion(index)}
              style={[
                styles.questionItem, 
                { borderLeftColor: STATUS_STYLES[detail.status].color, borderLeftWidth: 4 }
              ]}
            >
              <View style={styles.questionHeader}>
                <FontAwesome 
                  name={STATUS_STYLES[detail.status].icon}
                  size={24} 
                  color={STATUS_STYLES[detail.status].color}
                />
                <View style={styles.questionInfo}>
                  <Text 
                    style={styles.questionText} 
                    numberOfLines={expandedQuestion === index ? undefined : 2}
                  >
                    {detail.question}
                  </Text>
                  {expandedQuestion === index && (
                    <View style={styles.expandedContent}>
                      <View style={styles.optionsContainer}>
                        <Text style={styles.optionsTitle}>Options:</Text>
                        {['A', 'B', 'C', 'D'].map((opt) => (
                          <Text 
                            key={opt}
                            style={[
                              styles.optionText,
                              !detail.status.includes('skipped') && 
                              opt === detail.correctAnswer && 
                              styles.correctOptionText
                            ]}
                          >
                            {opt}: {detail[opt]}
                            {!detail.status.includes('skipped') && 
                             opt === detail.correctAnswer && 
                             ' ✓'}
                          </Text>
                        ))}
                        {detail.status === 'skipped' && (
                          <Text style={styles.skippedNote}>
                            Answer and explanation hidden for skipped questions
                          </Text>
                        )}
                      </View>
                      {detail.explanation && !detail.status.includes('skipped') && (
                        <View style={styles.explanationBox}>
                          <Text style={styles.explanationTitle}>Explanation:</Text>
                          <Text style={styles.explanationText}>
                            {detail.explanation}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.attemptsText}>
                        {detail.status === 'skipped' 
                          ? 'Question Skipped'
                          : `Answered in ${detail.attempts} ${detail.attempts === 1 ? 'attempt' : 'attempts'}`
                        }
                      </Text>
                    </View>
                  )}
                </View>
                <FontAwesome 
                  name={expandedQuestion === index ? 'chevron-up' : 'chevron-down'} 
                  size={16} 
                  color="#666"
                  style={styles.expandIcon}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('three')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('two')}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            New Quiz
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2C3E50',
  },
  score: {
    fontSize: 22,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 5,
  },
  totalQuestions: {
    fontSize: 18,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#34495E',
  },
  questionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionInfo: {
    flex: 1,
    marginLeft: 10,
  },
  questionText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statPoints: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    marginLeft: 'auto',
    padding: 5,
  },
  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  optionsContainer: {
    marginBottom: 15,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2C3E50',
  },
  optionText: {
    fontSize: 15,
    marginBottom: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  correctOptionText: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    fontWeight: '500',
  },
  explanationBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#2C3E50',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#34495E',
  },
  attemptsText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#7F8C8D',
    marginTop: 5,
  },
  skippedNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: STATUS_STYLES.skipped.color,
    marginTop: 8,
    textAlign: 'center',
  },
}); 