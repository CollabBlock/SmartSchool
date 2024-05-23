import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, TextField } from 'react-native-ui-lib';
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
      const userCredential = await auth().signInWithEmailAndPassword(username, password);
      const user = userCredential.user;
      const querySnapshot = await firestore().collection('Users').where('email', '==', user.email).get();

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.role === role) {
          const destination = role === 'admin' ? 'AdminDashboard' : role === 'teacher' ? 'TeacherDashboard' : 'StudentDashboard';
          navigation.reset({
            index: 0,
            routes: [{ name: destination }],
          });
        } else {
          Alert.alert('Error', `User role mismatch: expected ${role}, but found ${userData.role}`);
          await auth().signOut();
        }
      } else {
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
      <Text style={styles.welcomeText}>Welcome Back</Text>
      <Text style={styles.subText}>Login to continue using the app</Text>
      
      <View style={styles.inputContainer}>
        <TextField
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your email"
          autoCapitalize="none"
          validate={'email'}
          validationMessage={['Email is invalid']}
          floatingPlaceholder
          enableErrors
          showCharCounter
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          validateOnChange
          validationMessagePosition={'bottom'}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          validate={[(value) => value.length > 6]}
          validationMessage={['Password length should be greater than 6 characters']}
          floatingPlaceholder
          enableErrors
          showCharCounter
          maxLength={30}
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          validateOnChange
          validationMessagePosition={'bottom'}
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
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
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
