import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert} from 'react-native';
import Livlag from "../../helpers/Livlag";

export default class DataBaseInsertForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saveCallback: props.saveCallback,
            getFieldsMethod: props.getFieldsMethod
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
        };

        this.state.saveCallback(values, this.clearFields, this);
    }
    clearFields() {
        this.setState({
            Year: '',
            Quantity: '',
            QuantitySum: ''
        });
    }
    resetFieldValues(fields) {
        let stateObj = {};
        for (let i = 0; i < fields.length; i++) {
            stateObj[fields[i].name] = fields[i].value;
        }
        this.setState(stateObj);
    }
    render() {
        let fieldsConfig = this.state.getFieldsMethod();
        let fields = fieldsConfig.fields;
        let resetValues = fieldsConfig.resetValues;
        if (resetValues) {
            this.resetFieldValues(fields);
        }
        let values = {};
        for (let i = 0; i < fields.length; i++) {
            values[fields[i].name] = resetValues ?
                fields[i].value : this.state[fields[i].name];
        }

        return (
            <View style={styles.block}>
                {
                    fields.map(field => (
                        <View key={field.name} style={styles.row}>
                            <Text>{field.caption} : </Text>
                            <TextInput style={styles.input}
                               onChangeText={(value) => {
                                   let obj = {};
                                   obj[field.name] = +value;
                                   this.setState(obj);
                               }}
                               value={values[field.name] && values[field.name].toString()}
                            />
                        </View>
                    ))
                }
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => {
                            this.save();
                        }}
                    >
                        <Text style={styles.button} >Зберегти</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.clearFields();
                        }}
                    >
                        <Text style={styles.button} >Відмінити</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

DataBaseInsertForm.Mode = {
    INSERT: 1,
    UPDATE: 2
};

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