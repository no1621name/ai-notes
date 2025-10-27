import { describe, it, expect, vi, beforeEach } from 'vitest';
import DBClient from './client';
import type { ErrorNotifier } from '../errors/error-notifier';
import { SchemaFieldType } from '../../types/api';

type RequestHandler = null | ((ev: unknown) => void);
type IDBRequestType = Record<'onsuccess' | 'onerror', RequestHandler>;

describe('IDBClient', () => {
  let request: IDBRequestType;
  type MockedErrorNotifier = {
    add: ReturnType<typeof vi.fn>;
    invalidStoreName: ReturnType<typeof vi.fn>;
    missingPrimaryKey: ReturnType<typeof vi.fn>;
    requestFailed: ReturnType<typeof vi.fn>;
  };

  let mockErrorNotifier: MockedErrorNotifier;

  const mockIndexedDB = {
    open: vi.fn(),
  };

  const dbConfig = {
    name: 'testDB',
    version: 1,
    stores: [
      {
        name: 'testStore',
        primaryKey: 'id',
        schema: {
          id: SchemaFieldType.UNIQUE,
          name: SchemaFieldType.NOT_UNIQUE,
        },
      },
    ],
  };

  beforeEach(() => {
    mockErrorNotifier = {
      add: vi.fn(),
      invalidStoreName: vi.fn(),
      missingPrimaryKey: vi.fn(),
      requestFailed: vi.fn(),
    };

    global.indexedDB = mockIndexedDB as unknown as never;

    request = {
      onsuccess: null,
      onerror: null,
    };
    mockIndexedDB.open.mockReturnValue(request);
    vi.clearAllMocks();
  });

  it('should add error to toaster when IndexedDB is not supported', async () => {
    delete (window as { indexedDB: unknown }).indexedDB;
    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    await expect(dbClient.getAll('testStore')).rejects.toBeUndefined();

    expect(mockErrorNotifier.add).toHaveBeenCalledWith({
      type: 'danger',
      title: 'DB error occured',
      message: 'IndexedDB is not supported in your browser',
    });
  });

  it('should add error to toaster when IndexedDB fails to open', async () => {
    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);
    const errorHandler = vi.fn();
    mockIndexedDB.open.mockImplementation(() => {
      const request = {
        onerror: errorHandler,
        onsuccess: null,
        onupgradeneeded: null,
      };
      setTimeout(() => request.onerror?.(), 0);
      return request;
    });

    await expect(dbClient.getAll('testStore')).rejects.toBeUndefined();

    expect(mockErrorNotifier.add).toHaveBeenCalledWith({
      type: 'danger',
      title: 'DB error occured',
      message: 'IndexedDB failed to open',
    });
  });

  it('should add error to toaster when store name is invalid', async () => {
    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({
        target: {
          result: {
            objectStoreNames: {
              contains: vi.fn().mockReturnValue(false),
            },
            transaction: vi.fn(),
          },
        },
      });
    }, 0);

    await expect(dbClient.getAll('invalidStore')).rejects.toBeUndefined();

    expect(mockErrorNotifier.invalidStoreName).toHaveBeenCalled();
  });

  it('should add error to toaster when primary key is missing in create', async () => {
    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({
        target: {
          result: {
            objectStoreNames: { contains: () => true },
            transaction: vi.fn().mockReturnValue({
              objectStore: vi.fn().mockReturnValue({
                add: vi.fn(),
              }),
            }),
          },
        },
      });
    }, 0);

    await expect(dbClient.create('testStore', { name: 'Test' })).rejects.toBeUndefined();

    expect(mockErrorNotifier.missingPrimaryKey).toHaveBeenCalled();
  });

  it('should add error to toaster when request fails', async () => {
    const mockError = new Error('Request failed');
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          get: vi.fn().mockReturnValue({
            onsuccess: null,
            onerror: null,
          } as IDBRequestType),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const getRequest = mockDB.transaction().objectStore().get();
      setTimeout(() => getRequest.onerror?.({ target: { error: mockError } }), 0);
    }, 0);

    await expect(dbClient.getById('testStore', '1')).rejects.toBeUndefined();

    expect(mockErrorNotifier.requestFailed).toHaveBeenCalledWith(mockError);
  });

  it('should successfully get data by ID', async () => {
    const mockData = { id: '1', name: 'Test' };
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          get: vi.fn().mockReturnValue({
            onsuccess: null,
            onerror: null,
          } as IDBRequestType),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const getRequest = mockDB.transaction().objectStore().get();
      setTimeout(() => {
        getRequest.result = mockData;
        getRequest.onsuccess?.();
      }, 0);
    }, 0);
    const result = await dbClient.getById('testStore', '1');

    expect(result).toEqual(mockData);
    expect(mockErrorNotifier.add).not.toHaveBeenCalled();
    expect(mockErrorNotifier.requestFailed).not.toHaveBeenCalled();
  });

  it('should add toaster error when getAll request fails', async () => {
    const mockError = new Error('GetAll failed');
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          getAll: vi.fn().mockReturnValue({ onsuccess: null, onerror: null } as IDBRequestType),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const req = mockDB.transaction().objectStore().getAll();
      setTimeout(() => req.onerror?.({ target: { error: mockError } }), 0);
    }, 0);

    await expect(dbClient.getAll('testStore')).rejects.toBeUndefined();

    expect(mockErrorNotifier.requestFailed).toHaveBeenCalledWith(mockError);
  });

  it('should successfully get all items', async () => {
    const mockData = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
    const getAllRequest = { onsuccess: null, onerror: null, result: mockData } as unknown as IDBRequestType & { result: unknown };
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          getAll: vi.fn().mockReturnValue(getAllRequest),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const req = mockDB.transaction().objectStore().getAll();
      setTimeout(() => {
        req.result = mockData;
        req.onsuccess?.();
      }, 0);
    }, 0);

    const result = await dbClient.getAll('testStore');

    expect(result).toEqual(mockData);
    expect(mockErrorNotifier.add).not.toHaveBeenCalled();
    expect(mockErrorNotifier.requestFailed).not.toHaveBeenCalled();
  });

  it('should add error to toaster when IndexedDB is not supported for getStores', async () => {
    delete (window as { indexedDB: unknown }).indexedDB;
    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    await expect(dbClient.getStores(['testStore'])).rejects.toBeUndefined();

    expect(mockErrorNotifier.add).toHaveBeenCalledWith({
      type: 'danger',
      title: 'DB error occured',
      message: 'IndexedDB is not supported in your browser',
    });
  });

  it('should add error to toaster when one of store names is invalid', async () => {
    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({
        target: {
          result: {
            objectStoreNames: {
              contains: vi.fn().mockReturnValue(false),
            },
            transaction: vi.fn(),
          },
        },
      });
    }, 0);

    await expect(dbClient.getStores(['invalidStore'])).rejects.toBeUndefined();

    expect(mockErrorNotifier.invalidStoreName).toHaveBeenCalled();
  });

  it('should return array of object stores when store names are valid', async () => {
    const mockStore = {} as IDBObjectStore;
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockImplementation(() => mockStore),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
    }, 0);

    const result = await dbClient.getStores(['testStore']);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBe(mockStore);
    expect(mockErrorNotifier.add).not.toHaveBeenCalled();
  });

  it('should successfully create an item and return primary key', async () => {
    const addRequest = { onsuccess: null, onerror: null, result: '1' } as unknown as IDBRequestType & { result: string };
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          add: vi.fn().mockReturnValue(addRequest),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const req = mockDB.transaction().objectStore().add();
      setTimeout(() => {
        req.result = '1';
        req.onsuccess?.();
      }, 0);
    }, 0);

    const result = await dbClient.create('testStore', { id: '1', name: 'Test' });

    expect(result).toBe('1');
    expect(mockErrorNotifier.add).not.toHaveBeenCalled();
    expect(mockErrorNotifier.requestFailed).not.toHaveBeenCalled();
  });

  it('should add toaster error when create request fails', async () => {
    const mockError = new Error('Create failed');
    const addRequest = { onsuccess: null, onerror: null } as unknown as IDBRequestType;
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          add: vi.fn().mockReturnValue(addRequest),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const req = mockDB.transaction().objectStore().add();
      setTimeout(() => req.onerror?.({ target: { error: mockError } }), 0);
    }, 0);

    await expect(dbClient.create('testStore', { id: '1', name: 'Test' })).rejects.toBeUndefined();

    expect(mockErrorNotifier.requestFailed).toHaveBeenCalledWith(mockError);
  });

  it('should successfully update an item', async () => {
    const putRequest = { onsuccess: null, onerror: null } as unknown as IDBRequestType;
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          put: vi.fn().mockReturnValue(putRequest),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const req = mockDB.transaction().objectStore().put();
      setTimeout(() => req.onsuccess?.(), 0);
    }, 0);

    await expect(dbClient.update('testStore', { id: '1', name: 'Changed' })).resolves.toBeUndefined();
    expect(mockErrorNotifier.add).not.toHaveBeenCalled();
    expect(mockErrorNotifier.requestFailed).not.toHaveBeenCalled();
  });

  it('should add toaster error when update request fails', async () => {
    const mockError = new Error('Update failed');
    const putRequest = { onsuccess: null, onerror: null } as unknown as IDBRequestType;
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          put: vi.fn().mockReturnValue(putRequest),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const req = mockDB.transaction().objectStore().put();
      setTimeout(() => req.onerror?.({ target: { error: mockError } }), 0);
    }, 0);

    await expect(dbClient.update('testStore', { id: '1', name: 'Changed' })).rejects.toBeUndefined();

    expect(mockErrorNotifier.requestFailed).toHaveBeenCalledWith(mockError);
  });

  it('should successfully delete an item', async () => {
    const delRequest = { onsuccess: null, onerror: null } as unknown as IDBRequestType;
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue(delRequest),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const req = mockDB.transaction().objectStore().delete();
      setTimeout(() => req.onsuccess?.(), 0);
    }, 0);

    await expect(dbClient.delete('testStore', '1')).resolves.toBeUndefined();
    expect(mockErrorNotifier.add).not.toHaveBeenCalled();
    expect(mockErrorNotifier.requestFailed).not.toHaveBeenCalled();
  });

  it('should add toaster error when delete request fails', async () => {
    const mockError = new Error('Delete failed');
    const delRequest = { onsuccess: null, onerror: null } as unknown as IDBRequestType;
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue(delRequest),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig, mockErrorNotifier as unknown as ErrorNotifier);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const req = mockDB.transaction().objectStore().delete();
      setTimeout(() => req.onerror?.({ target: { error: mockError } }), 0);
    }, 0);

    await expect(dbClient.delete('testStore', '1')).rejects.toBeUndefined();

    expect(mockErrorNotifier.requestFailed).toHaveBeenCalledWith(mockError);
  });
});
