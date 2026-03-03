// sw.js - Service Worker Ocean Coffee

self.addEventListener('install', (event) => {
    // Força o SW a se tornar ativo imediatamente
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Garante que o SW controle a página logo de cara
    event.waitUntil(clients.claim());
});

// ESCUTAR O EVENTO DE PUSH
self.addEventListener('push', function(event) {
    let payload = "Nova notificação da Ocean Coffee!";
    
    if (event.data) {
        payload = event.data.text();
    }

    const options = {
        body: payload,
        icon: 'IMG/Loginho2.png',
        badge: 'IMG/Loginho2.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Ocean Coffee', options)
    );
});