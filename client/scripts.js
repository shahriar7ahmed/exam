function showRegister() {
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('register-form').classList.remove('hidden');
            }
    
            function showLogin() {
                document.getElementById('register-form').classList.add('hidden');
                document.getElementById('login-form').classList.remove('hidden');
            }
    
            async function handleLogin() {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                const errorDiv = document.getElementById('login-error');
                
                errorDiv.classList.add('hidden');
                
                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        errorDiv.textContent = data.error || 'Login failed';
                        errorDiv.classList.remove('hidden');
                    } else {
                        console.log('Login successful:', data);
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
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        errorDiv.textContent = data.error || 'Registration failed';
                        errorDiv.classList.remove('hidden');
                    } else {
                        console.log('Registration successful:', data);
                    }
                } catch (error) {
                    errorDiv.textContent = 'Network error occurred';
                    errorDiv.classList.remove('hidden');
                }
            }
           