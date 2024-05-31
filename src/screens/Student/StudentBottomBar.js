import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import StudentDashboard from './StudentDashboard';
import MyClass from './MyClass';
import MyFee from './MyFee';
import MyProfile from './MyProfile';

const Tab = createBottomTabNavigator();


const StudentBottomBar = () => {
  return (
    <Tab.Navigator
      initialRouteName='Dashboard'
      screenOptions={{
        tabBarActiveTintColor: '#3cb371',
        tabBarInactiveTintColor: '#222',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#3cb371',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyClass"
        component={MyClass}
        options={{
          tabBarLabel: 'My Class',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Marks"
        component={MyFee}
        options={{
          tabBarLabel: 'Fee',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={MyProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default StudentBottomBar;
