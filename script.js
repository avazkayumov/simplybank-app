"use strict";

// Simply Bank App

const account1 = {
  userName: "Cecil Ireland",
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  userName: "Amani Salt",
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  userName: "Corey Martinez",
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  userName: "Kamile Searle",
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
};

const account5 = {
  userName: "Oliver Avila",
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".total__value--in");
const labelSumOut = document.querySelector(".total__value--out");
const labelSumInterest = document.querySelector(".total__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseNickname = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");



const displayTransactions = function (transactions) {
  containerTransactions.innerHTML = "";

  transactions.forEach(function (trans, index) {
    const transType = trans > 0 ? "deposit" : "withdrawal";

    const transactionRow = `
      <div class="transactions__row">
        <div class="transactions__type transactions__type--${transType}">
          ${index + 1} ${transType}
        </div>
        <div class="transactions__value">${trans}</div>
      </div>
    `;

    containerTransactions.insertAdjacentHTML("afterbegin", transactionRow);
  });
};

// displayTransactions(account1.transactions);

const createNicknames = function (accs) {
  accs.forEach(function (acc) {
    acc.nickName = acc.userName
      .toLocaleLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};

createNicknames(accounts);
// console.log(accounts);

// const userName = "Oliver Avila"; //nickname = 'oa'
// const nickName = userName
//   .toLocaleLowerCase()
//   .split(" ")
//   .map((word) => word[0])
//   .join("");

// console.log(nickName);

const displayBalance = function (account) {
  const balance = account.transactions.reduce(function (acc, trans) {
    return acc + trans;
  });
  account.balance = balance
  labelBalance.textContent = `${balance}$`;
};

const displayTotal = function(currentAccount) {
  const depositesTotal = currentAccount.transactions.filter(trans => trans > 0).reduce((acc, trans) => acc + trans, 0)
  labelSumIn.textContent = depositesTotal

  const withdrawalsTotal = currentAccount.transactions.filter(trans => trans < 0).reduce((acc, trans) => acc + trans, 0)
  labelSumOut.textContent = withdrawalsTotal

  const interestTotal = currentAccount.transactions.filter(trans => trans > 0)
  .map(depos => (depos * currentAccount.interest) / 100)
  .filter(interest => interest > 5)
  .reduce((acc, interest) => acc + interest)
  labelSumInterest.textContent = interestTotal
}

//Method find()
// const coreyMartinesAccount = accounts.find(account => account.userName === 'Corey Martinez')
// console.log(coreyMartinesAccount)


const updateUI = function(currentAccount) {
  // Display transactions
  displayTransactions(currentAccount.transactions)

  // Display balance
  displayBalance(currentAccount)
  
  // Display total
  displayTotal(currentAccount)
}

let currentAccount;

btnLogin.addEventListener('click', function(e) {
  e.preventDefault()
  
  currentAccount = accounts.find(account => account.nickName === inputLoginUsername.value)
  console.log(currentAccount)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Рады, что вы снова с нами, ${currentAccount.userName.split(' ')[0]}`
    containerApp.style.opacity = 100

    // Clear input
    inputLoginUsername.value = ""
    inputLoginPin.value = ""
    inputLoginPin.blur()

    updateUI(currentAccount)
  }
})

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault()

  const recipientNickname = inputTransferTo.value
  const transferAmount = inputTransferAmount.value

  const recipientAccount = accounts.find(account => account.nickName === recipientNickname)

  inputTransferTo.value = ""
  inputTransferAmount.value = ""

  if (transferAmount > 0 && currentAccount.balance >= transferAmount && recipientAccount && currentAccount.nickName !== recipientAccount?.nickName) {
    currentAccount.transactions.push(-transferAmount)
    recipientAccount.transactions.push(Number(transferAmount))

    updateUI(currentAccount)
  }
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault()

  if(currentAccount.nickName === inputCloseNickname.value && currentAccount.pin === Number(inputClosePin.value)) {
    const currentAccountIndex = accounts.findIndex(account => account.nickName === currentAccount.nickName)
    
    accounts.splice(currentAccountIndex, 1)
    containerApp.style.opacity = 0 
    labelWelcome.textContent = "Войдите в свой аккаунт"
  }

  inputCloseNickname.value = ""
  inputClosePin.value = ""
})

btnLoan.addEventListener('click', function(e) {
  e.preventDefault()
  
  const loanAmount = Number(inputLoanAmount.value)

  if(loanAmount > 0 && currentAccount.transactions.some(trans => trans >= (loanAmount * 10) / 100)) {
    currentAccount.transactions.push(loanAmount)
    updateUI(currentAccount)
  }
  inputLoanAmount.value = ''
})