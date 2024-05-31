import 'react-native-gesture-handler'
import React from 'react';
import Login from './screens/Auth/Login';
import RoleSelectionScreen from './screens/Auth/RoleSelection';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from './screens/Admin/DeprecatedDashboard';
import BottomNavigator from './screens/Admin/BottomNavigator';
import AddStudentScreen from './screens/Admin/Students/AddStudentScreen';
import EditStudentScreen from './screens/Admin/Students/EditStudentScreen';
import AddTeacherScreen from './screens/Admin/Teachers/AddTeacherScreen';
import FullReportScreen from './screens/Admin/Reports/FullReportScreen.js'
import ViewMarks from './screens/Teacher/Students/ViewMarks.js';
import ClassDetailScreen from './screens/Admin/Classes/ClassDetailScreen';
import TeacherDashboard from './screens/Teacher/TeacherDashboard.js';
import StudentDashboard from './screens/Student/StudentDashboard';


import TeacherBottomNavigator from './screens/Teacher/TeacherBottomNavigator';

import StudentBottomBar from './screens/Student/StudentBottomBar.js';
import SubjectDetails from './screens/Student/SubjectDetails.js';

import TeacherBottomNavigator from './screens/Teacher/TeacherBottomNavigator';
import TimetableScreen from './screens/Admin/TimeTable/TimeTableScreen.js';
import StudentBottomBar from './screens/Student/StudentBottomBar.js';
import SubjectDetails from './screens/Student/SubjectDetails.js';


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
        <Stack.Screen 
          name="ViewMarks" 
          component={ViewMarks} 
          options={{ title: 'Manage Student Marks' }}
        />

        <Stack.Screen
          name="TeacherDashboard"
          component={TeacherBottomNavigator}
          options={{ title: 'Teacher Dashboard', headerShown: false}}
        />

        <Stack.Screen
          name="StudentDashboard"
          component={StudentBottomBar}
          options={{ title: 'Student Dashboard', headerShown: false}}
        />

        <Stack.Screen
          name="SubjectDetails" 
          component={SubjectDetails} 
          options={{ title: 'Subject Details' }}
         />


        <Stack.Screen
          name="AddTeacher"
          component={AddTeacherScreen}
          options={{ title: 'Add New Teacher' }}
        />

        <Stack.Screen
          name="ViewReport"
          component={FullReportScreen}
          options={{ title: 'Report' }}
        />

        <Stack.Screen
          name="ClassDetail"
          component={ClassDetailScreen}
          options={{ title: 'Class' }}
        />

        <Stack.Screen
          name="Timetable"
          component={TimetableScreen}
          options={{ title: 'Timetable' }}
        />

        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
