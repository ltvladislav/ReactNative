import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TouchableHighlight} from 'react-native';
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

const COLUMN_CAPTIONS = {
    "Year": "Рік",
    "Quantity": "Виробництво",
    "QuantitySum": "Вартість"
};

const GET_COLUMN_NAMES = () => {
    let cols = [];
    for (let key in COLUMN_CAPTIONS) {
        cols.push(key);
    }
    return cols;
}
const SHOW_FILTER =  {
    column: "Quantity",
    compareType: DataBase.CompareType.MORE_OR_EQUAL,
    value: 1000
}

export default class GalleryScreen extends React.Component {
    state = {
        modalVisible: false,
        rows: [],
        modalCaption: ""
    };
    showData() {
        Alert.alert("БД", "БД");
    }
    insertNew(values, callback, scope) {
        console.log(values);
        DataBase.Insert({
            dbName: "MobilaDB",
            tableName: "MilkProduction",
            values: values
        }, (result) => {
            if (result.insertId) {
                Alert.alert("Виконано", "Дані успішно додано");
            }
            Livlag.callback(callback, null, scope);
        })
    }
    showAllRecords() {
        this.showRecords();
    }
    showFilterRecords() {
        this.showRecords(SHOW_FILTER);
    }
    showRecords(filter) {

        let columns = GET_COLUMN_NAMES();

        let config = {
            dbName: "MobilaDB",
            tableName: "MilkProduction",
            columns: columns,
            order: {
                column: "Year"
            },
            filter: filter
        };

        DataBase.Select(config, function(result) {
            let rows = [];
            let array = result.rows._array;
            let captions = [];
            for (let key in columns) {
                captions.push(COLUMN_CAPTIONS[columns[key]]);
            }
            rows.push(captions);
            for (let i = 0; i < array.length; i++) {
                let values = [];
                for (let key in columns) {
                    values.push(array[i][columns[key]]);
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
        let config = {
            dbName: "MobilaDB",
            tableName: "MilkProduction",
            columns: {
                function: DataBase.AggregationFunction.AVG,
                column: "Quantity",
                alias: "AvgQuantity"
            }
        };

        DataBase.Select(config, function(result) {
            let avgRes = result.rows._array[0]["AvgQuantity"];
            avgRes = Calculator.roundToDec(avgRes, 3);
            Alert.alert("Обчислено", "Середньорічне виробництво - " + avgRes);
        }, this);
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
                    saveCallback={this.insertNew.bind(this)}
                    values={this.state.values}
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