import React from 'react';
import {StyleSheet, TextInput, View, Button, Text, TouchableOpacity, Alert, ScrollView, AsyncStorage, Dimensions} from 'react-native';
import Calculator from "../helpers/Calculator";
import {FlatList} from "react-native-web";
import TableRow from "../components/table/TableRow";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";


export default class CalculateChartScreen extends React.Component {
    constructor(props) {
        super(props);
        let navigation = props.navigation;
        this.state = {
            navigation: navigation,
            argY: navigation.getParam("argY"),
            argStartX: navigation.getParam("argStartX"),
            argEndX: navigation.getParam("argEndX"),
            step: navigation.getParam("step") / 2
        }
    }
    getDataForChart() {
        let labels = [];
        let data = [];

        for (let i = this.state.argStartX; i <= this.state.argEndX; i += this.state.step) {
            labels.push(i);
            data.push(Calculator.getFunctionResult(i, this.state.argY));
        }

        return {
            labels: labels,
            datasets: [
                {
                    data: data
                }
            ]
        }
    }
    render() {


        return (
            <View style={styles.container}>
                <Text>Графік функції</Text>
                <LineChart
                    data={this.getDataForChart()}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
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
