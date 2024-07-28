import {Button, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import { Text, View } from '@/components/Themed';
import {useEffect, useState} from "react";

import questions from '@/assets/quesions/qs.json';
import {useNavigation} from "@react-navigation/native";
import Checkbox from 'expo-checkbox';


import categoriesData from '@/assets/quesions/categories.json';

const categories = categoriesData.categories;

export default function TabTwoScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prevSelected =>
        prevSelected.includes(id)
            ? prevSelected.filter(catId => catId !== id)
            : [...prevSelected, id],
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

  const submit = () => {
    console.log({selected: [...selectedCategories, ...expandedCategories]});
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
              submit();
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

