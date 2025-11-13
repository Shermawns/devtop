// Selecionando elementos
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

// Alternar entre login e cadastro
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Recupera usuários do localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Salva usuários no localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Validação de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorMsg = document.getElementById('login-error');

    errorMsg.textContent = '';

    if (!email || !password) {
        errorMsg.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert(`Bem-vindo, ${user.name}!`);
        loginForm.reset();
    } else {
        errorMsg.textContent = 'Email ou senha incorretos.';
    }
});

// Validação e cadastro de novo usuário
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const dob = document.getElementById('reg-dob').value;
    const password = document.getElementById('reg-password').value.trim();
    const confirmPassword = document.getElementById('reg-confirm-password').value.trim();
    const errorMsg = document.getElementById('register-error');

    errorMsg.textContent = '';

    if (!name || !email || !dob || !password || !confirmPassword) {
        errorMsg.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = 'As senhas não coincidem.';
        return;
    }

    const users = getUsers();
    const emailExists = users.some(u => u.email === email);

    if (emailExists) {
        errorMsg.textContent = 'Este email já está cadastrado.';
        return;
    }

    // Cria novo usuário
    const newUser = { name, email, dob, password };
    users.push(newUser);
    saveUsers(users);

    alert('Cadastro realizado com sucesso!');
    registerForm.reset();

    // Volta para tela de login
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});
