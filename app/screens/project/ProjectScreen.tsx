import * as React from 'react';
import { useRef } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import { Text, View } from '../../components/Themed';

import { RootStackScreenProps } from '../../navigation/types';
import { useProject } from '../../hooks/useProject';
import tailwind from "tailwind-rn";
import { ProjectDetail } from "../../components/project/ProjectDetail";
import { BottomModal, BottomModalHandler } from "../../components/BottomModal";
import * as Clipboard from 'expo-clipboard';
import Tips from "../../services/tips";
import { SafeAreaView } from '../../components/SafeAreaView';
import * as Icons from "react-native-heroicons/outline";
import { LocaleContext } from '../../context/LocaleContext';
import { HOST } from '../../services/http';

export function ProjectScreen({ navigation, route }: RootStackScreenProps<'ProjectDetail'>) {
    const { project, loading } = useProject(route.params.id);
    const { translate } = React.useContext(LocaleContext)

    const bottomModalRef = useRef<BottomModalHandler>(null);

    return (
        <View style={tailwind(`bg-white w-full h-full`)}>
            <SafeAreaView style={tailwind(`w-full h-full`)}>
                {
                    loading ? <View style={tailwind(`flex-1 pt-32 items-center`)}>
                        <ActivityIndicator size="large" color="black" />
                    </View> : <>
                        <View style={tailwind(`flex flex-row items-center justify-between py-2 border-b border-gray-200`)}>
                            <View style={tailwind(`ml-4`)}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Icons.XIcon size={26} color="#1F2937" />
                                </TouchableOpacity>
                            </View>
                            <View style={tailwind(``)}>
                                <Text style={tailwind(`text-base font-medium text-gray-900`)}>{project.author.name}</Text>
                            </View>
                            <View style={tailwind(`mr-4`)}>
                                <TouchableOpacity onPress={() => bottomModalRef != null && bottomModalRef.current?.show()}>
                                    <Icons.DotsHorizontalIcon size={26} color="#1F2937" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ProjectDetail project={project} />
                    </>
                }
            </SafeAreaView>

            <BottomModal ref={bottomModalRef}>
                <SafeAreaView style={{ ...tailwind(`w-full bg-white rounded-t-xl`) }}>
                    <View style={tailwind(`flex-row p-4 bg-gray-100 rounded-t-xl`)}>
                        <TouchableOpacity style={tailwind(`flex-col`)} onPress={() => {
                            Clipboard.setString(`${HOST}/project/${project.id}`)
                            bottomModalRef != null && bottomModalRef.current?.hide()
                            Tips.success(translate('copySuccess'))
                        }}>
                            <View style={tailwind(`bg-white p-2 rounded-md items-center justify-center`)}>
                                <Icons.LinkIcon size={32} style={tailwind(`text-gray-800`)} />
                                <Text style={tailwind(`text-gray-800 mt-2 text-xs font-medium`)}>{translate('copyLink')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={tailwind(`flex-col ml-6`)} onPress={() => {
                            bottomModalRef != null && bottomModalRef.current?.hide()
                            navigation.navigate('Report', { header: translate('report'), title: `${translate('report')}: ${project.title}` })
                        }}>
                            <View style={tailwind(`bg-white p-2 rounded-md items-center justify-center`)}>
                                <Icons.BellIcon size={32} style={tailwind(`text-gray-800`)} />
                                <Text style={tailwind(`text-gray-800 mt-2 text-xs font-medium`)}>{translate('reportContent')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </BottomModal>

        </View>

    );
}
