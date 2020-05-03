import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert} from 'react-native';
import Hofman from "../Coding/Hofman";

export default class HofmanScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            code: '',
            alphabet: {},
            navigation: props.navigation
        }
    }

    code() {
        this.setState(Hofman.Code(this.state.text));
    }

    render() {
        let alphabetArray = [];
        for (let key in this.state.alphabet) {
            alphabetArray.push({
                key: key,
                value: this.state.alphabet[key]
            });
        }

        return (
            <View style={styles.container}>
                <Text>Бінарне кодування методом Хаффмана</Text>

                <View>
                    <View style={styles.row}>
                        <Text>Текст для кодування : </Text>
                    </View>
                    <View style={styles.row}>
                        <TextInput style={styles.input} onChangeText={(value) => {
                            this.setState({
                                text: value
                            });
                        }}/>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={this.code.bind(this)}
                >
                    <Text style={styles.button} >Закодувати</Text>
                </TouchableOpacity>


                <View style={styles.row}>
                    <Text>Код - {this.state.code}</Text>
                </View>
                <View style={styles.column}>
                    <Text>Алфавіт : </Text>
                    <View style={styles.column}>
                        {
                            alphabetArray.map(item => (
                                <Text >{item.key} - {item.value}</Text>
                            ))
                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    column: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    button: {
        padding: 10
    }
});
