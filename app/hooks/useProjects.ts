import * as React from 'react';
import http from '../services/http';
import { TPage } from './types';
import { TProject } from './useProject';

export type EProjectsMode = 'latest' | 'recommend' | 'search' | 'likes' | 'views' | 'collection';

export type ProjectListProps = { 
    mode: EProjectsMode; 
    skip?: number; 
    limit?: number; 
    value?: string;
}

const getProjects = ({ skip, mode, limit, value }: ProjectListProps) => {
    if (mode === 'latest') {
        return http.get(`/api/v1/projects?skip=${skip}&limit=${limit}`);
    }
    if (mode === 'search') {
        return http.get(`/api/v1/project/search?skip=${skip}&limit=${limit}&keyword=${value}`);
    }
    if (mode === 'recommend') {
        return http.get(`/api/v1/project/recommend?skip=${skip}&limit=${limit}`);
    }
    if (mode === 'likes') {
        return http.get(`/api/v1/project/likes/${value}?skip=${skip}&limit=${limit}`)
    }
    if (mode === 'views') {
        return http.get(`/api/v1/project/views?skip=${skip}&limit=${limit}`)
    }
    if (mode === 'collection') {
        return http.get(`/api/v1/project/collect/${value}?skip=${skip}&limit=${limit}`)
    }
    return Promise.reject();
}

export function useProjects({ mode = 'latest', limit = 20, value = '' }: { mode: EProjectsMode, limit: number, value: string }) {
    const [skip, setSkip] = React.useState(0);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [pagedProject, setPagedProject] = React.useState<TPage<TProject>>({
        has_more: false,
        limit,
        data: [],
        skip,
        total: 0,
    });

    const patchProjectCollectStatus = (id: string, is_collect: boolean) => {
        setPagedProject({
            ...pagedProject,
            data: pagedProject.data.map(item => item.id === id ? { ...item, is_collect } : item),
        });
    }

    const patchProjectLikeStatus = (id: string, is_like: boolean) => {
        setPagedProject({
            ...pagedProject,
            data: pagedProject.data.map(item => item.id === id ? { ...item, is_like } : item),
        });
    }

    const fetchProjects = ({ skip, limit, value }: { skip: number; limit: number; value: string; }) => {
        skip !== 0 && setLoading(true);
        getProjects({ skip, limit, mode, value }).then(res => {
            setRefreshing(false);
            setLoading(false);
            setPagedProject({
                ...res,
                data: skip === 0 ? res.data : pagedProject.data.concat(res.data),
            });
        }).catch(err => {
            console.error(err);
        });
    }

    const refresh = () => {
        setRefreshing(true)
        if (skip === 0) {
            fetchProjects({ skip, limit, value })
        } else {
            setSkip(0)
        }
    };

    const loadMore = () => {
        if (!loading && pagedProject.has_more) {
            setSkip(skip + limit);
        }
    };

    React.useEffect(() => {
        fetchProjects({
            skip, limit, value
        });
    }, [skip]);

    return {
        pagedProject,
        loading,
        refreshing,
        refresh,
        loadMore,
        patchProjectCollectStatus,
        patchProjectLikeStatus,
    }
}