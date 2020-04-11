import {Alert} from 'react-native';
import * as SQLite from 'expo-sqlite';
import Livlag from "./Livlag";

export default class DataBase {

    static Execute(dbName, queryConfig, callback, scope) {

        let db = SQLite.openDatabase(dbName);
        db.transaction((ts) => {
            ts.executeSql(queryConfig.sqlText, queryConfig.arguments || [], (config, res) => {
                let selectArray = queryConfig.isSelect  && res && res.rows && res.rows._array;
                let answer = selectArray || res;
                Livlag.callback(callback, [answer], scope);
            }, (error) => {
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
        DataBase.Execute(config.dbName, DataBase._getInsertSql(config.tableName, config.values), callback, scope);
    }
    static _getInsertSql(tableName, values) {
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

    static Update(config, callback, scope) {
        DataBase.Execute(config.dbName, DataBase._getUpdateSql(config.tableName, config.values, config), callback, scope);
    }
    static _getUpdateSql(tableName, values, config) {
        let exists = false;
        let columnsArr = [];
        let valuesArr = [];
        for (let key in values) {
            exists = true;
            columnsArr.push(`${key} = ?`);
            valuesArr.push(values[key]);
        }
        if (!exists) {
            throw new Error("Відсутні значення для оновлення");
        }

        return {
            sqlText: `UPDATE ${tableName} SET ${columnsArr.join(', ')}` +
                DataBase._getFilterSql(config.filter),
            arguments: valuesArr
        }
    }

    static Select(config, callback, scope) {
        DataBase.Execute(
            config.dbName,
            DataBase._getSelectSql(config.tableName, config.columns, config),
            callback, scope
        );
    }
    static _getSelectSql(tableName, columns, config) {
        return {
            sqlText: `SELECT ${DataBase._getColumnsSql(columns)} FROM ${tableName}` +
                DataBase._getFilterSql(config.filter) +
                DataBase._getOrderSql(config.order),
            isSelect: true
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
    LESS_OR_EQUAL: "<="
}

DataBase.AggregationFunction = {
    SUM: "SUM",
    AVG: "AVG",
    MIN: "MIN",
    MAX: "MAX"
}