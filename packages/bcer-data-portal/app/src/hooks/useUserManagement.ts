import { UserStatus } from '@/constants/localEnums';
import {
  Business,
  UserDetails,
  UserSearchFields,
  UserUpdateFields,
} from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import React, { useContext, useEffect, useState } from 'react';
import { useAxiosGet, useAxiosPatch } from './axios';
import { useToast } from './useToast';

function useUserManagement() {
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const { openToast } = useToast();
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [{ data: users, loading: userLoading, error: userError }, getUsers] =
    useAxiosGet<UserDetails[]>('/data/user', {
      manual: true,
    });
  const [
    { data: businesses, loading: businessLoading, error: businessError },
    getBusiness,
  ] = useAxiosGet<Business[]>('/data/business', {
    manual: true,
  });
  const [
    { loading: patchUserLoading, error: patchUserError },
    patchUser,
  ] = useAxiosPatch('/data/user/update', { manual: true });

  const [
    {
      loading: mergeBusinessLoading,
      error: mergeBusinessError,
    },
    mergeBusiness,
  ] = useAxiosPatch('/data/business/merge', { manual: true });

  function getUserData(query?: UserSearchFields) {
    let endPoint = '/data/user';
    if (query?.search) {
      endPoint = `${endPoint}?type=${query.type}&search=${query.search}`;
    }
    getUsers({ url: endPoint });
  }

  function getBusinessData() {
    try {
      getBusiness();
    } catch (err) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(err),
      });
    }
  }

  async function updateUser(data: UserUpdateFields) {
    const userName = `${data.user?.firstName || ''} ${
      data.user?.lastName || ''
    }`;
    const currentBusinessName = `${
      data.user?.business?.businessName || data.user?.business?.legalName
    }`;
    const newBusinessName = `${
      data.selectedBusiness?.businessName || data.selectedBusiness?.legalName
    }`;

    const successMessages = [];
    const errorMessages = [
      `Failed to move "${userName}" from "${currentBusinessName}" to "${newBusinessName}"`,
    ];
    if(data.mergeData){
      errorMessages.push(`Failed to merge information from "${currentBusinessName}" to "${newBusinessName}"`)
    }
    try {
      await patchUser({
        data: {
          userStatus: data.active ? UserStatus.ACTIVE : UserStatus.INACTIVE,
          newBusinessId: data.selectedBusiness?.id,
          userId: data.user?.id,
        },
      });
      successMessages.push(
        `You have successfully moved "${userName}" from "${currentBusinessName}" to "${newBusinessName}"`
      );
      errorMessages.shift();
      if (data.mergeData) {
        await mergeBusiness({
          data: {
            sourceBusinessId: data.user?.business?.id,
            targetBusinessId: data.selectedBusiness?.id,
          },
        });
        successMessages.push(
          `You have successfully merged all the information from "${currentBusinessName}" to "${newBusinessName}"`
        );
        errorMessages.shift();
      }
    } catch (err) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(err),
      });
    } finally {
      setOpenEditDialog(false);
      openToast({
        successMessages,
        errorMessages,
        type: errorMessages.length ? 'error' : 'success'
      })
      getUserData();
      getBusinessData();
    }
  }

  useEffect(() => {
    getUserData();
    getBusinessData();
  }, []);

  return {
    users,
    userLoading,
    userError,
    getUserData,
    businesses,
    businessLoading,
    businessError,
    getBusinessData,
    updateUser,
    openEditDialog,
    setOpenEditDialog,
    mergeBusinessLoading,
    mergeBusinessError,
    patchUserLoading,
    patchUserError,
  };
}

export default useUserManagement;
