import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import styles from '../styles/styles';

export default function ShowItemScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, onDelete } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.name);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [editedImage, setEditedImage] = useState(item.image);
  const [tempImage, setTempImage] = useState(null); // Temporary image before saving

  // Open item location in Google Maps
  const openGoogleMaps = () => {
    if (item.location) {
      const url = `https://www.google.com/maps/place/${item.location.latitude},${item.location.longitude}`;
      Linking.openURL(url);
    }
  };

  // Take a new picture
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
      setTempImage(result.assets[0].uri); // Store new image temporarily
    }
  };

  // Save edits (including text fields and image)
  const saveEdits = async () => {
    try {
      const savedData = await AsyncStorage.getItem('savedItems');
      if (savedData) {
        let itemList = JSON.parse(savedData);
        const updatedList = itemList.map((i) =>
          i.id === item.id ? { ...i, name: editedTitle, description: editedDescription, image: tempImage || editedImage } : i
        );
        await AsyncStorage.setItem('savedItems', JSON.stringify(updatedList));
      }
      setEditedImage(tempImage || editedImage); // Finalize the new image
      toggleEditMode();
  
    } catch (error) {
      console.error('Error saving edits:', error);
    }
  };

  // Confirm before deleting
  const confirmDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: deleteItem, style: 'destructive' },
      ]
    );
  };

  // Delete item from AsyncStorage
  const deleteItem = async () => {
    try {
      const savedData = await AsyncStorage.getItem('savedItems');
      if (savedData) {
        const itemList = JSON.parse(savedData);
        const newList = itemList.filter((i) => i.id !== item.id);
        await AsyncStorage.setItem('savedItems', JSON.stringify(newList));
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setTempImage(null); // Reset temporary image if canceling
  };

  return (
    <ImageBackground source={require('../../assets/bgnoflag.png')} style={styles.container}>
      <View style={styles.content}>
        {isEditing ? (
          <TextInput
            style={[styles.title, styles.inputField]}
            value={editedTitle}
            onChangeText={setEditedTitle}
          />
        ) : (
          <Text style={styles.title}>{editedTitle}</Text>
        )}

        {isEditing ? (
          <TextInput
            style={[styles.description, styles.inputField]}
            value={editedDescription}
            onChangeText={setEditedDescription}
            multiline
          />
        ) : (
          <Text style={styles.description}>{editedDescription}</Text>
        )}

        {(isEditing || item.image || editedImage) && (
          <View style={styles.imageContainer}>
            {isEditing ? (
              tempImage ? (
                <Image source={{ uri: tempImage }} style={styles.image} />
              ) : (
                <Image source={{ uri: item.image }} style={styles.image} />
              )
            ) : (
              editedImage && <Image source={{ uri: editedImage }} style={styles.image} />
            )}
          </View>
        )}

        {isEditing && (
          <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
            <FontAwesome5 name="camera" size={20} color="white" />
            <Text style={styles.takePictureText}>Take Picture</Text>
          </TouchableOpacity>
        )}

        {!isEditing && item.location && (
          <TouchableOpacity style={styles.gpsBox} onPress={openGoogleMaps}>
            <FontAwesome style={styles.iconContainer} name="map-marker" size={24} color="#6581BF" />
            <Text style={styles.gpsText}>
              {item.location.latitude}, {item.location.longitude}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity style={styles.button} onPress={saveEdits}>
              <FontAwesome5 style={[styles.iconContainer, { color: "#6581BF" }]} name="save" size={20} />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <FontAwesome5 style={[styles.iconContainer, { color: "#6581BF" }]} name="home" size={20} />
              <Text style={styles.buttonText}>Back to List</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={toggleEditMode}>
            <FontAwesome5 style={[styles.iconContainer, { color: "#6581BF" }]} name="edit" size={20} />
            <Text style={styles.buttonText}>{isEditing ? "Cancel" : "Manage Item"}</Text>
          </TouchableOpacity>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <FontAwesome5 style={styles.iconContainer} name="trash-alt" size={20} />
            <Text style={styles.deleteButtonText}>Delete Item</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}