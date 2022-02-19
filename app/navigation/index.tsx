/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ColorSchemeName } from 'react-native';
import LinkingConfiguration from './LinkingConfiguration';
import { navigationRef } from './root';
import { UserContext } from "../context/UserContext";
import useUser from "../hooks/useUser";
import { RootNavigator } from './RootNavigator';
import { LocaleContext } from '../context/LocaleContext';
import useTranslate from '../hooks/useTranslate';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    const { ...user } = useUser()
    const { ...translate } = useTranslate()

    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            ref={navigationRef}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <LocaleContext.Provider value={{ ...translate }}>
                <UserContext.Provider value={{ ...user }}>
                    <RootNavigator />
                </UserContext.Provider>
            </LocaleContext.Provider>
        </NavigationContainer>
    );
}
