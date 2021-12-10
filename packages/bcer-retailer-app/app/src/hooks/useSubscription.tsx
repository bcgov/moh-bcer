import {
  Subscription,
  SubscriptionFormData,
} from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import { GeneralUtil } from '@/utils/util';
import React, { useContext, useEffect, useState } from 'react';
import { useAxiosGet, useAxiosPatch } from './axios';

export function useSubscription() {
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [
    { data: subscriptionData, error: subscriptionError },
    getSubscription,
  ] = useAxiosGet<Subscription>('/subscription', { manual: true });

  const [
    { loading: subscriptionPatchLoading, error: subscriptionPatchError },
    patchSubscription,
  ] = useAxiosPatch('/subscription', { manual: true });

  useEffect(() => {
    getSubscription();
  }, []);

  const updateSubscription = async (data: SubscriptionFormData) => {
    try {
      await patchSubscription({
        data: {
          phoneNumber1: GeneralUtil.formatPhoneNumberForApi(data.phoneNumber1),
          phoneNumber2: GeneralUtil.formatPhoneNumberForApi(data.phoneNumber2),
          confirmed: data.confirmed,
        },
      });
      setOpenDialog(false);
      await getSubscription();
    } catch (err) {
      setOpenDialog(false);
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(err),
      });
    }
  };

  const getInitialFormData = (): SubscriptionFormData => {
    return {
      phoneNumber1: subscriptionData?.phoneNumber1
        ? GeneralUtil.formatPhoneNumber(subscriptionData.phoneNumber1.slice(2))
        : '',
      phoneNumber2: subscriptionData?.phoneNumber2
        ? GeneralUtil.formatPhoneNumber(subscriptionData.phoneNumber2.slice(2))
        : '',
      confirmed: true, // Should be updated if we decide to add a confirm checkbox in the field
    };
  };
  
  return {
    subscriptionData,
    subscriptionError,
    subscriptionPatchLoading,
    subscriptionPatchError,
    updateSubscription,
    openDialog,
    setOpenDialog,
    getInitialFormData,
  };
}
