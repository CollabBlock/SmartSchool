import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ViewMarks = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { studentId } = route.params;
    const [studentData, setStudentData] = useState(null);
    const [marks, setMarks] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [noMarks, setNoMarks] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentDoc = await firestore().collection('students').doc(studentId).get();
                if (studentDoc.exists) {
                    const studentData = studentDoc.data();
                    setStudentData(studentData);
                } else {
                    console.error('No such student document!');
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchData();
    }, [studentId]);

    const fetchMarksData = async (studentClass, term) => {
        try {
            const marksDoc = await firestore().collection('marks').doc(studentId).get();
            if (marksDoc.exists) {
                const marksData = marksDoc.data();
                console.log('Fetched marks data:', marksData);
                const termMarks = marksData[term] || {};
                if (Array.isArray(termMarks.Computer)) {
                    termMarks.Computer = {
                        class: termMarks.Computer[0],
                        lab: termMarks.Computer[1]
                    };
                }
                setMarks(termMarks);
                setSubjects(getSubjectsByClass(studentClass));
                setNoMarks(Object.keys(termMarks).length === 0);
            } else {
                setMarks({});
                setNoMarks(true);
            }
        } catch (error) {
            console.error('Error fetching marks data:', error);
        }
    };

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

    const handleSubmit = async () => {
        try {
            const marksDocRef = firestore().collection('marks').doc(studentId);
            const marksDocSnapshot = await marksDocRef.get();

            let updatedMarks;

            if (marksDocSnapshot.exists) {
                const marksDocData = marksDocSnapshot.data();
                updatedMarks = {
                    ...marksDocData,
                    [selectedTerm]: {
                        ...marksDocData[selectedTerm],
                        ...marks,
                        Computer: [
                            marks.Computer.class,
                            marks.Computer.lab
                        ]
                    }
                };
            } else {
                updatedMarks = {
                    regNo: studentId,
                    class: studentData.class,
                    [selectedTerm]: {
                        ...marks,
                        Computer: [
                            marks.Computer.class,
                            marks.Computer.lab
                        ]
                    }
                };
            }

            await marksDocRef.set(updatedMarks, { merge: true });
            console.log('Marks submitted successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error submitting marks:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const marksDocRef = firestore().collection('marks').doc(studentId);
            await marksDocRef.update({
                [selectedTerm]: firestore.FieldValue.delete()
            });
            console.log('Marks deleted successfully');
            setSelectedTerm('');
            setMarks({});
            setSubjects([]);
            setIsEditing(false);
        } catch (error) {
            console.error('Error deleting marks:', error);
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
                        onChangeText={value => handleMarksChange(subject, value, 'class')}
                        value={marks[subject] && marks[subject].class !== undefined ? marks[subject].class.toString() : ''}
                        editable={isEditing}
                    />
                    <Text style={styles.label}>{subject} Lab Marks:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={value => handleMarksChange(subject, value, 'lab')}
                        value={marks[subject] && marks[subject].lab !== undefined ? marks[subject].lab.toString() : ''}
                        editable={isEditing}
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
                        editable={isEditing}
                    />
                </View>
            );
        }
    };

    if (!studentData) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Student Details</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Name:</Text> {studentData.name}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Reg. No:</Text> {studentData.id}</Text>
            </View>

            <View style={styles.termContainer}>
                <View style={styles.dropdown}>
                    <Text style={styles.label}>Select Term:</Text>
                    <Picker
                        selectedValue={selectedTerm}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            setSelectedTerm(itemValue);
                            fetchMarksData(studentData.class, itemValue);
                        }}
                    >
                        <Picker.Item label="Select a term" value="" />
                        <Picker.Item label="First Term" value="first" />
                        <Picker.Item label="Mid Term" value="mid" />
                        <Picker.Item label="Final Term" value="final" />
                    </Picker>
                </View>
                {isEditing && selectedTerm && !noMarks && (
                    <TouchableOpacity onPress={handleDelete}>
                        <Icon name="delete" size={30} color="#dc3545" style={styles.deleteIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {noMarks && selectedTerm && (
                <Text style={styles.noMarksText}>There are no marks uploaded for the selected term.</Text>
            )}

            {subjects.length > 0 && (
                <View style={styles.marksContainer}>
                    {subjects.map(subject => renderMarksInput(subject))}
                </View>
            )}

            {selectedTerm && !isEditing && (
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Text style={styles.editButtonText}>Edit Marks</Text>
                </TouchableOpacity>
            )}

            {isEditing && (
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Marks</Text>
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    infoText: {
        fontSize: 18,
        marginBottom: 8,
        color: '#333',
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#555',
    },
    termContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    dropdown: {
        flex: 1,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    deleteIcon: {
        marginTop: 32,
        marginLeft: 15,
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
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 8,
    },
    noMarksText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
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
    editButton: {
        marginTop: 16,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ViewMarks;
