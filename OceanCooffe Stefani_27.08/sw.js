const NOME_DO_CACHE = 'oceancoffee-v2'; // Mude a versão sempre que alterar o CSS/JS
const arquivosParaGuardar = [
  './',
  './index.html',
  './CSS/styles.css',
  './CSS/dark-mode.css',
  './CSS/api.css',
  './CSS/curva.css',
  './CSS/responsive.css',
  './IMG/Logo.png',
  './IMG/Loginho2.png'
];

// Instalação: Salva arquivos no cache
self.addEventListener('install', evento => {
  self.skipWaiting(); // Força o novo SW a assumir o controle imediatamente
  evento.waitUntil(
    caches.open(NOME_DO_CACHE)
      .then(cache => {
        return cache.addAll(arquivosParaGuardar);
      })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(nomesCaches => {
      return Promise.all(
        nomesCaches.map(nome => {
          if (nome !== NOME_DO_CACHE) {
            return caches.delete(nome);
          }
        })
      );
    })
  );
});

// Fetch: Tenta buscar no cache, se não tiver, vai na rede
self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request)
      .then(resposta => {
        return resposta || fetch(evento.request);
      })
  );
});

// PUSH: Recebe a notificação do servidor
self.addEventListener('push', function(evento) {
  let dados = 'Nova atualização disponível na Ocean Coffee!';
  
  if (evento.data) {
    // Tenta ler como JSON se o servidor enviar objeto, senão lê como texto
    try {
      const json = evento.data.json();
      dados = json.body || dados;
    } catch (e) {
      dados = evento.data.text();
    }
  }

  const opcoes = {
    body: dados,
    icon: 'IMG/Loginho2.png', // Ícone que aparece na notificação
    badge: 'IMG/Loginho2.png', // Ícone pequeno na barra de status (Android)
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Ver novidades' },
      { action: 'close', title: 'Fechar' }
    ]
  };

  evento.waitUntil(
    self.registration.showNotification('Ocean Coffee', opcoes)
  );
});

// Clique na notificação: Abre o site
self.addEventListener('notificationclick', function(evento) {
  evento.notification.close();

  if (evento.action !== 'close') {
    evento.waitUntil(
      clients.openWindow('/') // Abre a página inicial do seu site
    );
  }
});