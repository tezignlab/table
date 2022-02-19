import * as React from 'react';

import { Image, Text, View } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from "../../navigation/types";
import Constants from 'expo-constants';

export function AboutScreen({ navigation }: RootStackScreenProps<'About'>) {

    // @ts-ignore
    const appVersion = Constants.manifest.version;

    return (
        <View style={tailwind(`bg-white h-full`)}>

            <View style={tailwind(`flex-col items-center my-8`)}>
                <Image
                    style={tailwind(`h-20 w-20 rounded-md`)}
                    source={require('../../assets/images/icon.png')}
                />
                <Text style={tailwind(`text-gray-400 mt-4`)}>Version {appVersion}</Text>
            </View>
        
        </View>
    );

}
