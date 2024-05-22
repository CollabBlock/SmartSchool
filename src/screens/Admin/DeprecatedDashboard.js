
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {View, Text, Card, Button} from 'react-native-ui-lib';
import { Colors, Typography, Spacings } from 'react-native-ui-lib';

const DeprecatedDashboard = () => {


    const schoolImage = require('../../assets/images/college.png');
    const teacherImage = require('../../assets/images/teacher2.png');

    return (
        <View flex padding-page backgroundColor='#ffffff'>
          <Text  margin-10 >Welcome</Text>
          <Text text60L marginL-10 >Admin, SmartSchool</Text>

          <View row marginV-10>
          <Card
          height={150}
          width={120}
          flex
          activeOpacity={1}
          marginH-5
          // lets shown alert for now on press
          
          >
          <Card.Section imageSource={schoolImage} imageStyle={{height: '100%'}}
            content={[{text: '', text70: true, grey10: true}]}
            contentStyle={{alignItems: 'center'}}
            backgroundColor='#f5f5f5'
          />
        </Card>

        </View>


        <View row marginV-10>
          
          {/* two cards in this view, one says manage student, other one is manage teacher */}


          <Card
          height={150}
          width={120}
          flex
          activeOpacity={1}
          marginH-5
          onPress={ () => alert('Manage Students screen pe jao')}
          >
          <Card.Section
            content={[{text: 'Manage Students', text70: true, grey10: true}]}
            contentStyle={{alignItems: 'center'}}
            backgroundColor='#f5f5f5'
          />
        </Card>

        <Card
          height={100}
          width={100}
          flex
          activeOpacity={1}
          marginH-5
          borderRadius={30}
          onPress={() => alert('Manage Teachers screen pe jao')}
        >
          <Card.Image source={teacherImage} height={50} width={50} />
          <Card.Section
            content={[{ text: 'Manage Teachers' }]}
            contentStyle={{ alignItems: 'center', marginTop: 5, backgroundColor: '#f5f5f5' }}
            backgroundColor=''
          />
        </Card>

        </View>
        {/* 4 more cards to be added here: 
        Fee status
        generate reports
        upload timetable
        upload syllabus */}

        <View row marginV-10>
            
            <Card
            height={150}
            width={120}
            flex
            activeOpacity={1}
            marginH-5
            onPress={ () => alert('Fee Status screen pe jao')}
            >
            <Card.Section
              content={[{text: 'Fee Status', text70: true, grey10: true}]}
              contentStyle={{alignItems: 'center'}}
              backgroundColor='#f5f5f5'
            />
            </Card>

            <Card
            height={150}
            width={120}
            flex
            activeOpacity={1}
            marginH-5
            onPress={ () => alert('Generate Reports screen pe jao')}
            >
            <Card.Section
              content={[{text: 'Generate Reports', text70: true, grey10: true}]}
              contentStyle={{alignItems: 'center'}}
              backgroundColor='#f5f5f5'
            />

          </Card>

        </View>


          <View row marginV-10>

            
            <Card
            height={150}
            width={120}
            flex
            activeOpacity={1}
            marginH-5
            onPress={ () => alert('Upload Timetable screen pe jao')}
            >
            <Card.Section
              content={[{text: 'Upload Timetable', text70: true, grey10: true}]}
              contentStyle={{alignItems: 'center'}}
              backgroundColor='#f5f5f5'
            />
            </Card>


            <Card
            height={150}
            width={120}
            flex
            activeOpacity={1}
            marginH-5
            onPress={ () => alert('Upload Syllabus screen pe jao')}
            >
            <Card.Section
              content={[{text: 'Upload Syllabus', text70: true, grey10: true}]}
              contentStyle={{alignItems: 'center'}}
              backgroundColor='#f5f5f5'
            />
            </Card>


          </View>


        </View>

        
      );


}

export default DeprecatedDashboard;