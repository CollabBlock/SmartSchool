import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const Todo = () => {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);

    const addTask = () => {
        if (task.trim() !== '') {
            setTasks(prevTasks => [...prevTasks, { id: Math.random().toString(), task }]);
            setTask('');
        }
    };

    const deleteTask = id => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

    const updateTask = (id, newTask) => {
        setTasks(prevTasks =>
            prevTasks.map(task => (task.id === id ? { ...task, task: newTask } : task))
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter task"
                    value={task}
                    onChangeText={text => setTask(text)}
                />
                <Button title="Add" onPress={addTask} />
            </View>
            <FlatList
                data={tasks}
                renderItem={({ item }) => (
                    <View style={styles.taskContainer}>
                        <TextInput
                            style={styles.taskInput}
                            value={item.task}
                            onChangeText={text => updateTask(item.id, text)}
                        />
                        <Button title="Delete" onPress={() => deleteTask(item.id)} />
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    taskInput: {
        flex: 1,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 2,
    },
});

export default Todo;
