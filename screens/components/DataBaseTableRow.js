import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert} from 'react-native';


export default class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: props.values,
            rowClickAction: props.rowClickAction
        }
    }

    render() {
        let cellWidth = this.state.values.length ?
            (90 / this.state.values.length) : 90;

        if (this.state.rowClickAction) {
            return (
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            this.state.rowClickAction(this.state.values)
                        }}
                        style={styles.row}
                    >
                        {
                            this.state.values.map(item => (
                                <View style={styles.cell} style={{width: `${cellWidth}%`}}><Text>{item}</Text></View>
                            ))
                        }
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.row}>
                {
                    this.state.values.map(item => (
                        <View style={styles.cell} style={{width: `${cellWidth}%`}}><Text>{item}</Text></View>
                    ))
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '90%',
        borderBottomWidth: 1,
        marginBottom: 5,
        paddingBottom: 5
    },
    cell: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }
});