import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Colors, TextField, Text, Button, Picker, Switch } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FeeScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [lateFees, setLateFees] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dueAmount, setDueAmount] = useState('');
  const [payableAmount, setPayableAmount] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false); // State to track form validity

  useEffect(() => {
    const fetchStudents = async () => {
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
        setDueAmount(feeData.due ? feeData.due.toString() : '0');
        setAmountPaid(feeData.paid ? feeData.paid.toString() : '0');
        setPayableAmount(feeData.payable ? feeData.payable.toString() : '0');
        updateLateFees(feeData.date);
        setLateFees(feeData.late || false);
        setRemarks(feeData.remarks || '');
        if (!feeData.date) {
          setPaymentDate(new Date());
        } else {
          var dateString = feeData.date;
          var parts = dateString.split('/');
          var day = parseInt(parts[0], 10);
          var month = parseInt(parts[1], 10) - 1; 
          var year = parseInt(parts[2], 10);
          var date = new Date(year, month, day);
          setPaymentDate(date);
        }
      };
  
      fetchStudentData();

      const fetchHistory = async () => {
        const historySnapshot = await firestore().collection(`fees/${selectedStudent}/history`).get();
        const historyList = historySnapshot.docs.map(doc => ({
          label: `Payment Date: ${doc.data().date}, Amount Paid: ${doc.data().paid}`,
          value: doc.id
        }));
        setHistory(historyList);
      };

      fetchHistory();
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedHistory) {
      const fetchHistoryData = async () => {
        try {
          const historyDoc = await firestore().collection(`fees/${selectedStudent}/history`).doc(selectedHistory).get();
          if (historyDoc.exists) {
            const historyData = historyDoc.data();
            setDueAmount(historyData.due ? historyData.due.toString() : '0');
            setAmountPaid(historyData.paid ? historyData.paid.toString() : '0');
            setPayableAmount(historyData.payable ? historyData.payable.toString() : '0');
            updateLateFees(historyData.date);
            setLateFees(historyData.late || false);
            setRemarks(historyData.remarks || '');
            if (!historyData.date) {
              setPaymentDate(new Date());
            } else {
              const dateString = historyData.date;
              const parts = dateString.split('/');
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1; 
              const year = parseInt(parts[2], 10);
              const date = new Date(year, month, day);
              setPaymentDate(date);
            }
          }
        } catch (error) {
          console.error('Error fetching history data:', error);
        }
      };
      fetchHistoryData();
    }
  }, [selectedHistory]);  

  useEffect(() => {
    setIsFormValid(
      selectedStudent &&
      amountPaid &&
      parseFloat(amountPaid) > 0 &&
      dueAmount &&
      parseFloat(dueAmount) >= 0 &&
      payableAmount &&
      parseFloat(payableAmount) >= 0
    );
  }, [selectedStudent, amountPaid, dueAmount, payableAmount]);

  const handleConfirm = (date) => {
    setPaymentDate(date);
    hideDatePicker();
    updateLateFees(date);
  };

  const updateLateFees = (dateString) => {
    const providedDate = new Date(dateString);
    const dayOfMonth = providedDate.getDate(); 
    setLateFees(dayOfMonth > 10);
};


  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleUpdateFeeRecord = async () => {
    if (!isFormValid) { 
      Alert.alert('Error', 'Please fill in all the required fields.');
      return;
    }
  
    try {
      // Prepare the fee record data
      const feeRecordData = {
        regNo: parseInt(selectedStudent, 10),
        date: paymentDate.toLocaleDateString('en-GB'),
        due: parseFloat(dueAmount),
        paid: parseFloat(amountPaid),
        payable: parseFloat(dueAmount) - parseFloat(amountPaid),
        late: lateFees,
        remarks: remarks,
      };
  
      if (selectedHistory) {
        await firestore().collection(`fees/${selectedStudent}/history`).doc(selectedHistory).set({
          date: paymentDate.toLocaleDateString('en-GB'),
          paid: parseFloat(amountPaid),
        });
      } else {
        await firestore().collection('fees').doc(selectedStudent).set(feeRecordData, { merge: true });
      }
  
      Alert.alert('Success', 'Fee record updated successfully!');
      setSelectedStudent('');
      setSelectedHistory('');
      setAmountPaid('');
      setPaymentDate(new Date());
      setLateFees(false);
      setRemarks('');
      setDueAmount('');
      setPayableAmount('');
      setStudentName('');
      setIsFormValid(false);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Error updating fee record:', error);
    }
  };


  const handleAddFeeRecord = async () => {
    if (!isFormValid) { 
      Alert.alert('Error', 'Please fill in all the required fields.');
      return;
    }
  
    try {
      // Prepare the fee record data
      const feeRecordData = {
        regNo: parseInt(selectedStudent, 10),
        date: paymentDate.toLocaleDateString('en-GB'),
        due: parseFloat(dueAmount),
        paid: parseFloat(amountPaid),
        payable: parseFloat(dueAmount) - parseFloat(amountPaid),
        late: lateFees,
        remarks: remarks,
      };

      const previousFeeDoc = await firestore().collection('fees').doc(selectedStudent).get();
  
      if (selectedHistory) {
        return;
      } else {
        const formattedDate = previousFeeDoc.data().date; // Assuming date format is 'dd/mm/yyyy'
        const parts = formattedDate.split('/');
        const monthYear = `${parts[1]}_${parts[2]}`; // Format: 'mm_yyyy'
        await firestore().collection(`fees/${selectedStudent}/history`).doc(monthYear).set(previousFeeDoc.data());
        await firestore().collection('fees').doc(selectedStudent).set(feeRecordData, { merge: true });
      }
        
      Alert.alert('Success', 'Fee record updated successfully!');
      setSelectedStudent('');
      setSelectedHistory('');
      setAmountPaid('');
      setPaymentDate(new Date());
      setLateFees(false);
      setRemarks('');
      setDueAmount('');
      setPayableAmount('');
      setStudentName('');
      setIsFormValid(false);
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
          containerStyle={styles.studentPicker}
          useNativePicker
        >
          {students.map(student => (
            <Picker.Item key={student.value} value={student.value} label={student.label} />
          ))}
        </Picker>
      </View>
      {selectedStudent && (
        <View style={styles.inputContainer}>
          <Picker
            placeholder="History"
            value={selectedHistory}
            onChange={(value) => {
              setSelectedHistory(value);
              handleHistoryChange(value);
            }}
            floatingPlaceholder
            floatOnFocus
            containerStyle={styles.historyPicker} 
            useNativePicker
          >
            <Picker.Item label="Select History" value="" />
            {history.map(history => (
              <Picker.Item key={history.value} value={history.value} label={history.label} />
            ))}
          </Picker>
        </View>
      )}


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
          value={dueAmount}
          onChangeText={setDueAmount}
          placeholder="Amount Due"
          keyboardType="numeric"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}
          enableErrors
          validate={['required', 'number', (value) => parseFloat(value) >= 0]}
          validateOnChange
          validationMessage={['Field is required', 'Must be a number', 'Must be 0 or greater']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
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
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}
          enableErrors
          validate={['required', 'number', (value) => parseFloat(value) > 0]}
          validateOnChange
          validationMessage={['Field is required', 'Must be a number', 'Must be greater than 0']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextField
          value={payableAmount}
          onChangeText={setPayableAmount}
          placeholder="Payable Amount"
          keyboardType="numeric"
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}
          enableErrors
          validate={['required', 'number', (value) => parseFloat(value) >= 0]}
          validateOnChange
          validationMessage={['Field is required', 'Must be a number', 'Must be 0 or greater']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
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
          date={paymentDate}
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
          floatingPlaceholderColor={{ focus: '#3cb371', error: '#E63B2E' }}
          fieldStyle={styles.fieldStyle}
          enableErrors
          validate={['string', (value) => value.length <= 200]}
          validateOnChange
          validationMessage={['Must be a string', 'Must be 200 characters or less']}
          validationMessagePosition="bottom"
          underlineColor={{ focus: '#3cb371', error: '#E63B2E' }}
        />
      </View>
      <View style={styles.buttonContainer}>
        {!selectedHistory && (
            <Button
            label="Add Fee"
            onPress={handleAddFeeRecord}
            backgroundColor="#3cb371"
            disabled={!isFormValid} 
            style={styles.button}
          />)
        }
        <Button
          label="Update Fee"
          onPress={handleUpdateFeeRecord}
          backgroundColor="#3cb371"
          disabled={!isFormValid} 
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0,
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
    marginBottom: 10,
  },
  studentPicker: { 
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
  historyPicker: { 
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
  textField: {
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
  fieldStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#3cb371',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default FeeScreen;
