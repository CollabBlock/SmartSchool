import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const Marks = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedStudentName, setSelectedStudentName] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [marks, setMarks] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [teacherData, setTeacherData] = useState({});
    const [submitted, setSubmitted] = useState(false);

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

    const handleMarksChange = (subject, value, part = null) => {
        if (/^\d*$/.test(value)) { // Only allow numeric input
            const maxMarks = (selectedTerm === 'final')
                ? (subject === 'Computer' ? (part === 'class' ? 70 : 30) : 100)
                : (subject === 'Computer' ? (part === 'class' ? 35 : 15) : 50);

            if (Number(value) <= maxMarks) {
                setMarks(prevMarks => {
                    if (part) {
                        return {
                            ...prevMarks,
                            [subject]: {
                                ...prevMarks[subject],
                                [part]: value === '' ? '' : Number(value),
                            }
                        };
                    } else {
                        return {
                            ...prevMarks,
                            [subject]: value === '' ? '' : Number(value),
                        };
                    }
                });
            } else {
                Alert.alert(`Invalid Marks`, `The maximum marks for ${subject} ${part ? part : ''} are ${maxMarks}.`);
            }
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
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting marks: ', error);
        }
    };

    const resetForm = () => {
        setSelectedStudentId('');
        setSelectedStudentName('');
        setSelectedTerm('');
        setMarks({});
        setSubjects([]);
        setSubmitted(false);
    };

    const renderMarksInput = (subject) => {
        if (subject === 'Computer') {
            return (
                <View key={subject} style={styles.inputContainer}>
                    <Text style={styles.label}>{subject} Class Marks:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={value => handleMarksChange(subject, value, 'class')}
                        value={marks[subject] && marks[subject]['class'] !== undefined ? marks[subject]['class'].toString() : ''}
                    />
                    <Text style={styles.label}>{subject} Lab Marks:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={value => handleMarksChange(subject, value, 'lab')}
                        value={marks[subject] && marks[subject]['lab'] !== undefined ? marks[subject]['lab'].toString() : ''}
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
                        value={marks[subject] !== undefined ? marks[subject].toString() : ''}
                    />
                </View>
            );
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Select a Student ID:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedStudentId}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        setSelectedStudentName('');
                        setSelectedStudentId(itemValue);
                    }}
                >
                    <Picker.Item label="Select a student" value="" />
                    {students.map(student => (
                        <Picker.Item key={student.key} label={student.key} value={student.key} />
                    ))}
                </Picker>
            </View>
            {selectedStudentName ? (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Student Name: {selectedStudentName}</Text>
                </View>
            ) : null}
            {selectedStudentId && (
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Select Term:</Text>
                    <View style={styles.pickerContainer}>
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
                </View>
            )}
            {selectedTerm && subjects.length > 0 && (
                <View style={styles.marksContainer}>
                    {subjects.map(subject => renderMarksInput(subject))}
                </View>
            )}
            {selectedTerm && subjects.length > 0 && !submitted && (
                <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(selectedStudentId, selectedTerm, marks)}>
                    <Text style={styles.submitButtonText}>Submit Marks</Text>
                </TouchableOpacity>
            )}
            {submitted && (
                <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                    <Text style={styles.resetButtonText}>Enter Another Student's Marks</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: '#333',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    infoContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
    },
    dropdownContainer: {
        marginTop: 16,
    },
    marksContainer: {
        marginTop: 16,
    },
    inputContainer: {
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        marginTop: 8,
        borderRadius: 8,
    },
    submitButton: {
        marginTop: 16,
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    resetButton: {
        marginTop: 16,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Marks;
