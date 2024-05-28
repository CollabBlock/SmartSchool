import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Svg, Path, color } from 'react-native-svg';
// import Dashboard from './TeacherDashboard';
import Marks from './Marks/TeacherMarks';
import Remarks from './Remarks/TeacherRemarks';
import Students from './Students/ManageStudents';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './TeacherDasboard';


const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator initialRouteName='Dashboard'
    screenOptions={{
      tabBarActiveTintColor: '#3cb371',
      tabBarInactiveTintColor: '#222',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#3cb371',
        // borderWidth: 1,
        // borderBottomColor: '#000000',
        // color: '#fffff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
      labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      style: {
        backgroundColor: '#fff',
      },
    }}
    >
      <Tab.Screen name="Teacher Dasboard" component={Dashboard}

      options={{
        tabBarLabel: 'Dasboard',
        
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
        ),
      }}
      
      />
       <Tab.Screen name="Manage Students" component={Students} 
        options={{
          tabBarLabel: 'Students',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen name="Marks" component={Marks}
        options={{
          tabBarLabel: 'Marks',
          tabBarIcon: () => (
            <Svg width={24} height={24}>
              <Path d="M10 15.5l-5-5 1.41-1.41L13 18.17l5-5 1.41 1.41z" fill={color} />
            </Svg>
          ),
      }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
