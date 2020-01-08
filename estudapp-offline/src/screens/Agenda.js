import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform
} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import todayImage from '../../assets/imgs/today.jpg';
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import AddTask from './AddTask';
import AsyncStorage from '@react-native-community/async-storage';

export default class Agenda extends Component {
    state = {
        tasks: [],
        visibleTasks: [],
        showTasksDone: true,
        showAddTask: false,
        selectedTask: null
    }

    addTask = task => {
        const tasks = [...this.state.tasks]
        if (task.id) {
            tasks[tasks.findIndex((taskValue, index) => taskValue.id === task.id )] = task
        } else {
            tasks.push({
                id: Math.random(),
                subject: task.subject,
                priority: task.priority,
                description: task.description,
                estimateAt: task.date,
                estimateAtTime: task.time,
                doneAt: null
            })
        }

        this.setState({ tasks, modalTask: null },
            this.filterTasks)
    }

    editTask = selectedTask => {
        //fazer metodo de edicao de nota
        const modalTask = this.renderAddTask(selectedTask)
        this.setState({ modalTask })
    }

    renderAddTask(selectedTask = null) {
        return <AddTask onSave={this.addTask}
            onCancel={() => this.setState({ modalTask: null })}
            selectedTask={selectedTask} />
    }

    openAddTaskModal() {
        const modalTask = this.renderAddTask()
        this.setState({ modalTask })
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({ tasks },
            this.filterTasks)
    }
    //Implementando filtro para as tasks (mostrar concluidas)
    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showTasksDone) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks))
    }

    //função disparada ao clicar no icone do filtro
    toggleFilter = () => {
        this.setState({ showTasksDone: !this.state.showTasksDone },
            this.filterTasks)
    }

    componentDidMount = async () => {
        const data = await AsyncStorage.getItem('tasks')
        const tasks = JSON.parse(data) || []
        this.setState({ tasks },
            this.filterTasks)
    }

    //Implementando funcao para marcar e desmarcar task ao clicar
    onToggleTask = id => {
        //crio um clone do array tasks para nao mexer diretamente nas tasks adicionadas
        //map cria um novo array sem modificar o original
        const tasks = this.state.tasks.map(task => {
            if (task.id === id) {
                task = { ...task }
                task.doneAt = task.doneAt ? null : new Date()
            }
            return task
        })
        this.setState({ tasks },
            this.filterTasks)

    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.modalTask}
                <ImageBackground source={todayImage}
                    style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showTasksDone ? 'eye' : 'eye-slash'}
                                size={20}
                                color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>
                            {moment().locale('pt-br').format('ddd, D [de] MMMM')}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskContainer}>
                    <FlatList data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) =>

                            <Task {...item} onToggleTask={this.onToggleTask}
                                onDelete={this.deleteTask}
                                onPress={() => { this.editTask(item) }} />}

                    />
                </View>
                <ActionButton buttonColor={commonStyles.colors.today}
                    onPress={() => { this.openAddTaskModal()}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    taskContainer: {
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }

})