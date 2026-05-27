const steps = ['one', 'two', 'three'];


steps.forEach(function (step) {
    console.log(step);
});


steps.forEach(showSteps);

function showSteps(step) {
    console.log(step);
}




let myList = document.querySelector('#myList');

const stepsHtml = steps.map(listTemplate);

function listTemplate(step) {
    return `<li>${step}</li>`;
}

myList.innerHTML = stepsHtml.join('');


let grades = ['A', 'B', 'C'];

let gpaPoints = grades.map(convert);






function convert(grade) {
    switch (grade) {
        case 'A':
            points = 4;
            break;
        case 'B':
            points = 3;
            break;
        case 'C':
            points = 2;
            break;
        case 'D':
            points = 1;
            break;
        case 'F':
            points = 0;
            break;
        default:
            alert('not a valid grade');
    }
    return points;
}


let totalPoints = gpaPoints.reduce(getTotal);

function GetTotal(total, item) {
    return total + item;
}

let gpaAverage = totalPoints / gpaPoints.length;

console.log(gpaAverage);

//.filter


const words = ['watermelon', 'peach', 'apple', 'tomato', 'grape'];


const shortWords = words.filter(function (isShort) {
    return isShort.length < 6;
});

console.log(shortWords);


const myArray = [12, 34, 21, 54];
const luckyNumbers = 21;
const luckyIndex = myArray.indexOf(luckyNumbers);
console.log(luckyIndex);




let container = document.querySelector('#studentContainer');

const students = [
    { last: 'Andrus', first: 'Aaron' },
    { last: 'Masa', first: 'Manny' },
    { last: 'Tanda', first: 'Tamanda' }
];

students.forEach(function (student) {
    let name = document.createElement('div');
    name.className = 'format';

    let html = `
        <span>${student.first}</span>
        <span>${student.last}</span>
    `;
    name.innerHTML = html;
    container.appendChild(name);


})
