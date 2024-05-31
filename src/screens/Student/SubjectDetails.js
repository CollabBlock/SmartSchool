import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SubjectDetails = ({ route }) => {
  const { subjectName, studentClass } = route.params;
  const [marks, setMarks] = useState({});

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          console.error("No authenticated user found.");
          return;
        }

        // Fetch the student document to get the registration number
        const studentQuerySnapshot = await firestore()
          .collection('students')
          .where('email', '==', user.email)
          .get();

        if (!studentQuerySnapshot.empty) {
          const studentDoc = studentQuerySnapshot.docs[0];
          const studentData = studentDoc.data();
          const regNo = `student_${studentData.id}`; // Assuming 'id' field is the registration number

          console.log(`Fetching marks for: ${regNo} in class: ${studentClass}`);

          // Now fetch the marks using the registration number
          const marksQuerySnapshot = await firestore()
            .collection('marks')
            .where('regNo', '==', regNo)
            .where('class', '==', studentClass)
            .get();

          if (!marksQuerySnapshot.empty) {
            const marksDoc = marksQuerySnapshot.docs[0];
            const marksData = marksDoc.data();
            console.log("Marks data found:", marksData);
            setMarks(marksData);
          } else {
            console.error(`Marks data not found for regNo: ${regNo} in class: ${studentClass}`);
          }
        } else {
          console.error("Student data not found.");
        }
      } catch (error) {
        console.error("Error fetching marks data:", error);
      }
    };

    fetchMarks();
  }, [subjectName, studentClass]);

  const renderMarks = (term) => {
    if (subjectName === 'Computer') {
      return (
        <View>
          <Text style={styles.marksText}>{term} Term - Part 1: {marks[term]?.Computer?.[0]}</Text>
          <Text style={styles.marksText}>{term} Term - Part 2: {marks[term]?.Computer?.[1]}</Text>
        </View>
      );
    } else {
      return (
        <Text style={styles.marksText}>{term} Term: {marks[term]?.[subjectName]}</Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subjectTitle}>{subjectName} Marks</Text>
      {renderMarks('first')}
      {renderMarks('mid')}
      {renderMarks('final')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  subjectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3cb371',
  },
  marksText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
});

export default SubjectDetails;
