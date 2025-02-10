import { ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AddItemScreen() {
    const navigation = useNavigation();
    const [thingName, setThingName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(null);
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState(null);
  
    const [loaded] = useFonts({
      'Monsterrat': require('../../assets/fonts/Montserrat.ttf'),
    });

    if (!loaded) {
      return null;
    }
  
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission Denied: Location permission is required.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    };
  
    const takePicture = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission Denied: Camera access is required.');
        return;
      }
  
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
      });
  
      if (!result.canceled) {
        const fileName = result.assets[0].uri.split('/').pop();
        setImage(result.assets[0].uri);
        setImageName(fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName);
      }
    };
  
    const handleSave = async () => {
      if (!thingName || !description) {
        alert('Validation Error: Name and description fields are required.');
        return;
      }
  
      const newItem = {
        id: Date.now().toString(),
        name: thingName,
        description,
        location: location ? { latitude: location.latitude, longitude: location.longitude } : null,
        image: image || null,
      };
  
      try {
        const existingData = await AsyncStorage.getItem('savedItems');
        const items = existingData ? JSON.parse(existingData) : [];
        items.push(newItem);
        await AsyncStorage.setItem('savedItems', JSON.stringify(items));
        alert('Success: Item saved successfully!');
        setThingName('');
        setDescription('');
        setLocation(null);
        setImage(null);
        navigation.navigate('Home');
      } catch (error) {
        alert('Error saving data:', error);
      }
    };
  
    return (
        <ImageBackground source={require('../../assets/bgnoflag.png')} style={styles.container}>
          <StatusBar style="auto" />
    
          {/* Title */}
          <Text style={styles.title}>Add New Item</Text>
    
          {/* Input Fields */}
          <TextInput
            style={styles.input}
            placeholder="Enter item name..."
            value={thingName}
            onChangeText={setThingName}
          />
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Enter description..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
    
          {/* Location Box */}
          <View style={styles.locationBox}>
            <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="map-marker-alt" size={20} color="#6581BF" />
              </View>
              <Text style={styles.buttonText}>Get Location</Text>
            </TouchableOpacity>
            <Text style={[styles.locationText, { flex: 1, textAlign: 'center' }, location && { fontWeight: 'bold' }]}>
              {location ? `Location set!` : 'No location set'}
            </Text>
          </View>
    
          {/* Camera Box */}
          <View style={styles.cameraBox}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="camera" size={20} color="#6581BF" />
              </View>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
            <Text style={[styles.cameraText, { flex: 1, textAlign: 'center' }, image && { fontWeight: 'bold' }]}>
              {image ? `Image Set! ${imageName}` : 'No image set'}
            </Text>
          </View>
    
          {/* Image Preview */}
          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
            </View>
          )}
    
          {/* Save Button */}
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <View style={[styles.iconContainer, { width: '20%' }]}>
              <FontAwesome5 name="save" size={20} color="#6581BF" />
            </View>
            <Text style={[styles.buttonText, { width: '52%' }]}>Save Item</Text>
          </TouchableOpacity>

          {/* Back Home Button */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <View style={[styles.iconContainer, { width: '20%' }]}>
              <FontAwesome5 name="home" size={20} color="#6581BF" />
            </View>
            <Text style={[styles.buttonText, { width: '50%' }]}>Go Back</Text>
          </TouchableOpacity>
        </ImageBackground>
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
  },
  title: {
    fontFamily: 'Monsterrat',
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 40,
    color: '#e2edfe',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#D7DCEA',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'Monsterrat',
  },
  button: {
    width: 180,
    height: 70,
    backgroundColor: '#D7DCEA',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  buttonText: {
    color: '#6581BF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Monsterrat',
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 22,
    alignItems: "center",
    justifyContent: 'center',
    marginRight: 5,
  },
  locationBox: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D7DCEA',
    borderRadius: 30,
    padding: 2.5,
    marginVertical: 10,
  },
  locationButton: {
    backgroundColor: '#A1B3D7',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Monsterrat',
    color: '#000',
    includeFontPadding: false,
  },
  cameraBox: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D7DCEA',
    borderRadius: 30,
    padding: 2.5,
    marginVertical: 10,
  },
  cameraButton: {
    backgroundColor: '#A1B3D7',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cameraText: {
    fontSize: 16,
    fontFamily: 'Monsterrat',
    color: '#000',
    includeFontPadding: false,
  },
  imageContainer: {
    width: '90%',
    marginVertical: 10,
    aspectRatio: 16 / 9,
    backgroundColor: '#A1B3D7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
