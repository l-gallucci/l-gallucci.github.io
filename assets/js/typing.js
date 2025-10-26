let typingTimeout;
let speed = 35;
const target = document.getElementById('typed-text');
const tabs = document.querySelectorAll('.tab');

// Funzione di typing
function typeText(text, i = 0) {
  target.innerHTML = '';
  clearTimeout(typingTimeout);

  function typeChar() {
    if (i < text.length) {
      target.innerHTML += text.charAt(i);
      i++;
      typingTimeout = setTimeout(typeChar, speed);
    }
  }
  typeChar();
}

// Attiva tab
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    typeText(tab.getAttribute('data-text'));
  });
});

// Typing iniziale
document.addEventListener('DOMContentLoaded', () => {
  const firstTab = document.querySelector('.tab.active');
  if (firstTab) typeText(firstTab.getAttribute('data-text'));
});