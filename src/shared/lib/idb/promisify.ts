export const promisifyRequest = <T>(request: IDBRequest<T>) => {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const promisifyCursor = (
  request: IDBRequest<IDBCursorWithValue | null>,
  onCursor: (cursor: IDBCursorWithValue) => void,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        onCursor(cursor);
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
};
