import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import Gameboard from './Gameboard';

export default function App() {
  return (
    <View style={{flex: 1}}>
      <Header/>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
      <Gameboard/>
      </ScrollView>
      <Footer/>
    </View>
  );
}
