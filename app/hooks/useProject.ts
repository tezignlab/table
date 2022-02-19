import * as React from 'react';
import http from '../services/http';

export type TProject = {
    author: { home: string; name: string; avatar: string; };
    count_like: number;
    count_read: number;
    cover: string;
    id: string;
    is_collect: boolean;
    is_like: boolean;
    origin: string;
    origin_url: string;
    publish_time: number;
    tags: string[];
    title: string;
    user_id: string | number;
}

export type TProjectDetail = TProject & {
    content: string;
    baidu_tags: string[];
}

export function useProject(id: string) {
    const [loading, setLoading] = React.useState(false);
    const [project, setProject] = React.useState<TProjectDetail>({
        author: { home: '', name: '', avatar: '' },
        count_like: 0,
        count_read: 0,
        cover: '',
        id: '',
        is_collect: false,
        is_like: false,
        origin: '',
        origin_url: '',
        publish_time: 0,
        tags: [],
        baidu_tags: [],
        title: '',
        user_id: 0,
        content: '',
    });

    const fetchDetail = () => {
        setLoading(true);
        http.get(`/api/v1/projects/${id}`).then(data => {
            setProject(data);
            setLoading(false);
        }).catch(err => console.error(err));
    }

    const recordView = () => {
        http.post(`/api/v1/project/view/${id}`).then(() => { }).catch(err => console.error(err));
    }

    React.useEffect(() => {
        fetchDetail();
        recordView();
    }, [id]);

    return {
        project,
        loading,
        refresh: fetchDetail,
    }

}