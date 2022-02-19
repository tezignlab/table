import * as React from 'react';
import { useEffect, useState } from 'react';

import { Text, View } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from "../../navigation/types";
import { CTextInput } from "../../components/TextInput";
import { CButton } from "../../components/CButton";
import Tips from "../../services/tips";
import { LocaleContext } from '../../context/LocaleContext';


export function ReportScreen({ navigation, route }: RootStackScreenProps<'Report'>) {

    const [content, setContent] = useState('');
    const { translate } = React.useContext(LocaleContext)

    useEffect(() => {
        navigation.setOptions({ title: route.params.header })
    }, [route.params])

    return (
        <View style={tailwind(`bg-white h-full`)}>

            <View style={tailwind(`flex flex-col w-full px-4 mt-4`)}>
                <View style={tailwind(`bg-gray-100 p-4 rounded-md border border-gray-200`)}>
                    <Text>{route.params.title}</Text>
                </View>
                <CTextInput name={translate('content')} value={content} handleChange={setContent} numberOfLines={3} />
                <View style={tailwind(`my-6`)} />
                <CButton disable={content.length < 1} onPress={() => Tips.successCallback(translate('submitSuccess'), translate('thanksFeedback'), navigation.goBack)}>{translate('submit')}</CButton>
            </View>

        </View>
    );

}
