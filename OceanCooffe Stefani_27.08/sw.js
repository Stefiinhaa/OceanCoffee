// sw.js - Motor de Notificações da Ocean Coffee

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Força a instalação imediata
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Assume o controle da página na hora
});

// ESCUTAR O PUSH DO SERVIDOR
self.addEventListener('push', function(event) {
    let msg = "Nova atualização da Ocean Coffee!";
    
    if (event.data) {
        msg = event.data.text(); // Pega o texto enviado pelo servidor
    }

    const options = {
        body: msg,
        icon: 'IMG/Logo.png',
        badge: 'IMG/Logo.png',
        vibrate: [100, 50, 100],
        data: {
            url: '/' // Abre a home ao clicar
        }
    };

    event.waitUntil(
        self.registration.showNotification('Ocean Coffee', options)
    );
});

// Ação ao clicar na notificação
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});