import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../commonStyles';
import Swipeable from 'react-native-swipeable';

export default props => {
    let check = null
    if (props.doneAt !== null) {
        check =
            <View style={styles.done}>
                <Icon name='check'
                    size={20}
                    color={commonStyles.colors.secondary} />
            </View>
    } else {
        check = <View style={styles.pending} />
    }

    const descStyle = props.doneAt !== null ? { textDecorationLine: 'line-through' } : {}

    //Definindo swipes para os lados direito e esquerdo
    const leftContent = (
        <View style={styles.delete}>
            <Icon name='trash'
                size={20}
                color='#FFF' />
            <Text style={styles.deleteText}>Excluir</Text>
        </View>
    )
    const rightContent = [
        <TouchableOpacity
            style={[styles.delete, {justifyContent: 'flex-start', paddingLeft: 20}]} 
            onPress= {() => props.onDelete(props.id)} >
            <Icon name='trash'
                size={30}
                color='#FFF' />
        </TouchableOpacity>
    ]
    
    return (
        <Swipeable
            leftActionActivateDistance={200} 
            onLeftActionActivate={() => props.onDelete(props.id)}
            leftContent = {leftContent}
            rightButtons={rightContent} >    
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
                    <View style={styles.checkContainer}>{check}</View>
                </TouchableWithoutFeedback>
                <TouchableOpacity onPress={() => props.onPress()}>
                    <View>
                        <Text style={[styles.description, descStyle]}>
                            {props.description}
                        </Text>
                        <View style={styles.particularsContainer}>
                            <Text style={styles.particulars}>
                                {props.subject}
                            </Text>
                            <Icon name='info-circle'
                                size={12}
                                color='#555'
                                style={{ paddingRight: 3, textAlignVertical: 'center' }} />
                            <Text style={styles.particulars}>
                                {props.priority}
                            </Text>
                        </View>
                        <Text style={[styles.date, { paddingRight: 2 }]}>
                            {moment(props.estimateAt).locale('pt-br').format('ddd, D [de] MMMM [de] YYYY [às] LT')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Swipeable>    
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#AAA',
    },
    checkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
    },
    pending: {
        borderWidth: 1,
        height: 25,
        width: 25,
        borderRadius: 15,
        borderColor: '#555',
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 15,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center',
    },
    description: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15,
    },
    particularsContainer: {
        flexDirection: 'row',
    },
    particulars: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 11,
        paddingRight: 10,
        textTransform: 'uppercase',
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12,
    },
    delete: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    deleteText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    },
})