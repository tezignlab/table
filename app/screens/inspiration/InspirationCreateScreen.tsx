import React, { useContext, useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    Modal,
    View,
    ActivityIndicator,
    Platform,
    TouchableOpacity,
} from 'react-native';
import tailwind, { getColor } from 'tailwind-rn';

import { RootStackScreenProps } from '../../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import http from '../../services/http';
import Tips from "../../services/tips";
import useIdentity from "../../hooks/useIdentity";
import { UserContext } from "../../context/UserContext";
import { TFile } from '../../hooks/types';
import { SafeAreaView } from '../../components/SafeAreaView';
import * as Icons from "react-native-heroicons/solid";
import * as OutlineIcons from "react-native-heroicons/outline";
import { LocaleContext } from '../../context/LocaleContext';


interface ILocalFile {
    cancelled: boolean;
    uri: string;
}

export function InspirationCreateScreen({ navigation, route }: RootStackScreenProps<'InspirationCreate'>) {
    const { translate } = React.useContext(LocaleContext)
    const inspiration = route.params.inspiration;
    const [content, setContent] = useState('');
    const [images, setImages] = useState<(ILocalFile & TFile)[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);

    const { isLogin } = useContext(UserContext)
    const { goLogin } = useIdentity()

    useEffect(() => {
        if (inspiration !== null) {
            setContent(inspiration.content)
            // @ts-ignore
            setImages(inspiration.files)
        }
    }, [inspiration]);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
            setHasMediaLibraryPermission(status === 'granted');
        })();
        (async () => {
            const { status } = await ImagePicker.getCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, [])

    // 发布
    const handlePost = () => {
        if (content.length < 1 && images.length < 1) {
            return
        }
        setModalVisible(true)
        Promise.all(images.map(item => {
            if (item.id) {
                return Promise.resolve(item)
            } else {
                return Platform.OS === 'ios' ? http.upload(item.uri) : http.upload(item.uri, 'image/jpeg')
            }
        })).then(results => Promise.all(results.map(result => result.id))).then(file_ids => {
            if (inspiration === null) {
                return http.post('/api/v1/inspiration', {
                    content: content,
                    file_ids: file_ids
                });
            } else {
                return http.put(`/api/v1/inspiration/${inspiration.id}`, {
                    content: content,
                    file_ids: file_ids,
                });
            }
        }).finally(() => {
            setContent('')
            setImages([])
            setModalVisible(false)
            navigation.navigate('Inspiration')
        })
    }

    const selectImage = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.6,
        }).then(data => {
            if (!data.cancelled) {
                // @ts-ignore
                setImages([...images, data])
            }
        })
    }

    const takePicture = () => {
        ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.6,
        }).then(data => {
            if (!data.cancelled) {
                // @ts-ignore
                setImages([...images, data])
            }
        })
    }

    // 选择文件
    function onMedias() {
        if (!hasMediaLibraryPermission) {
            if (Platform.OS !== 'web') {
                ImagePicker.requestMediaLibraryPermissionsAsync().then(({ status }) => {
                    if (status !== 'granted') {
                        Tips.error(translate('error'), translate('noPhotosPermission'));
                    } else {
                        setHasMediaLibraryPermission(true)
                        selectImage()
                    }
                })
            }
        } else {
            selectImage()
        }
    }

    // 照相
    function onCamera() {
        if (!hasCameraPermission) {
            if (Platform.OS !== 'web') {
                ImagePicker.requestCameraPermissionsAsync().then(({ status }) => {
                    if (status !== 'granted') {
                        Tips.error(translate('error'), translate('noCameraPermission'));
                    } else {
                        setHasMediaLibraryPermission(true)
                        takePicture()
                    }
                })
            }
        } else {
            takePicture()
        }
    }

    // 移除文件
    function removeFile(index: number) {
        let array = [...images]
        array.splice(index, 1)
        setImages(array)
    }

    return (
        <View style={tailwind(`w-full h-full bg-white`)}>
            {
                isLogin ? <SafeAreaView>
                    <View style={tailwind(`flex-row justify-between items-center my-2 mx-4`)}>
                        <Pressable onPress={navigation.goBack}>
                            <Text style={tailwind(`text-base`)}>{translate('cancle')}</Text>
                        </Pressable>
                        <Pressable onPress={handlePost}>
                            <View style={tailwind(`w-16 rounded-md ${content.length > 0 || images.length > 0 ? 'bg-gray-800' : 'bg-gray-300'}`)}>
                                <Text style={tailwind(`text-center text-white py-2`)}>{translate('publish')}</Text>
                            </View>
                        </Pressable>
                    </View>

                    <ScrollView style={tailwind(`h-full`)}>
                        <TextInput
                            style={{ ...tailwind(`h-32 p-2 rounded-md m-4 border-0`), minHeight: 64, maxHeight: 128 }}
                            multiline={true}
                            onChangeText={setContent}
                            value={content}
                            placeholder={translate('slogan')}
                            autoFocus
                        />
                        <View style={tailwind(`flex-row flex-wrap items-center mx-4`)}>
                            {
                                images.map((item, index) => <View style={tailwind(`w-1/3 p-1`)} key={index}>
                                    <Image style={[tailwind(`w-28 h-28 bg-gray-200`)]} source={{ uri: item.id ? item.thumbnail : item.uri }} />
                                    <Pressable onPress={() => removeFile(index)} style={{ ...tailwind('absolute -top-1 -right-1 bg-white rounded-full') }}>
                                        <Icons.XCircleIcon size={24} color={getColor('gray-400')} />
                                    </Pressable>
                                </View>)
                            }
                        </View>
                        <View style={tailwind(`flex-row flex-wrap items-center m-4`)}>
                            <Pressable onPress={onMedias} style={tailwind(`w-20 h-20 rounded-md border border-gray-400 bg-transparent mr-2 items-center justify-center`)}>
                                <Icons.PhotographIcon size={48} color="#9CA3AF" style={tailwind(``)} />
                            </Pressable>
                            <Pressable onPress={onCamera} style={tailwind(`w-20 h-20 rounded-md border border-gray-400 bg-transparent mr-2 items-center justify-center`)}>
                                <Icons.CameraIcon size={48} color="#9CA3AF" style={tailwind(``)} />
                            </Pressable>
                        </View>
                    </ScrollView>
                </SafeAreaView> : <SafeAreaView style={tailwind(`h-full w-full flex-col justify-center items-center`)}>
                    <OutlineIcons.LightningBoltIcon size={96} color={getColor('gray-300')} />
                    <Text style={tailwind(`text-center mb-6 text-base text-gray-600 mt-4 mb-16`)}>{translate('signInToUseThisFunction')}</Text>
                    <TouchableOpacity onPress={goLogin}>
                        <View style={tailwind(`w-36 rounded-md bg-gray-800`)}>
                            <Text style={[tailwind(`text-center text-center text-white py-3`)]}>{translate('signIn')}</Text>
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            }

            <Modal animationType="fade" transparent={true} visible={modalVisible}>
                <View style={tailwind(`w-full h-full flex items-center justify-center bg-black bg-opacity-60`)}>
                    <View style={tailwind(`w-32 h-32 bg-black bg-opacity-80 flex items-center justify-center rounded-md`)}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={tailwind(`text-white mt-2`)}>{translate('loading')}</Text>
                    </View>
                </View>
            </Modal>

        </View>
    );
}
