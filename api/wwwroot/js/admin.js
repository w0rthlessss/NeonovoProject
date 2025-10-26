document.addEventListener('DOMContentLoaded', async function() {
    await checkAuth();

    const modelButtons = document.querySelectorAll('.modelButton');
    const imageSection = document.getElementById('imageModelSection');
    const priceListSection = document.getElementById('priceListSection');
    const feedbackSection = document.getElementById('feedbackSection');

    modelButtons.forEach(button => {
        button.addEventListener('click', () => {
            modelButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const model = button.dataset.model;
            imageSection.classList.add('hidden');
            priceListSection.classList.add('hidden');
            feedbackSection.classList.add('hidden');

            switch(model) {
                case 'image':
                    imageSection.classList.remove('hidden');
                    break;
                case 'priceList':
                    priceListSection.classList.remove('hidden');
                    break;
                case 'feedback':
                    feedbackSection.classList.remove('hidden');
                    break;
            }
        });
    });

    const imageModelForm = document.getElementById('imageModelForm');

    imageModelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const recordId = document.getElementById('imageRecordId').value;
        const file = document.getElementById('imageData').files[0];
        
        if (file) formData.append('file', file);
        formData.append('name', document.getElementById('name').value);
        formData.append('imageType', document.getElementById('imageType').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('destination', document.getElementById('destination').value);

        try {
            const response = await fetch(`/api/AdminPanel/${recordId ? `updateImage/${recordId}` : 'uploadImage'}`, {
                method: recordId ? 'PUT' : 'POST',
                body: formData
            });

            if (response.ok) {
                await loadImageData();
                imageModelForm.reset();
                document.getElementById('imageRecordId').value = '';
                showNotification('Запись успешно сохранена');
            } else {
                showNotification('Ошибка при сохранении записи', 'error');
            }
        } catch (error) {
            console.error('Error saving image data:', error);
            showNotification('Ошибка при сохранении записи', 'error');
        }
    });

    const priceListForm = document.getElementById('priceListForm');

    priceListForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            title: document.getElementById('title').value,
            price: parseInt(document.getElementById('price').value)
        };
        const recordId = document.getElementById('priceListRecordId').value;

        try {
            const response = await fetch(`/api/AdminPanel/${recordId ? `updatePriceList/${recordId}` : 'uploadPriceList'}`, {
                method: recordId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await loadPriceListData();
                priceListForm.reset();
                document.getElementById('priceListRecordId').value = '';
                showNotification('Запись успешно сохранена');
            } else {
                showNotification('Ошибка при сохранении записи', 'error');
            }
        } catch (error) {
            console.error('Error saving price list data:', error);
            showNotification('Ошибка при сохранении записи', 'error');
        }
    });

    document.querySelectorAll('.clearBtn').forEach(button => {
        button.addEventListener('click', () => {
            const form = button.closest('form');
            form.reset();
            form.querySelector('input[type="hidden"]').value = '';
        });
    });

    await loadImageData();
    await loadPriceListData();
    await loadFeedbackData();
});

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (!data.isAuthenticated) {
            window.location.href = '/auth';
        }
    } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        window.location.href = '/auth';
    }
}

async function loadImageData() {
    try {
        const response = await fetch('/api/AdminPanel/getImages');
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error(`Server returned ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        const tableBody = document.getElementById('imageTableBody');
        
        tableBody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td><img src="data:${item.imageType};base64,${item.imgData}" alt="${item.name}" style="max-width: 100px;"></td>
                <td>${item.imageType}</td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.destination}</td>
                <td>
                    <button class="actionButton" onclick="editImageRecord(${item.id})">Редактировать</button>
                    <button class="actionButton" onclick="deleteImageRecord(${item.id})">Удалить</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading image data:', error);
        showNotification('Ошибка при загрузке данных: ' + error.message, 'error');
    }
}

async function loadPriceListData() {
    try {
        const response = await fetch('/api/AdminPanel/getPriceList');
        const data = await response.json();
        const tableBody = document.getElementById('priceListTableBody');
        
        tableBody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.price}</td>
                <td>
                    <button class="actionButton" onclick="editPriceListRecord(${item.id})">Редактировать</button>
                    <button class="actionButton" onclick="deletePriceListRecord(${item.id})">Удалить</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading price list data:', error);
        showNotification('Ошибка при загрузке данных', 'error');
    }
}

async function loadFeedbackData() {
    try {
        const response = await fetch('/api/AdminPanel/getFeedbackRequests');
        const data = await response.json();
        const tableBody = document.getElementById('feedbackTableBody');
        
        tableBody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.message}</td>
                <td>
                    <button class="actionButton" onclick="deletePriceListRecord(${item.id})">Удалить</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading price list data:', error);
        showNotification('Ошибка при загрузке данных', 'error');
    }
}

async function editImageRecord(id) {
    try {
        const response = await fetch(`/api/AdminPanel/getImages`);
        const data = await response.json();
        const record = data.find(x => x.id === id);
        
        if (!record) return;

        document.getElementById('imageRecordId').value = record.id;
        document.getElementById('imageType').value = record.imageType;
        document.getElementById('name').value = record.name;
        document.getElementById('description').value = record.description;
        document.getElementById('destination').value = record.destination;
        
        // Switch to image model section
        document.querySelector('[data-model="image"]').click();
        
        // Scroll to form
        document.getElementById('imageModelForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Error loading image record:', error);
        showNotification('Ошибка при загрузке записи', 'error');
    }
}

async function editPriceListRecord(id) {
    try {
        const response = await fetch(`/api/PriceListModel/${id}`);
        const data = await response.json();
        
        document.getElementById('priceListRecordId').value = data.id;
        document.getElementById('title').value = data.title;
        document.getElementById('price').value = data.price;
        
        document.querySelector('[data-model="priceList"]').click();
        
        document.getElementById('priceListForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Error loading price list record:', error);
        showNotification('Ошибка при загрузке записи', 'error');
    }
}

async function deleteImageRecord(id) {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        try {
            const response = await fetch(`/api/AdminPanel/deleteImage/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await loadImageData();
                showNotification('Запись успешно удалена');
            } else {
                showNotification('Ошибка при удалении', 'error');
            }
        } catch (error) {
            console.error('Error deleting image record:', error);
            showNotification('Ошибка при удалении', 'error');
        }
    }
}

async function deletePriceListRecord(id) {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        try {
            const response = await fetch(`/api/AdminPanel/deletePriceList/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadPriceListData();
                showNotification('Запись успешно удалена');
            } else {
                showNotification('Ошибка при удалении', 'error');
            }
        } catch (error) {
            console.error('Error deleting price list record:', error);
            showNotification('Ошибка при удалении', 'error');
        }
    }
}

async function deleteFeedbackRequestRecord(id) {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        try {
            const response = await fetch(`/api/AdminPanel/deleteFeedbackRequest/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadFeedbackData();
                showNotification('Запись успешно удалена');
            } else {
                showNotification('Ошибка при удалении', 'error');
            }
        } catch (error) {
            console.error('Error deleting price list record:', error);
            showNotification('Ошибка при удалении', 'error');
        }
    }
}
