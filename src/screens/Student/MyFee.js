// basic screen

import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const MyClass = () => {
    const navigation = useNavigation();
    
    

    return (
        <View style={styles.container}>
        <Text style={styles.text} >My fee</Text>
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

export default MyClass;
