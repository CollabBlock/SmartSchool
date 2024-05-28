import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextField, Text, Button, Picker } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddTeacherScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [teacherClass, setTeacherClass] = useState('None');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesCollection = await firestore().collection('classes').get();
        const classesData = classesCollection.docs.map(doc => doc.id);
        setClasses(['None', ...classesData]);
      } catch (error) {
        console.error('Error fetching classes: ', error);
      }
    };

    fetchClasses();
  }, []);

  const handleAddTeacher = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await firestore()
        .collection('teachers')
        .add({
          name,
          email,
          class: teacherClass === 'None' ? '' : teacherClass,
        });
      Alert.alert('Success', 'Teacher added successfully!');
      setName('');
      setEmail('');
      setTeacherClass('None');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Error adding teacher:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Please Enter Details to add a Teacher</Text>
      <View style={styles.warningContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={24}
          color="#ffcc00"
        />
        <Text style={styles.warningText}>
          Select class if a teacher is not already assigned.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={name}
          onChangeText={setName}
          placeholder="Enter teacher's name"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}
          validate={[
            [(value) => value.length > 3]
          ]}
          validationMessage={['Name must be valid']}
          validateOnChange
          validationMessagePosition={'bottom'}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={email}
          onChangeText={setEmail}
          placeholder="Enter teacher's email"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}
          validate={['required', 'email']}
          validationMessage={['Field is required', 'Email is invalid']}
          validateOnChange
        />
      </View>
      <View style={styles.inputContainer}>
        <Picker
          showSearch
          searchStyle={{ color: '#3cb371', placeholderTextColor: '#3cb371', selectionColor: '#3cb371'}}
          placeholder="Select Class"
          floatingPlaceholder
          value={teacherClass}
          onChange={item => setTeacherClass(item.valueOf())}
          useNativePicker
          style={styles.picker}
          
        >
          {classes.map(classItem => (
            <Picker.Item key={classItem} value={classItem} label={classItem} />
          ))}
        </Picker>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color="#3cb371"
          style={{ position: 'absolute', right: 10, top: 10 }}
        />
      </View>
      <Button
        label="Add Teacher"
        onPress={handleAddTeacher}
        style={styles.addButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3cb371',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  warningText: {
    marginLeft: 10,
    // dark gray color
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  fieldStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
  picker: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
  addButton: {
    backgroundColor: '#3cb371',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default AddTeacherScreen;
