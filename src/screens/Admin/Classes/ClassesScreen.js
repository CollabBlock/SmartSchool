import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Text, Card, Colors } from 'react-native-ui-lib';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ClassesScreen = () => {
  const navigation = useNavigation();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('classes')
      .onSnapshot(querySnapshot => {
        const classesData = [];
        querySnapshot.forEach(documentSnapshot => {
          classesData.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setClasses(classesData);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Section
        content={[
          { text: `Class: ${item.key}`, text70: true, grey10: true },
        ]}
        contentStyle={styles.cardContent}
      />
      <View style={styles.cardBody}>
        <Text style={styles.subjectText}>English:</Text>
        <Text style={styles.subjectLink} onPress={() => navigation.navigate('ViewImage', { uri: item.English })}>View</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.subjectText}>General Knowledge:</Text>
        <Text style={styles.subjectLink} onPress={() => navigation.navigate('ViewImage', { uri: item['General Knowledge'] })}>View</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.subjectText}>Islamyat:</Text>
        <Text style={styles.subjectLink} onPress={() => navigation.navigate('ViewImage', { uri: item.Islamyat })}>View</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.subjectText}>Math:</Text>
        <Text style={styles.subjectLink} onPress={() => navigation.navigate('ViewImage', { uri: item.Math })}>View</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.subjectText}>Urdu:</Text>
        <Text style={styles.subjectLink} onPress={() => navigation.navigate('ViewImage', { uri: item.Urdu })}>View</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.subjectText}>Timetable:</Text>
        <Text style={styles.subjectLink} onPress={() => navigation.navigate('ViewImage', { uri: item.timetable })}>View Timetable</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.grey50,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  cardContent: {
    padding: 10,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.grey50,
  },
  subjectText: {
    fontSize: 16,
    color: Colors.grey10,
  },
  subjectLink: {
    fontSize: 16,
    color: Colors.green30,
  },
});

export default ClassesScreen;
