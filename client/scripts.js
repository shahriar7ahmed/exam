const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

if (token) {
    showApp();
    loadTodos();
}

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function showApp() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('user-name').textContent = user.name || '';
}

function showAuth() {
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    errorDiv.classList.add('hidden');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.message || 'Login failed';
            errorDiv.classList.remove('hidden');
        } else {
            token = data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showApp();
            loadTodos();
        }
    } catch (error) {
        errorDiv.textContent = 'Network error occurred';
        errorDiv.classList.remove('hidden');
    }
}

async function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');

    errorDiv.classList.add('hidden');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.message || 'Registration failed';
            errorDiv.classList.remove('hidden');
        } else {
            token = data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showApp();
            loadTodos();
        }
    } catch (error) {
        errorDiv.textContent = 'Network error occurred';
        errorDiv.classList.remove('hidden');
    }
}

function handleLogout() {
    token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAuth();
}

async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('Failed to load todos');
    }
}

function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');

    if (todos.length === 0) {
        todoList.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        todoList.innerHTML = todos.map(todo => `
            <div class="bg-white border rounded-lg p-4 flex items-center gap-4">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                    onchange="toggleTodo('${todo._id}')"
                    class="w-5 h-5 rounded border-gray-300">
                <div class="flex-1">
                    <h3 class="font-medium ${todo.completed ? 'line-through text-gray-400' : ''}">${todo.title}</h3>
                    ${todo.description ? `<p class="text-sm text-gray-500">${todo.description}</p>` : ''}
                </div>
                <button onclick="deleteTodo('${todo._id}')" class="text-red-500 hover:text-red-700">
                    Delete
                </button>
            </div>
        `).join('');
    }

    updateStats(todos);
}

function updateStats(todos) {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-pending').textContent = pending;
}

async function handleAddTodo() {
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();

    if (!title) return;

    try {
        await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });

        document.getElementById('todo-title').value = '';
        document.getElementById('todo-description').value = '';
        loadTodos();
    } catch (error) {
        console.error('Failed to add todo');
    }
}

async function toggleTodo(id) {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const todos = await response.json();
        const todo = todos.find(t => t._id === id);

        await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed: !todo.completed })
        });

        loadTodos();
    } catch (error) {
        console.error('Failed to toggle todo');
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadTodos();
    } catch (error) {
        console.error('Failed to delete todo');
    }
}