document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registration-form');
    const resultMessage = document.querySelector('#result-message');
    const securityMessage = document.querySelector('#security-message');
    const securityCodeInput = document.querySelector('#security-code');

    function updateSecurityInfo() {
        const selectedOption = document.querySelector('input[name="security-option"]:checked').value;
        if (selectedOption === 'pin') {
            securityMessage.textContent = 'Wybrano: 6-cyfrowy PIN. Wprowadź dokładnie 6 cyfr.';
            securityCodeInput.placeholder = 'Wprowadź 6-cyfrowy PIN';
            securityCodeInput.maxLength = 6;
        } else if (selectedOption === 'short_password') {
            securityMessage.textContent = 'Wybrano: 10-znakowe krótkie hasło. Wprowadź dokładnie 10 znaków.';
            securityCodeInput.placeholder = 'Wprowadź 10-znakowe hasło';
            securityCodeInput.maxLength = 10;
        }
    }

    const radioButtons = document.querySelectorAll('input[name="security-option"]');
    radioButtons.forEach(radio => radio.addEventListener('change', updateSecurityInfo));
    updateSecurityInfo();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validatePageData() && validatePagePassword() && validatePageSecurity()) {
            submitForm();
        }
    });

    function validatePageData() {
        let valid = true;
        const email = document.querySelector('#email').value.trim();
        const username = document.querySelector('#username').value.trim();
        const emailError = document.querySelector('#email-error');
        const usernameError = document.querySelector('#username-error');
        emailError.textContent = '';
        usernameError.textContent = '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Proszę podać poprawny adres email.';
            valid = false;
        }
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(username)) {
            usernameError.textContent = 'Nazwa użytkownika może zawierać tylko litery, cyfry, _ i -.';
            valid = false;
        }
        return valid;
    }

    function validatePagePassword() {
        let valid = true;
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;
        const passwordError = document.querySelector('#password-error');
        const confirmPasswordError = document.querySelector('#confirm-password-error');
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
        if (!passwordRegex.test(password)) {
            passwordError.textContent = 'Hasło musi mieć minimum 10 znaków i zawierać duże i małe litery, cyfry oraz znaki specjalne.';
            valid = false;
        }
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Hasła nie są identyczne.';
            valid = false;
        }
        return valid;
    }

    function validatePageSecurity() {
        let valid = true;
        const securityCode = securityCodeInput.value.trim();
        const securityCodeError = document.querySelector('#security-code-error');
        securityCodeError.textContent = '';
        const selectedOption = document.querySelector('input[name="security-option"]:checked').value;
        if (selectedOption === 'pin') {
            const pinRegex = /^[0-9]{6}$/;
            if (!pinRegex.test(securityCode)) {
                securityCodeError.textContent = 'Kod musi być 6-cyfrowym PIN-em.';
                valid = false;
            }
        } else if (selectedOption === 'short_password') {
            if (securityCode.length !== 10) {
                securityCodeError.textContent = 'Hasło musi mieć dokładnie 10 znaków.';
                valid = false;
            }
        }
        return valid;
    }

    function submitForm() {
        const formData = {
            email: document.querySelector('#email').value.trim(),
            username: document.querySelector('#username').value.trim(),
            password: document.querySelector('#password').value,
            security_option: document.querySelector('input[name="security-option"]:checked').value,
            security_code: securityCodeInput.value.trim()
        };
        fetch('/api/v1/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if(response.status === 201) {
                    return response.json().then(data => ({ status: response.status, data }));
                }
                return response.json().then(data => Promise.reject({ status: response.status, data }));
            })
            .then(({ data }) => {
                resultMessage.textContent = "Zostałeś poprawnie zarejestrowany";
                resultMessage.classList.add('success');
                form.reset();
                updateSecurityInfo();
                resultMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            })
            .catch(error => {
                resultMessage.textContent = error.data.message || 'Wystąpił błąd podczas rejestracji.';
                resultMessage.classList.remove('success');
                resultMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
    }
});
