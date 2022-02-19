import * as React from 'react';

import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from "../../navigation/types";
import { View } from "../../components/Themed";
import { useContext } from "react";
import { LocaleContext } from '../../context/LocaleContext';
import { Pressable, Text } from 'react-native';
import { CheckIcon } from "react-native-heroicons/outline";

export function LanguageScreen({ navigation }: RootStackScreenProps<'Language'>) {

    const { locale, setLocale } = useContext(LocaleContext)

    return (
        <View style={tailwind(`bg-transparent`)}>
            <View style={tailwind(`w-full bg-white`)}>
                <Pressable onPress={() => locale != 'en' && setLocale('en') && navigation.goBack()} style={tailwind(`w-full flex flex-row justify-between items-center px-4 py-3`)}>
                    <Text>English</Text>
                    {
                        locale === 'en' && <CheckIcon size={16} color="black" />
                    }
                </Pressable>
                <Pressable onPress={() => locale != 'zh' && setLocale('zh') && navigation.goBack()} style={tailwind(`w-full flex flex-row justify-between items-center px-4 py-3 border-t border-gray-200`)}>
                    <Text>简体中文</Text>
                    {
                        locale === 'zh' && <CheckIcon size={16} color="black" />
                    }
                </Pressable>
            </View>
        </View>
    );
}
