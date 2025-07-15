const toggleSenha = document.getElementById('toggleSenha');
const senhaInput = document.getElementById('senha');
toggleSenha.addEventListener('click', () => {
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleSenha.classList.remove('fa-eye'); // Remove olho aberto
        toggleSenha.classList.add('fa-eye-slash'); // Adiciona olho fechado
    } else {
        senhaInput.type = 'password';
        toggleSenha.classList.remove('fa-eye-slash'); // Remove olho fechado
        toggleSenha.classList.add('fa-eye'); // Adiciona olho aberto
    }
});