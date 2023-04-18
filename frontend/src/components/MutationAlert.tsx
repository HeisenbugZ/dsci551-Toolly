import { useEffect } from 'react';
import { UseMutationResult } from 'react-query';

import { HTTPError } from '@/utils/invokeHttp';

export interface MutationAlertProps {
  mutation: UseMutationResult<any, any, any, any>;
}

export const MutationAlert: React.VFC<MutationAlertProps> = ({ mutation }) => {
  useEffect(() => {
    if (mutation.error instanceof HTTPError) {
      const message = mutation.error.messsge;
      alert(message);
    }
  }, [mutation.error]);

  return null;
};
