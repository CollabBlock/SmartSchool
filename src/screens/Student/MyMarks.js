import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Text, Colors } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MyMarks = () => {
  const [studentClass, setStudentClass] = useState('');
  const [classTeacher, setClassTeacher] = useState('');
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchStudentData = useCallback(async () => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No authenticated user found.");

      const studentQuerySnapshot = await firestore()
        .collection('students')
        .where('email', '==', user.email)
        .get();

      if (!studentQuerySnapshot.empty) {
        const studentDoc = studentQuerySnapshot.docs[0];
        const studentData = studentDoc.data();

        setStudentClass(studentData.class);
        fetchClassTeacher(studentData.class);
        fetchMarks(studentData.id, studentData.class);
      } else {
        throw new Error("Student data not found.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClassTeacher = useCallback(async (className) => {
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
  }, []);

  const fetchMarks = useCallback(async (studentId, className) => {
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
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('MarksHistory')} style={styles.headerButton}>
          <MaterialCommunityIcons name="history" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getSubjectsByClass = useCallback((className) => {
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
  }, []);

  const subjects = useMemo(() => getSubjectsByClass(studentClass), [studentClass]);

  const getTotalMarks = useCallback((subject, term) => {
    if (subject === 'Computer') {
      return term === 'final' ? [70, 30] : [35, 15];
    }
    return term === 'first' || term === 'mid' ? 50 : 100;
  }, []);

  const renderComputerMarks = useCallback((term) => {
    const part1Marks = marks[term.toLowerCase()]?.Computer?.[0] || 'N/A';
    const part2Marks = marks[term.toLowerCase()]?.Computer?.[1] || 'N/A';
    const [totalPart1, totalPart2] = getTotalMarks('Computer', term.toLowerCase());

    return (
      <>
        <View style={styles.termContainer} key={`${term}-part1`}>
          <Text style={styles.termText}>{term} Term - Part 1:</Text>
          <Text style={styles.marksText}>{part1Marks}/{totalPart1}</Text>
        </View>
        <View style={styles.termContainer} key={`${term}-part2`}>
          <Text style={styles.termText}>{term} Term - Part 2:</Text>
          <Text style={styles.marksText}>{part2Marks}/{totalPart2}</Text>
        </View>
      </>
    );
  }, [marks, getTotalMarks]);

  const renderSubjectItem = useCallback(({ item }) => {
    return (
      <Card style={styles.card} key={item}>
        <Card.Section
          content={[
            { text: item, text70: true, grey10: true, style: styles.subjectTitle },
          ]}
          contentStyle={styles.cardContent}
        />
        <View style={styles.marksContainer}>
          {item === 'Computer' ? 
            (['First', 'Mid', 'Final'].map(term => (
              <React.Fragment key={`${item}-${term}`}>
                {renderComputerMarks(term)}
              </React.Fragment>
            ))) : 
            (['First', 'Mid', 'Final'].map(term => (
              <View style={styles.termContainer} key={`${item}-${term}`}>
                <Text style={styles.termText}>{term} Term:</Text>
                <Text style={styles.marksText}>{marks[term.toLowerCase()]?.[item] || 'N/A'}/{getTotalMarks(item, term.toLowerCase())}</Text>
              </View>
            )))
          }
        </View>
      </Card>
    );
  }, [marks, renderComputerMarks, getTotalMarks]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.containerActivity}>
          <ActivityIndicator size="large" color="#3cb371" />
          <Text style={styles.loadingText}>Loading Your Class...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={subjects}
            renderItem={renderSubjectItem}
            keyExtractor={(item) => item}
            contentContainerStyle={[styles.subjectList, { paddingBottom: 20 }]}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  containerActivity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  subjectsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
    // textAlign: 'center',
    padding: 10,
  },
  subjectList: {
    marginTop: 10,
  },
  card: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.grey50,
    borderRadius: 7,
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
    borderBottomColor: Colors.grey50,
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  termText: {
    fontSize: 16,
    color: '#000',
  },
  marksText: {
    fontSize: 16,
    color: '#000',
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3cb371',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#3cb371',
  },
  headerButton: {
    marginRight: 15,
  },
});

export default MyMarks;

