import * as React from 'react';
import { useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import { RootTabScreenProps } from '../../navigation/types';
import tailwind from 'tailwind-rn';
import { NavigationState, Route, SceneRendererProps } from "react-native-tab-view/lib/typescript/types";
import { ProjectList } from "../../components/project/ProjectList";
import { SafeAreaView } from '../../components/SafeAreaView';
import { LocaleContext } from '../../context/LocaleContext';


export function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
    const { translate } = React.useContext(LocaleContext)
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);

    const DefaultTabBar = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => <TabBar
        {...props}
        activeColor={'#111827'}
        inactiveColor={'#9CA3AF'}
        indicatorStyle={[tailwind(`bg-black`), { width: 120, left: layout.width / 2 - 120 }]}
        labelStyle={[tailwind(`font-medium text-base border-0`)]}
        style={{ ...tailwind(`bg-white`) }}
        tabStyle={[{ width: 120 }]}
        contentContainerStyle={[tailwind(`justify-center border-0`)]}
    />

    const renderHomeScene = useMemo(() => SceneMap({
        latest: () => <ProjectList mode='latest' />,
        recommend: () => <ProjectList mode='recommend' />,
    }), [])


    return (
        <View style={tailwind(`bg-white w-full flex-1`)}>
            <SafeAreaView style={tailwind(`w-full flex-1`)}>
                <TabView
                    renderTabBar={DefaultTabBar}
                    navigationState={{
                        index, routes: [
                            { key: 'latest', title: translate('latest') },
                            { key: 'recommend', title: translate('discover') }
                        ]
                    }}
                    renderScene={renderHomeScene}
                    onIndexChange={setIndex}
                />
            </SafeAreaView>
        </View>
    );
}
