const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const getAppServerKey = () => {
  if (!import.meta.env.VITE_VAPID_PUBLIC_JWK) {
    console.warn('VITE_VAPID_PUBLIC_JWK is not defined');
    return;
  }

  const jwk = JSON.parse(import.meta.env.VITE_VAPID_PUBLIC_JWK);
  const x = urlBase64ToUint8Array(jwk.x);
  const y = urlBase64ToUint8Array(jwk.y);

  const key = new Uint8Array(1 + x.length + y.length);
  key[0] = 0x04;
  key.set(x, 1);
  key.set(y, 1 + x.length);

  return key as unknown as BufferSource;
};
