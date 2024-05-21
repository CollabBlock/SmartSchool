// basic screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';

const DashboardScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.text} >Dashboard hun vro</Text>
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

export default DashboardScreen;
