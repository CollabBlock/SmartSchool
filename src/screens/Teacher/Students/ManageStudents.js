import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Text, Colors, TextField } from 'react-native-ui-lib';

const ManageStudents = () => {
    const navigation = useNavigation();
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                            studentsData.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });
                        });
                        setStudents(studentsData);
                        setFilteredStudents(studentsData); // Initialize filteredStudents with all students
                        setLoading(false); // Stop loading
                    });

                return unsubscribe;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const results = students.filter(student =>
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.id.toString().includes(search)
        );
        setFilteredStudents(results);
    }, [search, students]);

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <MaterialCommunityIcons name="account-circle" size={40} color={'#3cb371'} style={styles.profilePic} />

            <TouchableOpacity
                onPress={() => navigation.navigate('ViewMarks', { studentId: item.key })}
                style={styles.listItemContent}
            >
                <Text style={styles.listItemText}>{item.name}</Text>
                <Text style={styles.listItemSubText}>Reg: {item.id}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3cb371" />
                </View>
            ) : (
                <>
                    <View style={styles.searchBar} >
                        <TextField
                            placeholder="🔎 Search by name or registration number"
                            value={search}
                            onChangeText={setSearch}
                            floatingPlaceholder
                            floatOnFocus
                            containerStyle={styles.searchText}
                            floatingPlaceholderColor={{ focus: Colors.green30 }}
                        />
                        <MaterialCommunityIcons name="close" size={20} color={Colors.grey20} onPress={() => setSearch('')} style={styles.clearSearch} />
                    </View>
                    <FlatList
                        data={filteredStudents}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.key}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderColor: Colors.grey50,
    },
    clearSearch: {
        position: 'absolute',
        right: 15,
        top: 20,
    },
    searchText: {
        flex: 1,
        paddingLeft: 10,
        marginLeft: 7,
    },
    profilePic: {
        marginRight: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderWidth: 1,
        borderColor: Colors.grey50,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#F2F2F2',
    },
    listItemContent: {
        flex: 1,
    },
    listItemText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listItemSubText: {
        fontSize: 14,
        color: Colors.grey40,
        marginTop: 3,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ManageStudents;
