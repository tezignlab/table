/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
import * as React from 'react';
import { HomeStackParamList, RootTabParamList } from './types';
import * as SolidIcons from "react-native-heroicons/solid";
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home';
import { SearchScreen } from '../screens/search';
import { MineScreen } from '../screens/mine/MineScreen';
import { InspirationCreateScreen } from '../screens/inspiration/InspirationCreateScreen';
import tailwind, { getColor } from 'tailwind-rn';
import { Platform } from 'react-native';
import { LocaleContext } from '../context/LocaleContext';

const BottomTab = createBottomTabNavigator<RootTabParamList & HomeStackParamList>();

export function BottomTabNavigator() {

    const { translate } = React.useContext(LocaleContext)

    const screenOptions: BottomTabNavigationOptions = Platform.OS === 'ios' ? {
        tabBarActiveTintColor: getColor('blue-500'),
    } : {
        tabBarActiveTintColor: getColor('blue-500'),
        tabBarLabelStyle: tailwind(`mb-2`),
        tabBarItemStyle: tailwind(`py-2`),
        tabBarStyle: [tailwind(``), {height: 64}],
    }

    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={screenOptions}>
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: translate('home'),
                    headerShown: false,
                    tabBarIcon: ({ color }) => <SolidIcons.HomeIcon size={28} color={color} />
                }}
            />
            <BottomTab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarLabel: translate('search'),
                    headerShown: false,
                    tabBarIcon: ({ color }) => <SolidIcons.SearchCircleIcon size={30} color={color} />,
                }}
                initialParams={{ keyword: '' }}
            />
            <BottomTab.Screen
                name="InspirationCreate"
                component={InspirationCreateScreen}
                options={{
                    tabBarLabel: translate('inspiration'),
                    headerShown: false,
                    tabBarIcon: ({ color }) => <SolidIcons.PlusCircleIcon size={32} color={color} />,
                }}
                initialParams={{ inspiration: null }}
            />
            <BottomTab.Screen
                name="Mine"
                component={MineScreen}
                options={{
                    tabBarLabel: translate('mine'),
                    headerShown: false,
                    tabBarIcon: ({ color }) => <SolidIcons.UserIcon size={28} color={color} />,
                }}
                initialParams={{ login: false }}
            />
        </BottomTab.Navigator>
    );
}