// JS/theme-toggle.js
document.addEventListener('DOMContentLoaded', () => {
    // Encontra *todos* os seletores na página (pode haver um no header e um no menu mobile)
    const themeToggles = document.querySelectorAll('.theme-switch input[type="checkbox"]');
    
    // Função para aplicar o tema e sincronizar todos os seletores
    function syncToggles(isDarkMode) {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
            themeToggles.forEach(toggle => toggle.checked = true);
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            themeToggles.forEach(toggle => toggle.checked = false);
            localStorage.setItem('theme', 'light');
        }
    }

    // Sincroniza os seletores com o estado atual no carregamento da página
    // (O applier no <head> já aplicou a classe, aqui só sincronizamos o botão)
    const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
    themeToggles.forEach(toggle => toggle.checked = isCurrentlyDark);

    // Adiciona o listener de clique a cada seletor
    themeToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            syncToggles(e.target.checked);
        });
    });
});