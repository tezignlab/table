/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/hello-react-navigation
 */
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SettingsScreen } from "../screens/mine/SettingScreen";
import { CollectionsScreen } from "../screens/mine/CollectionsScreen";
import { LikesScreen } from "../screens/mine/LikesScreen";
import { ViewsScreen } from "../screens/mine/ViewsScreen";
import { CollectedProjectsScreen } from "../screens/mine/CollectedProjectsScreen";
import { CollectionCreateScreen } from "../screens/mine/CollectionCreateScreen";
import { InspirationsScreen } from '../screens/inspiration/InspirationsScreen';
import { InspirationCreateScreen } from '../screens/inspiration/InspirationCreateScreen';
import { AboutScreen } from '../screens/setting/AboutScreen';
import { ReportScreen } from '../screens/setting/ReportScreen';
import { useNavigation } from "@react-navigation/core";
import { NotFoundScreen } from '../screens/NotFoundScreen';
import { ProjectScreen } from '../screens/project/ProjectScreen';
import * as OutlineIcons from "react-native-heroicons/outline";

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { RootStackParamList } from './types';

import { getColor } from 'tailwind-rn';
import { BottomTabNavigator } from './BottomTabNavigator';
import { Pressable } from 'react-native';
import { LanguageScreen } from '../screens/setting/LanguageScreen';
import { LocaleContext } from '../context/LocaleContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    const { translate } = React.useContext(LocaleContext)
    const navigation = useNavigation();
    const CommonHeaderOptions = { headerBackTitleVisible: false, headerTintColor: getColor('gray-800') };
    const AddCollection = () => <OutlineIcons.PlusIcon size={24} color={getColor('gray-800')} onPress={() => navigation.navigate('CollectionCreate')} />
    const AddInspiration = () => <OutlineIcons.PlusIcon size={24} color={getColor('gray-800')}  onPress={() => navigation.navigate('InspirationCreate', { inspiration: null })} />

    return (
        <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="ProjectDetail" component={ProjectScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Report" component={ReportScreen} options={{ ...CommonHeaderOptions, title: '', headerTitleAlign: 'center', }} initialParams={{ header: '', title: '' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ ...CommonHeaderOptions, title: translate('signIn'), headerTitleAlign: 'center', }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ ...CommonHeaderOptions, title: translate('signUp'), headerTitleAlign: 'center', }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ ...CommonHeaderOptions, title: translate('setting'), headerTitleAlign: 'center', }} />
            <Stack.Screen name="Language" component={LanguageScreen} options={{ ...CommonHeaderOptions, title: '', headerTitleAlign: 'center', }} />
            <Stack.Group>
                <Stack.Screen name="Collections" component={CollectionsScreen} options={{ ...CommonHeaderOptions, title: translate('myCollections'), headerTitleAlign: 'center', headerRight: AddCollection, }} />
                <Stack.Screen name="CollectedProjects" component={CollectedProjectsScreen} options={({navigation, route}) => ({ ...CommonHeaderOptions, title: '', headerRight: () => <Pressable onPress={() => navigation.setParams({ n: route.params.n + 1 })}><OutlineIcons.DotsHorizontalIcon size={24} color={getColor('gray-800')} /></Pressable> })} initialParams={{ n: 0 }} />
                <Stack.Screen name="CollectionCreate" component={CollectionCreateScreen} options={{ ...CommonHeaderOptions, title: translate('createNewCollection'), headerTitleAlign: 'center', }} />
            </Stack.Group>
            <Stack.Screen name="Likes" component={LikesScreen} options={{ ...CommonHeaderOptions, title: translate('myLikes'), headerTitleAlign: 'center', }} />
            <Stack.Screen name="Views" component={ViewsScreen} options={{ ...CommonHeaderOptions, title: translate('browsingHistory'), headerTitleAlign: 'center', }} />
            <Stack.Screen name="Inspiration" component={InspirationsScreen} options={{ ...CommonHeaderOptions, title: translate('inspiration'), headerTitleAlign: 'center', headerRight: AddInspiration }} />
            <Stack.Screen name="InspirationCreate" component={InspirationCreateScreen} options={{ headerShown: false }} />
            <Stack.Screen name="About" component={AboutScreen} options={{ ...CommonHeaderOptions, title: translate('about'), headerTitleAlign: 'center', }} />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: '404' }} />
        </Stack.Navigator>
    );
}