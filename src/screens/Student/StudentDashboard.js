import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Colors } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const StudentDashboard = () => {
  const navigation = useNavigation();
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setStudent(studentData);
        setSubjects(getSubjectsByClass(studentData.class));
      } else {
        console.error("Student data not found.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentData();
    }, [])
  );

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

  const renderSubjects = ({ item }) => (
    <Card style={styles.subjectCard}>
      <View style={styles.subjectCardContent}>
        <Text style={styles.subjectText}>{item}</Text>
        <TouchableOpacity style={styles.subjectButton}>
          <Text style={styles.subjectButtonText}>View Syllabus</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3cb371" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>Welcome, <Text style={styles.headerName}>{student?.name}</Text></Text>
            <Text style={styles.classText}>Class: {student?.class}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <FlatList
              data={subjects}
              renderItem={renderSubjects}
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatList}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerName: {
    color: '#3cb371',
  },
  classText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subjectCard: {
    width: screenWidth - 40,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grey50,
    padding: 10,
    marginVertical: 5,
  },
  subjectCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 18,
    color: '#000',
  },
  subjectButton: {
    backgroundColor: '#3cb371',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  subjectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StudentDashboard;
