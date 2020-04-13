import React, { useEffect } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TouchableHighlight} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Permissions from "expo-permissions";
import DataBaseTable from "./components/DataBaseTable";
import FileDataBase from "../helpers/FileDataBase";
import DataBase from "../helpers/DataBase";

const CAPTIONS = ["Ім'я", "Прізвище", "Телефон", "Email"];

export default class ContactsScreen extends React.Component {
    constructor(props) {
        super(props);
        let navigation = props.navigation;
        this.state = {
            navigation: navigation,
            modalVisible: false,
            rows: []
        }
    }
    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }

    showAllContacts() {
        this.showContacts();
    }
    showContactsStartsWithMi() {
        this.showContacts(item => item.firstName && item.firstName.startsWith('Ми'));
    }

    async showContacts(filter) {
        let { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.FirstName, Contacts.Fields.LastName, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails]
        });
        let rows = [];
        rows.push(CAPTIONS);
        data = filter ? data.filter(filter) : data;
        for (let i = 0; i < data.length; i++) {
            const contact = data[i];

            let firstName = contact.firstName;
            let lastName = contact.lastName;
            let phoneNumbers = (contact.phoneNumbers && contact.phoneNumbers instanceof Array && contact.phoneNumbers[0] && contact.phoneNumbers[0].number) || '';
            let email = (contact.emails && contact.emails instanceof Array && contact.emails[0] && contact.emails[0].email) || '';

            rows.push([firstName, lastName, phoneNumbers, email]);
        }

        this.setState({
            rows: rows,
            modalVisible: true,
            modalCaption: filter ? "Контакти на 'Ми'" : "Контакти"
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

                <Text>Адресна книга</Text>

                <TouchableOpacity
                    onPress={this.showAllContacts.bind(this)}
                >
                    <Text style={styles.button} >Контакти</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.showContactsStartsWithMi.bind(this)}
                >
                    <Text style={styles.button} >Контакти на 'Ми'</Text>
                </TouchableOpacity>


                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false});
                    }}>
                    <View
                        style={styles.container}>
                        <Text style={styles.marginBottom}>{this.state.modalCaption}</Text>
                        <DataBaseTable
                            rows={this.state.rows}
                        />
                    </View>
                </Modal>
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
    errorText: {
        fontSize: 18,
        marginBottom: 30,
        color: '#F00'
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
    },
    marginBottom: {
        marginBottom: 20
    }
});