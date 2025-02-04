import { useLocalSearchParams } from 'expo-router';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from "react";

export default function CustomQuizScreen() {
  const params = useLocalSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState<{label: string; value: string}[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState('');
  const [unclickableOptions, setUnclickableOptions] = useState<string[]>([]);

  useEffect(() => {
    if (params.questions) {
      const parsedQuestions = JSON.parse(params.questions as string);
      setQuestions(parsedQuestions);
      loadQuestion(0, parsedQuestions);
    }
  }, [params.questions]);

  const loadQuestion = (index: number, questionsList = questions) => {
    if (index >= questionsList.length) {
      // Quiz finished - handle completion
      return;
    }

    setCurrentQuestionIndex(index);
    const question = questionsList[index];
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

  const handleAnswer = (option: string) => {
    if (unclickableOptions.includes(option) || answerStatus === 'correct') {
      return;
    }

    const correctAnswer = questions[currentQuestionIndex].answer;
    if (option === correctAnswer) {
      setAnswerStatus('correct');
      setSelectedOption(option);
    } else {
      setAnswerStatus('wrong');
      setSelectedOption(null);
      setUnclickableOptions(prev => [...prev, option]);
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
          option.value === questions[currentQuestionIndex].answer &&
          styles.correctOption,
          unclickableOptions.includes(option.value) && styles.unclickableOption,
        ]}
        onPress={() => handleAnswer(option.value)}
        disabled={unclickableOptions.includes(option.value) || answerStatus === 'correct'}>
        <Text>{option.label}</Text>
      </TouchableOpacity>
    ));
  };

  const renderExplanation = () => {
    if (answerStatus === 'correct') {
      return (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            {questions[currentQuestionIndex].explanation}
          </Text>
          <Button 
            title="Next Question" 
            onPress={() => loadQuestion(currentQuestionIndex + 1)} 
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Quiz</Text>
      <Text style={styles.questionText}>{currentQuestion}</Text>
      <View style={styles.optionsContainer}>{renderOptions()}</View>
      {renderExplanation()}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
  },
  correctOption: {
    backgroundColor: '#90EE90',
  },
  unclickableOption: {
    backgroundColor: '#FFB6C1',
  },
  explanationContainer: {
    marginTop: 20,
    width: '100%',
  },
  explanationText: {
    fontStyle: 'italic',
    marginBottom: 15,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
}); 