import type { DataTransfer } from '@/shared/types/api';
import LocalStorageClient from '@/shared/api/localstorage/client';

import { inject } from 'vue';

export const createLsDataTransfer = (): DataTransfer => {
  return new LocalStorageClient();
};

export const lsDataTransferKey = Symbol('LsDataTransfer');
export const useLsDataTransfer = () => inject(lsDataTransferKey) as DataTransfer;
