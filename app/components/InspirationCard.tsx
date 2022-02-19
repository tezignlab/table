import React from 'react';
import { Image, Pressable, Text, View, useWindowDimensions } from 'react-native';
import tailwind from 'tailwind-rn';
import moment from "moment";
import { Styles } from "../utils/styles";
import { TInspiration } from '../hooks/useInspirations';
import * as Icons from "react-native-heroicons/solid";


export function InspirationCard({ item, showActionSheet, handleImagesPreview }: {
    showActionSheet: (item: TInspiration) => void;
    handleImagesPreview: (images: string[], index: number) => void;
    item: TInspiration;
}) {

    const {width, height} = useWindowDimensions()

    const imageWidth = (width - 60) / 3

    return (
        <View style={{ ...tailwind('pb-2 rounded-md bg-white'), ...Styles.cardShadow(), margin: 10}}>
            <View style={{...tailwind('flex flex-row justify-between items-center'), padding: 10}}>
                <Text style={tailwind('text-gray-400')}>{moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</Text>
                <Pressable onPress={() => showActionSheet(item)}>
                    <Icons.DotsHorizontalIcon  style={tailwind('text-gray-400')} size={24} />
                </Pressable>
            </View>
            {
                item.content.length > 0 && <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}><Text>{item.content}</Text></View>
            }
            <View style={{...tailwind('flex-row flex-wrap'), marginLeft: 10}}>
                {
                    item.files.map((file, index) => <Pressable key={index} onPress={() => handleImagesPreview(item.files.map(x => x.url), index)}>
                        <Image style={[{marginRight: 10, marginBottom: 10, width: imageWidth, height: imageWidth}]} source={{ uri: file.thumbnail }} />
                    </Pressable>)
                }
            </View>
        </View>
    )

}