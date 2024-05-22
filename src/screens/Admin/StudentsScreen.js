import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { Text, ListItem, Colors, TextField } from 'react-native-ui-lib';


const StudentsScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('students')
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
      });

    return () => unsubscribe();
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
      <TouchableOpacity
        onPress={() => navigation.navigate('EditStudent', { studentId: item.key })}
        style={styles.listItemContent}
      >
        <Text style={styles.listItemText}>{item.name}</Text>
        <Text style={styles.listItemSubText}>Reg: {item.id}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteStudent(item.key)} style={styles.deleteButton}>
        <MaterialCommunityIcons name="delete-outline" size={24} color={Colors.red30} />
      </TouchableOpacity>
    </View>
  );

  const deleteStudent = (studentId) => {
    firestore().collection('students').doc(studentId).delete();
  };

  return (
    <View style={styles.container}>
      <TextField
        placeholder="Search by name or registration number"
        value={search}
        onChangeText={setSearch}
        floatingPlaceholder
        floatOnFocus
        style={styles.searchBar}
        floatingPlaceholderColor={{ focus: Colors.green30 }}
      />
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddStudent')}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>
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
    marginBottom: 15,
    borderRadius: 5,
    border: 1,
    borderColor: '#000000',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.grey60,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#D4FFEA',
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
    marginTop: 4,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: 'transparent',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3cb371',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudentsScreen;
