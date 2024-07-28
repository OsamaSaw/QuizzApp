import {Pressable, StyleSheet, useColorScheme} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import {Link} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import React from "react";
import {useNavigation} from "@react-navigation/native";



export default function TabTwoScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const openModal = () => {
    // @ts-ignore
    navigation.navigate('six');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two Quiz</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Pressable onPress={openModal} style={styles.button}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome
              name="info-circle"
              size={25}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ marginHorizontal: 5 }}
          />
          <Text style={{ fontSize: 16, color: Colors[colorScheme ?? 'light'].text, margin:5 }}>Start a Quiz</Text>
        </View>
      </Pressable>

      <Pressable onPress={()=>{ // @ts-ignore
        navigation.navigate('seven')}} style={styles.button}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome
              name="info-circle"
              size={25}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ marginHorizontal: 5 }}
          />
          <Text style={{ fontSize: 16, color: Colors[colorScheme ?? 'light'].text, margin:5 }}>Start a Custom Quiz</Text>
        </View>
      </Pressable>

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
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    margin:5
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
