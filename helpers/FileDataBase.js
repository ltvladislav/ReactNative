import {Alert, AsyncStorage} from 'react-native';
import * as SQLite from 'expo-sqlite';
import Livlag from "./Livlag";

export default class FileDataBase {


    static Insert(config, callback, scope) {
        FileDataBase._readFromFile(config, (array) => {
            if (!array) {
                array = [];
            }
            array.push(config.values);
            FileDataBase._saveToFile(config, array, (result) => {
                result = result || {};
                result.insertId = true;
                Livlag.callback(callback, [result], scope);
            }, this);
        }, this);
    }


    static Select(config, callback, scope) {
        FileDataBase._readFromFile(config, (array) => {
            if (array && array.length) {
                array = FileDataBase._getOrderedArray(array, config.order);
                array = FileDataBase._getFilteredArray(array, config.filter);
                array = FileDataBase._prepareAggregationColumns(array, config.columns);
            }
            Livlag.callback(callback, [array], scope);
        }, this);
    }
    static _getOrderedArray(array, orderConfig) {
        if (!orderConfig) {
            return array;
        }
        let key = orderConfig.column;
        let orderFunction =  (a, b) => a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
        return array.sort(orderFunction);
    }
    static _getFilteredArray(array, filterConfig) {
        if (!filterConfig) {
            return array;
        }
        let filterFunction =  (a) => {
            return filterConfig.compareType(a[filterConfig.column], filterConfig.value);
        };
        return array.filter(filterFunction);
    }
    static _prepareAggregationColumns(array, columns) {
        if (columns instanceof Array) {
            return array;
        }
        let result = {};
        result[columns.alias] = Math[columns.function](...(array.map(item => item[columns.column])));
        return [result];
    }


    static _saveToFile(config, value, callback, scope) {
        AsyncStorage.setItem(FileDataBase._getStorageKey(config), JSON.stringify(value), (result) => {
            Livlag.callback(callback, [result], scope);
        });
    }
    static async _readFromFile(config, callback, scope) {
        await AsyncStorage.getItem(FileDataBase._getStorageKey(config), (error, result) => {
            const value = result !== null ? JSON.parse(result) : null;
            Livlag.callback(callback, [value], scope);
        });
    }

    static _getStorageKey(config) {
        if (config instanceof String) {
            return config;
        }
        return `${config.dbName}_${config.tableName}`;
    }
}

FileDataBase.CompareType = {
    EQUAL: (a, b) => a === b,
    NOT_EQUAL: (a, b) => a !== b,
    MORE: (a, b) => a > b,
    MORE_OR_EQUAL: (a, b) => a >= b,
    LESS: (a, b) => a < b,
    LESS_OR_EQUAL: (a, b) => a <= b
}

FileDataBase.AggregationFunction = {
    SUM: "sum",
    AVG: "avg",
    MIN: "min",
    MAX: "max"
}

Math.sum = function() {
    let sum = 0.0;
    for (let i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    return sum;
}
Math.avg = function() {
    return Math.sum(...arguments) / arguments.length;
}