import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  mainTitle: {
    fontFamily: 'Monsterrat',
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 60,
    color: 'white',
    textAlign: 'center',
  },
  descriptionTitle: {
    fontFamily: 'Monsterrat',
    fontStyle: "italic",
    fontSize: 20,
    color: 'white',
  },
  buttonsContainer: {
    width: '80%',
    alignItems: 'center',
  },
  mainMenuButton: {
    width: 180,
    height: 70,
    backgroundColor: '#D7DCEA',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#6581BF',
    fontSize: 20,
    fontFamily: 'Monsterrat',
    fontWeight: 'bold',
  },
});

