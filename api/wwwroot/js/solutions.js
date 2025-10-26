async function createSolutionCards(){
    const response = await fetch('/api/imagemodel');
    const recievedData = await response.json();

    if(recievedData.length === 0) return;

    const solutionImages = recievedData.filter(item => item.destination === "solutions").slice(0,6);


    const solutionsContainer = document.querySelector('.projectsGrid');
    const solutionsModal = document.querySelector('.solutionsModal');
    const closeModalBtn = document.querySelector('.closeModal');
    const solutionsModalContent = document.querySelector('.solutionsModalContent');

    solutionsModal.style.display = 'none';
    solutionsModalContent.innerHTML = '';
    solutionsContainer.innerHTML = '';

    solutionImages.forEach(image => {
        const project = document.createElement('div');
        const projectImage = document.createElement('img');
        projectImage.src = `data:${image.imageType};base64,${image.imgData}`;
        projectImage.className = 'solutionImage';
        project.id = image.id;
        project.className = 'solution';
        project.appendChild(projectImage);
        solutionsContainer.appendChild(project);

        project.addEventListener('click', () => {
            solutionsModalContent.innerHTML = '';

            const modalImage = document.createElement('img');
            modalImage.src = `data:${image.imageType};base64,${image.imgData}`;
            modalImage.className = 'modalImage';

            const modalText = document.createElement('div');
            modalText.className = 'modalText';

            const modalTitle = document.createElement('div');
            modalTitle.className = 'modalTitle';
            modalTitle.textContent = image.name;

            const modalDescription = document.createElement('div');
            modalDescription.className = 'modalDescription';
            modalDescription.textContent = image.description;

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
        });        

    });

    closeModalBtn.addEventListener('click', () => {
            solutionsModalContent.innerHTML = '';
            document.body.style.overflow = '';
            solutionsModal.style.display = 'none';
        });

}

document.addEventListener('DOMContentLoaded', () => {
    createSolutionCards();
});