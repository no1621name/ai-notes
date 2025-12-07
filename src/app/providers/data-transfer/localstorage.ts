import { inject } from 'vue';
import type { DataTransfer } from '@/shared/types/api';
import LocalStorageClient, { type LocalStorageErrorNotifier } from '@/shared/api/localstorage/client';

export const createLsDataTransfer = (errorNotifier: LocalStorageErrorNotifier): DataTransfer => {
  return new LocalStorageClient(errorNotifier);
};

export const lsDataTransferKey = Symbol('LsDataTransfer');
export const useLsDataTransfer = () => inject(lsDataTransferKey) as DataTransfer;
