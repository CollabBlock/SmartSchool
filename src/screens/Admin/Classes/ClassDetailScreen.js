import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Colors, Card } from 'react-native-ui-lib';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('window').width;

const ClassDetailScreen = ({ route, navigation }) => {
  const { className, teacher } = route.params;

  const [image, setImage] = useState(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (image) {
      try {
        Image.getSize(image, (width, height) => {
          const aspectRatio = width / height;
          const calculatedHeight = screenWidth / aspectRatio;
          setImageHeight(calculatedHeight);
        });
      } catch(e){
        console.log(e);
      }
    }
  }, [image]);
  
  useEffect(() => {
    const fetchImageURI = async () => {
      try {
        const syllabiSnapshot = await firestore()
          .collection('syllabi')
          .doc(className.toLowerCase())
          .get();

        if (syllabiSnapshot.exists) {
          const { uri } = syllabiSnapshot.data();
          setImage(uri);
        }
      } catch (error) {
        console.error('Error fetching image URI from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageURI();
  }, [className]);

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
    try {
        await firestore()
          .collection('syllabi')
          .doc(className.toLowerCase())
          .delete();
        } catch (error) {
            console.error('Error removing image URI from Firestore:', error);
    }
    setImage(null);
  };

  const uploadImageURI = async (uri) => {
    try {
      await firestore()
        .collection('syllabi')
        .doc(className.toLowerCase())
        .set({ uri: uri }, { merge: true });
    } catch (error) {
      console.error('Error uploading image URI to Firestore:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
            <Card style={styles.card} flex activeOpacity={1}>
                <Card.Section content={[{ text: 'Class Name', text70: true, grey10: true }, { text: `${className}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
            </Card>
            <Card style={styles.card} flex activeOpacity={1}>
                <Card.Section content={[{ text: 'Teacher Name', text70: true, grey10: true }, { text: `${teacher}`, text60: true, green30: true }]} contentStyle={styles.cardContent} />
            </Card>
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
                <MaterialCommunityIcons name="camera" size={30} color={Colors.green30}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={launchImageLibraryHandler}>
                <MaterialCommunityIcons name="image" size={30} color={Colors.green30} />
            </TouchableOpacity>
            {image && 
                <TouchableOpacity onPress={removeImage}>
                <MaterialCommunityIcons name="delete" size={30} color={Colors.red30}/>
                </TouchableOpacity>
            }
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
        backgroundColor: '#ffffff' 
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: (screenWidth / 2) - 25, 
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
    },
    cardContent: {
        alignItems: 'center',
        padding: 10,
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
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    separator: {
        borderBottomColor: Colors.grey20,
        borderBottomWidth: 1,
        marginVertical: 10,
    },
});

export default ClassDetailScreen;
