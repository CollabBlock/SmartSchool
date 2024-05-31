import React, { useState, useCallback, useEffect } from 'react';
import { Colors, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, PermissionsAndroid, Platform, Alert} from 'react-native';
import { Text, Card, Button } from 'react-native-ui-lib';
import { PieChart, StackedBarChart } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { green } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [ageGroupsData, setAgeGroupsData] = useState([]);
  const [studentsPerClass, setStudentsPerClass] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [marks, setMarks] = useState([]);
  const [averagePercentagePerClass, setAveragePercentagePerClass] = useState([95, 90, 87, 89, 95, 92, 88, 85, 90, 92]);

  const fetchStudent = async () => {
    try {
      const studentsSnapshot = await firestore().collection('students').get();
      const studentsData = studentsSnapshot.docs.map(doc => doc.data());
      setStudents(studentsData);
      setStudentCount(studentsSnapshot.size);
      const classCounts = studentsData.reduce((acc, student) => {
        let classID = student.class;
        classID = (classID == 'Nursery')?0:((classID == 'Prep')?1:parseInt(classID) + 1);
        acc[classID] = (acc[classID] || 0) + 1;
        return acc;
      }, []);
      setStudentsPerClass(classCounts);
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

  const fetchMarks = async () => {
    try {
      const marksSnapshot = await firestore().collection('marks').get();
      const marksData = marksSnapshot.docs.map(doc => doc.data());
      setMarks(marksData);
    } catch (error) {
      console.error("Error fetching marks: ", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchStudent();
      fetchTeacherCount();
      fetchMarks();
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

  function calculateYearNMonth(dob) {
    var dobArray = dob.split('-');
    var dobDay = parseInt(dobArray[0]);
    var dobMonth = parseInt(dobArray[1]) - 1;
    var dobYear = parseInt(dobArray[2]);

    var currentDate = new Date();
    var currentDay = currentDate.getDate();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();

    var ageYears = currentYear - dobYear;
    var ageMonths = currentMonth - dobMonth;

    if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
    }

    if (currentDay < dobDay) {
        ageMonths--;
        if (ageMonths < 0) {
            ageMonths += 12;
            ageYears--;
        }
    }

    return ageYears + " years " + ageMonths + " months";
  }

  function formatDate(dateStr) {
    var monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];

    var dateArray = dateStr.split('-');
    var day = parseInt(dateArray[0]);
    var month = parseInt(dateArray[1]);
    var year = parseInt(dateArray[2]);

    var monthName = monthNames[month - 1];

    return day + " " + monthName + " " + year;
  }

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
  
  const pieChartData = (data) => {
      return data.map((value, index) => ({
      name: getClassLabel(index),
      population: value,
      color: getClassColor(index),
      legendFontColor: '#000',
      legendFontSize: 15,
    }))
  };

  const generateHTMLTable = (headers, data) => {
    let htmlString = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 18px;
          text-align: left;
        }
        thead tr {
          background-color: #009879;
          color: #ffffff;
          text-align: left;
        }
        th, td {
          padding: 12px 15px;
        }
        tbody tr {
          border-bottom: 1px solid #dddddd;
        }
        tbody tr:nth-of-type(even) {
          background-color: #f3f3f3;
        }
        tbody tr:last-of-type {
          border-bottom: 2px solid #009879;
        }
        tbody tr:hover {
          background-color: #f1f1f1;
        }
      </style>
      <table>
        <thead><tr>`;
  
    headers.forEach(header => {
      htmlString += `<th>${header}</th>`;
    });
  
    htmlString += `</tr></thead><tbody>`;
  


    data.forEach(obj => {
      htmlString += '<tr>';
      for (const key in obj) {
        htmlString += `<td>${obj[key]}</td>`;
      }
      htmlString += '</tr>';
    });
  
    htmlString += '</tbody></table>';
    return htmlString;
  };

  const downloadPDF = async (headers, data, fileName) => {
    try {  
      const htmlContent = generateHTMLTable(headers, data);
      const options = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Documents',
      };
  
      const file = await RNHTMLtoPDF.convert(options);
      const filePath = 'file://' + file.filePath;
      
      const shareOptions = {
        url: filePath,
        type: 'application/pdf',
        failOnCancel: false,
      };
  
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error generating PDF: ', error);
      Alert.alert('Error', 'Failed to generate or share PDF');
    }
  };

  const headersForStudent = [
    "Reg No",
    "Name", 
    "Father Name", 
    "Date of Birth", 
    "Age",
    "Gender"
  ];

  const headersForClass = [
    "Reg No",
    "Name", 
    "Father Name", 
    "Class"
  ];

  const headersForResult = [
    "Reg No",
    "Name", 
    "Class",
    "First",
    "Mid",
    "Final"
  ];

  const getDataForStudentReport = () => {
    const studentReportData = [];
    students.forEach(student => {
      if(student !== undefined){
        const studentData = [
          student.id,
          (student.name === undefined) ? "unknown" : student.name,
          (student.fatherName === undefined) ? "unknown" : student.fatherName,
          (student.dob === undefined) ? "unknown" : formatDate(student.dob),
          (student.dob === undefined) ? calculateYearNMonth("25-12-2004"):calculateYearNMonth(student.dob),
          (student.gender === undefined)?"unknown": student.gender
        ];
        studentReportData.push(studentData);
      }
    });

    studentReportData.sort((a, b) => {
      const [aYears, aMonths] = a[4].split(' ').map(str => parseInt(str));
      const [bYears, bMonths] = b[4].split(' ').map(str => parseInt(str));

      if (aYears !== bYears) {
          return bYears - aYears;
      } else {
          return bMonths - aMonths;
      }
    });
    return studentReportData;
  };

  const getDataForStudentInClassReport = () => {    
    const classOrder = ["nursery", "prep", "1", "2", "3", "4", "5", "6", "7", "8"];
    const studentReportData = [];
    students.forEach(student => {
      const studentData = [
        student.id,
        (student.name === undefined) ? "unknown" : student.name,
        (student.fatherName === undefined) ? "unknown" : student.fatherName,
        (student.class === undefined) ? "unknown" : student.class.toLowerCase()
      ];
      studentReportData.push(studentData);
    });

    studentReportData.sort((a, b) => {
        const classA = a[3];
        const classB = b[3];
        return classOrder.indexOf(classA) - classOrder.indexOf(classB);
    });

    return studentReportData;
  };
  
  const calculateCollectiveMark = (marks) => {
    let collectiveMark = 0;
    let i = 0;
    Object.values(marks).forEach(mark => {
      if (typeof mark === 'object') {
        collectiveMark += (mark[0] + mark[1]);
      } else {
        collectiveMark += mark;
      }
      i++;
    });
    return (collectiveMark / i).toFixed(2);
  };

  const getStudentNameById = (id) => {
    const student = students.find(student => student.id == id);
    return student ? student.name : "unknown";
  };

  const getDataForResultReport = () => {    
    const resultReportData = [];
    marks.forEach(result => {
      if(result !== undefined){      
        const resultData = [
          (result.regNo === undefined)?"unknown":result.regNo, 
          (result.regNo === undefined)?"unknown":getStudentNameById(result.regNo),
          (result.class === undefined)?"unknown":result.class,
          (result.first === undefined)?"N/A": calculateCollectiveMark(result.first),
          (result.mid === undefined)?"N/A": calculateCollectiveMark(result.mid),
          (result.final === undefined)?"N/A": calculateCollectiveMark(result.final)
        ];
        resultReportData.push(resultData);
      }
    });

    return resultReportData;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subText}>Admin, SmartSchool</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Timetable')}
        >
            <MaterialCommunityIcons name="clock" color='#3cb371' size={50} />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Manage Students screen')}>
          <Card.Section content={[{ text: 'Total Students', text70: true, grey10: true }, { text: `${studentCount}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
        </Card>
        <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Manage Teachers screen')}>
          <Card.Section content={[{ text: 'Total Teachers', text70: true, grey10: true }, { text: `${teacherCount}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
        </Card>
      </View>

      <Card style={styles.bigCard} flex activeOpacity={1}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Students in Each Class</Text>
          <PieChart
            data={pieChartData(studentsPerClass)}
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
            paddingLeft="5"
            absolute 
          />
          <View style={styles.buttonsContainer}>
            <Button style = {styles.Button} label="View Full Report" onPress={() => navigation.navigate('ViewReport',  { data: getDataForStudentInClassReport(), headers: headersForClass})} />
            <Button style = {styles.Button} label="Download as PDF" onPress={() => downloadPDF(headersForClass, getDataForStudentInClassReport(), "Student in Class - Report")} />
          </View>
        </View>
      </Card>
      <Card style={styles.bigCard} flex activeOpacity={1}>
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
              width={screenWidth - 25}
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
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute 
            />
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <Button style = {styles.Button} label="View Full Report" onPress={() => navigation.navigate('ViewReport',  { data: getDataForStudentReport(), headers: headersForStudent})} />
            <Button style = {styles.Button} label="Download as PDF" onPress={() => downloadPDF(headersForStudent, getDataForStudentReport(), "Students Gender & Age Wise Report")} />
          </View>
        </View>
      </Card>
      <Card style={styles.bigCard} flex activeOpacity={1}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Average percentage in Each Class</Text>
          <PieChart
            data={pieChartData(averagePercentagePerClass)}
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
          <View style={styles.buttonsContainer}>
            <Button style = {styles.Button} label="View Full Report" onPress={() => navigation.navigate('ViewReport', { data: getDataForResultReport(), headers: headersForResult})} />
            <Button style = {styles.Button} label="Download as PDF" onPress={() => downloadPDF(headersForResult, getDataForResultReport(), "Average Percentage in Each Class Report")} />
          </View>
        </View>
      </Card>
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
    marginBottom: 20,
    color: '#000000', // Black color for text
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  bigCard: {
    width: (screenWidth) - 50, 
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3cb371', // Green border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    margin: 5,
    marginBottom: 16,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    // color: 'green',
  },
  Button: {
    backgroundColor: '#3cb371', // Green color for button
    borderRadius: 20,
    padding: 10,
    margin: 10,
  },
  headerButton: {
    marginRight: 15,
  },
});

export default DashboardScreen;
