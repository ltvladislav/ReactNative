import React, { useEffect } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TouchableHighlight} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Permissions from "expo-permissions";
import DataBaseTable from "./components/DataBaseTable";
import FileDataBase from "../helpers/FileDataBase";
import DataBase from "../helpers/DataBase";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

TaskManager.defineTask("MOBILA_GEO_TASK", ({ data: { locations }, error }) => {
    if (error) {
        // check `error.message` for more details.
        return;
    }
    Alert.alert(locations[0].coords.latitude + " - " + locations[0].coords.longitude);
    console.log('Received new locations', locations);
});

export default class GPSScreen extends React.Component {
    constructor(props) {
        super(props);
        let navigation = props.navigation;
        this.state = {
            navigation: navigation
        }
    }
    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        const { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        Location.startLocationUpdatesAsync("MOBILA_GEO_TASK", {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1
        });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                <Text>GPS</Text>
            </View>
        );
    }
}
