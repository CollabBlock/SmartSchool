import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';



const RoleSelectionScreen = () => {

    const navigation = useNavigation();


    const handleRoleSelect = (role) => {
        console.log(`Selected role: ${role}`);
        
        navigation.navigate('Login', { role })
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Choose Your Option</Text>
        <View style={styles.iconContainer}>
            <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => handleRoleSelect('admin')}
            >
            <Icon name="admin-panel-settings" size={60} color="#007bff" />
            <Text style={styles.iconLabel}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => handleRoleSelect('teacher')}
            >
            <Icon name="school" size={60} color="#28a745" />
            <Text style={styles.iconLabel}>Teacher</Text>
            </TouchableOpacity>
            
        </View>
        <TouchableOpacity
            style={styles.iconWrapper2}
            onPress={() => handleRoleSelect('student')}
            >
            <Icon name="person" size={60} color="#ffc107" />
            <Text style={styles.iconLabel}>Student</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000000',
    fontSize: 23
    
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
    iconWrapper2: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
    },
  iconLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default RoleSelectionScreen;
