import {Alert} from 'react-native';
import * as SQLite from 'expo-sqlite';
import Livlag from "./Livlag";

export default class DataBase {

    static Execute(dbName, queryConfig, callback, scope) {

        let db = SQLite.openDatabase(dbName);
        db.transaction((ts) => {
            console.log(queryConfig.sqlText);
            ts.executeSql(queryConfig.sqlText, queryConfig.arguments || [], (config, res) => {
                Livlag.callback(callback, res, scope);
            }, (error) => {
                console.log(error);
                DataBase._executeError(queryConfig.sqlText);
            })
        }, (error) => {
            DataBase._connectError();
        })
    }
    static _connectError() {
        Alert.alert("Помилка", "Помилка при підключенні до БД")
    }
    static _executeError(queryText) {
        Alert.alert("Помилка", "Помилка при виконанні запиту\n" + queryText)
    }

    static Insert(config, callback, scope) {
        DataBase.Execute(config.dbName, DataBase._getInsertConfig(config.tableName, config.values), callback, scope);
    }
    static _getInsertConfig(tableName, values) {
        let exists = false;
        let columnsArr = [];
        let valuesArr = [];
        for (let key in values) {
            exists = true;
            columnsArr.push(key);
            valuesArr.push(values[key]);
        }
        if (!exists) {
            throw new Error("Відсутні значення для вставки");
        }

        return {
            sqlText: `INSERT INTO ${tableName} (${columnsArr.join(', ')}) VALUES (${valuesArr.map((i) => "?").join(', ')})`,
            arguments: valuesArr
        }
    }


    static Select(config, callback, scope) {
        DataBase.Execute(
            config.dbName,
            DataBase._getSelectConfig(config.tableName, config.columns, config),
            callback, scope
        );
    }
    static _getSelectConfig(tableName, columns, config) {
        return {
            sqlText: `SELECT ${DataBase._getColumnsSql(columns)} FROM ${tableName}` +
                DataBase._getFilterSql(config.filter) +
                DataBase._getOrderSql(config.order)
        }
    }

    static _getColumnsSql(columns) {
        if (!columns) {
            return '';
        }
        if (columns instanceof Array) {
            return columns.join(', ');
        }
        return `${columns.function}(${columns.column})` + (columns.alias ? ` AS ${columns.alias}` : ``);

    }
    static _getOrderSql(orderConfig) {
        if (!orderConfig) {
            return '';
        }
        return ` ORDER BY ${orderConfig.column}`;
    }
    static _getFilterSql(filterConfig) {
        if (!filterConfig) {
            return '';
        }
        return ` WHERE ${filterConfig.column} ${filterConfig.compareType} ${filterConfig.value}`;
    }
}

DataBase.CompareType = {
    EQUAL: "=",
    NOT_EQUAL: "<>",
    MORE: ">",
    MORE_OR_EQUAL: ">=",
    LESS: "<",
    LESS_OR_EQUAL: "<=>"
}

DataBase.AggregationFunction = {
    SUM: "SUM",
    AVG: "AVG",
    MIN: "MIN",
    MAX: "MAX"
}