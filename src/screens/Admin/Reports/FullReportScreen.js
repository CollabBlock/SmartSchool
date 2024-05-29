// FullReportScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FullReportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Full Report Screen</Text>
      {/* Add full report content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 20,
    color: '#000',
  },
});

export default FullReportScreen;
