// sw.js - Motor de Notificações
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
    let msg = "Nova atualização da Ocean Coffee!";
    if (event.data) {
        msg = event.data.text();
    }

    event.waitUntil(
        self.registration.showNotification('Ocean Coffee', {
            body: msg,
            icon: 'IMG/Loginho2.png',
            vibrate: [200, 100, 200]
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});