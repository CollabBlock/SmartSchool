import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { TextField, Text } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';

const EditStudentScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const studentDoc = await firestore().collection('students').doc(studentId).get();
      if (studentDoc.exists) {
        setStudent(studentDoc.data());
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleUpdateStudent = async () => {
    await firestore().collection('students').doc(studentId).update(student);
    navigation.goBack();
  };

  if (!student) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextField
        value={student.name}
        onChangeText={(text) => setStudent({ ...student, name: text })}
        placeholder="Name"
        floatingPlaceholder
      />
      <TextField
        value={student.id.toString()}
        onChangeText={(text) => setStudent({ ...student, id: parseInt(text, 10) })}
        placeholder="Registration Number"
        floatingPlaceholder
        keyboardType="numeric"
      />
      {/* Add more fields as needed */}
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
});

export default EditStudentScreen;
