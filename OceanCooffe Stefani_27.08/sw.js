const NOME_DO_CACHE = 'oceancoffee-v1';
const arquivosParaGuardar = [
  './',
  './index.html',
  './CSS/estilo.css',
  './CSS/styles.css',
  './IMG/Logo.png'
];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(NOME_DO_CACHE)
      .then(cache => {
        return cache.addAll(arquivosParaGuardar);
      })
  );
});

self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request)
      .then(resposta => {
        if (resposta) {
          return resposta;
        }
        return fetch(evento.request);
      })
  );
});

self.addEventListener('push', function(evento) {
  const dados = evento.data ? evento.data.text() : 'Nova atualizacao disponivel';
  
  const opcoes = {
    body: dados,
    icon: 'IMG/Logo.png',
    badge: 'IMG/Logo.png'
  };

  evento.waitUntil(
    self.registration.showNotification('OceanCoffee', opcoes)
  );
});