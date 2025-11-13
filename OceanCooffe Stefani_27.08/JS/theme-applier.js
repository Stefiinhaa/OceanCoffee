(function() {
    // Verifica o tema salvo ou a preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.add('light-mode');
    }
})();