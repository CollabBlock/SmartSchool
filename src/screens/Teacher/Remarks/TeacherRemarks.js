import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const RemarkPage = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedStudentName, setSelectedStudentName] = useState('');
    const [remark, setRemark] = useState('');
    const [isEditing, setIsEditing] = useState(false);

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
                                    name: data.name,
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
                setRemark(selectedStudent?.remarks || '');
                console.log('Selected Student:', selectedStudent);
            }
        }, [selectedStudentId, students])
    );

    const handleRemarkChange = (value) => {
        setRemark(value);
    };

    const handleSubmit = async () => {
        try {
            const studentDocRef = firestore().collection('students').doc(selectedStudentId);

            await studentDocRef.update({
                remarks: remark,
            });

            console.log('Remark updated successfully');
            setIsEditing(false);
            Alert.alert('Success', 'Remark updated successfully');
        } catch (error) {
            console.error('Error updating remark: ', error);
            Alert.alert('Error', 'There was an error updating the remark');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Select a Student ID:</Text>
            <View style={styles.pickerContainer}>
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
            </View>
            {selectedStudentName ? (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Student Name: {selectedStudentName}</Text>
                </View>
            ) : null}
            {selectedStudentId && (
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Remark:</Text>
                    <TextInput
                        style={styles.input}
                        value={remark}
                        onChangeText={handleRemarkChange}
                        editable={isEditing}
                    />
                </View>
            )}
            {selectedStudentId && !isEditing && (
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Text style={styles.buttonText}>Edit Remark</Text>
                </TouchableOpacity>
            )}
            {isEditing && (
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit Remark</Text>
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
    inputContainer: {
        marginTop: 16,
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
        borderRadius: 8,
    },
    editButton: {
        marginTop: 16,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButton: {
        marginTop: 16,
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default RemarkPage;
