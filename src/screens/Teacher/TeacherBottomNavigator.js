import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Svg, Path } from 'react-native-svg';
import Marks from './Marks/TeacherMarks';
import Remarks from './Remarks/TeacherRemarks';
import Students from './Students/ManageStudents';
import Dashboard from './TeacherDashboard';
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

        const iconName = options.tabBarIcon?.({ color: isFocused ? '#3cb371' : '#696969', size: 25 });

        return (
          <View key={index} style={styles.tabBarItem}>
            <Text
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ color: isFocused ? '#3cb371' : '#696969', fontSize: 14, fontWeight: 'bold' }}
            >
              {iconName}
            </Text>
            <Text style={{ color: isFocused ? '#3cb371' : '#696969', fontSize: 12 }}>
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
    <Tab.Navigator
      initialRouteName='Dashboard'
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
        name="Teacher Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Students"
        component={Students}
        options={{
          tabBarLabel: 'Students',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Marks"
        component={Marks}
        options={{
          tabBarLabel: 'Marks',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="clipboard-list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Remarks"
        component={Remarks}
        options={{
          tabBarLabel: 'Remarks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
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
