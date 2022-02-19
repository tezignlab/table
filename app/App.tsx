import * as React from 'react';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import useNetwork from "./hooks/useNetwork";
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
    const isNetworkAvailable = useNetwork();
    const colorScheme = useColorScheme();

    React.useEffect(() => {
        if (isNetworkAvailable) {
            setTimeout(SplashScreen.hideAsync, 1500)
        } else {
            SplashScreen.preventAutoHideAsync().then(() => { })
        }
    }, [isNetworkAvailable]);

    if (!isNetworkAvailable) {
        return null;
    } else {
        return (
            <Navigation colorScheme={colorScheme} />
        );
    }
}
