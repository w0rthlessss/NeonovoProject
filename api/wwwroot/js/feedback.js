document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackFormOpen = document.getElementById('feedbackFormOpen');
    const closeModalBtn = feedbackModal.querySelector('.closeModal');
    const closeFeedbackBtn = feedbackModal.querySelector('.closeFeedbackBtn');

    feedbackFormOpen.addEventListener('click', () => {
        feedbackModal.style.display = 'block';
    });

    function closeModal() {
        feedbackModal.style.display = 'none';
        feedbackForm.reset();
    }

    closeModalBtn.addEventListener('click', closeModal);
    closeFeedbackBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === feedbackModal) {
            closeModal();
        }
    });

    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('feedbackName').value,
            email: document.getElementById('feedbackEmail').value,
            message: document.getElementById('feedbackMessage').value
        };

        try {
            const response = await fetch('/api/FeedbackRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showNotification('Спасибо! Ваша заявка успешно отправлена.');
                closeModal();
            } else {
                showNotification('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.', 'error');
        }
    });
});
