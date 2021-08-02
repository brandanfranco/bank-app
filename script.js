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
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-11T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-07-19T17:01:17.194Z',
    '2021-07-20T23:36:17.929Z',
    '2021-07-22T10:51:36.790Z',
  ],
  local: 'en-US',
  currency: 'USD',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-11T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  local: 'de-DE',
  currency: 'EUR',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-11T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  local: 'de-DE',
  currency: 'EUR',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-11T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-27T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  local: 'de-DE',
  currency: 'EUR',
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

const formatMovementDate = (date, local) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago `;

  /* const day = `${date.getDay()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear(); */

  return new Intl.DateTimeFormat(local).format(date);
};

const formatCurr = function (value, local, currency) {
  return new Intl.NumberFormat(local, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.local);

    const formattedMov = formatCurr(mov, acc.local, acc.currency);

    new Intl.NumberFormat(acc.local, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + i
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(e => e[0])
      .join('');
  });
};

createUserNames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);

  balanceTotal(acc);

  calculateDisplaySummary(acc);
};

const calculateDisplaySummary = function (acc) {
  const saldo = acc.movements
    .filter(function (e) {
      return e > 0;
    })
    .reduce(function (acum, valor) {
      return acum + valor;
    }, 0);

  labelSumIn.textContent = formatCurr(saldo, acc.local, acc.currency);

  const out = acc.movements
    .filter(function (e) {
      return e < 0;
    })
    .reduce(function (acum, valor) {
      return acum + valor;
    }, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out), acc.local, acc.currency);

  const interest = acc.movements
    .filter(function (e) {
      return e > 0;
    })
    .map(function (e) {
      return (e * acc.interestRate) / 100;
    })
    .filter(function (e) {
      return e >= 1;
    })
    .reduce(function (acum, valor) {
      return acum + valor;
    }, 0);

  labelSumInterest.textContent = formatCurr(interest, acc.local, acc.currency);
};

const balanceTotal = function (acc) {
  acc.balance = acc.movements.reduce(function (acumulador, valor) {
    return acumulador + valor;
  }, 0);

  labelBalance.textContent = formatCurr(acc.balance, acc.local, acc.currency);
};

let currentAccount, timer;

const now = new Date();
const day = `${now.getDay()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = `${now.getMinutes()}`.padStart(2, 0);

labelDate.textContent = `${day}/${month}/${year} , ${hour}:${min}`;

// timer function

const timerLogout = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${second}`;
    if (time === 0) {
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 100;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//expermenting with International api

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(function (e) {
    return e.username === inputLoginUsername.value;
  });
  if (currentAccount?.pin == Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.local,
      options
    ).format(now);
    /*  const now = new Date();
    const day = `${now.getDay()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year} , ${hour}:${min}`; */

    inputLoginUsername.value = inputLoginPin.value = '';

    if (timer) clearInterval(timer);
    timer = timerLogout();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveracc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiveracc &&
    currentAccount.balance >= amount &&
    receiveracc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiveracc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiveracc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(timer);
    timer = timerLogout();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = timerLogout();
    }, 3000);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value === currentAccount.pin)
  ) {
    const index = accounts.findIndex(function (e) {
      e.username === currentAccount.username;
    });

    accounts.splice(index);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposit = movements.filter(function (e) {
  return e > 0;
});

const withdrawals = movements.filter(e => e < 0);
console.log(deposit);
console.log(withdrawals);

const balance = movements.reduce(function (acumulador, valor) {
  return acumulador + valor;
}, 0);

console.log(balance);

/////////////////////////////////////////////////

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


const checkDogs = function (arr1, arr2) {
  const resultado1 = arr1.slice(1, 3);
  console.log(resultado1);

  const resultado2 = resultado1.concat(arr2);

  console.log(resultado2);

  resultado2.forEach(function (dog, i) {
    if (dog > 2) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old"`);
    } else {
      console.log(
        `Dog number ${i + 1} is still a puppy 🐶 with ${dog} years old `
      );
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

*/

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
*/

const eurToUsd = 1.1;

const movementsUsd = movements.map(e => e * eurToUsd);

const movementsDescription = movements.map(
  (e, i) =>
    `Movement ${i + 1}: You ${e > 0 ? 'deposited' : 'withdrew'} ${Math.abs(e)}`
);

const calcAverageHumanAge2 = function (array) {
  const resultado = array
    .map(function (e) {
      if (e <= 2) {
        return e * 2;
      }

      if (e > 2) {
        return 16 + e * 4;
      }
    })
    .filter(function (e) {
      return e >= 18;

      console.log(resultado);
    })
    .reduce(function (acumulador, valor, i, arr) {
      return acumulador + valor / arr.length;
    }, 0);

  return resultado;
};

const res = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);

const calcAverageHumanAge3 = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// adults.length
const hola = calcAverageHumanAge3([5, 2, 4, 1, 15, 8, 3]);

console.log(hola);

console.log(res);

let usuario;
for (const item of accounts) {
  if (item.owner === 'Sarah Smith') {
    usuario = item.owner;
    console.log(usuario);
  }
}

console.log(usuario);

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(function (e) {
  const recommendedFood = e.weight ** 0.75 * 28;
  console.log(recommendedFood);
});

const saraDogs = dogs.map(e => {
  return e.owners.find(e => e);
});

console.log(saraDogs);

const owners = dogs.map(e => e.owners);

console.log(owners);
