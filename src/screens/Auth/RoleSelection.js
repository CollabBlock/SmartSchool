import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const RoleSelectionScreen = () => {
  const navigation = useNavigation();

  const handleRoleSelect = (role) => {
    console.log(`Selected role: ${role}`);
    navigation.navigate('Login', { role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Option</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => handleRoleSelect('admin')}
        >
          <View style={[styles.iconBackground, { backgroundColor: '#007bff' }]}>
            <Icon name="admin-panel-settings" size={50} color="#ffffff" />
          </View>
          <Text style={styles.iconLabel}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => handleRoleSelect('teacher')}
        >
          <View style={[styles.iconBackground, { backgroundColor: '#28a745' }]}>
            <Icon name="school" size={50} color="#ffffff" />
          </View>
          <Text style={styles.iconLabel}>Teacher</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleRoleSelect('student')}
      >
        <View style={[styles.iconBackground, { backgroundColor: '#ffc107' }]}>
          <Icon name="person" size={50} color="#ffffff" />
        </View>
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
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default RoleSelectionScreen;
