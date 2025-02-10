import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';

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
    <ImageBackground source={require('../../assets/bgnoflag.png')} style={styles.container}>
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
    padding: 20,
  },
  title: {
    fontFamily: 'Monsterrat',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#D7DCEA',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 18,
    color: '#666',
  },
  iconContainer: {
    width: 22,
    alignItems: "center",
    justifyContent: 'center',
    marginRight: 5,
  },
  emptyText: {
    fontFamily: 'Monsterrat',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  itemCard: {
    backgroundColor: '#D7DCEA',
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontFamily: 'Monsterrat',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6581BF',
    flex: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginLeft: 10,
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
    alignSelf: 'center',
  },
  buttonText: {
    color: '#6581BF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Monsterrat',
    fontWeight: 'bold',
  },
});
