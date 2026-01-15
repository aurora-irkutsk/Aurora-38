// =============
// Инициализация после загрузки DOM
// =============
document.addEventListener('DOMContentLoaded', function () {
  initGallery();
  initBurgerMenu();
  initCallModal();
  initPhoneValidation(); // ← добавлена валидация телефона
});

// =============
// Галерея (Lightbox)
// =============
function initGallery() {
  // Отключаем галерею на мобильных и планшетах
  if (window.innerWidth < 768) {
    return;
  }

  const imageModal = document.getElementById('imageModal');
  if (!imageModal) return;

  const modalImg = document.getElementById('modalImage');
  const closeBtn = imageModal.querySelector('.modal__close');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('imageCounter');
  const images = document.querySelectorAll('.portfolio__item img');

  if (images.length === 0) return;

  let currentIndex = 0;

  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      imageModal.style.display = 'block';
      updateCounter();
      document.body.style.overflow = 'hidden';
    });
  });

  function updateCounter() {
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  const closeModal = () => {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeModal();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
      updateCounter();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
      updateCounter();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (imageModal.style.display !== 'block') return;
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'Escape') closeModal();
  });
}

// =============
// Бургер-меню
// =============
function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Если элементов нет — выходим
  if (!burger || !mobileMenu) return;

  // Переключение меню
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Закрытие по клику на ссылку
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Закрытие по клику вне меню
  document.addEventListener('click', (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !burger.contains(e.target) &&
      mobileMenu.classList.contains('active')
    ) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}

// =============
// Попап "Вызвать мастера"
// =============
function initCallModal() {
  const callModal = document.getElementById('callModal');
  const openCallBtn = document.getElementById('openCallModal');
  const closeCallBtn = document.getElementById('closeCallModal');

  if (!callModal || !openCallBtn || !closeCallBtn) return;

  const openCallModal = () => {
    callModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  const closeCallModal = () => {
    callModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  openCallBtn.addEventListener('click', openCallModal);
  closeCallBtn.addEventListener('click', closeCallModal);

  // Закрытие по клику на оверлей
  window.addEventListener('click', (e) => {
    if (e.target === callModal) closeCallModal();
  });
}

// =============
// Валидация номера телефона и имени в форме заявки
// =============
function initPhoneValidation() {
  const form = document.getElementById('requestForm');
  if (!form) return;

  // Поля
  const nameInput = form.querySelector('input[name="name"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const submitButton = form.querySelector('.request_button');

  // Создаём элемент для ошибки динамически
  let phoneError = form.querySelector('#phoneError');
  if (!phoneError) {
    phoneError = document.createElement('div');
    phoneError.id = 'phoneError';
    phoneError.style.color = 'white'; // ← БЕЛЫЙ ЦВЕТ вместо красного
    phoneError.style.fontWeight = '500'; // ← средняя жирность (500)
    phoneError.style.fontSize = '1rem';
    phoneError.style.marginTop = '5px';
    phoneError.style.display = 'none';
    phoneError.textContent = 'Номер должен начинаться с +7 и содержать ровно 10 цифр. Пожалуйста, проверьте и исправьте.';
    
    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.parentNode.insertBefore(phoneError, button.nextSibling);
    }
  }

  // === Валидация имени: запрет на цифры ===
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      // Удаляем все цифры из имени
      nameInput.value = nameInput.value.replace(/\d/g, '');
    });
  }

  // === Валидация телефона ===
  if (phoneInput) {
    // При фокусе — подставляем +7, если поле пустое
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) {
        phoneInput.value = '+7';
      }
    });

    // При вводе — форматируем
    phoneInput.addEventListener('input', () => {
      let value = phoneInput.value;
      value = value.replace(/[^\d+]/g, ''); // Только цифры и +
      if (!value.startsWith('+')) value = '+' + value;
      if (value.startsWith('+') && !value.startsWith('+7')) value = '+7' + value.slice(1);
      if (value.length > 12) value = value.slice(0, 12); // +7 + 10 цифр = 12 символов
      phoneInput.value = value;
      phoneError.style.display = 'none'; // Скрываем ошибку при вводе
    });
  }

  // === Отправка формы ===
  form.addEventListener('submit', (e) => {
    let isValid = true;

    // Проверка имени
    if (nameInput && nameInput.value.trim().length < 2) {
      isValid = false;
      // Можно добавить ошибку для имени, но по ТЗ не требуется
    }

    // Проверка телефона
    if (phoneInput) {
      const phoneValue = phoneInput.value.trim();
      const isPhoneValid = /^(\+7\d{10})$/.test(phoneValue);
      if (!isPhoneValid) {
        isValid = false;
        phoneError.style.display = 'block';
      } else {
        phoneError.style.display = 'none';
      }
    }

    if (!isValid) {
      e.preventDefault();
      if (submitButton) submitButton.disabled = true;
    } else {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
