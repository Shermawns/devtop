
const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
if (!loggedUser) {
    window.location.href = 'index.html'; // se não estiver logado
}

const openProfileModalBtn = document.getElementById('open-profile-modal-btn');
const profileModal = document.getElementById('profile-modal');
const closeProfileModalBtn = document.getElementById('close-profile-modal-btn');
const profileForm = document.getElementById('profile-form');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileMessage = document.getElementById('profile-message');
const deleteAccountBtn = document.getElementById('delete-account-btn');

const openAddModalBtn = document.getElementById('open-add-modal-btn');
const closeTaskModalBtn = document.getElementById('close-modal-btn');
const cancelTaskModalBtn = document.getElementById('cancel-modal-btn');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-detail-form');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');

const openCategoryModalBtn = document.getElementById('open-category-modal-btn');
const closeCategoryModalBtn = document.getElementById('close-category-modal-btn');
const cancelCategoryEditBtn = document.getElementById('cancel-category-edit-btn');
const categoryModal = document.getElementById('category-modal');


profileName.value = loggedUser.name;
profileEmail.value = loggedUser.email;

// Abrir e fechar modal de perfil
openProfileModalBtn.addEventListener('click', () => profileModal.classList.remove('hidden'));
closeProfileModalBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

// Atualizar nome do usuário
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    profileMessage.textContent = '';

    loggedUser.name = profileName.value.trim();

    // Salva alteração nos usuários
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.email === loggedUser.email);
    if (index !== -1) users[index].name = loggedUser.name;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

    profileMessage.textContent = 'Alterações salvas com sucesso!';
    profileMessage.style.color = 'green';
});

// Excluir conta
deleteAccountBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Isso é permanente.')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.email !== loggedUser.email);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('loggedUser');
        localStorage.removeItem(`tasks_${loggedUser.email}`);
        alert('Conta excluída com sucesso.');
        window.location.href = 'index.html';
    }
});

// Abrir modal de adicionar tarefa
openAddModalBtn.addEventListener('click', () => taskModal.classList.remove('hidden'));

// Fechar modal de tarefa
closeTaskModalBtn.addEventListener('click', () => taskModal.classList.add('hidden'));
cancelTaskModalBtn.addEventListener('click', () => taskModal.classList.add('hidden'));

// Abrir e fechar modal de categoria
openCategoryModalBtn.addEventListener('click', () => categoryModal.classList.remove('hidden'));
closeCategoryModalBtn.addEventListener('click', () => categoryModal.classList.add('hidden'));
cancelCategoryEditBtn.addEventListener('click', () => categoryModal.classList.add('hidden'));



function getTasks() {
    return JSON.parse(localStorage.getItem(`tasks_${loggedUser.email}`)) || [];
}

function saveTasks(tasks) {
    localStorage.setItem(`tasks_${loggedUser.email}`, JSON.stringify(tasks));
}

function renderTasks() {
    const tasks = getTasks();
    todoList.innerHTML = '';
    completedList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.name}</strong> - ${task.priority || 'média'}
            ${task.dueDate ? `<small> (${task.dueDate})</small>` : ''}
            <div class="task-actions">
                <button class="btn-small done-btn">${task.done ? '↩️' : '✅'}</button>
                <button class="btn-small delete-btn">🗑️</button>
            </div>
        `;

        if (task.done) completedList.appendChild(li);
        else todoList.appendChild(li);

        // Botões
        li.querySelector('.done-btn').addEventListener('click', () => {
            task.done = !task.done;
            saveTasks(tasks);
            renderTasks();
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            const updated = tasks.filter(t => t !== task);
            saveTasks(updated);
            renderTasks();
        });
    });
}

// Adicionar nova tarefa
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('task-name').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;
    const category = document.getElementById('task-category').value;
    const time = document.getElementById('task-time').value;

    if (!name) {
        alert('Por favor, informe o nome da tarefa.');
        return;
    }

    const tasks = getTasks();
    tasks.push({ name, desc, dueDate, priority, category, time, done: false });
    saveTasks(tasks);

    taskForm.reset();
    taskModal.classList.add('hidden');
    renderTasks();
});

// Inicializa as tarefas ao carregar
renderTasks();
