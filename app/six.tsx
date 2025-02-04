import {Button, StyleSheet, TouchableOpacity} from 'react-native';

import { Text, View } from '@/components/Themed';
import {useEffect, useState} from "react";

import questions from '@/assets/quesions/qs.json';
import {useNavigation} from "@react-navigation/native";
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

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
      setSelectedOption(null);
      
      if (attempts >= 3) { // This means it's the 4th attempt
        // Show all remaining options as wrong except the correct one
        const remainingOptions = options
          .map(opt => opt.value)
          .filter(opt => !unclickableOptions.includes(opt) && opt !== correctAnswer);
        setUnclickableOptions([...unclickableOptions, ...remainingOptions]);
        
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
      } else {
        setUnclickableOptions(prev => [...prev, option]);
      }
    }
  };

  const handleNextQuestion = () => {
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
              answerStatus === 'wrong' &&
              option.value !== quizQuestions[currentQuestionIndex].answer &&
              styles.wrongOption,
              unclickableOptions.includes(option.value) && styles.unclickableOption,
            ]}
            onPress={() => handleAnswer(option.value)}
            disabled={option.disabled}>
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
            <Button title="Next Question" onPress={handleNextQuestion} />
          </View>
      );
    }
    return null;
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
      <Text style={styles.title}>Quiz</Text>
      <Text style={styles.questionText}>{currentQuestion}</Text>
      <View style={styles.optionsContainer}>{renderOptions()}</View>
      {renderExplanation()}
      <View style={styles.buttonContainer}>
        {answerStatus !== 'correct' && unclickableOptions.length === 0 && (
          <Button title="Skip Question" onPress={handleSkip} />
        )}
        <Button title="Go to Home" onPress={() => navigation.navigate('three')} />
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
  },
  correctOption: {
    backgroundColor: 'lightgreen',
  },
  unclickableOption: {
    backgroundColor: 'lightcoral',
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
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
