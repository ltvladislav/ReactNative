import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert} from 'react-native';


export default class DataBaseInsertForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saveCallback: props.saveCallback
        }
    }
    savingValidation() {
        if (!this.state.Year) {
            Alert.alert("Некоректні дані", "Введіть рік!");
            return false;
        }
        if (!this.state.Quantity) {
            Alert.alert("Некоректні дані", "Введіть виробництво!");
            return false;
        }
        if (!this.state.QuantitySum) {
            Alert.alert("Некоректні дані", "Введіть вартість виробництва!");
            return false;
        }
        return true;
    }
    save() {
        if (!this.savingValidation()) {
            return;
        }
        let values = {
            Year: this.state.Year,
            Quantity: this.state.Quantity,
            QuantitySum: this.state.QuantitySum
        }

        this.state.saveCallback(values, this.clearFields, this);
    }
    clearFields() {
        this.setState({
            Year: '',
            Quantity: '',
            QuantitySum: ''
        });
    }
    render() {
        return (
            <View style={styles.block}>
                <View style={styles.row}>
                    <Text>Рік : </Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => {
                            this.setState({
                                Year: +value
                            });
                        }}
                       value={this.state.Year}
                    />
                </View>
                <View style={styles.row}>
                    <Text>Виробництво (т) : </Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => {
                            this.setState({
                                Quantity: +value
                            });
                        }}
                        value={this.state.Quantity}
                    />
                </View>
                <View style={styles.row}>
                    <Text>Вартість виробленого ($) : </Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => {
                            this.setState({
                                QuantitySum: +value
                            });
                        }}
                        value={this.state.QuantitySum}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.save();
                    }}
                >
                    <Text style={styles.button} >Розрахувати</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        width: '40%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    }
});