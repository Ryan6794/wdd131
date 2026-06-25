
const simpleList = ["oranges", "grapes", "lemons", "apples", "Bananas", "watermelons", "coconuts", "broccoli", "mango"];


function compareFn(a, b) {
    if (a.price < b.price) {
        return -1;
    } else if (a.price > b.price) {
        return 1;
    }
    return 0;
}

let simpleSort = simpleList.sort(compareFn);
d
console.log(simpleSort);

let lowerList = simpleList.map(function (item) {
    return item.toLowerCase();
});
let lowerSort = lowerList.sort(compareFn);
console.log(lowerList);


let searchTerm = 'an';

function filterFruits(item) {
    return item.includes(searchTerm);
}

console.log(filterFruits);


const products = [
    {
        productName: "Wireless Mouse",
        price: 29.99
    },
    {
        productName: "Bluetooth Keyboard",
        price: 49.99
    },
    {
        productName: "Laptop Stand",
        price: 39.99
    }
];

let productSort = products.sort(compareFn);

console.log(productSort);



const animals = [
    {
        name: "Lion",
        traits: ["brave", "strong", "fierce", "wild"]
    },
    {
        name: "Elephant",
        traits: ["large", "gentle", "smart", "wild"]
    },
    {
        name: "Fox",
        traits: ["sly", "quick", "clever", "wild"]
    },
    {
        name: "Dog",
        traits: ["loyal", "friendly", "playful", "cuddly"]
    },
    {
        name: "Cat",
        traits: ["quiet", "independent", "curious", "cuddly"]
    }
];

let queryTrait = "wild";

let filterTraits = animals.filter(searchTrait);

function searchTrait(item) {
    return item.traits.find((trait) => trait.toLowerCase().includes(queryTrait.toLowerCase()));
}

console.log(filterTraits);