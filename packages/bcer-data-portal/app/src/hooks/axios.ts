import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { makeUseAxios } from 'axios-hooks';
import store from 'store';
// NB: this will configure axios globally, includes routes like Login that don't use these custom instances
axios.defaults.baseURL = process.env.BASE_URL;

function successInterceptor(request: AxiosRequestConfig) {
  if (request.headers) {
    request.headers['Authorization'] = `Bearer ${store.get('TOKEN')}`;
  } else {
    request.headers = {
      'Authorization': `Bearer ${store.get('TOKEN')}`,
    }
  }
  return request
}

const axiosPost = axios.create({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})

const axiosPostForm = axios.create({
  method: 'POST',
  responseType: 'arraybuffer',
  headers: {
    'Content-Type': 'application/json',
  }
})

const axiosPatch = axios.create({
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  }
})

const axiosGet = axios.create({
  method: 'GET',
})

axiosPost.interceptors.request.use(successInterceptor)
axiosPostForm.interceptors.request.use(successInterceptor)
axiosPatch.interceptors.request.use(successInterceptor)
axiosGet.interceptors.request.use(successInterceptor)

export const useAxiosPost = makeUseAxios({
  cache: false,
  axios: axiosPost
});

export const useAxiosPostFormData = makeUseAxios({
  cache: false,
  axios: axiosPostForm
});

export const useAxiosPatch = makeUseAxios({
  cache: false,
  axios: axiosPatch
});

export const useAxiosGet = makeUseAxios({
  cache: false,
  axios: axiosGet
});