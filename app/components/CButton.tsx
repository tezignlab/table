import * as React from 'react';
import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import tailwind from "tailwind-rn";
import {ReactNode} from "react";

export function CButton({disable =  false, style = tailwind(`w-full rounded-md bg-gray-800`), textStyle = tailwind(`text-center text-white py-4`), onPress, children}: {disable?: boolean, style?: StyleProp<ViewStyle>, textStyle?: StyleProp<ViewStyle>, onPress?: () => void,  children: ReactNode}) {

    return (
        <>
            {
                disable ? <View style={tailwind(`w-full rounded-md bg-gray-300`)}>
                    <Text style={[tailwind(`text-center text-white py-4`), textStyle]}>{children}</Text>
                </View> : <TouchableOpacity onPress={onPress} >
                    <View style={style}>
                        <Text style={[tailwind(`text-center`), textStyle]}>{children}</Text>
                    </View>
                </TouchableOpacity>
            }
        </>
    )

}