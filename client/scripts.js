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
                
                console.log('Login attempt:', email, password);
            }
    
            async function handleRegister() {
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const errorDiv = document.getElementById('register-error');
                
                errorDiv.classList.add('hidden');
                
                console.log('Register attempt:', name, email, password);
            }