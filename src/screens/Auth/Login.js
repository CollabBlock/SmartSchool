  import React, { useState } from 'react';
  import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
  import auth from '@react-native-firebase/auth';

  import Icon from 'react-native-vector-icons/FontAwesome5';

  // import Icon from 'react-native-vector-icons/MaterialIcons';


  const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
      if (username === '' || password === '') {
        Alert.alert('Error', 'Please enter a valid email and password.');
        return;
      }

      setLoading(true);

      auth()
        .signInWithEmailAndPassword(username, password)
        .then(() => {
          console.log('Usersigned in!');
          Alert.alert('Success', 'User signed in!');
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Not Found', 'Try test@gmail.com , test123');
        })
        .finally(() => {
          setLoading(false); // Set loading back to false when login process completes
        });
      
      // lets reset the form
      setUsername('');
      setPassword('');

    };

    return (
      
      <ScrollView contentContainerStyle={styles.container}>
        <Icon style={styles.logo} name="school" size={60} color="#3cb371" />
        <Text style={styles.title}>Please Login</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor= '#999'
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
            placeholderTextColor= '#999'
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
      // textAlign: 'center',
      marginBottom: 10,
      marginLeft: 10,
      color: '#000000',
    },
    inputContainer: {
      marginBottom: 15,

    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 12,
      color: '#000', // Text color for input
      
    },
    button: {
      backgroundColor: '#3cb371',
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default Login;
