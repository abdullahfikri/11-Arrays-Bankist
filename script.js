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

const account5 = {
  owner: 'Muhammad Fikri',
  movements: [430, 1000, 700, 50, 90, 502, 1000],
  interestRate: 1.6,
  pin: 1234,
};

const accounts = [account1, account2, account3, account4, account5];

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

///////////////////////////////////////////////////////////////////////////
// Display label.textContent -------------------------------
const displayLabel = (balance, income, outcome, interest) => {
  if (balance) {
    labelBalance.textContent = `${balance} €`;
  } else if (income) {
    labelSumIn.textContent = `${income} €`;
  } else if (outcome) {
    labelSumOut.textContent = `${outcome} €`;
  } else if (interest) {
    labelSumInterest.textContent = `${interest} €`;
  }
};

// Function display all movement current account
const displayHTMLMovement = (move, index) => {
  const type = move > 0 ? 'deposit' : 'withdrawal';
  const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
    index + 1
  } ${type}</div>
      <div class="movements__value">${move} €</div>
    </div>
    `;
  containerMovements.insertAdjacentHTML('afterbegin', html);
};

const displayEachMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;

  moves.forEach((move, index) => {
    displayHTMLMovement(move, index);
  });
};
// display movement End --------------

// Function calculating balance account
const calcPrintBalance = account => {
  account.balance = account.movements.reduce((acc, move) => acc + move, 0);
  displayLabel(account.balance);
};

const calcDisplaySummary = account => {
  const income = account.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  account.income = income;

  // Start Outcome --------------------------------
  let out = account.movements.filter(move => move < 0);
  if (out.length > 0) {
    out = out.reduce((acc, move) => acc + move);
  } else {
    out = 0;
  }
  const outcome = Math.abs(out);
  account.outcome = outcome;
  //End of outcome -----------------------------------

  const interest = account.movements
    .map(move => (move * account.interestRate) / 100)
    .filter(move => move >= 1)
    .reduce((acc, move) => acc + move)
    .toFixed(2);

  displayLabel(null, income);
  displayLabel(null, null, outcome);
  displayLabel(null, null, null, interest);
};

// Create user account ------------------------------
const createUsername = accounts =>
  accounts.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join(''))
  );
createUsername(accounts);
// Create user account end ---------------------------

//login handler -----------------------------------
let currentUsername;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentUsername = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentUsername?.pin === Number(inputLoginPin.value)) {
    // Display UI
    containerApp.style.opacity = 100;
    // Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentUsername.owner.split(' ')[0]
    }`;
    //Clear input fields -----------------
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //end clear input field --------------

    //Calculate & display balance
    calcPrintBalance(currentUsername);

    // display movement
    displayEachMovements(currentUsername.movements);

    // Calculate & display summary
    calcDisplaySummary(currentUsername);
  } else if (!currentUsername) {
    alert('Username not found');
  } else {
    alert(`Username or Password wrong`);
  }
});
//end login addEventListener ------------------------------------

//Transfer event listener start ------------------------
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const to = accounts.find(acc => acc.username === inputTransferTo.value);

  if (amount <= 0) {
    alert(`Balance can't be negative`);
  } else if (amount > currentUsername.balance) {
    alert(`You balance not enough`);
  } else if (!to) {
    alert('Receiver not found');
  } else if (to.username === currentUsername.username) {
    alert(`Receiver can't be yourself`);
  } else {
    const userMovement = currentUsername.movements;
    to.movements.push(amount); //add positive move to receiver
    userMovement.push(-amount); // add negative to current user

    const lastMovementIndex = userMovement.length - 1;

    // update ui display move -----------
    displayHTMLMovement(userMovement[lastMovementIndex], lastMovementIndex);
    // update move End -------------

    //Update balance display ------------------------
    currentUsername.balance += userMovement[lastMovementIndex];
    displayLabel(currentUsername.balance);
    // Update balance end ---------------------------

    //Update outcome summary ------------------------
    currentUsername.outcome += Math.abs(userMovement[lastMovementIndex]);
    labelSumOut.textContent = `${currentUsername.outcome} €`;
    // End update outcome summary --------------------

    //Clear input fields --------------------
    inputTransferAmount.value = inputTransferTo.value = '';

    alert(`Success transfer to ${to.username}`);
  }
});
// Transfer event listener end ------------------------------------

