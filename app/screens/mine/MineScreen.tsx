import * as React from 'react';
import { useContext, useEffect } from 'react';

import { Image, TouchableOpacity } from 'react-native';
import tailwind, { getColor } from 'tailwind-rn';
import { LineActions } from "../../components/mine/LineActions";
import { useIsFocused } from '@react-navigation/native';
import { RootTabScreenProps } from "../../navigation/types";
import { Text, View } from '../../components/Themed';
import { UserContext } from "../../context/UserContext";
import useIdentity from "../../hooks/useIdentity";
import { LightBulbIcon, CogIcon, HeartIcon, StarIcon, BookOpenIcon } from "react-native-heroicons/outline";
import Images from '../../utils/images';
import { LocaleContext } from '../../context/LocaleContext';

export function MineScreen({ navigation, route }: RootTabScreenProps<'Mine'>) {

    const isFocused = useIsFocused()
    const { isLogin, user, refreshIdentity } = useContext(UserContext)
    const { goLogin } = useIdentity()
    const { translate } = React.useContext(LocaleContext)

    useEffect(() => {
        isFocused && refreshIdentity()
    }, [isFocused])

    return (
        <View style={tailwind(`bg-transparent h-full w-full`)}>

            {
                isLogin ? <View style={tailwind(`pt-20 px-6 pb-8 flex flex-row bg-white`)}>
                    <Image style={tailwind(`w-16 h-16 rounded-md`)} source={Images.wrap(user.avatar)} />
                    <View style={tailwind(`pl-4`)}>
                        <Text style={tailwind(`text-gray-900 text-xl font-medium mb-1`)}>{user.nickname}</Text>
                        <Text style={tailwind(`text-gray-500 text-base`)}>UID: {user.username}</Text>
                    </View>
                </View> : <TouchableOpacity style={tailwind(`pt-20 px-6 pb-8 flex flex-row bg-white`)} onPress={goLogin}>
                    <Image style={tailwind(`w-16 h-16 rounded-md`)} source={require('../../assets/images/unlogin.png')} />
                    <View style={tailwind(`pl-4`)}>
                        <Text style={tailwind(`text-gray-900 text-xl font-medium mb-1`)}>{translate('clickToSignIn')}</Text>
                        <Text style={tailwind(`text-gray-500 text-base`)}>{translate('slogan')}</Text>
                    </View>
                </TouchableOpacity>
            }

            <View style={tailwind(`h-2 bg-transparent`)} />

            <LineActions actions={[{
                icon: <LightBulbIcon size={22} color={getColor('gray-700')} />,
                name: translate('inspiration'),
                onPress: () => isLogin ? navigation.navigate('Inspiration') : goLogin(),
            }]} />

            <View style={tailwind(`h-2 bg-transparent`)} />

            <LineActions actions={[{
                icon: <HeartIcon size={22} color={getColor('gray-700')} />,
                name: translate('myLikes'),
                onPress: () => isLogin ? navigation.navigate('Likes') : goLogin(),
            }, {
                icon: <StarIcon size={22} color={getColor('gray-700')} />,
                name: translate('myCollections'),
                onPress: () => isLogin ? navigation.navigate('Collections', { value: user.id }) : navigation.navigate('Login'),
            }, {
                icon: <BookOpenIcon size={22} color={getColor('gray-700')} />,
                name: translate('browsingHistory'),
                onPress: () => isLogin ? navigation.navigate('Views') : goLogin(),
            },]} />

            <View style={tailwind(`h-2 bg-transparent`)} />

            <LineActions actions={[{
                icon: <CogIcon size={22} color={getColor('gray-700')} />,
                name: translate('setting'),
                onPress: () => navigation.navigate('Settings'),
            },]} />

        </View>
    );
}
