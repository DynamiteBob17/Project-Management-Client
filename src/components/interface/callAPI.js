import axios from 'axios';

async function callAPI(method, route, data) {
    try {
        const config = {
            method: method,
            url: 'https://pm-restapi.onrender.com' + route,
            data: data
        }

        const result = await axios(config);

        return new Promise((resolve, reject) => {
            resolve(result.data);
        });
    } catch (error) {
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

export default callAPI;