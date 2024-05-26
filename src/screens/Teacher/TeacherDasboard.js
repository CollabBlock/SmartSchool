import React, { useState, useCallback, useEffect } from 'react';
import { Colors, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

const TeacherDashboard = () => {
    const navigation = useNavigation();
    const [studentCount, setStudentCount] = useState(0);
    const [teacherclass, setTeacherClass] = useState(0);
    const [teahername, setTeacherName] = useState('');
    const [taskCount, setTaskCount] = useState(5); // Example static data for tasks

    const fetchStudentCount = async () => {
        try {
            const studentsCollection = await firestore().collection('students').where('class', '==', 3).get();
            setStudentCount(studentsCollection.size);
        } catch (error) {
            console.error("Error fetching student count: ", error);
        }
    };

    const fetchTeacherClass = async () => {
        try {
            const teacherCollection = await firestore().collection('teachers').doc(auth().currentUser.id).get();
            setTeacherClass(teacherCollection.data().class);
        } catch (error) {
            console.error("Error fetching teacher class: ", error);
        }
    };

    const fetchTeacherName = async () => {
        try {
            const teacherCollection = await firestore().collection('teachers').doc(auth().currentUser.id).get();
            setTeacherName(teacherCollection.data().name);
        } catch (error) {
            console.error("Error fetching teacher name: ", error);
        }
    }

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
        <View style={styles.container}>
            <Text style={styles.welcometext} >Welcome Back!</Text>
            <Text style={styles.subText}> {teahername}</Text>
            <Text style={styles.subText}> {teacherclass}</Text>

            <View style={styles.row}>
                <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Total Student')}>
                    <Card.Section content={[{ text: 'Total Students', text70: true, grey10: true }, { text: `${studentCount}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
                </Card>
                <Card style={styles.card} flex activeOpacity={1} onPress={() => alert('Manage Tasks screen')}>
                    <Card.Section content={[{ text: 'Total Tasks', text70: true, grey10: true }, { text: `${taskCount}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff'
    },
    welcometext: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#3cb371', // MediumSeaGreen
    },
    subText: {
        fontSize: 20,
        marginBottom: 30,
        color: '#000000',
    },

    text: {
        fontSize: 20,
        color: 'black',
    },
});

export default TeacherDashboard;
