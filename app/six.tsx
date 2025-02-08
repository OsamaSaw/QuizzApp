import { Button, StyleSheet, TouchableOpacity, Dimensions, Pressable, Modal, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

import questions from '@/assets/quesions/qs.json';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type QuestionTiming = {
  questionIndex: number;
  timeSpent: number;
};

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState('');
  const [unclickableOptions, setUnclickableOptions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    skippedQuestions: 0,
    score: 0,
    questionsDetails: [],
  });
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [quizStartTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [questionTimings, setQuestionTimings] = useState<QuestionTiming[]>([]);
  const modalVisible = useRef(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Initialize quiz questions
    if (params.questions) {
      const customQuestions = JSON.parse(params.questions as string);
      setQuizQuestions(customQuestions);
      loadQuestion(0, customQuestions);
    } else {
      setQuizQuestions(questions.questions);
      const randomIndex = Math.floor(Math.random() * questions.questions.length);
      loadQuestion(randomIndex, questions.questions);
    }
  }, [params.questions]);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const loadQuestion = (index: number, questionsList: any[]) => {
    if (!questionsList || questionsList.length === 0) return;
    
    // If we've already answered 20 questions, finish the quiz
    if (quizResults.questionsDetails.length >= 20) {
      handleNextQuestion();
      return;
    }
    
    const question = questionsList[index];
    // Normalize the answer field (handle both "answer" and "Answer")
    const answer = question?.answer || question?.Answer;
    
    if (!question || !question.q || !answer || !question.A || !question.B || !question.C || !question.D) {
      console.warn('Invalid question format:', question);
      // Skip to next question or handle invalid question
      if (index + 1 < questionsList.length) {
        loadQuestion(index + 1, questionsList);
      }
      return;
    }
    
    setCurrentQuestionIndex(index);
    setCurrentQuestion(question.q);
    setOptions([
      {label: question.A, value: 'A'},
      {label: question.B, value: 'B'},
      {label: question.C, value: 'C'},
      {label: question.D, value: 'D'},
    ]);
    setSelectedOption(null);
    setAnswerStatus('');
    setUnclickableOptions([]);
  };

  const handleSkip = () => {
    recordQuestionTime();
    const currentQuestion = quizQuestions[currentQuestionIndex];
    setQuizResults(prev => ({
      ...prev,
      skippedQuestions: prev.skippedQuestions + 1,
      questionsDetails: [
        ...prev.questionsDetails,
        {
          question: currentQuestion.q,
          status: 'skipped',
          attempts: 0,
          correctAnswer: currentQuestion.answer || currentQuestion.Answer,
          explanation: currentQuestion.explanation,
          A: currentQuestion.A,
          B: currentQuestion.B,
          C: currentQuestion.C,
          D: currentQuestion.D
        }
      ]
    }));
    handleNextQuestion();
  };

  const handleAnswer = (option: string) => {
    if (!quizQuestions || quizQuestions.length === 0) return;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion?.answer || currentQuestion?.Answer;
    
    if (!currentQuestion || !correctAnswer) {
      console.warn('Question has no answer:', currentQuestion);
      return;
    }

    if (unclickableOptions.includes(option) || answerStatus === 'correct') {
      return;
    }

    const attempts = unclickableOptions.length + 1;

    if (option === correctAnswer) {
      setAnswerStatus('correct');
      setSelectedOption(option);
      
      // Determine answer quality based on attempts
      const status = attempts === 1 ? 'perfect' : attempts === 2 ? 'good' : 'okay';
      
      setQuizResults(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        score: prev.score + (attempts === 1 ? 5 : attempts === 2 ? 3 : 1),
        questionsDetails: [
          ...prev.questionsDetails,
          {
            question: currentQuestion.q,
            status,
            attempts,
            correctAnswer,
            explanation: currentQuestion.explanation,
            A: currentQuestion.A,
            B: currentQuestion.B,
            C: currentQuestion.C,
            D: currentQuestion.D
          }
        ]
      }));
    } else {
      setAnswerStatus('wrong');
      setSelectedOption(option);
      setUnclickableOptions(prev => [...prev, option]);
      
      if (attempts >= 3) { // This means it's the 4th attempt
        setQuizResults(prev => ({
          ...prev,
          wrongAnswers: prev.wrongAnswers + 1,
          score: Math.max(0, prev.score - 1),
          questionsDetails: [
            ...prev.questionsDetails,
            {
              question: currentQuestion.q,
              status: 'failed',
              attempts: 4,
              correctAnswer,
              explanation: currentQuestion.explanation,
              A: currentQuestion.A,
              B: currentQuestion.B,
              C: currentQuestion.C,
              D: currentQuestion.D
            }
          ]
        }));
      }
    }
  };

  const handleNextQuestion = () => {
    recordQuestionTime();
    if (!quizQuestions || quizQuestions.length === 0) return;
    
    // Check if we've completed 20 questions
    if (quizResults.questionsDetails.length >= 20) {
      const finalResults = {
        ...quizResults,
        totalQuestions: 20, // Explicitly set to 20
        perfectAnswers: quizResults.questionsDetails.filter(q => q.status === 'perfect').length,
        goodAnswers: quizResults.questionsDetails.filter(q => q.status === 'good').length,
        okayAnswers: quizResults.questionsDetails.filter(q => q.status === 'okay').length,
        failedAnswers: quizResults.questionsDetails.filter(q => q.status === 'failed').length,
        skippedQuestions: quizResults.questionsDetails.filter(q => q.status === 'skipped').length,
      };

      // Verify total adds up to 20
      const total = finalResults.perfectAnswers + 
                   finalResults.goodAnswers + 
                   finalResults.okayAnswers + 
                   finalResults.failedAnswers + 
                   finalResults.skippedQuestions;

      console.log('Question count verification:', {
        total,
        perfect: finalResults.perfectAnswers,
        good: finalResults.goodAnswers,
        okay: finalResults.okayAnswers,
        failed: finalResults.failedAnswers,
        skipped: finalResults.skippedQuestions
      });

      if (total !== 20) {
        console.warn('Question count mismatch:', total);
      }
      
      router.push({
        pathname: '/quizResults',
        params: { results: JSON.stringify(finalResults) }
      });
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= quizQuestions.length) {
      // If we run out of questions but haven't reached 20, start over
      loadQuestion(0, quizQuestions);
    } else {
      loadQuestion(nextIndex, quizQuestions);
    }
  };

  const renderOptions = () => {
    return options.map(option => (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.optionButton,
          selectedOption === option.value && styles.selectedOption,
          answerStatus === 'correct' && 
          option.value === quizQuestions[currentQuestionIndex].answer && 
          styles.correctOption,
          selectedOption === option.value && 
          answerStatus === 'wrong' && 
          styles.wrongOption,
          unclickableOptions.includes(option.value) && styles.unclickableOption,
        ]}
        onPress={() => handleAnswer(option.value)}
        disabled={unclickableOptions.includes(option.value) || answerStatus === 'correct'}
      >
        <Text>{option.label}</Text>
      </TouchableOpacity>
    ));
  };

  const renderExplanation = () => {
    if (answerStatus === 'correct') {
      return (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            {quizQuestions[currentQuestionIndex].explanation}
          </Text>
        </View>
      );
    }
    return null;
  };

  const recordQuestionTime = () => {
    const endTime = new Date();
    const timeSpent = endTime.getTime() - questionStartTime.getTime();
    setQuestionTimings(prev => [...prev, {
      questionIndex: currentQuestionIndex,
      timeSpent
    }]);
    setQuestionStartTime(new Date());
  };

  const getTotalTime = () => {
    const totalSeconds = Math.floor((currentTime.getTime() - quizStartTime.getTime()) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Only render if we have questions loaded
  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Exit Button - only show when modal is not visible */}
      {!modalVisible.current && (
        <Pressable 
          style={styles.exitButton}
          onPress={() => {
            modalVisible.current = true;
            setShowExitModal(true);
          }}
        >
          <FontAwesome5 name="times" size={SCREEN_HEIGHT * 0.02} color="#666" />
        </Pressable>
      )}

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <FontAwesome5 name="clock" size={SCREEN_HEIGHT * 0.016} color="#666" />
        <Text style={styles.timerText}>{getTotalTime()}</Text>
      </View>

      {/* Progress and Score */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1}/{quizQuestions.length}
        </Text>
        <Text style={styles.scoreText}>Score: {quizResults.score}</Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion}</Text>
      </View>

      {/* Answers */}
      <View style={styles.optionsContainer}>{renderOptions()}</View>

      {renderExplanation()}

      <View style={styles.buttonContainer}>
        {answerStatus !== 'correct' && unclickableOptions.length === 0 && (
          <Pressable 
            style={styles.actionButton}
            onPress={handleSkip}
          >
            <FontAwesome5 name="forward" size={SCREEN_HEIGHT * 0.016} color="white" />
            <Text style={styles.actionButtonText}>Skip</Text>
          </Pressable>
        )}
        {answerStatus === 'correct' && (
          <Pressable 
            style={[styles.actionButton, styles.nextButton]}
            onPress={handleNextQuestion}
          >
            <Text style={styles.actionButtonText}>Next</Text>
            <FontAwesome5 name="arrow-right" size={SCREEN_HEIGHT * 0.016} color="white" />
          </Pressable>
        )}
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Exit Confirmation Modal */}
      <Modal
        transparent
        visible={showExitModal}
        animationType="fade"
        onRequestClose={() => {
          modalVisible.current = false;
          setShowExitModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Exit Quiz?</Text>
            <Text style={styles.modalText}>Are you sure you want to exit? Your progress will be lost.</Text>
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  modalVisible.current = false;
                  setShowExitModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, styles.exitConfirmButton]}
                onPress={() => {
                  modalVisible.current = false;
                  setShowExitModal(false);
                  navigation.navigate('three')
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#FF5252' }]}>Exit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionText: {
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    padding: SCREEN_HEIGHT * 0.015,
    marginVertical: SCREEN_HEIGHT * 0.008,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  selectedOption: {
    borderColor: '#6212B1',
    backgroundColor: 'rgba(98,18,177,0.1)',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76,175,80,0.1)',
  },
  wrongOption: {
    borderColor: '#FF5252',
    backgroundColor: 'rgba(255,82,82,0.1)',
  },
  unclickableOption: {
    borderColor: '#FF5252',
    backgroundColor: 'rgba(255,82,82,0.1)',
  },
  explanationContainer: {
    marginTop: 20,
  },
  explanationText: {
    fontStyle: 'italic',
    marginHorizontal:20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
    gap: SCREEN_WIDTH * 0.03,
  },
  exitButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.02,
    right: SCREEN_WIDTH * 0.04,
    padding: SCREEN_HEIGHT * 0.01,
    zIndex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  progressText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#666',
  },
  scoreText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    fontWeight: '600',
    color: '#6212B1',
  },
  questionContainer: {
    backgroundColor: 'rgba(98,18,177,0.05)',
    padding: SCREEN_HEIGHT * 0.03,
    borderRadius: 15,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: SCREEN_HEIGHT * 0.03,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: SCREEN_HEIGHT * 0.024,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  modalText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.03,
  },
  modalButton: {
    paddingVertical: SCREEN_HEIGHT * 0.012,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButton: {
    borderColor: 'rgba(150,150,150,0.2)',
  },
  exitConfirmButton: {
    borderColor: '#FF5252',
  },
  modalButtonText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: '500',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.02,
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.02,
    left: SCREEN_WIDTH * 0.04,
  },
  timerText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
    fontFamily: 'monospace',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SCREEN_WIDTH * 0.02,
    backgroundColor: '#6212B1',
    paddingVertical: SCREEN_HEIGHT * 0.012,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderRadius: 8,
    minWidth: SCREEN_WIDTH * 0.3,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: 'white',
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: '500',
  },
});
