import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert} from 'react-native';
import Calculator from "../helpers/Calculator";

export default class CalculateScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: 0,
            argX: 0,
            argY: 0,
            navigation: props.navigation
        }
    }

    calculate = () => {
        let x = this.state.argX;
        let y = this.state.argY;
        this.setState({
            result: Calculator.getFunctionResult(x, y)
        });
    }
    goToRange = () => {
        this.state.navigation.navigate("CalculateRange", {
            result: this.state.result,
            argX: this.state.argX,
            argY: this.state.argY
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.block}>
                    <View style={styles.row}>
                        <Text>X : </Text>
                        <TextInput style={styles.input} onChangeText={(value) => {
                            this.setState({
                                argX: +value
                            });
                        }}/>
                    </View>
                    <View style={styles.row}>
                        <Text>Y : </Text>
                        <TextInput style={styles.input} onChangeText={(value) => {
                            this.setState({
                                argY: +value
                            });
                        }}/>
                    </View>
                    <TouchableOpacity
                        onPress={this.calculate}
                    >
                        <Text style={styles.button} >Розрахувати</Text>
                    </TouchableOpacity>
                    <Text>{this.state.result}</Text>

                    <TouchableOpacity
                        onPress={this.goToRange}
                    >
                        <Text style={styles.button} >Переглянути значення з проміжку</Text>
                    </TouchableOpacity>
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
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    input: {
        width: '60%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    button: {
        padding: 10
    }
});
