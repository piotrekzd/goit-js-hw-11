export { images };

import axios from 'axios'; 

axios.defaults.baseURL = 'https://pixabay.com/api/';

const API_KEY = '29677253-331af6074919a5bc21fef774b';

async function images(query, page, perPage) {
    const response = await axios.get(`?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safeSearch=true&page=${page}&per_page=${perPage}`);
    return response
};