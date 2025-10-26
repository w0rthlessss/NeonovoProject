document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.querySelector('.authForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                window.location.href = '/admin';
            } else if (response.status === 401) {
                showNotification('Неверный логин или пароль.', 'error');
            } else {
                showNotification('Ошибка при входе. Попробуйте позже.', 'error');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('Ошибка сети. Попробуйте позже.', 'error');
        }
    });
});