import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { TextField, Text } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';

const EditStudentScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      const studentDoc = await firestore().collection('students').doc(studentId).get();
      if (studentDoc.exists) {
        setStudent(studentDoc.data());
      }

      setLoading(false);
    };

    fetchStudent();
  }, [studentId]);

  const handleUpdateStudent = async () => {
    setLoading(true);
    await firestore().collection('students').doc(studentId).update(student);
    setLoading(false);
    navigation.goBack();
    
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3cb371" />
        {/* <Text>Loading...</Text> */}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Edit Student Information</Text>
      <TextField
        value={student.name}
        onChangeText={(text) => setStudent({ ...student, name: text })}
        placeholder="Name"
        floatingPlaceholder
      />
      <TextField
        value={student.fatherName}
        onChangeText={(text) => setStudent({ ...student, fatherName: text })}
        placeholder="Father's Name"
        floatingPlaceholder
      />
      <TextField
        value={student.dob}
        onChangeText={(text) => setStudent({ ...student, dob: text })}
        placeholder="Date of Birth"
        floatingPlaceholder
      />
      <TextField
        value={student.gender}
        onChangeText={(text) => setStudent({ ...student, gender: text })}
        placeholder="Gender"
        floatingPlaceholder
      />
      <TextField
        value={student.cast}
        onChangeText={(text) => setStudent({ ...student, cast: text })}
        placeholder="Cast"
        floatingPlaceholder
      />
      <TextField
        value={student.occupation}
        onChangeText={(text) => setStudent({ ...student, occupation: text })}
        placeholder="Occupation"
        floatingPlaceholder
      />
      <TextField
        value={student.remarks}
        onChangeText={(text) => setStudent({ ...student, remarks: text })}
        placeholder="Remarks"
        floatingPlaceholder
      />
      <TextField
        value={student.residence}
        onChangeText={(text) => setStudent({ ...student, residence: text })}
        placeholder="Residence"
        floatingPlaceholder
      />
      <TextField
        value={student.admissionDate}
        onChangeText={(text) => setStudent({ ...student, admissionDate: text })}
        placeholder="Admission Date"
        floatingPlaceholder
      />
      <Button title="Update Student" onPress={handleUpdateStudent} color="#3cb371" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3cb371',
    marginBottom: 20,
  },
  textField: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3cb371',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditStudentScreen;
