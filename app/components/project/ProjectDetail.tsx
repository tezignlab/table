import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, useWindowDimensions, Text, View } from 'react-native';
import tailwind from "tailwind-rn";
import { TProjectDetail } from "../../hooks/useProject";
import * as Icons from "react-native-heroicons/solid";
import http from "../../services/http";
import Tips from "../../services/tips";
import useIdentity from "../../hooks/useIdentity";
import SelectCollections from "./SelectCollections";
import { BottomModal, BottomModalHandler } from "../BottomModal";
import { UserContext } from "../../context/UserContext";
import Images from "../../utils/images";
import { AutoHeightWebView } from '../AutoHeightWebView';
import { ProjectTag } from './ProjectTag';
import { CommonActions, useNavigation } from '@react-navigation/core';
import { SafeAreaView } from '../SafeAreaView';
import { LocaleContext } from '../../context/LocaleContext';


const formattedHTML = (origin: string, content: string) => {
    if (origin == 'digitaling') {
        return content.split(`"https://file.digitaling.com/images/common/loadimg.gif" data-original=`).join('')
    }
    return content;
};

export function ProjectDetail({ project }: { project: TProjectDetail }) {

    const { height } = useWindowDimensions();

    const navigation = useNavigation();

    const [showMore, setShowMore] = useState(false);

    const { id, is_like, is_collect, title, content = '', author = { name: '', avatar: '' }, origin, publish_time, tags, baidu_tags } = project;
    const { isLogin } = useContext(UserContext)
    const { goLogin } = useIdentity()

    const [isLike, setIsLike] = useState(false);
    const [isCollected, setIsCollected] = useState(false);
    // const [showCollectionsModal, setShowCollectionsModal] = useState(false);
    const bottomModalRef = React.useRef<BottomModalHandler>(null);
    const { translate } = React.useContext(LocaleContext)

    useEffect(() => {
        setIsLike(is_like)
        setIsCollected(is_collect)
    }, [project])

    const onLike = () => {
        if (isLogin) {
            if (isLike) {
                http.delete(`/api/nd/v1/project/like/${id}`)
                    .then(() => setIsLike(false))
                    .catch(e => Tips.error('Error', e))
            } else {
                http.put(`/api/nd/v1/project/like/${id}`)
                    .then(() => setIsLike(true))
                    .catch(() => { })
            }
        } else {
            goLogin()
        }
    };

    const setModalVisible = (visible: boolean) => {
        visible && bottomModalRef != null ? bottomModalRef.current?.show() : bottomModalRef.current?.hide()
    }

    const jumpToSearch = (keyword: string) => navigation.dispatch(CommonActions.navigate('Search', { keyword }))

    return (
        <ScrollView style={tailwind(`w-full h-full`)}>
            <View style={tailwind(`px-4 mb-4`)}>
                <Text style={tailwind(`font-bold text-xl my-4`)}>{title}</Text>
                <View style={tailwind(`flex flex-col mb-2`)}>
                    <View style={tailwind(`flex-row items-center`)}>
                        <Image source={Images.wrap(author.avatar)} style={tailwind(`w-6 h-6 rounded-full bg-gray-200`)} />
                        <Text style={tailwind(`ml-2 text-base text-gray-500 text-sm`)}>{author.name}</Text>
                    </View>
                    <View style={tailwind(`flex-row items-center mt-2`)}>
                        <Text style={tailwind(`text-base text-gray-400 text-sm`)}>{origin}</Text>
                        <Text style={tailwind(`ml-2 text-base text-gray-400 text-sm`)}>{publish_time !== 0 && new Date(publish_time).toISOString().slice(0, 10)}</Text>
                    </View>
                </View>
            </View>

            <AutoHeightWebView html={formattedHTML(origin, content)} onLoaded={() => setShowMore(true)} />

            {
                showMore && <>
                    <View style={tailwind(`flex-row my-8 justify-center items-center`)}>
                        <TouchableOpacity onPress={onLike} style={tailwind(`flex-row items-center px-4 py-2 rounded-md ${isLike ? 'bg-red-400' : 'bg-gray-900'}`)}>
                            <Icons.HeartIcon size={20} color={'white'} style={tailwind(``)} />
                            <Text style={tailwind(`ml-2 text-white`)}>{translate('like')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => isLogin ? bottomModalRef.current?.show() : goLogin()} style={tailwind(`flex-row items-center px-4 py-2 rounded-md ml-2 ${isCollected ? 'bg-blue-400' : 'bg-gray-900'}`)}>
                            <Icons.StarIcon size={20} color={'white'} style={tailwind(``)} />
                            <Text style={tailwind(`ml-2 text-white`)}>{translate('collect')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={tailwind(`w-full border-t border-gray-300 my-2 py-4 px-2 flex-col`)} >
                        <Text style={tailwind(`font-bold text-lg`)}>{translate('tags')}</Text>
                        <View style={{ ...tailwind(`mt-2 flex flex-row flex-wrap bg-white`) }}>
                            {
                                tags.map((item, index) => <ProjectTag key={index} name={item} onPress={() => jumpToSearch(item)} />)
                            }
                        </View>
                    </View>
                </>
            }

            <BottomModal ref={bottomModalRef}>
                <SafeAreaView
                    style={{ ...tailwind(`w-full bg-white rounded-t-xl`), height: Math.floor(height / 5 * 3) }}>
                    <Text style={tailwind(`py-4 font-medium text-center `)}>
                        选择收藏夹
                    </Text>
                    <SelectCollections shot_id={id} setShotCollectStatus={(id, collected) => setIsCollected(collected)} setModalVisible={setModalVisible} />
                </SafeAreaView>
            </BottomModal>

        </ScrollView>
    )
}

