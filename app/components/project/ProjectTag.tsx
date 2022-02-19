import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import tailwind from "tailwind-rn";


export function ProjectTag({name, onPress}: {name: string, onPress: () => void}) {
    return (
        <TouchableOpacity style={tailwind(`mr-2 mb-2 border border-gray-400 px-2 py-1 rounded-md`)} onPress={onPress}>
            <Text style={tailwind(`text-center`)}>{name}</Text>
        </TouchableOpacity>
    )
}