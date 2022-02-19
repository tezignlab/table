import * as React from 'react';

import { View } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from "../../navigation/types";
import { ProjectList } from "../../components/project/ProjectList";

export function ViewsScreen({ }: RootStackScreenProps<'Views'>) {

    return (
        <View style={tailwind(`bg-white h-full`)}>
            <ProjectList mode='views' />
        </View>
    );

}
