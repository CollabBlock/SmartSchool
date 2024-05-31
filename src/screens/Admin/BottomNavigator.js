import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './Dashboard';
import StudentsScreen from './Students/StudentsScreen';
import TeachersScreen from './Teachers/TeachersScreen';
import FeeScreen from './Fees/FeeScreen';
import ClassesScreen from './Classes/ClassesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconName = options.tabBarIcon?.({ color: isFocused ? '#3cb371' : '#222', size: 25 });

        return (
          <View key={index} style={styles.tabBarItem}>
            <Text
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ color: isFocused ? '#3cb371' : '#222', fontSize: 14, fontWeight: 'bold' }}
            >
              {iconName}
            </Text>
            <Text style={{ color: isFocused ? '#3cb371' : '#222', fontSize: 12 }}>
              {options.tabBarLabel}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const BottomNavigator = () => {
  return (
    <>
      <Tab.Navigator
        initialRouteName='DashboardScreen'
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#3cb371',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Manage Students"
          component={StudentsScreen}
          options={{
            tabBarLabel: 'Students',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Manage Classes"
          component={ClassesScreen}
          options={{
            tabBarLabel: 'Classes',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="school-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Manage Teachers"
          component={TeachersScreen}
          options={{
            tabBarLabel: 'Teachers',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Fee"
          component={FeeScreen}
          options={{
            tabBarLabel: 'Fee',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="cash-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E0FBE2',
    paddingVertical: 10,
    borderTopWidth: 0,
    elevation: 5,
    paddingTop: 10, 
  },
  tabBarItem: {
    alignItems: 'center',
    flex: 1,
  },
});

export default BottomNavigator;
