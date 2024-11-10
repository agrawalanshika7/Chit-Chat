function setVh() {
    // Pobiera wysokość widocznego ekranu i konwertuje ją na jednostkę vh
    let vh = window.innerHeight * 0.01;
    // Ustawia tę wartość jako custom property --vh
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Uruchom funkcję przy załadowaniu strony
  setVh();
  
  // Uruchom funkcję ponownie, gdy okno zostanie zmienione, co obsługuje np. obrót ekranu
  window.addEventListener('resize', setVh);