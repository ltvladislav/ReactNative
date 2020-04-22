import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    TouchableHighlight,
    Dimensions,
    TextInput,
    ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import MapView, { Marker } from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const UNIVER = {
    latlng: {
        latitude: 50.3827049,
        longitude: 30.4976772
    },
    title: "Місцезнаходження",
    description: ""
};


export default class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        let navigation = props.navigation;
        this.state = {
            navigation: navigation,
            marker: UNIVER,
            region: MapScreen.getRegion(UNIVER),
            customLatintude: "",
            customLongitude: ""
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
    }

    async showCurrentLocation() {
        let location = await Location.getCurrentPositionAsync({});

        let marker = {
            latlng: MapScreen.getLatLngFromLocation(location),
            title: "Місцезнаходження",
            description: ""
        };
        this.setState({
            marker: marker,
            region: MapScreen.getRegion(marker),
            customLatintude: "",
            customLongitude: ""
        });
    }
    static getLatLngFromLocation(location) {
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
    }
    static getRegion(marker) {
        return {
            latitude: marker.latlng.latitude,
            longitude: marker.latlng.longitude,
            latitudeDelta: 0.0461,
            longitudeDelta: 0.0211,
        };
    }
    setCoordinates(value) {
        console.log(value);
        let latLng = {
            latitude: value.lat || this.state.customLatintude,
            longitude: value.lng || this.state.customLongitude
        };
        let state = {
            customLatintude: latLng.latitude,
            customLongitude: latLng.longitude
        };
        if (latLng.latitude && latLng.longitude) {
            state.marker = {
                latlng: latLng,
                title: "Визначені координати",
                description: ""
            };
            state.region = MapScreen.getRegion(state.marker)
        }
        this.setState(state);
    }
    getAttributeValue(attribute) {
        if (this.state[attribute] || this.state[attribute] === 0) {
            return this.state[attribute].toString();
        }
        return '';
    }

    render() {
        console.log("RENDER");
        return (
<ScrollView>
            <View style={styles.containerBetween}>
                <MapView
                    region={this.state.region}
                    style={styles.mapStyle}
                >
                    <Marker
                        coordinate={this.state.marker.latlng}
                        title={this.state.marker.title}
                        description={this.state.marker.description}
                    />
                </MapView>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={this.showCurrentLocation.bind(this)}
                    >
                        <Text>Місцезнаходження</Text>
                    </TouchableOpacity>
                    <View style={styles.row}>
                        <Text>Latintude : </Text>
                        <TextInput style={styles.input} value={this.getAttributeValue('customLatintude')}
                        onChangeText={(value) => {
                            this.setCoordinates({lat: +value});
                        }}/>
                    </View>
                    <View style={styles.row}>
                        <Text>Longitude : </Text>
                        <TextInput style={styles.input} value={this.getAttributeValue('customLongitude')}
                        onChangeText={(value) => {
                            this.setCoordinates({lng: +value});
                        }}/>
                    </View>
                </View>
            </View>
</ScrollView>
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
    containerBetween: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 200,
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
    }
});
