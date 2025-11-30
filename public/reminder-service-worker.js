const DB_NAME = 'messages';
const DB_VERSION = 1;
const STORE_NAME = 'fired_reminders';

const addFiredReminder = async (noteId) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const data = {
        id: Math.random().toString(36).substring(8),
        note_id: noteId,
        timestamp: Date.now(),
      };

      const addRequest = store.add(data);

      addRequest.onsuccess = () => {
        db.close();
        resolve();
      };

      addRequest.onerror = () => {
        db.close();
        reject(addRequest.error);
      };
    };
  });
};

self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: `I've asked to remind you to check the note "${data.title}"`,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      noteId: data.note_id,
    },
    actions: [
      {
        action: 'explore',
        title: 'To note',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification('Reminder notification', options),
      addFiredReminder(data.note_id).then(() => {
        const channel = new BroadcastChannel('ai-notes-app');
        channel.postMessage({
          type: 'REMINDER_FIRED',
          payload: { noteId: data.note_id },
        });
        channel.close();
      }),
    ]),
  );
});

self.addEventListener('notificationclick', (event) => {
  const eventAction = event.action;

  if (eventAction !== 'explore') {
    return;
  }

  const noteId = event.notification.data.noteId;
  const url = `${self.location.origin}/note/${noteId}`;
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
