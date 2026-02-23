export const toChunks = <T>(array: T[], chunkSize: number) => {
  if (chunkSize <= 0) {
    throw new RangeError(`chunkSize must be greater than 0, got ${chunkSize}`);
  }

  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};
