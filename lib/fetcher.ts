import axios from 'axios';

export const getFetch = (url: string, data? : any) => axios.get(url, {params: data}).then((res) => res.data);
export const postFetch = (url: string, data : any) => axios.post(url, data).then((res) => res.data);




