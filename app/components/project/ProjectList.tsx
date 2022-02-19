import * as React from 'react';
import {
    View,
    RefreshControl,
    VirtualizedList
} from 'react-native';

import { TProject } from "../../hooks/useProject";
import { useProjects, ProjectListProps } from '../../hooks/useProjects';
import tailwind from "tailwind-rn";
import { BottomModalHandler } from "../BottomModal";
import { useNavigation } from "@react-navigation/core";
import { LoadingIndicator } from '../LoadingIndicator';
import { ProjectCard } from './ProjectCard';


export function ProjectList({ mode = 'latest', skip = 0, limit = 20, value = ''}: ProjectListProps) {
    const { pagedProject, refresh, loadMore, refreshing, loading } = useProjects({ mode, limit, value});
    const navigation = useNavigation();

    let refFlatList = React.useRef<VirtualizedList<TProject>>(null);
    const bottomModalRef = React.useRef<BottomModalHandler>(null);

    React.useEffect(() => {
        if (pagedProject.data.length > 0) {
            refFlatList?.current?.scrollToIndex({ animated: true, index: 0 });
            refresh()
        }
    }, [value])

    const goDetail = (id: string) => navigation.navigate('ProjectDetail', { id });

    const renderItem = ({ item }: { item: TProject }) => <ProjectCard project={item} goDetail={goDetail} />

    return (
        <>
            <VirtualizedList
                ref={refFlatList}
                data={pagedProject.data}
                getItem={(data, index) => data[index]}
                getItemCount={(data) => data.length}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={tailwind(`flex-1 pt-4 pb-2`)}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
                ListFooterComponent={loading ? <LoadingIndicator /> : <View style={tailwind(`h-4 w-full`)} />}
                onScroll={({ nativeEvent: { contentOffset, contentSize, layoutMeasurement } }) => {
                    const paddingToBottom = 10;
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                        loadMore()
                    }
                }}
                scrollEventThrottle={100}
            />
          
        </>
    )
};
