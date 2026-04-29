const title = document.querySelector('h1');

console.log(title);

title.textContent = 'Web Page Components';


document.querySelector('#topics').style.color = 'red';


document.getElementById('topics').style.color = 'blue';



let list = document.querySelector('.list');

list.style.border = '2px solid black';



let para = document.querySelector('p');

para.style.backgroundColor = 'lightblue';


para.classList.add('background');

// document.querySelector('body').classList.add('background');

const image = document.querySelector('img');

image.setAttribute('src', 'https://www.w3schools.com/w3images/lights.jpg');




let selectElem = document.getElementById('webdevlist');
selectElem.addEventListener('change', function () {
    let codeValue = selectElem.value;
    console.log(codeValue);
})



