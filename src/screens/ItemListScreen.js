import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/styles';


export default function ItemListScreen() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const [loaded] = useFonts({
    'Monsterrat': require('../../assets/fonts/Montserrat.ttf'),
  });

  useEffect(() => {
    loadItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems(); // Refresh list when screen is focused
    }, [])
  );

  const loadItems = async () => {
    try {
      const savedData = await AsyncStorage.getItem('savedItems');
      if (savedData) {
        setItems(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  if (!loaded) {
    return null;
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground source={require('../../assets/bgnoflag.png')}>
      <View style={{width: "100%", height: "100%"}}>
        <StatusBar style="light" />
        <View style={{ marginTop: 40}}>
          <Text style={styles.title}>Saved Items</Text>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search items..."
          placeholderTextColor="#6581BF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {filteredItems.length === 0 ? (
          <Text style={[styles.emptyText, {fontWeight:"bold", marginBottom: 15}]}>No items found...</Text>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => navigation.navigate('ShowItem', { item })}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
                <FontAwesome5 style={{marginLeft: 15, color: "#6581BF"}} name="chevron-right" size={32} />
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={[styles.button, {marginVertical: 30}]} onPress={() => navigation.goBack()}>
          <View style={[styles.iconContainer, { width: '20%' }]}> 
            <FontAwesome5 name="home" size={20} color="#6581BF" />
          </View>
          <Text style={[styles.buttonText, { width: '50%' }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}