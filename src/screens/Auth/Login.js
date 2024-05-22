import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Colors, Typography, Spacings } from 'react-native-ui-lib';
import {TextField} from 'react-native-ui-lib';


import { useNavigation } from '@react-navigation/native';

const Login = ({ route }) => {

  const navigation = useNavigation();

  const role = route.params.role;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please enter a valid email and password.');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to sign in with email:', username);

      const userCredential = await auth().signInWithEmailAndPassword(username, password);
      const user = userCredential.user;

      console.log('User authenticated:', user);

      const querySnapshot = await firestore().collection('Users').where('email', '==', user.email).get();

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        console.log('User data retrieved:', userData);

        if (userData.role === role) {
          // Alert.alert('Success', `User signed in as ${userData.role}`);
          

          // if admin, navigate to AdminDashboard
          // clear the stack and navigate to the AdminDashboard
          if (role === 'admin') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AdminDashboard' }],
            });
          } else if (role === 'teacher'){
            // if teacher, navigate to TeacherDashboard
            // clear the stack and navigate to the TeacherDashboard
            navigation.reset({
              index: 0,
              routes: [{ name: 'TeacherDashboard' }],
            });
          } else {
            // if student, navigate to StudentDashboard
            // clear the stack and navigate to the StudentDashboard
            navigation.reset({
              index: 0,
              routes: [{ name: 'StudentDashboard' }],
            });
          }

        } else {
          Alert.alert('Error', `User role mismatch: expected ${role}, but found ${userData.role}`);
          await auth().signOut();
        }
      } else {
        console.log('User document not found');
        Alert.alert('Error', 'User data not found');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
      setUsername('');
      setPassword('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Icon style={styles.logo} name="school" size={60} color="#3cb371" />
      <View style={styles.inputContainer}>
        {/* <Text style={styles.label}>Email</Text> */}
        <TextField
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your email"
          // color= '#3cb371'
          autoCapitalize="none"
          validate={'email'}
          validationMessage={['Field is required', 'Email is invalid',]}
          errormessage="Please enter a valid email"
          floatingPlaceholder
          enableErrors
          showCharCounter
          floatOnFocus
          floatingPlaceholderColor={{focus: '#3cb371', error: '#E63B2E'}}
        />
      </View>
      <View style={styles.inputContainer}>
        {/* <Text style={styles.label}>Password</Text> */}
        <TextField
          value={password}
          onChangeText={setPassword}
          // style={styles.input}
          // color= '#3cb371'
          placeholder="Enter your password"
          placeholderTextColor='#999'
          secureTextEntry
          validate={['required', 'password', (value) => value.length > 6]}
          validationMessage={['Field is required', 'Email is invalid',]}
          floatingPlaceholder
          enableErrors
          showCharCounter
          maxLength={30}
          floatOnFocus
          floatingPlaceholderColor={{focus: '#3cb371', error: '#E63B2E'}}



        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FAF9F6',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    color: '#000000',
  },
  inputContainer: {
    marginBottom: 15,
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#000',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 5,
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    // color: '#000',
  },
  button: {
    backgroundColor: '#3cb371',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
