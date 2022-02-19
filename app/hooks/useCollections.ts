import * as React from 'react';
import http from '../services/http';

export type TCollection = {
    id: string;
    name: string;
    desc?: boolean;
    covers: string[];
    create_time: number;
}

export default function useCollections(mode: 'default' | 'select', value: string = '') {

    const [loading, setLoading] = React.useState(false);

    const [collections, setCollections] = React.useState<(TCollection & {is_collect: boolean})[]>([]);

    const getCollections = () => {
        if (value.length < 1) {
            return;
        }
        setLoading(true);
        let api = `/api/v1/project/collections/${value}`;
        if (mode === 'select') {
            api = `/api/v1/project/${value}/collections`
        }
        http.get(api).then(data => {
            setLoading(false);
            setCollections(data);
        }).catch(err => console.log(err));
    }

    const reloadCollections = getCollections;

    React.useEffect(() => {
        getCollections()
    }, [mode, value]);

    return {
        collections,
        loading,
        reloadCollections,
    }

}