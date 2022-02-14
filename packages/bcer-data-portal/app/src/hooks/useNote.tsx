import { NoteDTO, NoteRO } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import React, { useContext, useEffect, useState } from 'react';
import { useAxiosGet, useAxiosPost } from './axios';

export interface NoteProps {
  targetId: string;
  type: 'business' | 'location';
  showHideButton?: boolean;
}

function useNote({ targetId, type }: NoteProps) {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [initialValue, setInitialValue] = useState('');
  const [{ error: postError, loading: postLoading }, post] = useAxiosPost(
    '/data/note',
    {
      manual: true,
    }
  );
  const [{ data: noteData, loading: noteLoading, error: noteError }, get] =
    useAxiosGet<NoteRO[]>(`/data/note/get/${targetId}`);

  const submit = async (content: string) => {
    let body: NoteDTO = {
      content,
    };
    if (type === 'location') {
      body.locationId = targetId;
    } else if (type === 'business') {
      body.businessId = targetId;
    }
    await post({
      data: body,
    });
    get();
  };

  const getInitialValue = () => {
    return { content: initialValue };
  };

  useEffect(() => {
    if (noteData) {
      setInitialValue(noteData[0]?.content || '');
    }
  }, [noteData]);

  useEffect(() => {
    if (postError) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(postError),
      });
    }
  }, [postError]);

  return {
    initialValue,
    getInitialValue,
    submit,
    noteData,
    noteLoading,
    noteError,
    postLoading,
  };
}

export default useNote;
