import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Text, Card, Button } from 'react-native-ui-lib';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

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

  const handleImagePick = async (classId, subject) => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        const fileName = `${classId}_${subject}.jpg`;
        const reference = storage().ref(`/syllabus/${fileName}`);

        await reference.putFile(uri);
        const downloadURL = await reference.getDownloadURL();

        await firestore().collection('classes').doc(classId).update({ [subject]: downloadURL });
        Alert.alert('Success', 'Image uploaded successfully');
      }
    });
  };

  const handleImageRemove = async (classId, subject) => {
    await firestore().collection('classes').doc(classId).update({ [subject]: firestore.FieldValue.delete() });
    Alert.alert('Success', 'Image removed successfully');
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Section
        content={[{ text: `Class: ${item.key}`, text70: true, grey10: true }]}
        contentStyle={styles.cardContent}
      />
      {['English', 'General Knowledge', 'Islamyat', 'Math', 'Urdu', 'timetable'].map(subject => (
        <View style={styles.cardBody} key={subject}>
          <Text style={styles.subjectText}>{subject}:</Text>
          {item[subject] ? (
            <View style={styles.imageActions}>
              <Text style={styles.subjectLink} onPress={() => navigation.navigate('ViewImage', { uri: item[subject] })}>View Image</Text>
              <Button
                link
                label="Remove"
                color={Colors.red30}
                onPress={() => handleImageRemove(item.key, subject)}
              />
            </View>
          ) : (
            <Button
              link
              label="Upload Image"
              color={Colors.green30}
              onPress={() => handleImagePick(item.key, subject)}
            />
          )}
        </View>
      ))}
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
    alignItems: 'center',
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
  imageActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ClassesScreen;
