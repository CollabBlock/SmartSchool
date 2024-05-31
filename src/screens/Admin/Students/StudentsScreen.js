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
      {/* // lets add profile image here */}
      <MaterialCommunityIcons name="account-circle" size={40} color={'#3cb371'} style={styles.profilePic}/>

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
      <View  style={styles.searchBar} >
      <TextField
        placeholder="🔎 Search by name or registration number"
        value={search}
        onChangeText={setSearch}
        floatingPlaceholder
        floatOnFocus
        containerStyle={styles.searchText}
        floatingPlaceholderColor={{ focus: Colors.green30 }}
        // centered
        // fieldStyle={{ color: Colors.grey60, borderColor: Colors.grey60}}
      />
      {/* // lets a cross icon to clear the search field */}
      <MaterialCommunityIcons name="close" size={20} color={Colors.grey20} onPress={() => setSearch('')} style={styles.clearSearch}/>

      </View>
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddStudent')}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff"  />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 15,
    // borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // borderWidth: 1,
    // paddingHorizontal: 35,
    borderColor: Colors.grey50,
  },

  clearSearch: {
    position: 'absolute',
    right: 15,
    top: 20,
  },

  searchText: {
    flex: 1,
    // backgroundColor: 'red',
    // borderWidth: 1,
    // borderColor: Colors.grey50,
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
