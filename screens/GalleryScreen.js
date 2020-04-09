import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TouchableHighlight} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import Gallery from 'react-native-image-gallery';
import Livlag from "../helpers/Livlag";

const PHOTO_PAGINATION_COUNT = 20;

export default class GalleryScreen extends React.Component {
    state = {
        images: [],
        photoEndCursor: null,
        currentPhotoIndex: -1,
        loadedPageCount: 0,
        hasNextPage: true,
        modalVisible: false,
        directories: [],
        selectedDirectoryId: ""
    };

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        this.loadPhotos();
    }
    showDirectories() {
        this.setState({modalVisible: true})
        MediaLibrary.getAlbumsAsync()
            .then((dirs) => {
                console.log(dirs);
                this.setState({
                    directories: dirs
                });
            })
    }
    onDirectorySelected(directoryId) {
        this.setState({
            images: [],
            photoEndCursor: null,
            hasNextPage: true,
            loadedPageCount: 0,
            currentPhotoIndex: -1,
            modalVisible: false,
            directories: [],
            selectedDirectoryId: directoryId
        }, () => {
            this.loadPhotos();
        });
    }
    loadPhotos() {
        console.log(this.state);
        if (!this.state.hasNextPage) {
            return;
        }
        let conf = {};
        if (this.state.selectedDirectoryId) {
            conf.album = this.state.selectedDirectoryId;
        }
        if (this.state.photoEndCursor) {
            conf.after = this.state.photoEndCursor;
        }
        let loadConfig = !Livlag.objectIsEmpty(conf) ? conf : undefined;
        console.log(conf);
        MediaLibrary.getAssetsAsync(loadConfig)//-572399359
            .then((result) => {
                console.log(result);
                let newImages = this.state.images.concat(result.assets.map((image) => {
                    return { source: image };
                }) );
                this.setState({
                    images: newImages,
                    photoEndCursor: result.endCursor,
                    hasNextPage: result.hasNextPage,
                    loadedPageCount: this.state.loadedPageCount + 1
                });
            })
    }
    onPhotoScroll(config) {
        if (this.state.loadedPageCount * PHOTO_PAGINATION_COUNT - 1 === config.position) {
            this.loadPhotos();
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    render(lfl) {
        let { image } = this.state;
        let { images } = this.state;

        return (
            <View style={styles.container}>

                {images &&
                <Gallery
                    style={{ flex: 1, backgroundColor: 'black' }}
                    images={images}
                    onPageScroll={this.onPhotoScroll.bind(this)}
                /> ||
                    <Text style={styles.errorText} >Фото відсутні</Text>}
                {image &&
                    <Image source={{ uri: image }} style={{ width: 300, height: 400 }} />}

                <TouchableOpacity
                    onPress={this._pickImage}
                >
                    <Text style={styles.button} >Фото</Text>
                </TouchableOpacity>
                <TouchableHighlight
                    onPress={() => {
                        this.showDirectories()
                    }}>
                    <Text>Вибрати папку</Text>
                </TouchableHighlight>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false});
                    }}>
                    <View
                        style={styles.container}>
                        <Text>Вибрати папку!</Text>
                        {
                            this.state.directories.map(item => (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.onDirectorySelected(item.id);
                                    }}
                                >
                                    <Text style={styles.button} >{item.title}</Text>
                                </TouchableOpacity>
                            ))
                        }
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
    }
});
