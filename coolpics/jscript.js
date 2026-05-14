// --- Menu Toggle ---
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');

menuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
});

// --- Modal ---
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');

// Open modal when any gallery image is clicked
const galleryImages = document.querySelectorAll('.gallery img');

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.remove('hidden');
    });
});

// Close functions
function closeModal() {
    modal.classList.add('hidden');
    modalImg.src = '';
}

// Close via X button
modalClose.addEventListener('click', closeModal);

// Close via clicking the overlay (outside the image)
modalOverlay.addEventListener('click', closeModal);

// Close via Esc key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});