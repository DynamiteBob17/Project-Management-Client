import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

async function callAPI(method, route, data, setLoading) {
    try {
        setLoading(true);

        const config = {
            method: method,
            url: process.env.REACT_APP_SERVER_ORIGIN + route,
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${cookies.get('USER_ID')} ${cookies.get('TOKEN')}`
            },
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
    } finally {
        setLoading(false);
    }
}

export default callAPI;
