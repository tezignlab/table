import * as React from 'react';
import { Image, Text, Pressable, View } from 'react-native';

import { TProject } from '../../hooks/useProject';
import tailwind from "tailwind-rn";
import Images from "../../utils/images";
import { Styles } from '../../utils/styles';

type TProjectCardProps = {
    project: TProject;
    goDetail: (id: string) => void;
}

export function ProjectCard({ project, goDetail }: TProjectCardProps) {

    const { id, author, cover } = project;

    return (
        <View style={[tailwind(`mx-4 mb-6`)]}>
            <View style={[tailwind(`flex flex-col bg-white rounded-md`), Styles.cardShadow()]}>
                <View style={tailwind(`w-full`)}>
                    <Pressable onPress={() => goDetail(id)}>
                        <Image source={Images.wrap(cover)} style={tailwind(`w-full rounded-t-md bg-gray-200 h-48`)} />
                    </Pressable>
                </View>
                <View style={tailwind(`p-2 w-full flex-row justify-between`)}>
                    <View style={tailwind(`flex-1`)}>
                        <Pressable onPress={() => goDetail(id)}>
                            <Text style={tailwind(`text-sm font-medium`)} numberOfLines={1}>{project.title}</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={tailwind(`px-2 pb-2 flex flex-row items-center`)}>
                    <Image source={Images.wrap(author.avatar)} style={tailwind(`w-6 h-6 rounded-full bg-gray-200`)} />
                    <Text style={tailwind(`ml-2 text-sm text-gray-500`)}>{author.name}</Text>
                </View>
            </View>
        </View>
    )
}