import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert} from 'react-native';


export default class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: props.values
        }
    }

    render() {
        return (
            <View style={styles.row}>
                <View><Text>{this.state.values.argX}</Text></View>
                <View><Text>{this.state.values.argF}</Text></View>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '60%',
        borderBottomWidth: 1,
        marginBottom: 5,
        paddingBottom: 5
    }
});