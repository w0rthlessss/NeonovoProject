
const cardDescriptions = ['Индивидуальный дизайн', 'Качественная работа', 'Кратчайшие сроки'];

async function createAboutCards() {
    const response = await fetch('/api/imagemodel');
    const recievedData = await response.json();

    if(recievedData.length === 0) return;

    const aboutImages = recievedData.filter(item => item.destination === "about");

    const cardsContainer = document.querySelector('.cards');

    cardsContainer.innerHTML = '';

    cardDescriptions.forEach(element => {
        const item = aboutImages.find(el => el.description === element);

        const card = document.createElement('div');
        card.className = 'cardsItem';
        card.id = item.id;
        
        const text = document.createElement('div');
        text.className = 'cardsItemText';
        text.textContent = element;
        
        const image = document.createElement('div');
        image.className = 'cardsItemImage';
        image.style.backgroundImage = `url(data:${item.imageType};base64,${item.imgData})`;
        
        card.appendChild(text);
        card.appendChild(image);
        cardsContainer.appendChild(card);
    });

}

document.addEventListener('DOMContentLoaded', () => {
    createAboutCards();
});
