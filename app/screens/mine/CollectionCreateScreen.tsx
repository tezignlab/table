import * as React from 'react';
import { useState } from 'react';

import { TouchableOpacity } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from "../../navigation/types";
import { CTextInput } from "../../components/TextInput";
import { Text, View } from "../../components/Themed";
import http from "../../services/http";
import Tips from "../../services/tips";
import { LocaleContext } from '../../context/LocaleContext';

type TEInfo = {
    msg: string;
}

type TErrorInfo = {
    name?: TEInfo;
}

function validateInput({ name }: { name: string }) {
    const errorInfo: TErrorInfo = {};
    if (!name) {
        errorInfo.name = {
            msg: '请输入标题',
        };
    }
    return {
        errorInfo,
        pass: Object.keys(errorInfo).length === 0
    };
}

export function CollectionCreateScreen({ navigation }: RootStackScreenProps<'CollectionCreate'>) {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [errorInfo, setErrorInfo] = React.useState<TErrorInfo>({});
    const { translate } = React.useContext(LocaleContext)

    const createCollection = () => {
        const { errorInfo, pass } = validateInput({
            name,
        });
        setErrorInfo(errorInfo);
        if (!pass) return;
        http.post(`/api/nd/v1/project/collection`, { name, desc }).then(navigation.goBack).catch(e => Tips.error('Error', e))
    }

    return (
        <View style={tailwind(`bg-white h-full`)}>

            <View style={tailwind(`flex flex-col w-full px-8 mt-4`)}>
                <CTextInput name={translate('title')} placeholder={translate('title')} value={name} handleChange={setName} errorMsg={errorInfo.name?.msg} />
                <CTextInput name={translate('introduction')} placeholder={translate('optional')} value={desc} handleChange={setDesc} numberOfLines={3} />
                <TouchableOpacity onPress={createCollection}>
                    <View style={tailwind(`w-full rounded-md bg-gray-800 mt-12`)}>
                        <Text style={tailwind(`text-center text-white py-4`)}>完成</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    );

}
