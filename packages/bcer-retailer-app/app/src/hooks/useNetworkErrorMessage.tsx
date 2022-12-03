import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import { AxiosError } from 'axios';
import React, { useContext } from 'react';

function useNetworkErrorMessage() {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const showNetworkErrorMessage = (err: AxiosError<any>) => {
    if (err) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(err),
      });
    }
  };
  return { showNetworkErrorMessage };
}

export default useNetworkErrorMessage;
