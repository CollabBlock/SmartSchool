import React, { useState, useEffect } from 'react';
import { Colors, View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextField, Text, Button, Picker, Switch } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FeeScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [lateFees, setLateFees] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dueAmount, setDueAmount] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsSnapshot = await firestore().collection('students').get();
      const studentsList = studentsSnapshot.docs.map(doc => ({
        label: `${doc.data().name} (${doc.id})`,
        value: doc.id
      }));
      setStudents(studentsList);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const fetchStudentData = async () => {
        const studentDoc = await firestore().collection('students').doc(selectedStudent).get();
        const studentData = studentDoc.data();
        setStudentName(studentData.name);
        const feeDoc = await firestore().collection('fees').doc(selectedStudent).get();
        const feeData = feeDoc.exists ? feeDoc.data() : {};
        setDueAmount(feeData.due || 0);
        setPayableAmount(feeData.payable || 0);
      };

      fetchStudentData();
    }
  }, [selectedStudent]);

  const handleConfirm = (date) => {
    setPaymentDate(date);
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleAddFeeRecord = async () => {
    if (!selectedStudent || !amountPaid) {
      Alert.alert('Error', 'Please select a student and enter the amount paid.');
      return;
    }

    try {
      const newDueAmount = dueAmount - parseFloat(amountPaid);
      const newPayableAmount = newDueAmount > 0 ? newDueAmount : 0;

      await firestore().collection('fees').doc(selectedStudent).set({
        regNo: parseInt(selectedStudent, 10),
        date: paymentDate.toLocaleDateString('en-GB'),
        due: newDueAmount,
        paid: parseFloat(amountPaid),
        payable: newPayableAmount,
        late: lateFees,
        remarks,
      }, { merge: true });

      Alert.alert('Success', 'Fee record updated successfully!');
      // Reset form
      setSelectedStudent('');
      setAmountPaid('');
      setPaymentDate(new Date());
      setLateFees(false);
      setRemarks('');
      setDueAmount(0);
      setPayableAmount(0);
      setStudentName('');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Error updating fee record:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Fees</Text>
      <View style={styles.inputContainer}>
        <Picker
          placeholder="Select Student"
          value={selectedStudent}
          onChange={setSelectedStudent}
          floatingPlaceholder
          floatOnFocus
          containerStyle={styles.picker}
          useNativePicker
        >
          {students.map(student => (
            <Picker.Item key={student.value} value={student.value} label={student.label} />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={studentName}
          placeholder="Student Name"
          editable={false}
          floatingPlaceholder
          floatOnFocus
          containerStyle={styles.textField}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={amountPaid}
          onChangeText={setAmountPaid}
          placeholder="Amount Paid"
          keyboardType="numeric"
          floatingPlaceholder
          floatOnFocus
          containerStyle={styles.textField}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={paymentDate.toISOString().split('T')[0]}
          placeholder="Payment Date"
          floatingPlaceholder
          floatOnFocus
          containerStyle={styles.textField}
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
        <Switch
          value={lateFees}
          onValueChange={setLateFees}
          thumbColor={lateFees ? Colors.green30 : '#f4f4f4'}
          onTintColor={'#3cb371'}
          offTintColor={'#f4f4f4'}
        />
        <Text>Late Fees</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Remarks"
          floatingPlaceholder
          floatOnFocus
          containerStyle={styles.textField}
        />
      </View>
      <Button label="Update Fee Record" onPress={handleAddFeeRecord} backgroundColor="#3cb371" />
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
  textField: {
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
  picker: {
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
});

export default FeeScreen;
