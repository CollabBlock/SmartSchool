// basic screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentsScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Students Screen</Text>
        </View>
    );
    }

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 20,
        color: 'black',
    },
});

export default StudentsScreen;
