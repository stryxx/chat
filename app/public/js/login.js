document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#login-form');

    checkUserSession();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateLogin()) {
            submitLogin();
        }
    });

    function getJwtToken() {
        return localStorage.getItem("jwt_token");
    }

    function checkUserSession() {
        const token = getJwtToken();
        if (!token) {
            localStorage.removeItem("user");
        } else {
            window.location.href = "/screen";
        }
    }

    function validateLogin() {
        let valid = true;
        const username = document.querySelector('#login-email').value.trim();
        const password = document.querySelector('#login-password').value;
        const usernameError = document.querySelector('#login-email-error');
        const passwordError = document.querySelector('#login-password-error');
        usernameError.textContent = '';
        passwordError.textContent = '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            usernameError.textContent = 'Proszę podać poprawny adres email.';
            valid = false;
        }
        if (password.length < 1) {
            passwordError.textContent = 'Proszę podać hasło.';
            valid = false;
        }
        return valid;
    }

    function submitLogin() {
        const formData = {
            email: document.querySelector('#login-email').value.trim(),
            password: document.querySelector('#login-password').value
        };

        fetch('/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (!data.token) {
                    document.querySelector('#login-result-message').textContent = data.error || 'Błąd logowania.';
                } else {
                    localStorage.setItem('jwt_token', data.token);
                    localStorage.setItem('user', JSON.stringify({ email: formData.email }));
                    document.querySelector('#login-result-message').textContent = 'Logowanie pomyślne.';
                    setTimeout(() => { window.location.href = "/screen"; }, 500);
                }
            })
            .catch(error => {
                document.querySelector('#login-result-message').textContent = 'Wystąpił błąd podczas logowania.';
            });
    }
});
