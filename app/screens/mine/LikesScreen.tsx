import * as React from 'react';
import { useContext } from 'react';

import { View } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from "../../navigation/types";
import { ProjectList } from "../../components/project/ProjectList";
import { UserContext } from "../../context/UserContext";

export function LikesScreen({ route }: RootStackScreenProps<'Likes'>) {

    const { user } = useContext(UserContext)

    return (
        <View style={tailwind(`bg-white h-full`)}>
            <ProjectList mode='likes' value={user.id} />
        </View>
    );

}
