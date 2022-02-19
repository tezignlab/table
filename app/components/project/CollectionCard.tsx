import * as React from 'react';
import { Text, Pressable, View, Image, useWindowDimensions } from 'react-native';

import { TCollection } from '../../hooks/useCollections';
import tailwind from "tailwind-rn";
import { useNavigation } from "@react-navigation/core";
import { Styles } from "../../utils/styles";

export function CollectionCard({ collection }: { collection: TCollection }) {
    const navigation = useNavigation();
    const { width } = useWindowDimensions()

    const viewShots = () => navigation.navigate('CollectedProjects', { collection: collection, n: 0 });

    return (
        <Pressable onPress={viewShots} style={tailwind(`mx-4 mb-6`)}>
            <View style={{ ...tailwind(`p-4 flex flex-col bg-white rounded-md`), ...Styles.shadow() }}>
                <View style={tailwind(`mb-2 w-full flex-row justify-between`)}>
                    <Text style={tailwind(`text-base font-medium`)} numberOfLines={1}>{collection.name}</Text>
                </View>
                <View style={tailwind(`flex-row justify-between`)}>
                    {
                        [0, 1, 2].map(index => <View style={{ ...tailwind(`bg-gray-200 rounded-md ${width > 640 ? 'h-36' : 'h-24'}`), width: '32%' }} key={index}>
                            {
                                collection.covers[index] && <Image source={{ uri: collection.covers[index] }} style={tailwind(`w-full h-full rounded-md`)} />
                            }
                        </View>)
                    }
                </View>
            </View>
        </Pressable>
    )

}