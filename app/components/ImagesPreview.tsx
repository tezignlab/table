import * as React from 'react';
import { useState } from 'react';

import tailwind from "tailwind-rn";
import { SafeAreaView } from './SafeAreaView';
import * as Icons from "react-native-heroicons/solid";

import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Pressable,
    useWindowDimensions,
    View,
} from 'react-native';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 0,
    viewAreaCoveragePercentThreshold: 51,
};

function ImageItem({ uri }: { uri: string }) {

    const { width, height } = useWindowDimensions()
    const [loading, setLoading] = useState(true)

    return <View style={{ ...tailwind(`justify-center items-center`), width: width, height: height }}>
        {
            loading && <ActivityIndicator style={tailwind(`absolute`)} color="white" />
        }
        <Image style={{
            width: width - 10,
            height: '100%',
        }} source={{ uri: uri }} onLoadEnd={() => setLoading(false)} resizeMode='contain' />
    </View>
}

export function ImagesPreview({ visible, setVisible, images, initIndex = 0 }: { visible: boolean, setVisible: (visible: boolean) => void, images: string[], initIndex: number }) {

    const { width, height } = useWindowDimensions()

    return (
        <Modal animationType="none" transparent={false} visible={visible} statusBarTranslucent={true}>
            <View style={tailwind(`bg-gray-900 flex-1`)}>
                <FlatList
                    horizontal
                    pagingEnabled
                    data={images}
                    initialScrollIndex={initIndex}
                    getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <ImageItem uri={item} />}
                    viewabilityConfig={VIEWABILITY_CONFIG}
                />
                <SafeAreaView style={tailwind(`absolute top-0`)}>
                    <Pressable onPress={() => setVisible(false)} style={tailwind(`m-2 z-10`)}>
                        <Icons.XCircleIcon size={30} color="white" />
                    </Pressable>
                </SafeAreaView>
            </View>
        </Modal>
    )
}