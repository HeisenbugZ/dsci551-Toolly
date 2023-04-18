import { File as ModelFile } from '@/.apis/model';
import { auth } from '@/utils/auth';
import { HTTPError, invokeHttp } from '@/utils/invokeHttp';
import { useMutation } from 'react-query';
import { User } from './models';

export const useLogin = () =>
  useMutation((body: { email: string; password: string }) => {
    return invokeHttp<{ token: string }>('post', '/auth/login', undefined, body);
  });

export const useRegister = () =>
  useMutation((body: { name: string; email: string; password: string; address: string }) => {
    return invokeHttp<User>('post', '/auth/register', undefined, body);
  });

export const usePostFiles = () => useMutation(async (files: File[]) => {
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file);
  }

  const response = await fetch(`${import.meta.env.VITE_APP_BASE_SERVER}/files`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${auth.getToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new HTTPError('PostFiles failed', response);
  }
  const data: ModelFile[] = await response.json();
  return data;
});
