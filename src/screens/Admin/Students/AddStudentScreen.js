import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { TextField, Colors, Typography, Text } from 'react-native-ui-lib';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';


const AddStudentScreen = () => {
  const [id, setID] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [name, setName] = useState('');
  const [dob, setdob] = useState('');
  const [gender, setGender] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cast, setCast] = useState('');
  const [occupation, setOccupation] = useState('');
  const [residence, setResidence] = useState('');
  const [admclass, setClass] = useState('');
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [remarks, setRemarks] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentDateField, setCurrentDateField] = useState('');


  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const studentsSnapshot = await firestore().collection('students').get();
        const studentsList = studentsSnapshot.docs.map(doc => ({
          label: `${doc.data().name} (${doc.id})`,
          value: doc.id
        }));

        const customSort = (a, b) => {
          const numA = parseInt(a.value, 10);
          const numB = parseInt(b.value, 10);

          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }

          return a.value.localeCompare(b.value, undefined, { numeric: true, sensitivity: 'base' });
        };

        studentsList.sort(customSort);
        
        const highestID = studentsList.length > 0 ? parseInt(studentsList[studentsList.length - 1].value, 10) : 0;
        const newId = highestID + 1;
        setID(newId.toString());
        setEmail(`student_${newId}@smart.com`);
      } catch (error) {
        console.error('Error fetching student count:', error);
      }
    };

    fetchStudentCount();
  }, []);



  const handleAddStudent = async () => {
    if (
      !id ||
      !admissionDate ||
      !name ||
      !dob ||
      !gender ||
      !fatherName ||
      !cast ||
      !occupation ||
      !residence ||
      !admclass ||
      !email
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Add student to the 'students' collection
      await firestore().collection('students').doc(id.toString()).set({
        id: parseInt(id, 10),
        admissionDate,
        name,
        dob,
        gender,
        fatherName,
        cast,
        occupation,
        residence,
        class: admclass,
        email,
        remarks,
      });

      // Add student to the 'Users' collection
      await firestore().collection('Users').doc(`student_${id}`).set({
        email,
        role: 'student',
      });

      // Create authentication for the user
      await auth().createUserWithEmailAndPassword(email, `student_${id}`);

      Alert.alert('Success', `Student added successfully! with email: ${email}`);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Error adding student:', error);
    }
  };

  const showDatePicker = (field) => {
    setCurrentDateField(field);
    setDatePickerVisibility(true);
  };
  

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  

  const handleConfirm = (date) => {
    const formattedDate = formatDate(date);
    if (currentDateField === 'admissionDate') {
      setAdmissionDate(formattedDate);
    } else if (currentDateField === 'dob') {
      setdob(formattedDate);
    }
    hideDatePicker();
  };

  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Add New Student</Text> */}
      <View style={styles.inputContainer}>
        <TextField
          value={id}
          onChangeText={setID}
          placeholder="Registration Number"
          floatingPlaceholder
          keyboardType="numeric"
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          enableErrors
          validate={['required', 'number', (value) => value >= 0 && value <= 1000]}
          validateOnChange
          validationMessage={['Field is required', 'Must be a number', 'Must be between 0 and 1000']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={admissionDate}
          onChangeText={setAdmissionDate}
          placeholder="Date of Admission"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          enableErrors
          validate={['required']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          fieldStyle={styles.fieldStyle}
          trailingAccessory={
            <TouchableOpacity onPress={() => showDatePicker('admissionDate')}>
              <MaterialCommunityIcons name="calendar" size={24} color="#3cb371" />
            </TouchableOpacity>
          }
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={name}
          onChangeText={setName}
          placeholder="Name"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          enableErrors
          validate={['required', 'string', (value) => value.length > 3, (value) => value.length < 30, (value) => /^[a-zA-Z ]+$/.test(value)]}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <View style={styles.inputContainer}>
      <TextField
        value={dob}
        onChangeText={setdob}
        placeholder="Date of Birth"
        floatingPlaceholder
        floatOnFocus
        floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
        enableErrors
        validate={['required']}
        validateOnChange
        validationMessage={['Field is required']}
        validationMessagePosition="bottom"
        fieldStyle={styles.fieldStyle}
        trailingAccessory={
          <TouchableOpacity onPress={() => showDatePicker('dob')}>
            <MaterialCommunityIcons name="calendar" size={24} color="#3cb371" />
          </TouchableOpacity>
        }

        
      />
      {/* <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      /> */}

    </View>
      <View style={styles.inputContainer}>
        <TextField
          value={gender}
          onChangeText={setGender}
          placeholder="Gender"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          enableErrors
          validate={['required']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={fatherName}
          onChangeText={setFatherName}
          placeholder="Father Name"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          enableErrors
          validate={['required']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={cast}
          onChangeText={setCast}
          placeholder="Caste"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          enableErrors
          validate={['required']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Occupation"
          floatingPlaceholder
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          floatOnFocus
          enableErrors
          validate={['required']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={residence}
          onChangeText={setResidence}
          placeholder="Residence"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          enableErrors
          validate={['required']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={admclass}
          onChangeText={setClass}
          placeholder="Admission Class"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          enableErrors
          validate={['required']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      {/* <View style={styles.inputContainer}>
        <TextField
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          enableErrors
          validate={['required', 'email']}
          validateOnChange
          validationMessage={['Field is required', 'Email is invalid']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View> */}
      {/* <View style={styles.inputContainer}>
        <TextField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          enableErrors
          validate={['required']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View> */}
      <View style={styles.inputContainer}>
        <TextField
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Remarks"
          floatingPlaceholder
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}

          floatOnFocus
          enableErrors
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <Button title="Add Student" onPress={handleAddStudent} color="#3cb371" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  inputContainer: {
    marginBottom: 15,
  },

  fieldStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
});

export default AddStudentScreen;
