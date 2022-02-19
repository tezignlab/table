import * as React from 'react';
import tailwind from "tailwind-rn";
import {GestureResponderEvent, Pressable, Text, View} from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";

export interface LineActionProps {
    icon?: any;
    name: string;
    onPress?: (event: GestureResponderEvent) => void;
}

export function LineActions({actions}: { actions: LineActionProps[] }) {
    return <View style={tailwind(`bg-white`)}>
        {
            actions.map((item, index) => <Pressable onPress={item.onPress} key={index}>
                <View style={tailwind(`py-3 px-4 flex flex-row items-center`)}>
                    <View style={tailwind(`flex-row flex-grow items-center`)}>
                        {item.icon}
                        <Text style={tailwind(`ml-3 text-base`)}>{item.name}</Text>
                    </View>
                    <View>
                        <ChevronRightIcon size={18} color="gray" />
                    </View>
                </View>
                {
                    index < actions.length - 1 && <View style={tailwind(`border-b border-gray-200 ${item.icon ? 'ml-12' : 'ml-6'}`)}/>
                }
            </Pressable>)
        }
    </View>
}
