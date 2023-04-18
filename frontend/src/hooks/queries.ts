import { useToken } from '@/utils/auth';
import { invokeHttp } from '@/utils/invokeHttp';
import { useQuery } from 'react-query';
import { User } from '@apis/model';

export const useMe = () => {
  const token = useToken();

  return useQuery('/users/me', () => invokeHttp<User>('get', '/users/me'), {
    enabled: !!token,
  });
};
