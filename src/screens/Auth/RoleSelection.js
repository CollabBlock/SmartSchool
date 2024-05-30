import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setLoading(true);
        try {
          const querySnapshot = await firestore().collection('Users').where('email', '==', user.email).get();
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const role = userData.role;
            const destination = role === 'admin' ? 'AdminDashboard' : role === 'teacher' ? 'TeacherDashboard' : 'StudentDashboard';
            navigation.reset({
              index: 0,
              routes: [{ name: destination }],
            });
          } else {
            Alert.alert('Error', 'User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Something went wrong');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleRoleSelect = (role) => {
    console.log(`Selected role: ${role}`);
    navigation.navigate('Login', { role });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3cb371" />
        <Text style={styles.loadingText}>Checking auth status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Option</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => handleRoleSelect('admin')}
        >
          <View style={[styles.iconBackground, { backgroundColor: '#007bff' }]}>
            <Icon name="admin-panel-settings" size={50} color="#ffffff" />
          </View>
          <Text style={styles.iconLabel}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => handleRoleSelect('teacher')}
        >
          <View style={[styles.iconBackground, { backgroundColor: '#28a745' }]}>
            <Icon name="school" size={50} color="#ffffff" />
          </View>
          <Text style={styles.iconLabel}>Teacher</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleRoleSelect('student')}
      >
        <View style={[styles.iconBackground, { backgroundColor: '#ffc107' }]}>
          <Icon name="person" size={50} color="#ffffff" />
        </View>
        <Text style={styles.iconLabel}>Student</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000000',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default RoleSelectionScreen;
