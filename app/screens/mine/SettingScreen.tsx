import * as React from 'react';

import { Alert } from 'react-native';
import tailwind, { getColor } from 'tailwind-rn';
import { LineActions } from "../../components/mine/LineActions";
import { SingleAction } from "../../components/mine/SingleAction";
import { RootStackScreenProps } from "../../navigation/types";
import { View } from "../../components/Themed";
import useIdentity from "../../hooks/useIdentity";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { InformationCircleIcon, ChatIcon, TranslateIcon } from "react-native-heroicons/outline";
import { LocaleContext } from '../../context/LocaleContext';

export function SettingsScreen({ navigation, route }: RootStackScreenProps<'Settings'>) {

    const { isLogin } = useContext(UserContext)
    const { translate } = useContext(LocaleContext)
    const { logout } = useIdentity()

    const handleLogout = React.useCallback(() => {
        Alert.alert(
            "确定退出当前账号？",
            undefined,
            [
                {
                    text: translate('cancle'),
                    style: 'cancel'
                },
                {
                    text: translate('ok'),
                    onPress: logout
                }
            ]
        )
    }, []);

    return (
        <View style={tailwind(`bg-transparent`)}>

            <View style={tailwind(`h-4 bg-transparent`)} />

            <LineActions actions={[{
                icon: <TranslateIcon size={22} color="black" />,
                name: translate('lang'),
                onPress: () => navigation.navigate('Language'),
            }, {
                icon: <ChatIcon size={22} color="black" />,
                name: translate('feedback'),
                onPress: () => navigation.navigate('Report', { header: '帮助与反馈', title: '如果您有好的意见与反馈，请及时给我们留言！' }),
            }, {
                icon: <InformationCircleIcon size={22} color={getColor('gray-700')} />,
                name: translate('about'),
                onPress: () => navigation.navigate('About'),
            },]} />

            {
                isLogin && <SingleAction name={translate('signOut')} onPress={handleLogout} />
            }

        </View>
    );
}
