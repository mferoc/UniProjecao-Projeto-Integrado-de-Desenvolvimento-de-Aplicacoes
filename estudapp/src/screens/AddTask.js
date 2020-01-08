import React, { Component } from 'react'
import {
    Modal,
    View,
    Text,
    TextInput,
    DatePickerIOS,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
    DatePickerAndroid,
    TimePickerAndroid,
    Platform,
    Picker
} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br';
import commonStyles from '../commonStyles'
import DateTimePicker from 'react-native-modal-datetime-picker'

//const initialState = { description: '', subject: '', priority: '', date: new Date(), time: new Date() }

export default class AddTask extends Component {
    //state = { ...initialState }

    getInitialState = () => {
        return {
            description: '',
            subject: '',
            priority: '',
            estimateAt: new Date()
        }
    }

    constructor(props) {
        super(props)
        this.state = props.selectedTask ? props.selectedTask : this.getInitialState()
        console.log("executando.....")
        console.log(props)
    }

    save = () => {
        if (!this.state.description.trim() || !this.state.subject.trim() || !this.state.priority.trim()) {
            Alert.alert('Dados inválidos', 'Informe todos os dados necessários!')
            return
        }

        const data = { ...this.state }
        this.props.onSave(data)
        //this.setState({ ...initialState })
    }

    handleDateTimeAndroidChanged = () => {
        const momentDateTime = moment(this.state.estimateAt)
        TimePickerAndroid.open({
            date: this.state.date
        }).then(f => {
            if (f.action !== TimePickerAndroid.dismissedAction) {
                momentDateTime.hours(f.hour)
                momentDateTime.minutes(f.minute)
                this.setState({ estimateAt: momentDateTime.toDate() })
            }
        })
        DatePickerAndroid.open({
            date: this.state.date
        }).then(e => {
            if (e.action !== DatePickerAndroid.dismissedAction) {
                //const momentDate = moment(this.state.date)
                momentDateTime.date(e.day)
                momentDateTime.month(e.month)
                momentDateTime.year(e.year)
                this.setState({ estimateAt: momentDateTime.toDate() })
            }
        })
    }
    
    render() {
        let datePicker = null
        if (Platform.OS === 'ios') {
            datePicker = <DatePickerIOS mode='datetime' date={this.state.date}
                onDateChange={date => this.setState({ date })} />
        } else {
            datePicker = (
                <TouchableOpacity onPress={this.handleDateTimeAndroidChanged}>
                    <Text style={styles.date}>
                        {moment(this.state.estimateAt).format('ddd, D [de] MMMM [de] YYYY [às] LT')}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <Modal onRequestClose={this.props.onCancel}
                visible={this.props.isVisible}
                animationType='slide' transparent={true}>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.offset}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>
                    {this.props.selectedTask ?
                            'Editar Tarefa!' : 'Nova Tarefa!'}
                    </Text>
                    <TextInput placeholder="Categoria..." style={styles.input}
                        onChangeText={subject => this.setState({ subject })}
                        value={this.state.subject} />
                    <Picker
                        selectedValue={this.state.priority}
                        style={styles.inputPicker}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ priority: itemValue })
                        }>
                        <Picker.Item label="Prioridade..." value="" />
                        <Picker.Item label="Alta" value="alta" />
                        <Picker.Item label="Media" value="media" />
                        <Picker.Item label="Baixa" value="baixa" />
                    </Picker>
                    <TextInput placeholder="Descrição..." style={styles.input}
                        onChangeText={description => this.setState({ description })}
                        value={this.state.description} />
                    {datePicker}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.offset}></View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    offset: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.default,
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.default,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 15,
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        width: '90%',
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 6
    },
    inputPicker: {
        fontFamily: commonStyles.fontFamily,
        width: '90%',
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        color: '#555',
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 10,
        textAlign: 'center',
    }
}) 