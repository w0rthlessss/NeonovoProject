async function setUpIntro() {
    const response = await fetch('/api/imagemodel');
    const recievedData = await response.json();

    if(recievedData.length === 0) return;

    const sliderImages = recievedData.filter(item => item.destination === "intro");
    
    sliderImages.sort((a,b) => (a.description - b.description)).slice(0,7);

    const config = {
        slideInterval: 7000,  
        transitionTime: 1000, 
        fillAnimationTime: 7000 
    };

    const sliderInner = document.querySelector('.sliderInner');
    const sliderProgress = document.querySelector('.sliderProgress');
    
    function createSliderElements() {
        sliderInner.innerHTML = '';
        sliderProgress.innerHTML = '';

        sliderImages.forEach((image, index) => {
            const sliderItem = document.createElement('div');
            sliderItem.className = 'sliderItem';
            sliderItem.style.backgroundImage = `url(data:${image.imageType};base64,${image.imgData})`;
            sliderItem.setAttribute('data-alt', image.description);
            
            sliderInner.appendChild(sliderItem);
            
            const progressSlide = document.createElement('div');
            progressSlide.className = 'progressSlide';

            sliderProgress.appendChild(progressSlide);
        });
        
        const firstSliderItem = sliderInner.querySelector('.sliderItem');
        const firstProgressSlide = sliderProgress.querySelector('.progressSlide');
        
        if (firstSliderItem && firstProgressSlide) {
            firstSliderItem.classList.add('active');
            firstProgressSlide.classList.add('active');
        }
}

function setAnimationDuration() {
        const style = document.createElement('style');
        style.textContent = `
            .progressSlide.active:after {
                animation: fillUp ${config.fillAnimationTime}ms linear forwards;
            }
            
            @keyframes fillUp {
                0% { width: 0; }
                100% { width: 100%; }
            }
        `;
        document.head.appendChild(style);
}

function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;

        sliderItems[currentSlide].classList.remove('active');
        progressSlides[currentSlide].classList.remove('active');
        progressSlides[currentSlide].classList.add('completed');

        currentSlide = (currentSlide + 1) % sliderItems.length;

        sliderItems[currentSlide].classList.add('active');
        progressSlides[currentSlide].classList.add('active');

        setTimeout(() => {
            isAnimating = false;
        }, config.transitionTime);
}

    createSliderElements();
    setAnimationDuration();
    
    const sliderItems = document.querySelectorAll('.sliderItem');
    const progressSlides = document.querySelectorAll('.progressSlide');
    let currentSlide = 0;
    let isAnimating = false;

    setInterval(nextSlide, config.slideInterval);

}

document.addEventListener('DOMContentLoaded', () => {
    setUpIntro();
});
