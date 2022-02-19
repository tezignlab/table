import * as React from 'react';
import {Animated, Easing, View} from 'react-native';
import tailwind from "tailwind-rn";
import * as Icons from "react-native-heroicons/solid";

export function Spin() {
    const spinValue = React.useRef(new Animated.Value(0)).current;

    const spinning = () => {
        spinValue.setValue(0);
        // @ts-ignore
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(spinning);
    }

    React.useEffect(() => {
        spinning();
    }, []);

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={{
                transform: [{
                    rotate: rotate,
                }],
            }}
        >
            <View style={tailwind(`w-full items-center py-8`)}>
                <Icons.SunIcon size={30} color="black"/>
            </View>
        </Animated.View>
    )
}