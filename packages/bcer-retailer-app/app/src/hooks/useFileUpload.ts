import { useState, useEffect } from 'react';
import { useAxiosPostFormData } from './axios';

type UploadSource = File | undefined;

export default function useFileUpload(target: string): [
  {
    uploadError: any;
    uploaded: boolean;
    sent: boolean;
    loading: boolean;
    done: boolean;
    data: any;
    fileData: UploadSource | null;
  },
  Function,
] {
  const [fileData, setFileData] = useState<UploadSource | null>(null);
  const [uploadError, setUploadError] = useState<any>(null);
  const [uploaded, toggleUploaded] = useState(false);
  const [sent, toggleSent] = useState(false);
  const [done, toggleDone] = useState(false);
  const [{ data, loading, error, response }, upload] = useAxiosPostFormData(target, { manual: true });

  useEffect(() => {
    if (fileData) {
      try {
        toggleUploaded(true);
        const formData: FormData = new FormData();
        formData.append('file', fileData);
        (async () => {
          toggleSent(true);
          await upload({ data: formData });
        })();
      } catch (error) {
        setUploadError(error);
      }
    } else {
      toggleSent(false);
      toggleDone(false);
    }
  }, [fileData]);

  useEffect(() => {
    if (response?.status === 201) {
      setUploadError(null);
      toggleDone(true);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      toggleDone(true);
      setUploadError(error);
    }
  }, [error]);
  
  return [{ uploadError, uploaded, sent, done, data, loading, fileData }, setFileData];
}