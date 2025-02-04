import {Button, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import { Text, View } from '@/components/Themed';
import {useEffect, useState} from "react";

import questions from '@/assets/quesions/qs.json';
import {useNavigation} from "@react-navigation/native";
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

import categoriesData from '@/assets/quesions/categories.json';

const categories = categoriesData.categories;

export default function CustomQuizSetup() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(catId => catId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleMainCategory = (
      mainCategoryId: string,
      subcategories: {id: string}[],
  ) => {
    const allSelected = subcategories.every(sub =>
        selectedCategories.includes(sub.id),
    );
    const newSelectedCategories = allSelected
        ? selectedCategories.filter(
            catId => !subcategories.some(sub => sub.id === catId),
        )
        : [
          ...new Set([
            ...selectedCategories,
            ...subcategories.map(sub => sub.id),
          ]),
        ];

    setSelectedCategories(newSelectedCategories);
  };

  const toggleExpandCategory = (categoryId: string) => {
    setExpandedCategories(prevExpanded =>
        prevExpanded.includes(categoryId)
            ? prevExpanded.filter(id => id !== categoryId)
            : [...prevExpanded, categoryId],
    );
  };

  const getQuestionsForCategories = () => {
    // Map subcategory IDs to their JSON files
    const questionSources: { [key: string]: any } = {
      '11': require('@/assets/questions/11.json'),
      '12': require('@/assets/questions/12.json'),
      '13': require('@/assets/questions/13.json'),
      '14': require('@/assets/questions/14.json'),
      '21': require('@/assets/questions/21.json'),
      '22': require('@/assets/questions/22.json'),
      '31': require('@/assets/questions/31.json'),
      '32': require('@/assets/questions/32.json'),
      '33': require('@/assets/questions/33.json'),
      '34': require('@/assets/questions/34.json'),
      '35': require('@/assets/questions/35.json'),
      '36': require('@/assets/questions/36.json'),
      '41': require('@/assets/questions/41.json'),
      '42': require('@/assets/questions/42.json')
    };

    const totalQuestionsNeeded = 20;
    const selectedSources = selectedCategories.map(id => questionSources[id]?.questions || []);
    let allQuestions: any[] = [];

    // First, check total available questions across all selected categories
    const totalAvailableQuestions = selectedSources.reduce((sum, questions) => sum + questions.length, 0);
    
    if (totalAvailableQuestions === 0) {
      return []; // Return empty array if no questions available
    }

    // If we don't have enough questions, we'll take all available ones and repeat them
    if (totalAvailableQuestions < totalQuestionsNeeded) {
      // Collect all available questions
      selectedSources.forEach(questions => {
        allQuestions.push(...questions);
      });
      
      // Shuffle all questions
      allQuestions = allQuestions.sort(() => 0.5 - Math.random());
      
      // If we still need more, repeat questions
      while (allQuestions.length < totalQuestionsNeeded) {
        allQuestions.push(...allQuestions.slice(0, totalQuestionsNeeded - allQuestions.length));
      }
      
      return allQuestions.slice(0, totalQuestionsNeeded);
    }

    // Original distribution logic for when we have enough questions
    const baseQuestionsPerCategory = Math.floor(totalQuestionsNeeded / selectedCategories.length);
    const extraQuestions = totalQuestionsNeeded % selectedCategories.length;

    selectedSources.forEach((questions, index) => {
      if (questions.length > 0) {
        const questionsToTake = baseQuestionsPerCategory + (index < extraQuestions ? 1 : 0);
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        allQuestions.push(...shuffled.slice(0, questionsToTake));
      }
    });

    return allQuestions;
  };

  const startCustomQuiz = () => {
    if (selectedCategories.length === 0) {
      return; // Don't start if no categories selected
    }

    const questions = getQuestionsForCategories();
    if (questions.length === 0) {
      // Show an alert or handle the case where no questions are available
      alert('No questions available in selected categories');
      return;
    }

    router.push({
      pathname: '/six',
      params: { questions: JSON.stringify(questions) }
    });
  };

  const getMainCategoryCheckState = (subcategories: {id: string}[]) => {
    const selectedCount = subcategories.filter(sub =>
        selectedCategories.includes(sub.id),
    ).length;
    if (selectedCount === 0) {
      return false;
    }
    if (selectedCount === subcategories.length) {
      return true;
    }
    return 'mixed';
  };

  return (
      <View style={{flex: 1, padding: 16}}>
        <FlatList
            data={categories}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              const isExpanded = expandedCategories.includes(item.id);
              const mainCategoryCheckState = getMainCategoryCheckState(
                  item.subcategories,
              );

              return (
                  <View>
                    <View style={styles.mainCategoryContainer}>
                      <Checkbox
                          value={mainCategoryCheckState === true}
                          onValueChange={() =>
                              toggleMainCategory(item.id, item.subcategories)
                          }
                          style={
                            mainCategoryCheckState === 'mixed'
                                ? styles.indeterminateCheckBox
                                : {}
                          }
                      />
                      <TouchableOpacity onPress={() => toggleExpandCategory(item.id)}>
                        <Text style={styles.mainCategoryText}>{item.name}</Text>
                      </TouchableOpacity>
                    </View>
                    {isExpanded &&
                        item.subcategories.map(subcategory => (
                            <View key={subcategory.id} style={styles.checkboxContainer}>
                              <Checkbox
                                  value={selectedCategories.includes(subcategory.id)}
                                  onValueChange={() => toggleCategory(subcategory.id)}
                              />
                              <Text style={styles.checkboxLabel}>{subcategory.name}</Text>
                            </View>
                        ))}
                  </View>
              );
            }}
        />
        <Button
            title="Start Quiz with Selected Categories"
            onPress={() => {
              startCustomQuiz();
            }}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  mainCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  mainCategoryText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginLeft: 30,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  indeterminateCheckBox: {
    borderColor: '#007AFF', // Default blue color for iOS
    borderWidth: 2,
    borderRadius: 15, // Make the border circular
    padding: 1, // Add some padding to make the border visible
  },
});

