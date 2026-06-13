// Character
const character = {
    name: 'Snortleblat',
    class: 'Swamp Beast Diplomat',
    level: 5,
    health: 60,
    image: 'images/snortleblat.webp',

    attack: function () {
        this.health -= 20;
        if (this.health <= 0) {
            this.health = 0;
            renderCard();
            alert('Character Died');
        } else {
            renderCard();
        }
    },

    levelUp: function () {
        this.level += 1;
        renderCard();
    }
};

// Render 
function renderCard() {
    document.querySelector('#character-name').textContent = character.name;
    document.querySelector('#character-class').textContent = `Class: ${character.class}`;
    document.querySelector('#character-level').textContent = `Level: ${character.level}`;
    document.querySelector('#character-health').textContent = `Health: ${character.health}`;

    const img = document.querySelector('#character-image');
    img.setAttribute('src', character.image);
    img.setAttribute('alt', `${character.name} the ${character.class}`);
}

// Event Listeners
document.querySelector('#btn-attack').addEventListener('click', function () {
    character.attack();
});

document.querySelector('#btn-level-up').addEventListener('click', function () {
    character.levelUp();
});

// Initial Render
renderCard();