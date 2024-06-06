import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { Card, Text, Colors } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const MarksHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHistoryData = async () => {
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
          const studentId = studentDoc.id;
  
          const historySnapshot = await firestore()
            .collection('marks')
            .doc(studentId)
            .collection('history')
            .get();
  
          if (!historySnapshot.empty) {
            let historyData = historySnapshot.docs.map(doc => ({
              ...doc.data(),
              className: doc.id
            }));
  
            // Define custom class order
            const classOrder = ['Nursery', 'Prep', ...Array.from({ length: 8 }, (_, i) => `${i + 1}`)];
  
            // Sort historyData according to class order
            historyData.sort((a, b) => classOrder.indexOf(a.className) - classOrder.indexOf(b.className));
  
            setHistory(historyData);
          } else {
            console.error("History data not found.");
          }
        } else {
          console.error("Student data not found.");
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHistoryData();
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
      return term === 'final' ? [70, 30] : [35, 15];
    }
    return term === 'first' || term === 'mid' ? 50 : 100;
  };

  const renderComputerMarks = (term, marks) => {
    const part1Marks = marks?.[term.toLowerCase()]?.Computer?.[0] || 'N/A';
    const part2Marks = marks?.[term.toLowerCase()]?.Computer?.[1] || 'N/A';
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
  };

  const renderSubjectItem = (subject, marksData) => {
    return (
      <Card style={styles.card} key={subject}>
        <Card.Section
          content={[
            { text: subject, text70: true, grey10: true, style: styles.subjectTitle },
          ]}
          contentStyle={styles.cardContent}
        />
        <View style={styles.marksContainer}>
          {subject === 'Computer' ? 
            (['First', 'Mid', 'Final'].map(term => (
              <React.Fragment key={`${subject}-${term}`}>
                {renderComputerMarks(term, marksData)}
              </React.Fragment>
            ))) : 
            (['First', 'Mid', 'Final'].map(term => (
              <View style={styles.termContainer} key={`${subject}-${term}`}>
                <Text style={styles.termText}>{term} Term:</Text>
                <Text style={styles.marksText}>{marksData?.[term.toLowerCase()]?.[subject] || 'N/A'}/{getTotalMarks(subject, term.toLowerCase())}</Text>
              </View>
            )))
          }
        </View>
      </Card>
    );
  };

  const renderHistoryItem = ({ item }) => {
    const subjects = getSubjectsByClass(item.className);
    return (
        <>
        <Text style={styles.historyClassName}>Class: {item.className}</Text>
        <Card>
            {subjects.map(subject => renderSubjectItem(subject, item))}
        </Card>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.containerActivity}>
          <ActivityIndicator size="large" color="#3cb371" />
          <Text style={styles.loadingText}>Loading History...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.className}
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
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  historyList: {
    marginTop: 10,
  },
  historyClassName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3cb371',
    padding: 10,
    textAlign: 'center',
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
});

export default MarksHistory;
