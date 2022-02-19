import * as React from 'react';
import tailwind from "tailwind-rn";
import {GestureResponderEvent, Pressable, Text} from "react-native";

export interface SingleProps {
    name: string;
    onPress?: (event: GestureResponderEvent) => void;
}

export function SingleAction({name, onPress}: SingleProps) {
    return <Pressable onPress={onPress} style={tailwind(`w-full bg-white mt-4`)}>
        <Text style={tailwind(`py-4 text-base text-center font-medium`)}>{name}</Text>
    </Pressable>
}
