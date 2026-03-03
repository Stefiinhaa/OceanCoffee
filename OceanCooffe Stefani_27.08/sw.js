// sw.js - Service Worker para Ocean Coffee

const CACHE_NAME = 'ocean-coffee-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/CSS/styles.css',
  '/IMG/Loginho2.png'
];

// Instalação: Cache básico de recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ESCUTAR O EVENTO DE PUSH
// É aqui que a mágica acontece quando o servidor envia a notificação
self.addEventListener('push', function(event) {
  let data = { title: 'Ocean Coffee', body: 'Nova atualização para você!' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Ocean Coffee', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: 'IMG/Loginho2.png', // Caminho do seu ícone
    badge: 'IMG/Loginho2.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ação ao clicar na notificação (abrir o site)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});