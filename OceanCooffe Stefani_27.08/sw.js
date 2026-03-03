// sw.js - Motor de Notificações da Ocean Coffee

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Força a instalação imediata
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Assume o controle da página na hora
});

// ESCUTAR O PUSH (Corrigido para funcionar com o botão do F12)
self.addEventListener('push', function(event) {
    let msg = "Nova atualização da Ocean Coffee!";
    
    // Tratamento seguro para garantir que não dê erro se o botão for clicado vazio
    if (event.data) {
        msg = event.data.text() || msg; 
    }

    const options = {
        body: msg,
        icon: 'IMG/Loginho2.png', // Mudei para Loginho2.png que sei que existe e é o favicon
        badge: 'IMG/Loginho2.png',
        vibrate: [200, 100, 200], // Aumentei a vibração para você notar
        data: {
            url: '/' 
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