import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const MyComponent = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedStudentName, setSelectedStudentName] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [marks, setMarks] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [teacherData, setTeacherData] = useState({});

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const user = auth().currentUser;
                if (!user) {
                    console.error("No authenticated user");
                    return;
                }

                const userEmail = user.email;
                console.log("Authenticated user email:", userEmail);

                try {
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
                    setTeacherData(teacherData);

                    const unsubscribe = firestore()
                        .collection('students')
                        .where('class', '==', teacherData.class)
                        .onSnapshot((querySnapshot) => {
                            const studentsData = [];
                            querySnapshot.forEach((documentSnapshot) => {
                                const data = documentSnapshot.data();
                                studentsData.push({
                                    ...data,
                                    key: documentSnapshot.id,
                                    name: data.name, // Ensure 'name' is part of the data structure
                                });
                            });
                            setStudents(studentsData);
                        });

                    return () => unsubscribe();
                } catch (error) {
                    console.error("Error fetching teacher data: ", error);
                }
            };

            fetchData();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (selectedStudentId) {
                const selectedStudent = students.find(student => student.key === selectedStudentId);
                setSelectedStudentName(selectedStudent?.name || '');
                const studentClass = selectedStudent?.class;
                setSubjects(getSubjectsByClass(studentClass));
                console.log('Selected Student:', selectedStudent);
                console.log('Subjects:', getSubjectsByClass(studentClass));
            }
        }, [selectedStudentId, students])
    );

    const getSubjectsByClass = (className) => {
        switch (className) {
            case 'Nursery':
                return ['English', 'Urdu', 'Math', 'Nazra-e-Quran'];
            case 'Prep':
                return ['English', 'Urdu', 'Math', 'Nazra-e-Quran', 'General Knowledge'];
            case '1':
                return ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat'];
            case '2':
            case '3':
                return ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat', 'Computer'];
            case '4':
            case '5':
                return ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer'];
            case '6':
            case '7':
            case '8':
                return ['English', 'Urdu', 'Math', 'General Knowledge', 'Social Study', 'Islamyat', 'Computer', 'Quran'];
            default:
                return [];
        }
    };

    const handleMarksChange = (subject, value, index = null) => {
        if (/^\d*$/.test(value)) { // Only allow numeric input
            setMarks(prevMarks => {
                if (index !== null) {
                    const updatedSubjectMarks = Array.isArray(prevMarks[subject]) ? [...prevMarks[subject]] : [];
                    updatedSubjectMarks[index] = value;
                    return {
                        ...prevMarks,
                        [subject]: updatedSubjectMarks,
                    };
                } else {
                    return {
                        ...prevMarks,
                        [subject]: value,
                    };
                }
            });
        }
    };

    const handleSubmit = async (selectedStudentId, selectedTerm, marks) => {
        try {
            const marksDocRef = firestore().collection('marks').doc(selectedStudentId);
            const marksDocSnapshot = await marksDocRef.get();
    
            let updatedMarks;
    
            if (marksDocSnapshot.exists) {
                const marksDocData = marksDocSnapshot.data();
                updatedMarks = {
                    ...marksDocData,
                    [selectedTerm]: {
                        ...marksDocData[selectedTerm],
                        ...marks
                    }
                };
            } else {
                updatedMarks = {
                    regNo: selectedStudentId,
                    class: teacherData.class,
                    [selectedTerm]: marks
                };
            }
    
            await marksDocRef.set(updatedMarks, { merge: true });
            console.log('Marks submitted successfully');
        } catch (error) {
            console.error('Error submitting marks: ', error);
        }
    };

    const renderMarksInput = (subject) => {
        if (subject === 'Computer') {
            return (
                <View key={subject} style={styles.inputContainer}>
                    <Text style={styles.label}>{subject} Class Marks:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={value => handleMarksChange(subject, value, 0)}
                        value={marks[subject] ? marks[subject][0] : ''}
                    />
                    <Text style={styles.label}>{subject} Lab Marks:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={value => handleMarksChange(subject, value, 1)}
                        value={marks[subject] ? marks[subject][1] : ''}
                    />
                </View>
            );
        } else {
            return (
                <View key={subject} style={styles.inputContainer}>
                    <Text style={styles.label}>{subject} Marks:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={value => handleMarksChange(subject, value)}
                        value={marks[subject] || ''}
                    />
                </View>
            );
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Select a Student ID:</Text>
            <Picker
                selectedValue={selectedStudentId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedStudentId(itemValue)}
            >
                <Picker.Item label="Select a student" value="" />
                {students.map(student => (
                    <Picker.Item key={student.key} label={student.key} value={student.key} />
                ))}
            </Picker>
            {selectedStudentName ? (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Student Name: {selectedStudentName}</Text>
                </View>
            ) : null}
            {selectedStudentId && (
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Select Term:</Text>
                    <Picker
                        selectedValue={selectedTerm}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedTerm(itemValue)}
                    >
                        <Picker.Item label="Select a term" value="" />
                        <Picker.Item label="First" value="first" />
                        <Picker.Item label="Mid" value="mid" />
                        <Picker.Item label="Final" value="final" />
                    </Picker>
                </View>
            )}
            {selectedTerm && subjects.length > 0 && (
                <View style={styles.marksContainer}>
                    {subjects.map(subject => renderMarksInput(subject))}
                </View>
            )}
            {selectedTerm && subjects.length > 0 && (
                <Button title="Submit Marks" onPress={() => handleSubmit(selectedStudentId, selectedTerm, marks)} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginBottom: 20, // Add margin to ensure the submit button is visible
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    infoContainer: {
        marginTop: 16,
    },
    infoText: {
        fontSize: 16,
    },
    dropdownContainer: {
        marginTop: 16,
    },
    marksContainer: {
        marginTop: 16,
    },
    inputContainer: {
        marginBottom: 12,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        marginTop: 8,
    },
});

export default MyComponent;
