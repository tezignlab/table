import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import tailwind from "tailwind-rn";

export function LoadingIndicator() {

    return <View style={tailwind(`flex w-full items-center justify-center h-20 bg-transparent`)}>
       <ActivityIndicator color="black" />
    </View>

}