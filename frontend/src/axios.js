import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://vreality.ipangram.com/api',
    // baseURL: 'https://a162402ce9c0.ngrok.io/api',
});


export default instance;
