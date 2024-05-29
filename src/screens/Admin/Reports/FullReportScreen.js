import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const FullReportScreen = ({ route, navigation }) => {
  const { data, headers } = route.params;

  if (!data || !Array.isArray(data) || !headers || !Array.isArray(headers)) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Invalid data format</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {headers.map((header, index) => (
          <Text key={index} style={styles.headerText}>{header}</Text>
        ))}
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.rowContainer}>
            {item.map((cell, index) => (
              <View key={index} style={styles.cellContainer}>
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  headerContainer: { flexDirection: 'row', margin: 2 },
  headerText: { flex: 1, backgroundColor: '#3cb371', padding: 10, textAlign: 'center', borderWidth: 1, borderColor: '#000', color: '#fff', fontWeight: 'bold' },
  rowContainer: { flexDirection: 'row'},
  cellContainer: { flex: 1, borderWidth: 1, borderColor: '#000', padding: 10, backgroundColor: '#F2F2F2', margin: 2},
  cellText: { color: '#000', textAlign: 'center' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 }
});

export default FullReportScreen;
