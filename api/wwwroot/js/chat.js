const messages = document.querySelectorAll('.message');
const typingIndicators = document.querySelectorAll('.typingIndicator');
const chatContainer = document.querySelector('.chatContainer');
let currentMessageIndex = 0;
let animationStarted = false;

function showNextMessage() {
  if (currentMessageIndex >= messages.length) return;

  const currentMessage = messages[currentMessageIndex];
  const isOdd = currentMessageIndex % 2 === 0;

  currentMessage.classList.add('visible');

  if (isOdd && currentMessageIndex < messages.length - 1) {
    const nextTypingIndicator = typingIndicators[Math.floor(currentMessageIndex / 2)];
    const nextMessageSide = messages[currentMessageIndex + 1].classList.contains('left') ? 'typing-left' : 'typing-right';
    nextTypingIndicator.classList.add(nextMessageSide);

    setTimeout(() => {
      nextTypingIndicator.classList.add('visible');
    }, 500);

    setTimeout(() => {
      nextTypingIndicator.classList.remove('visible');
      currentMessageIndex++;
      showNextMessage();
    }, 1500);
  } else {
    setTimeout(() => {
      if (currentMessageIndex < messages.length - 1) {
        currentMessageIndex++;
        showNextMessage();
      }
    }, 1000);
  }
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !animationStarted) {
      animationStarted = true;
      showNextMessage();
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5
});

observer.observe(chatContainer);