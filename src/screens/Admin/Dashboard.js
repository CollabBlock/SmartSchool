import React, { useState, useCallback, useEffect } from 'react';
import { Colors, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-ui-lib';
import { PieChart, StackedBarChart } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [ageGroupsData, setAgeGroupsData] = useState([]);
  const [studentsPerClass, setStudentsPerClass] = useState([]);

  const fetchStudentCount = async () => {
    try {
      const studentsCollection = await firestore().collection('students').get();
      setStudentCount(studentsCollection.size);
    } catch (error) {
      console.error("Error fetching student count: ", error);
    }
  };

  const fetchTeacherCount = async () => {
    try {
      const teacherCollection = await firestore().collection('teachers').get();
      setTeacherCount(teacherCollection.size);
    } catch (error) {
      console.error("Error fetching teacher count: ", error);
    }
  };

  const fetchStudentPerClass = async () => {
    try {
      const studentsSnapshot = await firestore().collection('students').get();
      const studentsData = studentsSnapshot.docs.map(doc => doc.data());

      const classCounts = studentsData.reduce((acc, student) => {
        let classID = student.class;
        classID = (classID == 'Nursery')?0:((classID == 'Prep')?1:parseInt(classID) + 1);
        acc[classID] = (acc[classID] || 0) + 1;
        return acc;
      }, []);

      setStudentsPerClass(classCounts);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const fetchAgeGroupsData = async () => {
    try {
      const studentsCollection = await firestore().collection('students').get();
      const studentsData = studentsCollection.docs.map(doc => doc.data());

      const ageGroupsData = {
        '0-5': { boys: 0, girls: 0 },
        '6-10': { boys: 0, girls: 0 },
        '11-15': { boys: 0, girls: 0 },
        '16-20': { boys: 0, girls: 0 },
      };

      studentsData.forEach(student => {
        const age = calculateAge(student.dob);
        const ageGroup = age < 6 ? '0-5' : age < 11 ? '6-10' : age < 16 ? '11-15' : '16-20';

        if (student.gender === 'male') {
          ageGroupsData[ageGroup].boys++;
        } else if (student.gender === 'female') {
          ageGroupsData[ageGroup].girls++;
        }
      });

      setAgeGroupsData(ageGroupsData);
    } catch (error) {
      console.error("Error fetching age groups data: ", error);
    }
  };

  function calculateAge(dob) {
    var dobArray = dob.split('-');
    var dobDay = parseInt(dobArray[0]);
    var dobMonth = parseInt(dobArray[1]) - 1;
    var dobYear = parseInt(dobArray[2]);

    var currentDate = new Date();
    var currentDay = currentDate.getDate();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();

    var age = currentYear - dobYear;

    if (currentMonth < dobMonth || (currentMonth === dobMonth && currentDay < dobDay)) {
      age--;
    }

    return age;
  }

  useFocusEffect(
    useCallback(() => {
      fetchStudentCount();
      fetchTeacherCount();
      fetchStudentPerClass();
      fetchAgeGroupsData();
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

  const getClassLabel = (index) => {
    switch (index) {
      case 0:
        return 'Nursery';
      case 1:
        return 'Prep';
      case 2:
        return 'One';
      case 3:
        return 'Two';
      case 4:
        return 'Three';
      case 5:
        return 'Four';
      case 6:
        return 'Five';
      case 7:
        return 'Six';
      case 8:
        return 'Seven';
      case 9:
        return 'Eight';
      default:
        return '';
    }
  }

  const getClassColor = (index) => {
    const colors = ['#ff6347', '#ffa500', '#ffd700', '#32cd32', '#4169e1', '#8a2be2', '#ff69b4', '#00ced1', '#4b0082', '#20b2aa']; // Pre-defined colors
    return colors[index % colors.length]; 
  };
  
  const pieChartData = studentsPerClass.map((value, index) => ({
    name: getClassLabel(index),
    population: value,
    color: getClassColor(index),
    legendFontColor: '#000',
    legendFontSize: 15,
  }));
  
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
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Students in Each Class</Text>
        <PieChart
          data={pieChartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute 
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Total Boys and Girls in Each Age Group</Text>
        <ScrollView horizontal={true}>
          <StackedBarChart
            data={{
              labels: Object.keys(ageGroupsData),
              legend: ['Boys', 'Girls'],
              data: Object.values(ageGroupsData).map(data => [data.boys, data.girls]),
              barColors: ['#3366ff', '#ff6699'], // Boys - Blue, Girls - Pink
            }}
            width={screenWidth}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
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
