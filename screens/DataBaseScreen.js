import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TouchableHighlight} from 'react-native';
import { CheckBox } from 'react-native-elements'; // 0.16.0
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import Gallery from 'react-native-image-gallery';
import TableRow from "../components/table/TableRow";
import Livlag from "../helpers/Livlag";
import * as SQLite from 'expo-sqlite';
import DataBaseInsertForm from "./components/DataBaseInsertForm";
import DataBase from "../helpers/DataBase";
//"CREATE TABLE MilkProduction (Year INTEGER, Quantity FLOAT, QuantitySum FLOAT)"
import DataBaseTable from "./components/DataBaseTable";
import Calculator from "../helpers/Calculator";
import FileDataBase from "../helpers/FileDataBase";

const COLUMN_CAPTIONS = {
    "Year": "Рік",
    "Quantity": "Виробництво",
    "QuantitySum": "Вартість"
};
const COLUMN_NAMES = ["Year", "Quantity", "QuantitySum"]

export default class GalleryScreen extends React.Component {
    state = {
        modalVisible: false,
        rows: [],
        modalCaption: "",
        isFileDB: true,
        formValues: {},
        formMode: DataBaseInsertForm.Mode.INSERT,
        resetValues: false
    };
    showData() {
        Alert.alert("БД", "БД");
    }
    saveData(values, callback, scope) {
        if (this.state.formMode === DataBaseInsertForm.Mode.INSERT) {
            this.insertData(values, callback, scope);
        } else if (this.state.formMode === DataBaseInsertForm.Mode.UPDATE) {
            this.updateData(values, callback, scope);
        }
    }
    insertData(values, callback, scope) {
        let InsertMethod = this.state.isFileDB ? FileDataBase.Insert : DataBase.Insert;
        InsertMethod({
            dbName: "MobilaDB",
            tableName: "MilkProduction",
            values: values
        }, (result) => {
            console.log(result);
            if (result && result.insertId) {
                Alert.alert("Виконано", "Дані успішно додано");
            }
            Livlag.callback(callback, null, scope);
        })
    }
    updateData(values, callback, scope) {
        let UpdateMethod = this.state.isFileDB ? FileDataBase.Update : DataBase.Update;
        let CompareType = this.state.isFileDB ? FileDataBase.CompareType : DataBase.CompareType;
        UpdateMethod({
            dbName: "MobilaDB",
            tableName: "MilkProduction",
            values: values,
            filter: {
                column: "Year",
                compareType: CompareType.EQUAL,
                value: values["Year"]
            }
        }, (result) => {
            console.log(result);
            if (result && result.rowsAffected) {
                Alert.alert("Виконано", "Дані успішно оновлено");
            }
            this.setState({
                formMode: DataBaseInsertForm.Mode.INSERT
            });
            Livlag.callback(callback, null, scope);
        })
    }
    showAllRecords() {
        this.showRecords();
    }
    showFilterRecords() {
        let CompareType = this.state.isFileDB ? FileDataBase.CompareType : DataBase.CompareType;
        let filter = {
            column: "Quantity",
            compareType: CompareType.MORE_OR_EQUAL,
            value: 1000
        }
        this.showRecords(filter);
    }
    showRecords(filter) {

        let config = {
            dbName: "MobilaDB",
            tableName: "MilkProduction",
            columns: COLUMN_NAMES,
            order: {
                column: "Year"
            },
            filter: filter
        };
        let SelectMethod = this.state.isFileDB ? FileDataBase.Select : DataBase.Select;
        SelectMethod(config, function(array) {
            if (!array) {
                Alert.alert("Пусто", "Немає даних для відображення");
                return;
            }
            let rows = [];
            let captions = [];
            for (let i = 0; i < COLUMN_NAMES.length; i++) {
                captions.push(COLUMN_CAPTIONS[COLUMN_NAMES[i]]);
            }
            rows.push(captions);
            for (let i = 0; i < array.length; i++) {
                let values = [];
                for (let j = 0; j < COLUMN_NAMES.length; j++) {
                    values.push(array[i][COLUMN_NAMES[j]]);
                }
                rows.push(values);
            }
            this.setState({
                rows: rows,
                modalVisible: true,
                modalCaption: filter ? "Дані (Виробництво > 1000)" : "Всі дані"
            });
        }, this);
    }
    showAvgQuantity() {
        let AggregationFunction = this.state.isFileDB ? FileDataBase.AggregationFunction : DataBase.AggregationFunction;
        let config = {
            dbName: "MobilaDB",
            tableName: "MilkProduction",
            columns: {
                function: AggregationFunction.AVG,
                column: "Quantity",
                alias: "AvgQuantity"
            }
        };

        let SelectMethod = this.state.isFileDB ? FileDataBase.Select : DataBase.Select;
        SelectMethod(config, function(result) {
            let avgRes = result[0]["AvgQuantity"];
            avgRes = Calculator.roundToDec(avgRes, 3);
            Alert.alert("Обчислено", "Середньорічне виробництво - " + avgRes);
        }, this);
    }

    listRowClick(itemArray) {
        let item = {};
        for (let i = 0; i < COLUMN_NAMES.length; i++) {
            item[COLUMN_NAMES[i]] = itemArray[i];
        }
        this.setState({
            formValues: item,
            modalVisible: false,
            formMode: DataBaseInsertForm.Mode.UPDATE,
            resetValues: true
        });

    }

    sendFormValues() {
        let formValues = [];

        for (let key in COLUMN_CAPTIONS) {
            formValues.push({
                name: key,
                caption: COLUMN_CAPTIONS[key],
                value: this.state.formValues[key] || ""
            });
        }
        let isReset = this.state.resetValues;
        if (isReset) {
            this.setState({
                resetValues: false
            })
        }
        return {
            fields: formValues,
            resetValues: this.state.resetValues
        };
    }

    render() {
        return (
            <View style={styles.container}>

                <TouchableOpacity
                    onPress={this.showData}
                >
                    <Text style={styles.button} >БД</Text>
                </TouchableOpacity>
                <DataBaseInsertForm
                    saveCallback={this.saveData.bind(this)}
                    getFieldsMethod={this.sendFormValues.bind(this)}
                />
                <TouchableHighlight
                    onPress={() => {
                        this.showAllRecords()
                    }}>
                    <Text>Показати дані</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => {
                        this.showFilterRecords()
                    }}>
                    <Text>Показати дані (Виробництво > 1000)</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => {
                        this.showAvgQuantity()
                    }}>
                    <Text>Показати середньорічне виробництво</Text>
                </TouchableHighlight>

                <CheckBox
                    title="Режим файлової системи"
                    checked={this.state.isFileDB}
                    onPress={() => this.setState({ isFileDB: !this.state.isFileDB })}
                />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false});
                    }}>
                    <View
                        style={styles.container}>
                        <Text style={styles.marginBottom}>{this.state.modalCaption}</Text>
                        <DataBaseTable
                            rows={this.state.rows}
                            rowClickAction={this.listRowClick.bind(this)}
                        />
                    </View>
                </Modal>
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
    errorText: {
        fontSize: 18,
        marginBottom: 30,
        color: '#F00'
    },
    info: {
        fontSize: 14,
    },
    image: {
        width: 250,
        height: 200,
        marginBottom: 20,
    },
    purpose: {
        textAlign: 'center',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    marginBottom: {
        marginBottom: 20
    }
});