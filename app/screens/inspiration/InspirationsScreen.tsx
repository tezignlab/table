import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Pressable, Text, View, RefreshControl } from 'react-native';
import tailwind from 'tailwind-rn';
import { RootStackScreenProps } from '../../navigation/types';
import { InspirationCard } from '../../components/InspirationCard';
import http from '../../services/http';
import { ImagesPreview } from "../../components/ImagesPreview";
import { useIsFocused } from "@react-navigation/native";
import useInspirations, { TInspiration } from "../../hooks/useInspirations";
import { BottomModal, BottomModalHandler } from "../../components/BottomModal";
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { SafeAreaView } from '../../components/SafeAreaView';
import { LocaleContext } from '../../context/LocaleContext';

export function InspirationsScreen({ navigation }: RootStackScreenProps<'Inspiration'>) {
    const [showImagesPreview, setShowImagesPreview] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [currentItem, setCurrentItem] = useState<TInspiration | null>(null);
    const isFocused = useIsFocused();
    const bottomModalRef = useRef<BottomModalHandler>(null);
    const { translate } = React.useContext(LocaleContext)

    const { items, loadMore, loading, refresh, refreshing, deleteItem } = useInspirations({ limit: 20 });

    useEffect(() => {
        isFocused && refresh()
    }, [isFocused])

    // 删除
    function onDeleteItem() {
        currentItem != null && http.delete(`/api/v1/inspiration/${currentItem?.id}`).then(() => {
            deleteItem(currentItem?.id)
        })
    }

    // 图片预览
    function onPreviewImages(images: string[], index: number) {
        setPreviewImages(images)
        setPreviewIndex(index)
        setShowImagesPreview(true);
    }

    // 显示操作
    function onShowInspirationActions(inspiration: TInspiration) {
        setCurrentItem(inspiration)
        bottomModalRef != null && bottomModalRef.current?.show()
    }

    const renderItem = ({ item }: { item: TInspiration }) => <InspirationCard item={item} showActionSheet={onShowInspirationActions} handleImagesPreview={onPreviewImages} />

    return (

        <View style={tailwind(`w-full h-full bg-white`)}>

            <FlatList data={items.data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={tailwind(`flex-1`)}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
                ListHeaderComponent={<View style={tailwind(`h-4 w-full`)} />}
                ListFooterComponent={loading ? <LoadingIndicator /> : <View style={tailwind(`h-8 w-full`)} />}
                onScroll={({ nativeEvent: { contentOffset, contentSize, layoutMeasurement } }) => {
                    const paddingToBottom = 10;
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                        loadMore()
                    }
                }}
                scrollEventThrottle={100}
            />

            <BottomModal ref={bottomModalRef}>
                <SafeAreaView style={{ ...tailwind(`w-full bg-white rounded-t-xl flex-grow`) }}>
                    <Pressable style={tailwind(`w-full`)} onPress={() => {
                        bottomModalRef != null && bottomModalRef.current?.hide()
                        navigation.navigate('InspirationCreate', { inspiration: currentItem })
                    }}>
                        <Text style={tailwind(`text-center py-4 text-base font-medium text-blue-500`)}>{translate('edit')}</Text>
                    </Pressable>

                    <Pressable style={tailwind(`w-full border-t border-gray-200`)} onPress={() => {
                        bottomModalRef != null && bottomModalRef.current?.hide()
                        onDeleteItem()
                    }}>
                        <Text style={tailwind(`text-center py-4 text-base font-medium text-red-500`)}>{translate('delete')}</Text>
                    </Pressable>
                </SafeAreaView>
            </BottomModal>

            <ImagesPreview visible={showImagesPreview} setVisible={setShowImagesPreview} images={previewImages} initIndex={previewIndex} />
        </View>

    );
}
