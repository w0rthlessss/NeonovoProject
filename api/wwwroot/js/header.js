document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let scrollTimeout;
    let isNavigating = false; 

    function handleScroll() {
        if (isNavigating) return;
        
        const currentScroll = window.pageYOffset;

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            if (currentScroll > lastScroll && currentScroll > 50) {
                header.classList.add('hide');
            } else {
                header.classList.remove('hide');
            }
            lastScroll = currentScroll;
        }, 50);
    }

    window.addEventListener('scroll', handleScroll);

    const menuToggle = document.querySelector('.navigationToggle');
    const navigation = document.querySelector('.navigation');
    const body = document.body;

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navigation.classList.toggle('active');
            body.style.overflow = navigation.classList.contains('active') ? 'hidden' : '';
        });
        document.addEventListener('click', (e) => {
            if (navigation.classList.contains('active') && 
                !navigation.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navigation.classList.remove('active');
                body.style.overflow = '';
            }
        });

        const navLinks = navigation.querySelectorAll('.navigationLink');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                isNavigating = true;
                
                header.classList.remove('hide');
                
                menuToggle.classList.remove('active');
                navigation.classList.remove('active');
                body.style.overflow = '';

                const targetId = link.getAttribute('data-scroll');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                    
                    setTimeout(() => {
                        isNavigating = false;
                    }, 1000); 
                }
            });
        });
    }
}); 