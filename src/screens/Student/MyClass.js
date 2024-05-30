import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card, Text, Colors } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MyClass = () => {
  const [studentClass, setStudentClass] = useState('');
  const [classTeacher, setClassTeacher] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
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
          const studentData = studentDoc.data();

          setStudentClass(studentData.class);
          fetchClassTeacher(studentData.class);
          setSubjects(getSubjectsByClass(studentData.class));
          fetchMarks(studentData.id, studentData.class);
        } else {
          console.error("Student data not found.");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchClassTeacher = async (className) => {
      try {
        const teacherQuerySnapshot = await firestore()
          .collection('teachers')
          .where('class', '==', className)
          .get();

        if (!teacherQuerySnapshot.empty) {
          const teacherDoc = teacherQuerySnapshot.docs[0];
          const teacherData = teacherDoc.data();
          setClassTeacher(teacherData.name);
        } else {
          setClassTeacher('No class teacher assigned');
        }
      } catch (error) {
        console.error("Error fetching class teacher data:", error);
      }
    };

    const fetchMarks = async (studentId, className) => {
      try {
        const regNo = studentId.toString();
        const marksQuerySnapshot = await firestore()
          .collection('marks')
          .where('regNo', '==', regNo)
          .where('class', '==', className)
          .get();

        if (!marksQuerySnapshot.empty) {
          const marksDoc = marksQuerySnapshot.docs[0];
          const marksData = marksDoc.data();
          setMarks(marksData);
        } else {
          console.error(`Marks data not found for regNo: ${regNo} in class: ${className}`);
        }
      } catch (error) {
        console.error("Error fetching marks data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const getSubjectsByClass = (className) => {
    const subjectsByClass = {
      Nursery: ['English', 'Urdu', 'Math', 'Nazra-e-Quran'],
      Prep: ['English', 'Urdu', 'Math', 'Nazra-e-Quran', 'General Knowledge'],
      1: ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat'],
      2: ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer'],
      3: ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer'],
      4: ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer'],
      5: ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer'],
      6: ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer', 'Quran'],
      7: ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer', 'Quran'],
      8: ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer', 'Quran'],
    };
    return subjectsByClass[className] || [];
  };

  const getTotalMarks = (subject, term) => {
    if (subject === 'Computer') {
      return term === 'first' || term === 'mid' ? 50 : 100;
    }
    return term === 'first' || term === 'mid' ? 50 : 100;
  };

  const renderSubjectItem = ({ item }) => {
    const firstTermMarks = marks.first?.[item] || (item === 'Computer' ? marks.first?.Computer : '');
    const midTermMarks = marks.mid?.[item] || (item === 'Computer' ? marks.mid?.Computer : '');
    const finalTermMarks = marks.final?.[item] || (item === 'Computer' ? marks.final?.Computer : '');

    return (
      <Card style={styles.card}>
        <Card.Section
          content={[
            { text: item, text70: true, grey10: true, style: styles.subjectTitle },
          ]}
          contentStyle={styles.cardContent}
        />
        <View style={styles.marksContainer}>
          <View style={styles.termContainer}>
            <Text style={styles.termText}>First Term:</Text>
            <Text style={styles.marksText}>{Array.isArray(firstTermMarks) ? firstTermMarks.join(', ') : firstTermMarks}/{getTotalMarks(item, 'first')}</Text>
          </View>
          <View style={styles.termContainer}>
            <Text style={styles.termText}>Mid Term:</Text>
            <Text style={styles.marksText}>{Array.isArray(midTermMarks) ? midTermMarks.join(', ') : midTermMarks}/{getTotalMarks(item, 'mid')}</Text>
          </View>
          <View style={styles.termContainer}>
            <Text style={styles.termText}>Final Term:</Text>
            <Text style={styles.marksText}>{Array.isArray(finalTermMarks) ? finalTermMarks.join(', ') : finalTermMarks}/{getTotalMarks(item, 'final')}</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
      <View style={styles.containeractivity}>
        <ActivityIndicator size="large" color="#3cb371" />
        <Text style={styles.loadingText}>Checking auth status...</Text>
      </View>
    ) : (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Class:</Text>
            <Text style={styles.infoText}>{studentClass}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Teacher:</Text>
            <Text style={styles.infoText}>{classTeacher}</Text>
          </View>
          <Text style={styles.subjectsTitle}>List of Courses</Text>
          <FlatList
            data={subjects}
            renderItem={renderSubjectItem}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.subjectList}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  containeractivity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff'
  },

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey50,
    paddingBottom: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3cb371',
  },
  infoText: {
    fontSize: 20,
    color: '#000',
  },
  subjectsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subjectList: {
    marginTop: 10,
  },
  card: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.grey50,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  cardContent: {
    padding: 10,
  },
  marksContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.grey50,
  },
  termContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  termText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  marksText: {
    fontSize: 16,
    color: '#000',
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3cb371',
  },
});

export default MyClass;
