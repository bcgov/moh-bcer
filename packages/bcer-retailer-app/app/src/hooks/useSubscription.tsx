import {
  Subscription,
  SubscriptionFormData,
} from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import { GeneralUtil } from '@/utils/util';
import React, { useContext, useEffect, useState } from 'react';
import { useAxiosGet, useAxiosPatch } from './axios';
import { useToast } from './useToast';

export function useSubscription() {
  const { openToast } = useToast();
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const [openSubscribe, setOpenSubscribe] = useState<boolean>(false);
  const [openUnsubscribe, setOpenUnsubscribe] = useState<boolean>(false);
  const [
    {
      data: subscriptionData,
      loading: subscriptionLoading,
      error: subscriptionError,
    },
    getSubscription,
  ] = useAxiosGet<Subscription>('/subscription', { manual: true });

  const [
    { loading: subscriptionPatchLoading, error: subscriptionPatchError },
    patchSubscription,
  ] = useAxiosPatch('/subscription', { manual: true });

  useEffect(() => {
    getSubscription();
  }, []);

  const updateSubscription = async (
    data: SubscriptionFormData,
    type: 'subscribe' | 'unsubscribe'
  ) => {
    const successMessage =
      type === 'subscribe'
        ? 'Successfully Subscribed to SMS Notification'
        : 'Successfully Unsubscribed from SMS Notification';
    setOpenUnsubscribe(false);
    setOpenSubscribe(false);
    try {
      await patchSubscription({
        data: {
          phoneNumber1: GeneralUtil.formatPhoneNumberForApi(data.phoneNumber1),
          phoneNumber2: GeneralUtil.formatPhoneNumberForApi(data.phoneNumber2),
          confirmed: data.confirmed,
        },
      });
      openToast({
        successMessages: [successMessage],
        type: 'success',
      });
      await getSubscription();
    } catch (err) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(err),
      });
    }
  };

  const unSubscribe = async () => {
    const data = getInitialFormData();
    data.confirmed = false;
    await updateSubscription(data, 'unsubscribe');
  };

  const getInitialFormData = (): SubscriptionFormData => {
    return {
      phoneNumber1: subscriptionData?.phoneNumber1
        ? GeneralUtil.formatPhoneNumber(subscriptionData.phoneNumber1.slice(2))
        : '',
      phoneNumber2: subscriptionData?.phoneNumber2
        ? GeneralUtil.formatPhoneNumber(subscriptionData.phoneNumber2.slice(2))
        : '',
      confirmed: subscriptionData?.confirmed ?? false,
    };
  };

  return {
    subscriptionData,
    subscriptionLoading,
    subscriptionError,
    subscriptionPatchLoading,
    subscriptionPatchError,
    updateSubscription,
    openSubscribe,
    setOpenSubscribe,
    openUnsubscribe,
    setOpenUnsubscribe,
    getInitialFormData,
    unSubscribe,
  };
}
