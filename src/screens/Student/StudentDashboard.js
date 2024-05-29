// basic screen

import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const StudentDashboard = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        });
      }, [navigation]);
    
      const handleLogout = () => {
        auth()
          .signOut()
          .then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'RoleSelection' }],
            });
          })
          .catch(error => {
            console.error('Error during sign out:', error);
          });
      };
    return (
        <View style={styles.container}>
        <Text style={styles.text} >Ye ghareeb student</Text>
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

export default StudentDashboard;