// Loan event handler -----------------------------------
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const requestLoan = Number(inputLoanAmount.value);
  if (currentUsername.movements.some(deposit => deposit > requestLoan * 0.1)) {
    // Add new deposit to array movements && array Balance --------
    currentUsername.movements.push(requestLoan);
    const indexLastMove = currentUsername.movements.length - 1;
    const lastMovement = currentUsername.movements[indexLastMove];
    //display update movement --------
    displayHTMLMovement(lastMovement, indexLastMove);
    //display update balance --------
    currentUsername.balance += lastMovement;
    displayLabel(currentUsername.balance);

    // Display summary income --------
    currentUsername.income += lastMovement;
    displayLabel(null, currentUsername.income);
    // Display summary income ----------
    const interest = currentUsername.movements
      .map(move => (move * currentUsername.interestRate) / 100)
      .filter(move => move >= 1)
      .reduce((acc, move) => acc + move)
      .toFixed(2);

    displayLabel(null, null, null, interest);

    // Reset form field
    alert(`Success to loan money`);
    inputLoanAmount.value = '';
  } else {
    console.log(`You'r loan can't be accepted`);
  }
});
// Loand event handler END ---------------------------

// Delete account btn event listener ------------------------------
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    currentUsername.username === inputCloseUsername.value &&
    currentUsername.pin === Number(inputClosePin.value)
  ) {
    // Delete account --------------
    accounts.splice(
      accounts.findIndex(acc => acc.username === currentUsername.username),
      1
    );
    //Reset form ---------------
    inputCloseUsername.value = inputClosePin.value = '';

    // Hide UI --------------
    containerApp.style.opacity = 0;
  } else {
    alert(`Username or Pin incorrect`);
  }
}); // Close button event end --------------------------------

// Sort the movements and display it ------------------
let sortStatus = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayEachMovements(currentUsername.movements, !sortStatus);
  sortStatus = !sortStatus;
});
// Sort the movements end --------------------------------

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
//Sort
const acc2Move = account2.movements.slice();
console.log(acc2Move);

// return < 0, A, B to keep the order
// return > 0, A, B to switch the order

//Ascending sort
acc2Move.sort((a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
});
console.log(acc2Move);

//descending Sort
acc2Move.sort((a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
});
console.log(acc2Move);
*/
/*
// Flat array Method
const arr = [1, 2, [3, 4, 5], 6, 7, [8, 9, 0]];
console.log(arr);
console.log(arr.flat());

const arrMoreDeep = [1, 2, [3, [4, 5]], 6, 7, [[8, 9], 0]];
console.log(arrMoreDeep.flat(2));

//Calculating avarage of balance
const accountsMovement = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, move, i, arr) => acc + move, 0);
console.log(accountsMovement);

// Flat map
const accountsMovement2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, move) => acc + move, 0);
console.log(accountsMovement2);
*/

// console.log(accountsMovement.flat().length);

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements.includes(-130));

//SOME Array Method
// IF one can satisfy the condition the method will return true
console.log(movements.some(move => move > 0));

//EVERY Array Method
// If all element can satisfy the condition the method will return true;
console.log(movements.every(move => move > 0));
console.log(account5.movements.every(move => move > 0));
console.log('');

//Separate callback
const deposit = move => move > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/
/*
// Find METHOD Array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(move => move < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === `Jessica Davis`);
console.log(account);

for (const mov of movements) {
  if (mov < 0) {
    console.log(mov);
    break;
  }
}

for (const acc of accounts) {
  if (acc.owner === `Jessica Davis`) {
    console.log(acc);
  }
}
*/
///////////////////////////////////////
// Coding Challenge #2 & #3

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


const calcAverageHumanAge = catAge =>
  catAge
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// const averageHumanAge =
//   humanAge.reduce((acc, age) => acc + age, 0) / humanAge.length;

const catAge1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const catAge2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(catAge1, catAge2);
*/
/*
// Reduce method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const balances = movements.reduce((acc, mov) => acc + mov, 0);
console.log(balances);

const max = movements.reduce((acc, mov) => (acc > mov ? acc : mov), 0);
const max2 = Math.max(...movements);
console.log(max, max2);
*/
/**
// Filter method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposited = movements.filter(mov => mov > 0);
const withdrawal = movements.filter(mov => mov < 0);
console.log(deposited);
console.log(withdrawal);
*/
/*
// MAP METHOD
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUSD = 1.1;

const moveOnUsd = movements.map(function (mov) {
  return mov * euroToUSD;
});
console.log(movements);
console.log(moveOnUsd);

const moveOnUsdArr = movements.map(mov => mov * euroToUSD);
console.log(moveOnUsdArr);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? `deposited` : `withdrew`} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);
*/ ///
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀

//Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:
const checkDogs = function (catsJulia, catsKate) {
  const catsJuliaNew = catsJulia.slice(1, -2);
  // console.log(catsJuliaNew);
  const concatData = catsJuliaNew.concat(catsKate);

  concatData.forEach((value, index) => {
    console.log(
      `Cat number ${index + 1} is ${
        value >= 3 ? `an adult, and is ${value} years old` : `still a puppy 🐶`
      }.`
    );
  });
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/ ///
/*
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
*/

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
