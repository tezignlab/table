import * as React from 'react';
import { useEffect, useRef } from 'react';

import { Alert, Text, TouchableOpacity, View } from 'react-native';
import tailwind, { getColor } from 'tailwind-rn';
import { RootStackScreenProps } from "../../navigation/types";
import http from "../../services/http";
import Tips from "../../services/tips";
import { ProjectList } from "../../components/project/ProjectList";
import { BottomModal, BottomModalHandler } from "../../components/BottomModal";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from '../../components/SafeAreaView';
import * as Icons from "react-native-heroicons/solid";
import { LocaleContext } from '../../context/LocaleContext';

export function CollectedProjectsScreen({ navigation, route }: RootStackScreenProps<'CollectedProjects'>) {

    const bottomModalRef = useRef<BottomModalHandler>(null);
    const { translate } = React.useContext(LocaleContext)

    useEffect(() => {
        navigation.setOptions({ title: route.params.collection.name })
    }, [])

    useEffect(() => {
       route.params.n > 0 && bottomModalRef.current?.show()
    }, [route.params.n])

    const handleDeleteCollection = () => {
        Alert.alert('确定删除收藏夹吗？', undefined, [
            { text: translate('cancle'), style: 'cancel' },
            {
                text: translate('ok'), onPress: () => {
                    http.delete(`/api/v1/project/collection/${route.params.collection.id}`).then(() => {
                        navigation.goBack()
                    }).catch(e => Tips.error('Error', e))
                }
            }
        ])
    }

    return (
        <View style={tailwind(`bg-white h-full`)}>
            <ProjectList mode='collection' value={route.params.collection.id} />
            <BottomModal ref={bottomModalRef}>
                <SafeAreaView style={{ ...tailwind(`w-full bg-white rounded-t-xl`) }}>
                    <View style={tailwind(`flex-row p-4 bg-gray-100 rounded-t-xl`)}>
                        <TouchableOpacity style={tailwind(`flex-col`)} onPress={() => {
                            Clipboard.setString(`https://naodong.io/collections/${route.params.collection.id}`)
                            bottomModalRef.current?.hide()
                            Tips.success(translate('copySuccess'))
                        }}>
                            <View style={tailwind(`bg-white p-2 rounded-md items-center justify-center`)}>
                                <Icons.LinkIcon size={32} style={tailwind(`text-gray-800`)} />
                                <Text style={tailwind(`text-gray-800 mt-2 text-xs font-medium`)}>{translate('copyLink')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={tailwind(`flex-col ml-6`)} onPress={handleDeleteCollection}>
                            <View style={tailwind(`bg-white p-2 rounded-md items-center justify-center`)}>
                                <Icons.TrashIcon size={32} color={getColor('red-600')} />
                                <Text style={tailwind(`text-red-600 mt-2 text-xs font-medium`)}>{translate('delete')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </BottomModal>
        </View>
    );

}
