import * as React from 'react';
import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { Animated, Modal, Pressable, useWindowDimensions, View } from 'react-native';
import tailwind from "tailwind-rn";
import { ReactNode } from 'react';

export type BottomModalHandler = {
    show: () => void,
    hide: () => void,
}

export const BottomModal = forwardRef<BottomModalHandler, { children: ReactNode }>((props, ref) => {

    const layout = useWindowDimensions()
    const modalOffsetY = useRef(new Animated.Value(layout.height)).current
    const [visible, setVisible] = useState(false)

    function show() {
        setVisible(true)
        Animated.spring(modalOffsetY, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true
        }).start()
    }

    function hide() {
        Animated.timing(modalOffsetY, {
            toValue: layout.height,
            duration: 0,
            useNativeDriver: true
        }).start(() => setVisible(false))
    }

    useImperativeHandle(ref, () => ({ show, hide }))

    return (
        <Modal animationType="none" transparent={true} visible={visible} statusBarTranslucent={true} presentationStyle='overFullScreen'>
            <View style={tailwind(`w-full h-full bg-black bg-opacity-60 flex-1 flex-col justify-end`)} >
                <Pressable style={tailwind(`flex-grow`)} onPress={hide} />
                <Animated.View style={{ transform: [{ translateY: modalOffsetY }] }}>
                    {
                        props.children
                    }
                </Animated.View>
            </View>
        </Modal>
    )

})
