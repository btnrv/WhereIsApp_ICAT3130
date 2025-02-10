import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loaded] = useFonts({
    'Monsterrat': require('../../assets/fonts/Montserrat.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ImageBackground source={require('../../assets/bg.png')} style={styles.container}>
      <StatusBar style="auto" />

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>Where Is App</Text>
        <Text style={styles.descriptionTitle}>Developed for ICAT3120 Course</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.mainMenuButton} onPress={() => navigation.navigate('AddItem')}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainMenuButton} onPress={() => navigation.navigate('ItemList')}>
          <Text style={styles.buttonText}>List Items</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}