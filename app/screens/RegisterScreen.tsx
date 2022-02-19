import * as React from 'react';

import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import tailwind from 'tailwind-rn';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../navigation/types';
import { CTextInput } from '../components/TextInput';
import http from "../services/http";
import Tips from "../services/tips";
import { LocaleContext } from '../context/LocaleContext';

type TEInfo = {
    msg: string;
}

type TErrorInfo = {
    username?: TEInfo;
    email?: TEInfo;
    password?: TEInfo;
}

function validateInput({ username, email, password, translate }: { username: string, email: string, password: string, translate: (word: string) => string }) {
    const errorInfo: TErrorInfo = {};
    if (!username) {
        errorInfo.username = {
            msg: translate('emptyUsername'),
        };
    }
    if (!email) {
        errorInfo.email = {
            msg: translate('emptyEmail'),
        };
    }
    if (!password) {
        errorInfo.password = {
            msg: translate('emptyPassword'),
        }
    }
    return {
        errorInfo,
        pass: Object.keys(errorInfo).length === 0
    };
}

export function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorInfo, setErrorInfo] = React.useState<TErrorInfo>({});
    const { translate } = React.useContext(LocaleContext)

    const handleRegister = () => {
        const { errorInfo, pass } = validateInput({ username, email, password, translate });
        setErrorInfo(errorInfo);
        if (!pass) return;
        http.post(`/api/v1/register`, { username, email, password, translate }).then(() => {
            Alert.alert(
                translate('signUpSuccess'),
                "",
                [
                    {
                        text: translate('signIn'),
                        onPress: navigation.goBack
                    }
                ]
            )
        }).catch(err => Tips.error(translate('signUpFail'), err));
    }

    return (
        <View style={tailwind(`h-full`)}>
            <ScrollView style={tailwind(`flex flex-col w-full p-8`)}>
                <CTextInput name={translate('username')} placeholder={''} value={username} handleChange={setUsername} errorMsg={errorInfo.username?.msg} keyboardType="default" />
                <CTextInput name={translate('email')} placeholder={''} value={email} handleChange={setEmail} errorMsg={errorInfo.email?.msg} keyboardType="email-address" />
                <CTextInput name={translate('password')} placeholder={''} value={password} handleChange={setPassword} errorMsg={errorInfo.password?.msg} secureTextEntry={true} textContentType="password" />
                <TouchableOpacity onPress={handleRegister}>
                    <View style={tailwind(`w-full rounded-md bg-gray-800 mt-4`)}>
                        <Text style={tailwind(`text-center text-white py-4`)}>{translate('signUp')}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

}