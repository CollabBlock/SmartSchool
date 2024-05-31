import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
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
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Checking auth status...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['pink', '#2193b0']} style={styles.gradient}>
      <View style={styles.container}>
        <Image source={require('C:/Users/Public/OneDrive - Higher Education Commission/SmartSchool/src/assets/images/Sms_Bg.png')} style={styles.logo} />
        <Text style={styles.title}>Choose Your Option</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => handleRoleSelect('admin')}
          >
            <View style={[styles.iconBackground, { backgroundColor: '#007bff' }]}>
              <Icon name="account-cog" size={50} color="#ffffff" />
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
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => handleRoleSelect('student')}
          >
            <View style={[styles.iconBackground, { backgroundColor: '#ffc107' }]}>
              <Icon name="account" size={50} color="#ffffff" />
            </View>
            <Text style={styles.iconLabel}>Student</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ffffff',
    elevation: 50,
    shadowColor: 'black',
    shadowOpacity: 0.5,
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
    color: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
  },
});

export default RoleSelectionScreen;
