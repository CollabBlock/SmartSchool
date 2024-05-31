import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Colors } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        } else {
          Alert.alert("Error", "Student data not found.");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        Alert.alert("Error", "Failed to fetch student data.");
      }
    };

    fetchStudentData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {student ? (
        <>
          <View style={styles.header}>
            <MaterialCommunityIcons name="account-circle" size={80} color={Colors.green30} />
            <Text style={styles.name}>{student.name}</Text>
            <Text style={styles.email}>{student.email}</Text>
          </View>
          <Card style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Father's Name</Text>
              <Text style={styles.value}>{student.fatherName}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Date of Birth</Text>
              <Text style={styles.value}>{student.dob}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{student.gender}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Residence</Text>
              <Text style={styles.value}>{student.residence}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Class</Text>
              <Text style={styles.value}>{student.class}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Cast</Text>
              <Text style={styles.value}>{student.cast}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Occupation</Text>
              <Text style={styles.value}>{student.occupation}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Admission Date</Text>
              <Text style={styles.value}>{student.admissionDate}</Text>
            </View>
          </Card>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.green30,
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: Colors.grey40,
  },
  card: {
    padding: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey50,
  },
  label: {
    fontSize: 16,
    color: Colors.grey10,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
});

export default MyProfile;