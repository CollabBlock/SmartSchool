import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Colors, Card } from 'react-native-ui-lib';
import DropDownPicker from 'react-native-dropdown-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const screenWidth = Dimensions.get('window').width;

const TimetableScreen = ({ route, navigation }) => {
    
  const [value, setValue] = useState('2024');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [loading, setLoading] = useState(true);

  const items = [
    { label: 'Year 2024', value: '2024' },
    { label: 'Year 2023', value: '2023' },
    { label: 'Year 2022', value: '2022' },
    { label: 'Year 2021', value: '2021' },
    { label: 'Year 2020', value: '2020' },
    { label: 'Year 2019', value: '2019' },
  ];

  useEffect(() => {
    if (image) {
      try {
        Image.getSize(image, (width, height) => {
          const aspectRatio = width / height;
          const calculatedHeight = screenWidth / aspectRatio;
          setImageHeight(calculatedHeight);
        });
      } catch(e){
        setImage(null);
        console.log(e);
      }
    }
  }, [image]);

  useEffect(() => {
    const fetchImageURI = async () => {
      if (!value) return;

      try {
        const timetableSnapshot = await firestore()
          .collection('timetable')
          .doc(value)
          .get();

        if (timetableSnapshot.exists) {
          const { uri } = timetableSnapshot.data();
          setImage(uri);
        } else {
          setImage(null);
        }
      } catch (error) {
        console.error('Error fetching image URI from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageURI();
  }, [value]);


  const launchCameraHandler = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        uploadImageURI(imageUri);
        setImage(imageUri);
      }
    });
  };
  
  const launchImageLibraryHandler = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        uploadImageURI(imageUri);
        setImage(imageUri);
      }
    });
  };

  const removeImage = async () => {
    setImage(null);
    try {
      await firestore()
        .collection('timetable')
        .doc(value)
        .update({ uri: firestore.FieldValue.delete() });
    } catch (error) {
      console.error('Error removing image URI from Firestore:', error);
    }
  };

  const uploadImageURI = async (uri) => {
    try {
      await firestore()
        .collection('timetable')
        .doc(value)
        .set({ uri: uri }, { merge: true });
    } catch (error) {
      console.error('Error uploading image URI to Firestore:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
      <DropDownPicker
          open={open}
          value={value}
          items={items}
          defaultValue={value}
          containerStyle={{ height: 40, width: '50%' }}
          style={{ backgroundColor: '#fafafa' }}
          itemStyle={{
            justifyContent: 'flex-start'
          }}
          dropDownStyle={{ backgroundColor: '#fafafa' }}
          onChangeItem={item => setValue(item.value)}
          setOpen={setOpen}
          setValue={setValue}
          scrollViewProps={{
            scrollEnabled: false
          }}
      />

      </View>
      <Card style={styles.imageCard}>
        <View style={styles.imageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.green30} />
          ) : image ? (
            <Image source={{ uri: image }} style={[styles.image, { height: imageHeight }]} />
          ) : (
            <MaterialCommunityIcons name="image-off" size={300} color={Colors.grey40} />
          )}
        </View>
        <View style={styles.separator} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={launchCameraHandler}>
            <MaterialCommunityIcons name="camera" size={30} color={Colors.green30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={launchImageLibraryHandler}>
            <MaterialCommunityIcons name="image" size={30} color={Colors.green30} />
          </TouchableOpacity>
          {image && (
            <TouchableOpacity onPress={removeImage}>
              <MaterialCommunityIcons name="delete" size={30} color={Colors.red30} />
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageCard: {
    width: screenWidth - 40,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3cb371',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    margin: 5,
    marginBottom: 16,
    padding: 10,
  },
  imageContainer: {
    marginTop: 20,
  },
  image: {
    width: '100%',
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  separator: {
    borderBottomColor: Colors.grey20,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default TimetableScreen;
