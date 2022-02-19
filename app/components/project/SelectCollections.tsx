import * as React from 'react';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { TCollection } from '../../hooks/useCollections';
import tailwind from "tailwind-rn";
import { Styles } from "../../utils/styles";
import http from "../../services/http";
import Tips from "../../services/tips";
import { useNavigation } from "@react-navigation/core";
import * as Icons from "react-native-heroicons/solid";
import { LocaleContext } from '../../context/LocaleContext';


function CollectionOption({ shot_id, collection, setCollectionStatus }: { shot_id: string, collection: TCollection & { is_collect: boolean }, setCollectionStatus: (collection_id: string, is_collect: boolean) => void }) {

    const [isCollect, setIsCollect] = useState(collection.is_collect)
    
    const doCollect = () => {
        if (isCollect) {
            http.delete(`/api/nd/v1/project/${shot_id}/collect/${collection.id}`, {}).then(() => {
                setIsCollect(false)
                setCollectionStatus(collection.id, false)
            }).catch(e => Tips.error('Error', e))
        } else {
            http.post(`/api/nd/v1/project/${shot_id}/collect/${collection.id}`, {}).then(() => {
                setIsCollect(true)
                setCollectionStatus(collection.id, true)
            }).catch(e => Tips.error('Error', e))
        }
    }

    return <TouchableOpacity onPress={doCollect} style={{ ...tailwind(` bg-white my-2 p-4 rounded-md mx-4`), ...Styles.cardShadow() }}>
        <View style={tailwind(`flex-row justify-between items-center`)}>
            <Text style={tailwind(`text-base font-medium`)}>{collection.name}</Text>
            <Icons.CheckCircleIcon size={24} color={isCollect ? '#34D399' : '#9CA3AF'} />
        </View>
    </TouchableOpacity>
}

export default function SelectCollections({ shot_id, setShotCollectStatus, setModalVisible }: {
    shot_id: string,
    setShotCollectStatus: (shot_id: string, is_collect: boolean) => void,
    setModalVisible: (visible: boolean) => void
}) {
    const [collections, setCollections] = useState<(TCollection & { is_collect: boolean })[]>([])
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const { translate } = React.useContext(LocaleContext)
    let collectionsStatus: { [key: string]: boolean } = {}

    useEffect(() => {
        setLoading(true)
        http.get(`/api/nd/v1/project/${shot_id}/collections`).then(data => {
            setCollections(data);
            setLoading(false)
            collectionsStatus = Object.fromEntries(new Map(data.map((item: TCollection & { is_collect: boolean }) => [item.id, item.is_collect])))
        }).catch(err => console.log(err))
    }, [shot_id])

    const setCollectionStatus = (collection_id: string, is_collect: boolean) => {
        collectionsStatus[collection_id] = is_collect;
        setShotCollectStatus(shot_id, Object.values(collectionsStatus).reduce((a, b) => a || b, false))
    }

    return <ScrollView style={[tailwind(`py-2 h-64`)]}>

        {
            loading ? <View style={tailwind(`flex-col items-center justify-center`)}>
                <ActivityIndicator color="black" />
            </View> : <>
                {
                    collections.length > 0 ? collections.map((item, index) => <CollectionOption shot_id={shot_id} collection={item} key={index} setCollectionStatus={setCollectionStatus} />) :
                        <View style={tailwind(`flex-col items-center justify-center`)}>
                            <Text>{translate('noCollection')}</Text>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false)
                                navigation.navigate('CollectionCreate')
                            }}>
                                <View style={tailwind(`flex-row rounded-md border border-gray-900 mt-4 items-center py-2 px-4`)}>
                                    <Icons.PlusIcon size={24} color="black" />
                                    <Text style={tailwind(`text-center`)}>{translate('createNewCollection')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                }
            </>
        }


    </ScrollView>
}