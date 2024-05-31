import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, SectionList } from 'react-native';
import { Text, Card, Colors } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MyFee = () => {
  const [feeData, setFeeData] = useState(null);
  const [feeHistory, setFeeHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          console.error("No authenticated user found.");
          return;
        }

        const studentQuerySnapshot = await firestore()
          .collection('students')
          .where('email', '==', user.email)
          .get();

        if (!studentQuerySnapshot.empty) {
          const studentDoc = studentQuerySnapshot.docs[0];
          const studentData = studentDoc.data();
          const regNo = studentData.id.toString();

          // Fetch current fee data
          const feeDoc = await firestore().collection('fees').doc(regNo).get();
          if (feeDoc.exists) {
            setFeeData(feeDoc.data());
          } else {
            console.error("Fee data not found.");
          }

          // Fetch fee history
          const historyCollection = await firestore()
            .collection('fees')
            .doc(regNo)
            .collection('history')
            .orderBy('date', 'desc')
            .get();

          const historyData = historyCollection.docs.map(doc => doc.data());
          setFeeHistory(historyData);
        } else {
          console.error("Student data not found.");
        }
      } catch (error) {
        console.error("Error fetching fee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, []);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>{item.date}</Text>
      <Text style={styles.historyText}>Due: {item.due}</Text>
      <Text style={styles.historyText}>Paid: {item.paid}</Text>
      <Text style={styles.historyText}>Payable: {item.payable}</Text>
      <Text style={styles.historyText}>Late: {item.late ? 'Yes' : 'No'}</Text>
      {/* <Text style={styles.historyText}>Remarks: {item.remarks}</Text> */}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3cb371" />
          <Text style={styles.loadingText}>Loading Fee Data...</Text>
        </View>
      ) : (
        <SectionList
          sections={[
            {
              title: 'Current Fee Status', data: feeData ? [feeData] : [], renderItem: ({ item }) => (
                <Card style={styles.card}>
                  <View style={styles.cardRow}>
                    <Text style={styles.label}>Due:</Text>
                    <Text style={styles.value}>{item.due}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.label}>Paid:</Text>
                    <Text style={styles.value}>{item.paid}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.label}>Payable:</Text>
                    <Text style={styles.value}>{item.payable}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.label}>Late Fee:</Text>
                    <Text style={styles.value}>{item.lateFee ? 'Yes' : 'No'}</Text>
                  </View>
                  <View style={styles.remarkscardRow}>
                    <Text style={styles.label}>Remarks:</Text>
                    <Text style={styles.value}>{item.remarks}</Text>
                  </View>
                </Card>
              )
            },
            { title: 'Payment History', data: feeHistory, renderItem: renderHistoryItem },
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.grey40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.green30,
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grey50,
    padding: 10,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey50,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: Colors.grey10,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  historyList: {
    marginTop: 10,
  },
  historyItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.grey50,
    borderRadius: 10,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 10,
    borderBottomColor: Colors.grey50,
    borderBottomWidth: 1,
    
  },
  noDataText: {
    fontSize: 16,
    color: Colors.grey40,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MyFee;
