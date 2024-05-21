import 'react-native-gesture-handler'
import React from 'react';
import Login from './screens/Auth/Login';
import RoleSelectionScreen from './screens/Auth/RoleSelection';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from './screens/Admin/DeprecatedDashboard';
import BottomNavigator from './screens/Admin/BottomNavigator';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RoleSelection">
          
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
          
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
