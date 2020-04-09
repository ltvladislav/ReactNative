import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import myPhoto from '../assets/myPhoto.png'


export default class AboutScreen extends React.Component {
    render(lfl) {
        return (
            <View style={styles.container}>
                <Text style={styles.name}>Литвинчук Владислав</Text>
                <Image style={styles.image} source={myPhoto}/>
                <Text style={styles.info}>Комп'ютерні науки група КН-16002б</Text>
                <Text style={styles.purpose}>В кінці навчального курсу прагну оволодіти методологією та технікою
                    створення мобільних додатків за допомогою ReactNative</Text>
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
    name: {
        fontSize: 18,
        marginBottom: 30
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
    }
});
