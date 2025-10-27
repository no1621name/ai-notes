import { inject } from 'vue';
import type { DataTransfer } from '@/shared/types/api';
import type { ErrorNotifier } from '@/shared/api/errors/error-notifier';
import LocalStorageClient from '@/shared/api/localstorage/client';

export const createLsDataTransfer = (errorNotifier: ErrorNotifier): DataTransfer => {
  return new LocalStorageClient(errorNotifier);
};

export const lsDataTransferKey = Symbol('LsDataTransfer');
export const useLsDataTransfer = () => inject(lsDataTransferKey) as DataTransfer;
