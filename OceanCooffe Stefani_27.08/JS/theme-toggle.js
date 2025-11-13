document.addEventListener('DOMContentLoaded', () => {
    const themeToggles = document.querySelectorAll('.theme-switch input[type="checkbox"]');
    
    function syncToggles(isDarkMode) {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
            themeToggles.forEach(toggle => toggle.checked = true);
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.documentElement.classList.add('light-mode');
            themeToggles.forEach(toggle => toggle.checked = false);
            localStorage.setItem('theme', 'light');
        }
    }

    // Sincroniza os seletores com o estado atual no carregamento
    const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
    themeToggles.forEach(toggle => toggle.checked = isCurrentlyDark);

    // Adiciona o listener de clique a cada seletor
    themeToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            syncToggles(e.target.checked);
        });
    });

    // Ouve mudanças no sistema operacional
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Só muda se o usuário não tiver salvo uma preferência manual
        if (!localStorage.getItem('theme')) {
            syncToggles(e.matches);
        }
    });
});