import axios from 'axios';

const Axios = axios.create({
    timeout: 5000,
    withCredentials: false
});

const request = (url, data = {}, method = 'GET') => {
    return Axios({
        method,
        url,
        data,
        params: method.toUpperCase() === 'GET' && data
    }).then(res => {
        if (res.status == 200) {
            return res.data
        }
    });
};

export default request