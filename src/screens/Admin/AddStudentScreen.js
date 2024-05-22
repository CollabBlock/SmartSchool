import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { TextField, Colors, Typography, Text } from 'react-native-ui-lib';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';



const AddStudentScreen = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [dateOfAdmission, setDateOfAdmission] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [caste, setCaste] = useState('');
  const [occupation, setOccupation] = useState('');
  const [residence, setResidence] = useState('');
  const [admissionClass, setAdmissionClass] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remarks, setRemarks] = useState('');


  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


  const handleAddStudent = async () => {
    if (
      !registrationNumber ||
      !dateOfAdmission ||
      !name ||
      !dateOfBirth ||
      !gender ||
      !fatherName ||
      !caste ||
      !occupation ||
      !residence ||
      !admissionClass ||
      !email ||
      !password
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await firestore().collection('students').doc(registrationNumber.toString()).set({
        registrationNumber: parseInt(registrationNumber, 10),
        dateOfAdmission,
        name,
        dateOfBirth,
        gender,
        fatherName,
        caste,
        occupation,
        residence,
        admissionClass,
        email,
        password,
        remarks,
      });
      Alert.alert('Success', 'Student added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Error adding student:', error);
    }
  };


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDateOfAdmission(date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Student</Text>
      <View style={styles.inputContainer}>
        <TextField
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
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
          value={dateOfAdmission}
          onChangeText={setDateOfAdmission}
          placeholder="Date of Admission"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}

          enableErrors

          validate={['required', 'date']}
          validateOnChange
          validationMessage={['Field is required']}
          validationMessagePosition="bottom"
          fieldStyle={styles.fieldStyle}
          trailingAccessory={
            <TouchableOpacity onPress={showDatePicker}>
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
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="Date of Birth"
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
          value={caste}
          onChangeText={setCaste}
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
          value={admissionClass}
          onChangeText={setAdmissionClass}
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
      <View style={styles.inputContainer}>
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
      </View>
      <View style={styles.inputContainer}>
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
      </View>
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
