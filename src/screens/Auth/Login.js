import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Login = ({ route }) => {
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
          Alert.alert('Success', `User signed in as ${userData.role}`);
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
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor='#999'
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor='#999'
          secureTextEntry
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
    backgroundColor: '#f0ffff',
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
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#000',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#000',
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
