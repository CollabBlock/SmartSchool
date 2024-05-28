import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

const TeacherDashboard = () => {
    const navigation = useNavigation();
    const [studentCount, setStudentCount] = useState(0);
    const [teacherClass, setTeacherClass] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [taskCount, setTaskCount] = useState(5); // Example static data for tasks
    const [selectedTerm, setSelectedTerm] = useState('first');
    const [selectedDataType, setSelectedDataType] = useState('average');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    const fetchTeacherData = async () => {
        try {
            const user = auth().currentUser;
            if (!user) {
                console.error("No authenticated user");
                return;
            }

            const userEmail = user.email;
            console.log("Authenticated user email:", userEmail);

            const teacherQuerySnapshot = await firestore()
                .collection('teachers')
                .where('email', '==', userEmail)
                .get();

            if (teacherQuerySnapshot.empty) {
                console.error("No such document in teachers collection for user email:", userEmail);
                return;
            }

            const teacherDoc = teacherQuerySnapshot.docs[0];
            const teacherData = teacherDoc.data();

            setTeacherClass(teacherData.class);
            setTeacherName(teacherData.name);

            // Fetch the number of students in the teacher's class
            const studentsCollection = await firestore().collection('students').where('class', '==', teacherData.class).get();
            setStudentCount(studentsCollection.size);

            // Fetch the marks data for the teacher's class
            fetchMarksData(teacherData.class, 'first', 'average'); // Initial load for 'first' term and 'average' data type
        } catch (error) {
            console.error("Error fetching teacher data: ", error);
        }
    };

    const fetchMarksData = async (teacherClass, term, dataType) => {
        try {
            console.log(`Fetching marks data for class: ${teacherClass}, term: ${term}, data type: ${dataType}`);

            // Fetch marks data for the teacher's class and term
            const marksQuerySnapshot = await firestore()
                .collection('marks')
                .where('class', '==', teacherClass)
                .get();

            if (marksQuerySnapshot.empty) {
                console.log(`No marks data found for class: ${teacherClass}, term: ${term}`);
                setChartData({ labels: [], datasets: [] });
                return;
            }

            // Extract subjects from the first document (assuming all documents have the same structure)
            const firstDocData = marksQuerySnapshot.docs[0].data();
            const subjects = Object.keys(firstDocData[term]);

            // Prepare chart data based on subjects
            const chartDatasets = subjects.map(subject => {
                const subjectMarks = marksQuerySnapshot.docs.map(doc => doc.data()[term][subject]);

                let flattenedMarks = [];
                subjectMarks.forEach(mark => {
                    if (Array.isArray(mark)) {
                        // Flattening the array and filtering non-numeric values
                        flattenedMarks = flattenedMarks.concat(mark.filter(m => !isNaN(m)));
                    } else if (!isNaN(mark)) {
                        flattenedMarks.push(mark);
                    }
                });

                let dataValue = 0;
                if (dataType === 'average') {
                    const sum = flattenedMarks.reduce((acc, mark) => acc + mark, 0);
                    dataValue = flattenedMarks.length ? sum / flattenedMarks.length : 0;
                } else if (dataType === 'highest') {
                    dataValue = Math.max(...flattenedMarks);
                } else if (dataType === 'lowest') {
                    dataValue = Math.min(...flattenedMarks);
                }

                // Ensure dataValue is not NaN
                dataValue = isNaN(dataValue) ? 0 : dataValue;

                return {
                    label: subject,
                    data: [dataValue],
                };
            });

            // Set chart data
            setChartData({
                labels: subjects,
                datasets: [
                    {
                        data: chartDatasets.map(dataset => dataset.data[0]),
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching marks data: ", error);
        }
    };



    useFocusEffect(
        useCallback(() => {
            fetchTeacherData();
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

    const handleTermChange = (itemValue) => {
        setSelectedTerm(itemValue);
        fetchMarksData(teacherClass, itemValue, selectedDataType);
    };

    const handleDataTypeChange = (itemValue) => {
        setSelectedDataType(itemValue);
        fetchMarksData(teacherClass, selectedTerm, itemValue);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.subText}>{teacherName}</Text>
                {/* <Text style={styles.subText}>Class: {teacherClass}</Text> */}
            </View>
            <View style={styles.row}>
                <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Total Students')}>
                    <Card.Section content={[{ text: 'Total Students', text70: true, grey10: true }, { text: `${studentCount}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
                </Card>
                <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Manage Tasks screen')}>
                    <Card.Section content={[{ text: 'Total Tasks', text70: true, grey10: true }, { text: `${taskCount}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
                </Card>
            </View>
            <View style={styles.dropdown}>
                <Text>Select Term:</Text>
                <Picker
                    selectedValue={selectedTerm}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleTermChange(itemValue)}
                >
                    <Picker.Item label="First Term" value="first" />
                    <Picker.Item label="Mid Term" value="mid" />
                    <Picker.Item label="Final Term" value="final" />
                </Picker>
            </View>
            <View style={styles.dropdown}>
                <Text>Select Data Type:</Text>
                <Picker
                    selectedValue={selectedDataType}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleDataTypeChange(itemValue)}
                >
                    <Picker.Item label="Average" value="average" />
                    <Picker.Item label="Highest" value="highest" />
                    <Picker.Item label="Lowest" value="lowest" />
                </Picker>
            </View>
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{`${selectedTerm.charAt(0).toUpperCase() + selectedTerm.slice(1)} Term Marks (${selectedDataType.charAt(0).toUpperCase() + selectedDataType.slice(1)})`}</Text>
                {chartData.labels.length > 0 ? (
                    <ScrollView horizontal={true}>
                        <BarChart
                            data={{
                                labels: chartData.labels,
                                datasets: chartData.datasets.map(dataset => ({
                                    ...dataset,
                                    data: dataset.data.map(value => (isNaN(value) ? 0 : value)), // Ensure data values are numeric
                                })),
                            }}
                            width={Math.max(350, chartData.labels.length * 100)} // Minimum width of 1150, or adjust dynamically based on the number of labels
                            height={230}
                            chartConfig={{
                                backgroundColor: '#3cb371',
                                backgroundGradientFrom: '#66cdaa',
                                backgroundGradientTo: '#3cb371',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: '#000000'
                                },
                            }}
                            style={styles.chart}
                        />
                    </ScrollView>
                ) : (
                    <Text>No data available for the selected term and data type.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        marginTop: 0,
    },
    header: {
        alignItems: 'start',
        flex: 'row',
        marginBottom: 20,

    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subText: {
        fontSize: 20,
        fontWeight: 'semibold',
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
    headerButton: {
        marginRight: 15,
    },
    dropdown: {
        marginVertical: 15,
        alignItems: 'center',
    },
    picker: {
        height: 50,
        width: 200,
    },
    chartContainer: {
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chart: {
        borderRadius: 16,
    },
});

export default TeacherDashboard;
