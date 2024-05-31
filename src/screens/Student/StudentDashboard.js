import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Text, Card } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const StudentDashboard = () => {
  const navigation = useNavigation();
  const [student, setStudent] = useState(null);


  const fetchStudentData = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error("No authenticated user found.");
        return;
      }

      const studentQuerySnapshot = await firestore()
        .collection('students')
        .where('email', '==', user.email)
        .get();

      if (!studentQuerySnapshot.empty) {
        const studentDoc = studentQuerySnapshot.docs[0];
        setStudent(studentDoc.data());
        fetchMarks(studentDoc.data().id);
      } else {
        Alert.alert("Error", "Student data not found.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      Alert.alert("Error", "Failed to fetch student data.");
    }
  };

  const fetchMarks = async (studentId) => {
    try {
      const marksSnapshot = await firestore()
        .collection('marks')
        .where('regNo', '==', studentId.toString())
        .get();

     
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  

  useFocusEffect(
    useCallback(() => {
      fetchStudentData();
    }, [])
  );

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
        Alert.alert('Error', 'Failed to log out.');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {student ? (
        <>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome, {student.name}</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class Information</Text>
            <Card style={styles.card}>
              <Card.Section content={[{ text: `Class: ${student.class}`, text70: true, grey10: true }]} contentStyle={styles.cardContent} />
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Overview</Text>
            <View style={styles.row}>
            </View>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff' // Mint cream
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3cb371', // Green color for text
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: (screenWidth / 2) - 25, // Adjust width to fit two cards per row
    backgroundColor: '#F2F2F2', // White background for cards
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3cb371', // Green border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    margin: 5,
  },
  cardContent: {
    alignItems: 'center',
    padding: 10,
  },
  headerButton: {
    marginRight: 15,
  },
});

export default StudentDashboard;
