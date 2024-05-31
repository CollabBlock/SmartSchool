import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { Text, Colors, TextField, Button, Picker } from 'react-native-ui-lib';

const TeachersScreen = () => {
  const navigation = useNavigation();
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('teachers')
      .onSnapshot((querySnapshot) => {
        const teachersData = [];
        querySnapshot.forEach((documentSnapshot) => {
          teachersData.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setTeachers(teachersData);
        setFilteredTeachers(teachersData); // Initialize filteredTeachers with all teachers
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const results = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.class.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTeachers(results);
  }, [search, teachers]);

  useEffect(() => {
    const fetchClasses = async () => {
      const classesCollection = await firestore().collection('classes').get();
      const classesData = classesCollection.docs.map(doc => ({
        label: doc.id,
        value: doc.id
      }));
      setClasses([{ label: 'None', value: 'None' }, ...classesData]);
    };

    fetchClasses();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <MaterialCommunityIcons name="account-circle" size={40} color={'#3cb371'} style={styles.profilePic} />

      <TouchableOpacity
        onPress={() => {
          setSelectedTeacher(item);
          setNewClass(item.class === '' ? 'None' : item.class); // Set initial class to 'None' if empty
        }}
        style={styles.listItemContent}
      >
        <Text style={styles.listItemText}>{item.name}</Text>
        <Text style={styles.listItemSubText}>Class: {item.class || 'None'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTeacher(item.key)} style={styles.deleteButton}>
        <MaterialCommunityIcons name="delete-outline" size={24} color={Colors.red30} />
      </TouchableOpacity>
    </View>
  );

  const deleteTeacher = (teacherId) => {
    firestore().collection('teachers').doc(teacherId).delete();
  };

  const updateClass = async () => {
    console.log("Attempting to update class to:", newClass); // Debug log to see the value of newClass
    
    if (!newClass || newClass === 'Select Class') {
      Alert.alert('Error', 'Please select a valid class.');
      return;
    }

    const classToUpdate = newClass === 'None' ? '' : newClass;

    try {
      if (classToUpdate !== '') {
        const classCheck = await firestore().collection('teachers').where('class', '==', classToUpdate).get();
        if (!classCheck.empty) {
          Alert.alert('Error', 'This class is already assigned to another teacher.');
          return;
        }
      }

      await firestore().collection('teachers').doc(selectedTeacher.key).update({ class: classToUpdate });
      Alert.alert('Success', 'Class updated successfully!');
      setSelectedTeacher(null);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Error updating class:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextField
          placeholder="🔎 Search by name or class"
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
        data={filteredTeachers}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
      {selectedTeacher && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Update Class for {selectedTeacher.name}</Text>
          <Picker
            placeholder="Select Class"
            floatingPlaceholder
            value={newClass}
            onChange={(item) => {
              console.log('Picker value selected:', item.valueOf()); // Debug log for Picker value
              setNewClass(item.valueOf());
            }}
            useNativePicker
            style={styles.picker}
            items={classes}
            getLabel={(item) => item.label}
          />
          <Button label="Update" onPress={updateClass} style={styles.updateButton} />
          <Button label="Close" onPress={() => setSelectedTeacher(null)} style={styles.closeButton} />
        </View>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTeacher')}
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
    paddingBottom: 0,
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
  modal: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#3cb371',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#3cb371',
  },
});

export default TeachersScreen;
