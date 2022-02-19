import * as React from 'react';

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from '../navigation/types';
import { CTextInput } from '../components/TextInput';
import { HOST } from "../services/http";
import Tips from "../services/tips";
import { CButton } from "../components/CButton";
import { useNavigation } from "@react-navigation/core";
import useIdentity from "../hooks/useIdentity";
import { LocaleContext } from '../context/LocaleContext';

function NormalLogin() {

    const navigation = useNavigation()
    const { login } = useIdentity()
    const [username, handleChangeUsername] = React.useState('');
    const [password, handleChangePassword] = React.useState('');
    const { translate } = React.useContext(LocaleContext)

    const handleLogin = () => {
        fetch(HOST + `/api/v1/login`, {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: `username=${username}&password=${password}`,
        }).then(resp => {
            if (resp.status === 401) {
                return Promise.reject(resp.json())
            }
            return resp.json()
        }).then(data => {
            login(data.access_token, data.expire.toString())
        }).catch(() => Tips.error(translate('signInFailed'), translate('errorAccountOrPassword')));
    }

    return (
        <ScrollView style={tailwind(`flex flex-col w-full px-8 `)}>
            <CTextInput name={translate('account')} placeholder={translate('accountPlaceholder')} value={username} handleChange={handleChangeUsername} keyboardType="email-address" />
            <CTextInput name={translate('password')} placeholder={translate('password')} value={password} handleChange={handleChangePassword} secureTextEntry={true} textContentType="password" />
            <View style={tailwind(`w-full h-4`)}></View>
            <CButton disable={username.length < 1 || password.length < 1} onPress={handleLogin}>{translate('signIn')}</CButton>
            <View style={tailwind(`w-full mt-4 px-2 flex flex-row items-center justify-between`)}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={tailwind(``)}>{translate('createNewAccount')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}


export function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {

    return (
        <View style={tailwind(`flex-1 bg-white pt-8 h-full`)} >
            <NormalLogin />
        </View>
    );

}