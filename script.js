'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  console.log(
    `Movement ${i + 1}: ${
      movement > 0
        ? `You deposited ${movement}`
        : `You withdraw ${Math.abs(movement)}`
    }`
  );
}

console.log(`----Using ForEach----`);
movements.forEach(function (movement, i) {
  console.log(
    `Movement ${i + 1}: ${
      movement > 0
        ? `You deposited ${movement}`
        : `You withdraw ${Math.abs(movement)}`
    }`
  );
});
console.log(`USING ARROW FUNCTIONS`);
movements.forEach((movement, index) => {
  console.log(
    `Movement ${index + 1}: ${
      movement > 0
        ? `You deposited ${movement}`
        : `You withdraw ${Math.abs(movement)}`
    }`
  );
});
console.log('');
movements.forEach((el, i, arr, th) => {
  console.log(`${(el + '').padEnd(7)} ${i}`);
  // arr.splice(-1);
});

// 0 : function(200)
// 1 : function(450)
// 2 : function(-400)
// and so on and so forth

//ForEach Map
const currenciesMap = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currenciesMap.forEach(function (value, key, map) {
  console.log(`${value} : ${key}`);
  // console.log(map);
});

//ForEach Sets
const currenciesSet = new Set(['USD', 'EUR', 'GPB', 'IDR', 'USD', 'EUR']);
console.log(currenciesSet);
currenciesSet.forEach(function (value, _, set) {
  console.log(`${value} : ${value}`);
  // console.log(set);
});

/*
let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

console.log(`SLICE METHOD`);
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-1));
console.log(arr.slice(-3));
console.log(arr.slice());
console.log([...arr]);

console.log(`SPLICE METHOD`);
console.log(arr.splice(4, 3));
console.log(arr);

////////////////////////////////
arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
console.log(arr);
let arr2 = ['z', 'y', 'x', 'w', 'v', 'u', 't', 's', 'r'];
arr2.reverse();
console.log(arr2);
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);
console.log(letters.join(' '));
*/
