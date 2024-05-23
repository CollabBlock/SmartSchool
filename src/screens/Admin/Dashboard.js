import React, { useState, useCallback, useEffect } from 'react';
import { Colors, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-ui-lib';
import { BarChart } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(15); // Example static data for teachers
  const revenue = 5000; // Example revenue data
  const averageAttendance = 92; // Example average attendance percentage
  const studentsPerClass = [30, 25, 20, 15, 30, 22, 28, 24, 26, 20]; // Example students in each class

  const fetchStudentCount = async () => {
    try {
      const studentsCollection = await firestore().collection('students').get();
      setStudentCount(studentsCollection.size);
    } catch (error) {
      console.error("Error fetching student count: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentCount();
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
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome Back!</Text>
      <Text style={styles.subText}>Admin, SmartSchool</Text>

      <View style={styles.row}>
        <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Manage Students screen')}>
          <Card.Section content={[{ text: 'Total Students', text70: true, grey10: true }, { text: `${studentCount}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
        </Card>
        <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Manage Teachers screen')}>
          <Card.Section content={[{ text: 'Total Teachers', text70: true, grey10: true }, { text: `${teacherCount}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
        </Card>
      </View>
      <View style={styles.row}>
        <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Manage Revenue screen')}>
          <Card.Section content={[{ text: 'Total Revenue', text70: true, grey10: true }, { text: `$${revenue}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
        </Card>
        <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Average Attendance')}>
          <Card.Section content={[{ text: 'Average Attendance', text70: true, grey10: true }, { text: `${averageAttendance}%`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
        </Card>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Students in Each Class</Text>
        <ScrollView horizontal={true}>
          <BarChart
            data={{
              labels: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
              datasets: [
                {
                  data: studentsPerClass
                }
              ]
            }}
            width={1000} // Increased width to fit all classes
            height={220}
            chartConfig={{
              backgroundColor: '#3cb371',
              backgroundGradientFrom: '#66cdaa',
              backgroundGradientTo: '#3cb371',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: '#000000'
              }
            }}
            style={styles.chart}
          />
        </ScrollView>
      </View>
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
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    // textAlign: 'center',
    marginBottom: 5,
    color: '#3cb371', // Green color for text
  },
  subText: {
    fontSize: 20,
    // textAlign: 'center',
    marginBottom: 30,
    color: '#000000', // Black color for text
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000000', // Green color for text
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  headerButton: {
    marginRight: 15,
  },
});

export default DashboardScreen;
