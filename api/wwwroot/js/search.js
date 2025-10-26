document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const solutionsModal = document.querySelector('.solutionsModal');
    const solutionsModalContent = document.querySelector('.solutionsModalContent');
    const closeModalBtn = document.querySelector('.closeModal');

    let searchTimeout;
    let allSolutions = [];

    loadAllSolutions();

    searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
            searchBar.classList.remove('active');
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    async function loadAllSolutions() {
        try {
            const response = await fetch('/api/imagemodel');
            const data = await response.json();
            allSolutions = data.filter(item => item.destination === "solutions");
        } catch (error) {
            console.error('Error loading solutions:', error);
        }
    }

    function performSearch(query) {
        const results = allSolutions.filter(solution => {
            if (!solution) return false;
            
            const title = solution.name || solution.title || '';
            const description = solution.description || '';
            
            const titleMatch = title.toLowerCase().includes(query);
            const descMatch = description.toLowerCase().includes(query);
            
            return titleMatch || descMatch;
        });

        displayResults(results);
    }

    function displayResults(results) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<span class="searchResultItem">Ничего не найдено</span>';
            return;
        }

        results.forEach(solution => {
            if (!solution) return;
            
            const resultItem = document.createElement('div');
            resultItem.className = 'searchResultItem';
            
            const title = solution.name || solution.title || 'Без названия';
            const description = solution.description || 'Нет описания';
            
            resultItem.innerHTML = `
                <span class="resultTitle">${title}</span>
                <span class="resultDescription">${description.substring(0, 100)}...</span>
            `;

            resultItem.addEventListener('click', () => {
                showSolutionInModal(solution);
                searchBar.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
            });

            searchResults.appendChild(resultItem);
        });
    }

    function showSolutionInModal(solution) {
        if (!solution) return;
        
        solutionsModalContent.innerHTML = '';

        const modalImage = document.createElement('img');
        modalImage.src = `data:${solution.imageType};base64,${solution.imgData}`;
        modalImage.className = 'modalImage';

        const modalText = document.createElement('div');
        modalText.className = 'modalText';

        const modalTitle = document.createElement('div');
        modalTitle.className = 'modalTitle';
        modalTitle.textContent = solution.name || solution.title || 'Без названия';

        const modalDescription = document.createElement('div');
        modalDescription.className = 'modalDescription';
        modalDescription.textContent = solution.description || 'Нет описания';

        const modalLink = document.createElement('div');
        modalLink.className = 'modalLink';
        modalLink.innerHTML = '<a href="https://vk.com/neonovvo" target="_blank">Больше примеров работ в нашей группе в VK</a>';

        modalText.appendChild(modalTitle);
        modalText.appendChild(modalDescription);
        modalText.appendChild(modalLink);

        solutionsModalContent.appendChild(modalImage);
        solutionsModalContent.appendChild(modalText);

        solutionsModal.style.display = 'block';
        document.body.style.overflow = "hidden";
    }

    closeModalBtn.addEventListener('click', () => {
        solutionsModalContent.innerHTML = '';
        document.body.style.overflow = '';
        solutionsModal.style.display = 'none';
    });
});
