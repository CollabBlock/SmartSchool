import 'react-native-gesture-handler'
import React from 'react';
import Login from './screens/Auth/Login';
import RoleSelectionScreen from './screens/Auth/RoleSelection';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from './screens/Admin/DeprecatedDashboard';
import BottomNavigator from './screens/Admin/BottomNavigator';
import AddStudentScreen from './screens/Admin/AddStudentScreen';
import EditStudentScreen from './screens/Admin/EditStudentScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RoleSelection"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3cb371', // Background color for the header
          },
          headerTintColor: '#fff', // Color for the header text and icons
          headerTitleStyle: {
            fontWeight: 'bold', // Bold font for the header title
          },
        }}
        >
          
          <Stack.Screen 
          name="RoleSelection" 
          component={RoleSelectionScreen} 
          options={{ headerShown: false }}
          />
          
          <Stack.Screen 
          name="Login" 
          component={Login} 
          options={({route}) => ({ title: `Login as ${route.params.role}` })}
          />

          <Stack.Screen
          name="AdminDashboard"
          component={BottomNavigator}
          options={{ title: 'Admin Dashboard', headerShown: false}}
          
          />

        <Stack.Screen 
          name="AddStudent" 
          component={AddStudentScreen} 
          options={{ title: 'Add New Student' }}
        />

        <Stack.Screen 
          name="EditStudent" 
          component={EditStudentScreen} 
          options={{ title: 'Edit Student' }}
        />
          
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
