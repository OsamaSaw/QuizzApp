import {Button, StyleSheet, TouchableOpacity} from 'react-native';

import { Text, View } from '@/components/Themed';
import {useEffect, useState} from "react";

import questions from '@/assets/quesions/qs.json';
import {useNavigation} from "@react-navigation/native";

export default function TabTwoScreen() {
  const navigation = useNavigation();


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState('');
  const [unclickableOptions, setUnclickableOptions] = useState([]);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.questions.length);
    setCurrentQuestionIndex(randomIndex);
    const question = questions.questions[randomIndex];
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
    const correctAnswer = questions.questions[currentQuestionIndex].answer;

    if (unclickableOptions.includes(option) || answerStatus === 'correct') {
      return; // Exit early if the option is already unclickable
    }

    if (option === correctAnswer) {
      setAnswerStatus('correct');
      setSelectedOption(option);
    } else {
      setAnswerStatus('wrong');
      setSelectedOption(null);
      setUnclickableOptions(prevOptions => [...prevOptions, option]);
      console.log('wrong answer clicked');
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
              option.value === questions.questions[currentQuestionIndex].answer &&
              styles.correctOption,
              answerStatus === 'wrong' &&
              option.value !== questions.questions[currentQuestionIndex].answer &&
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
              {questions.questions[currentQuestionIndex].explanation}
            </Text>
            <Button title="Next Question" onPress={loadQuestion} />
          </View>
      );
    }
    return null;
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Six</Text>
      <Text style={styles.questionText}>{currentQuestion}</Text>
      <View style={styles.optionsContainer}>{renderOptions()}</View>
      {renderExplanation()}
      <Button title="Go to Home" onPress={() => navigation.navigate('three')} />

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
});
