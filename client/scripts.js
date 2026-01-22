const API = 'http://localhost:5000/api';
let user = null;
let todos = [];

// Auth functions
function getToken() { return localStorage.getItem('token'); }
function setToken(t) { localStorage.setItem('token', t); }

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
        setToken(data.token);
        user = data.user;
        showApp();
        loadTodos();
    } else {
        alert(data.message);
    }
}

async function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
        setToken(data.token);
        user = data.user;
        showApp();
        loadTodos();
    } else {
        alert(data.message);
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    user = null;
    todos = [];
    showAuth();
}

function showAuth() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
}

function showApp() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('user-name').textContent = `Hello, ${user.name}`;
}

function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

// Todo functions
async function loadTodos() {
    const res = await fetch(`${API}/todos`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    todos = await res.json();
    renderTodos();
}

function renderTodos() {
    const list = document.getElementById('todo-list');
    const empty = document.getElementById('empty-state');

    if (todos.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        updateStats();
        return;
    }

    empty.classList.add('hidden');
    list.innerHTML = todos.map(t => `
        <div class="bg-white border p-4 rounded flex items-center gap-4 ${t.completed ? 'opacity-50' : ''}">
            <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleComplete('${t._id}')">
            <div class="flex-1">
                <h3 class="${t.completed ? 'line-through' : ''}">${t.title}</h3>
                <p class="text-sm text-gray-500">${t.description || ''}</p>
            </div>
            <button onclick="openEditModal('${t._id}')" class="text-blue-500">Edit</button>
            <button onclick="handleDeleteTodo('${t._id}')" class="text-red-500">Delete</button>
        </div>
    `).join('');
    updateStats();
}

function updateStats() {
    document.getElementById('stat-total').textContent = todos.length;
    document.getElementById('stat-completed').textContent = todos.filter(t => t.completed).length;
    document.getElementById('stat-pending').textContent = todos.filter(t => !t.completed).length;
}

async function handleAddTodo() {
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    if (!title) return alert('Title required');
    const res = await fetch(`${API}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ title, description })
    });
    const todo = await res.json();
    todos.unshift(todo);
    renderTodos();
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-description').value = '';
}

async function toggleComplete(id) {
    const todo = todos.find(t => t._id === id);
    const res = await fetch(`${API}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ completed: !todo.completed })
    });
    const updated = await res.json();
    todos = todos.map(t => t._id === id ? updated : t);
    renderTodos();
}

function openEditModal(id) {
    const todo = todos.find(t => t._id === id);
    document.getElementById('edit-todo-id').value = id;
    document.getElementById('edit-title').value = todo.title;
    document.getElementById('edit-description').value = todo.description || '';
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

async function handleUpdateTodo() {
    const id = document.getElementById('edit-todo-id').value;
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-description').value;
    const res = await fetch(`${API}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ title, description })
    });
    const updated = await res.json();
    todos = todos.map(t => t._id === id ? updated : t);
    renderTodos();
    closeEditModal();
}

async function handleDeleteTodo(id) {
    await fetch(`${API}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    todos = todos.filter(t => t._id !== id);
    renderTodos();
}

// Init
async function init() {
    const token = getToken();
    if (token) {
        try {
            const res = await fetch(`${API}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                user = data.user;
                showApp();
                loadTodos();
                return;
            }
        } catch (e) { }
        localStorage.removeItem('token');
    }
    showAuth();
}

init();
