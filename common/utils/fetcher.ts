import logger from './logger.ts';
import { qs } from '../../dep.ts';

export default (url: string, data?: any, method = 'GET', headers = {}) => {
    // 请求参数设置
    let options: any = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            // Authorization: store.get('access_token') || '',
            ...headers,
        },
    };
    let body = '';

    if (data) {
        if (options.method === 'GET') {
            url = `${url}?${qs.stringify(data)}`;
        } else {
            options.body = JSON.stringify(data);
        }
    }

    return new Promise((resolve, reject) => {
        logger.debug(
            `[ fetcher ] fetch ${url} ${body ? JSON.stringify(body) : ''}`,
        );
        fetch(url, options)
            .then(async (res) => {
                let json = await res.json();
                resolve(json);
            })
            .catch((e) => {
                reject(e.message);
            });
    });
};
