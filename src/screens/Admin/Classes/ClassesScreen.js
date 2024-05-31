import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, Colors, TextField } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const ClassesScreen = () => {
  const navigation = useNavigation();
  const [teacher, setTeacher] = useState([]);
  const [search, setSearch] = useState('');
  const [subjects, setSubjects] = useState([
    { id: '1', name: 'Nursery', teacher: '' },
    { id: '2', name: 'Prep', teacher: '' },
    { id: '3', name: 'One', teacher: '' },
    { id: '4', name: 'Two', teacher: '' },
    { id: '5', name: 'Three', teacher: '' },
    { id: '6', name: 'Four', teacher: '' },
    { id: '7', name: 'Five', teacher: '' },
    { id: '8', name: 'Six', teacher: '' },
    { id: '9', name: 'Seven', teacher: '' },
    { id: '10', name: 'Eight', teacher: '' },
  ]);
  const [filteredClass, setFilteredClass] = useState(subjects);

  const classMapping = {
    'Nursery': 'Nursery',
    'Prep': 'Prep',
    'One': '1',
    'Two': '2',
    'Three': '3',
    'Four': '4',
    'Five': '5',
    'Six': '6',
    'Seven': '7',
    'Eight': '8'
  };
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
        setTeacher(teachersData);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (teacher.length > 0) {
      const updatedSubjects = subjects.map((subject) => {
        const assignedTeacher = teacher.find((t) => t.class === classMapping[subject.name]);
        return {
          ...subject,
          teacher: assignedTeacher ? assignedTeacher.name : 'N/A',
        };
      });
      setSubjects(updatedSubjects);
      setFilteredClass(updatedSubjects);
    }
  }, [teacher]);

  useEffect(() => {
    const filteredData = subjects.filter((subject) =>
      subject.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredClass(filteredData);
  }, [search, subjects]);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <MaterialCommunityIcons name="google-classroom" size={36} color={'#3cb371'} style={styles.profilePic}/>

      <TouchableOpacity
        onPress={() => navigation.navigate('ClassDetail', { className: item.name, teacher: item.teacher})}
        style={styles.listItemContent}
      >
        <Text style={styles.listItemText}>{item.name}</Text>
        <Text style={styles.listItemSubText}>Teacher: {item.teacher}</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => navigation.navigate('ClassDetail', { className: item.name, teacher: item.teacher})} style={styles.arrowButton}>
        <MaterialCommunityIcons name="arrow-right-drop-circle" size={24} color={Colors.green30} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextField
          placeholder="🔎 Search by class name..."
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
        data={filteredClass}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
    marginBottom: 5,
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
  arrowButton: {
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

export default ClassesScreen;
