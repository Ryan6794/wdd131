
const gallery = document.querySelector('.gallery');
const modal = document.querySelector('dialog');
const modalImage = modal.querySelector('img');
const closeButton = modal.querySelector('.close-viewer');

// Event listener for opening the modal
gallery.addEventListener('click', openModal);

function openModal(e) {

    //     if (e.target.tagName === 'IMG') {
    //         modalImage.src = e.target.src; // Set the modal image source to the clicked image
    //         modal.showModal(); // Show the modal
    //     }

        const img = e.target
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')

        const full = src.replace('sm', 'full') // Replace 'thumb' with 'full' in the image source


        modalImage.src = full // Set the modal image source to the full image
        modalImage.alt = alt // Set the modal image alt text to the clicked image's alt text
        modal.showModal() // Show the modal
}
// Close modal on button click
closeButton.addEventListener('click', () => {
    modal.close();
});

// Close modal if clicking outside the image
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
});
