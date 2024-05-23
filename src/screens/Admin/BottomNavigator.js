import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './Dashboard';
import StudentsScreen from './Students/StudentsScreen';
import TeachersScreen from './Teachers/TeachersScreen';
import FeeScreen from './Fees/FeeScreen';
import ClassesScreen from './Classes/ClassesScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator initialRouteName='DashboardScreen'
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
      <Tab.Screen name="Dashboard" component={DashboardScreen}

      options={{
        tabBarLabel: 'Dashboard',
        
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
        ),
      }}
      
      />
      <Tab.Screen name="Manage Students" component={StudentsScreen} 
        options={{
          tabBarLabel: 'Students',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen name="Manage Classes" component={ClassesScreen}
        options={{
          tabBarLabel: 'Classes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="google-classroom" color={color} size={size} />
          ),
      }}
      />


      <Tab.Screen name="Manage Teachers" component={TeachersScreen} 
        options={{
          tabBarLabel: 'Teachers',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="Fee" component={FeeScreen}
        options={{
          tabBarLabel: 'Fee',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="credit-card" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
