import * as React from 'react';
import { useEffect } from 'react';

import { ScrollView } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from "../../navigation/types";
import useCollections from "../../hooks/useCollections";
import { CollectionCard } from "../../components/project/CollectionCard";
import { useIsFocused } from "@react-navigation/native";


export function CollectionsScreen({ route }: RootStackScreenProps<'Collections'>) {
    const isFocused = useIsFocused();

    const { collections, reloadCollections } = useCollections('default', route.params.value);

    useEffect(() => {
        if (isFocused) {
            reloadCollections()
        }
    }, [isFocused])

    return (
        <ScrollView style={tailwind(`py-4 mb-8`)}>
            {
                collections.map((item, index) => <CollectionCard collection={item} key={index} />)
            }
        </ScrollView>
    );

}
