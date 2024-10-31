import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { makeUseAxios } from 'axios-hooks';
import store from 'store';
// NB: this will configure axios globally, includes routes like Login that don't use these custom instances
axios.defaults.baseURL = process.env.BASE_URL;

function successInterceptor(request: AxiosRequestConfig): AxiosRequestConfig {
  if (request.headers) {
    request.headers['Authorization'] = `Bearer ${store.get('TOKEN')}`;
  } else {
    request.headers = {
      'Authorization': `Bearer ${store.get('TOKEN')}`,
    };
  }
  return request;
}

const axiosPost = axios.create({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosPostForm = axios.create({
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const axiosPatch = axios.create({
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosGet = axios.create({
  method: 'GET',
});

const axiosDelete = axios.create({
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosPost.interceptors.request.use(successInterceptor as any);
axiosPostForm.interceptors.request.use(successInterceptor as any);
axiosPatch.interceptors.request.use(successInterceptor as any);
axiosGet.interceptors.request.use(successInterceptor as any);
axiosDelete.interceptors.request.use(successInterceptor as any);

export const useAxiosPost = makeUseAxios({
  cache: false,
  axios: axiosPost,
});

export const useAxiosPostFormData = makeUseAxios({
  cache: false,
  axios: axiosPostForm,
});

export const useAxiosPatch = makeUseAxios({
  cache: false,
  axios: axiosPatch,
});

export const useAxiosGet = makeUseAxios({
  cache: false,
  axios: axiosGet,
});

export const useAxiosDelete = makeUseAxios({
  cache: false,
  axios: axiosDelete,
});