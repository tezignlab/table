import * as React from 'react';
import http from '../services/http';
import { TFile, TPage } from './types';

export type TInspiration = {
    content: string;
    create_time: number;
    files: TFile[];
    id: string;
    tags: string[];
    update_time: number;
}

export default function useInspirations({limit = 20}: { limit: number; }) {
    const [skip, setSkip] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [items, setItems] = React.useState<TPage<TInspiration>>({
        has_more: false,
        limit,
        data: [],
        skip,
        total: 0,
    });

    const deleteItem = (id: string) => {
        let array = [...items.data]
        array.splice(array.findIndex((item)=> item.id === id), 1)
        setItems({
            ...items,
            data: array
        })
    }

    const fetchItems = ({skip, limit}: { skip: number; limit: number; }) => {
        skip !== 0 && setLoading(true);
        http.get(`/api/v1/inspirations?skip=${skip}&limit=${limit}`).then(res => {
            setRefreshing(false);
            setLoading(false);
            setItems({
                ...res,
                list: skip === 0 ? res.data : items.data.concat(res.data),
            });
        }).catch(err => {
            console.error(err);
        })
    }

    const refresh = function () {
        setRefreshing(true);
        if (skip === 0) {
            fetchItems({skip: 0, limit});
        } else {
            setSkip(0);
        }
    };

    React.useEffect(() => {
        fetchItems({skip, limit});
    }, [skip]);

    return {
        items,
        loading,
        refresh,
        refreshing,
        deleteItem,
        loadMore: function () {
            if (!loading && items.has_more) {
                setSkip(skip + limit);
            }
        }
    }
}