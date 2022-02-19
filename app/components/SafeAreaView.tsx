import * as React from 'react';
import { SafeAreaView as AndroidSafeAreaView } from 'react-native-safe-area-context';
import { Platform, SafeAreaView as IOSSafeAreaView } from 'react-native';

export function SafeAreaView(props: IOSSafeAreaView['props']) {
    return Platform.OS == 'android' ? <AndroidSafeAreaView {...props} /> : <IOSSafeAreaView {...props} />;
}