import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert, ScrollView, AsyncStorage} from 'react-native';
import Calculator from "../helpers/Calculator";
import {FlatList} from "react-native-web";
import TableRow from "../components/table/TableRow";


export default class CalculateRangeScreen extends React.Component {
    constructor(props) {
        super(props);
        let navigation = props.navigation;
        this.state = {
            navigation: navigation,
            result: navigation.getParam("result"),
            argY: navigation.getParam("argY"),
            argStartX: navigation.getParam("argX"),
            argEndX: navigation.getParam("argX") + 10,
            step: 1
        }
    }

    setAttributeValue(attribute, value) {
        if (!+value && +value !== 0) {
            Alert.alert("Помилка", "Невірний параметр")
        }
        let valueObject = {};
        valueObject[attribute] = +value;
        this.setState(valueObject);
    }
    getAttributeValue(attribute) {
        if (this.state[attribute] || this.state[attribute] === 0) {
            return this.state[attribute].toString();
        }
        return '';
    }

    render() {
        let values = [];

        for (let i = this.state.argStartX; i <= this.state.argEndX; i += this.state.step) {
            values.push({
                argX: i,
                argF: Calculator.getFunctionResult(i, this.state.argY)
            });
        }

        return (
            <View style={styles.container}>

                <View style={styles.row}>
                    <Text>Початок проміжку : </Text>
                    <TextInput style={styles.input} onChangeText={(value) => {
                            this.setAttributeValue("argStartX", value);
                        }}
                        value={this.getAttributeValue('argStartX')}
                    />
                </View>
                <View style={styles.row}>
                    <Text>Кінець проміжку : </Text>
                    <TextInput style={styles.input} onChangeText={(value) => {
                            this.setAttributeValue("argEndX", value);
                        }}
                        value={this.getAttributeValue('argEndX')}
                    />
                </View>
                <View style={styles.row}>
                    <Text>Крок : </Text>
                    <TextInput style={styles.input} onChangeText={(value) => {
                            this.setAttributeValue("step", value);
                        }}
                        value={this.getAttributeValue('step')}
                    />
                </View>

                <View style={styles.headerBlock}>
                    <Text style={{ textAlign: 'center' }}>Значення функції з коефіцієнтом {this.state.argY} на проміжку [{this.state.argStartX}; {this.state.argEndX}], крок - {this.state.step}</Text>
                </View>

                <ScrollView>
                    <TableRow values={{
                        argX: 'X',
                        argF: 'F'
                    }} />
                    {
                        values.map(item => (
                            <TableRow key={item.argX} values={item} />
                        ))
                    }
                </ScrollView>

                <TouchableOpacity
                    onPress={this.saveToFile}
                >
                    <Text style={styles.button} >Зберегти в файл</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.readFromFile}
                >
                    <Text style={styles.button} >Зчитати з файлу</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={this.goToChart}
                >
                    <Text style={styles.button} >Показати графік функції</Text>
                </TouchableOpacity>
            </View>
        );
    }
    saveToFile = () => {
        const value = {
            argY: this.state.argY,
            argStartX: this.state.argStartX,
            argEndX: this.state.argEndX,
            step: this.state.step
        };
        AsyncStorage.setItem('KeyForSaveToFile', JSON.stringify(value));
    }
    readFromFile = async () => {
        await AsyncStorage.getItem('KeyForSaveToFile', (error, result) => {
            if (result !== null) {
                const value = JSON.parse(result);
                this.setState({
                    argY: value.argY,
                    argStartX: value.argStartX,
                    argEndX: value.argEndX,
                    step: value.step
                })
            }
            else {
                Alert.alert("Помилка", "Неможливо зчитати дані");
            }
        });
    }

    goToChart = () => {
        this.state.navigation.navigate("CalculateChart", {
            argY: this.state.argY,
            argStartX: this.state.argStartX,
            argEndX: this.state.argEndX,
            step: this.state.step
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerBlock: {
        width: '80%',
        marginBottom: 30,
        alignItems: 'center'
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
