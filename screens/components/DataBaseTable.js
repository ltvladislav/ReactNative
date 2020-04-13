import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert, ScrollView} from 'react-native';
import DataBaseTableRow from "./DataBaseTableRow";

export default class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: props.rows,
            rowClickAction: props.rowClickAction
        }
    }

    render() {
        return (
            <ScrollView>
                {
                    this.state.rows.map((row, index) => (
                        <DataBaseTableRow
                            key={index}
                            values={row}
                            rowClickAction={this.state.rowClickAction}
                        />
                    ))
                }
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '80%',
        borderBottomWidth: 1,
        marginBottom: 5,
        paddingBottom: 5
    }
});