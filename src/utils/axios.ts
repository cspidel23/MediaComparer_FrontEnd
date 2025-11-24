import axios, { AxiosRequestConfig } from 'axios';

// next
import { getSession } from 'next-auth/react';

// ==============================|| ENVIRONMENT VALIDATION ||============================== //

if (!process.env.CREDENTIALS_API_URL) {
  throw new Error(
    'CREDENTIALS_API_URL environment variable is not set. ' +
      'Please add CREDENTIALS_API_URL to your .env and/or next.config.js file(s). ' +
      'Example: CREDENTIALS_API_URL=http://localhost:8008'
  );
}

if (!process.env.MESSAGES_WEB_API_URL) {
  throw new Error(
    'MESSAGES_WEB_API_URL environment variable is not set. ' +
      'Please add MESSAGES_WEB_API_URL to your .env and/or next.config.js file(s). ' +
      'Example: MESSAGES_WEB_API_URL=http://localhost:8000'
  );
}

if (!process.env.MESSAGES_WEB_API_KEY) {
  throw new Error(
    'MESSAGE_WEB_API_KEY environment variable is not set. ' +
      'Please add MESSAGE_WEB_API_KEY to your .env and/or next.config.js file(s). ' +
      'Example: MESSAGE_WEB_API_KEY=your-api-key-here'
  );
}

if (!process.env.TV_API_URL) {
  throw new Error(
    'TV_API_URL environment variable is not set. ' +
      'Please add TV_API_URL to your .env and/or next.config.js file(s). ' +
      'Example: TV_API_URL=https://g1-tvapi.onrender.com'
  );
}

if (!process.env.TV_API_KEY) {
  throw new Error(
    'TV_API_KEY environment variable is not set. ' +
      'Please add TV_API_KEY to your .env and/or next.config.js file(s). ' +
      'Example: TV_API_KEY=your-api-key-here'
  );
}

if (!process.env.MOVIE_API_URL) {
  throw new Error(
    'MOVIE_API_URL environment variable is not set. ' +
      'Please add MOVIE_API_URL to your .env and/or next.config.js file(s). ' +
      'Example: MOVIE_API_URL=https://movie-api-group2-20e70498bde4.herokuapp.com'
  );
}

if (!process.env.MOVIE_API_KEY) {
  throw new Error(
    'MOVIE_API_KEY environment variable is not set. ' +
      'Please add MOVIE_API_KEY to your .env and/or next.config.js file(s). ' +
      'Example: MOVIE_API_KEY=your-api-key-here'
  );
}

// ==============================|| CREDENTIALS SERVICE ||============================== //

const credentialsService = axios.create({ baseURL: process.env.CREDENTIALS_API_URL });

credentialsService.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.token.accessToken) {
      config.headers['Authorization'] = `Bearer ${session?.token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

credentialsService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Auth/Web API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    } else if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| MESSAGES SERVICE ||============================== //

const messagesService = axios.create({ baseURL: process.env.MESSAGES_WEB_API_URL });

messagesService.interceptors.request.use(
  async (config) => {
    config.headers['X-API-Key'] = process.env.MESSAGES_WEB_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

messagesService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Messages API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| TV SERVICE ||============================== //

const tvService = axios.create({ baseURL: process.env.TV_API_URL });

tvService.interceptors.request.use(
  async (config) => {
    config.headers['X-API-Key'] = process.env.TV_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

tvService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The TV API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| MOVIE SERVICE ||============================== //

const movieService = axios.create({ baseURL: process.env.MOVIE_API_URL });

movieService.interceptors.request.use(
  async (config) => {
    config.headers['x-api-key'] = process.env.MOVIE_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

movieService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Movie API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| EXPORTS ||============================== //

export default credentialsService; // Maintain backward compatibility
export { credentialsService, messagesService, tvService, movieService };

// Credentials service helpers
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.post(url, { ...config });

  return res.data;
};

// Messages service helpers
export const messagesFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await messagesService.get(url, { ...config });

  return res.data;
};

export const messagesFetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await messagesService.post(url, { ...config });

  return res.data;
};

// TV service helpers
export const tvFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await tvService.get(url, { ...config });

  return res.data;
};

// Movie service helpers
export const movieFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await movieService.get(url, { ...config });

  return res.data;
};
