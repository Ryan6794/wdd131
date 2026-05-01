
let selectElem = document.querySelector('select');
let logo = document.querySelector('img');

selectElem.addEventListener('change', changeTheme);

function changeTheme() {
    let current = selectElem.value;
    if (current === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        if (logo) {
            logo.src = 'img/byui-logo-white.png';
            logo.onerror = function () {
                // Fallback: apply invert filter if white logo not found
                logo.src = 'img/byui_logo.webp';
                logo.style.filter = 'brightness(0) invert(1)';
            };
        }
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        if (logo) {
            logo.src = 'img/byui_logo.webp';
            logo.style.filter = '';
        }
    }
}
