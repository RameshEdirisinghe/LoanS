// Config.js
const Config = {
  appName: 'Loan Calculator',
  version: '1.0.0',
  apiUrl: 'https://api.example.com',
};

export default Config;

export class DateUtil {
  static formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  static parseDate(dateString) {
    return new Date(Date.parse(dateString));
  }
}

// Graph.js
import { Chart } from 'chart.js';

export class Graph {
  constructor(canvasId) {
    this.ctx = document.getElementById(canvasId).getContext('2d');
  }

  render(data, options) {
    new Chart(this.ctx, {
      type: 'line',
      data: data,
      options: options
    });
  }
}

// Loan.js
export class Loan {
  constructor(principal, interestRate, term) {
    this.principal = principal;
    this.interestRate = interestRate;
    this.term = term;
  }

  calculateMonthlyPayment() {
    const monthlyRate = this.interestRate / 12 / 100;
    const numberOfPayments = this.term * 12;
    return this.principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  }

  getAmortizationSchedule() {
    const schedule = [];
    let balance = this.principal;
    const monthlyPayment = this.calculateMonthlyPayment();
    const monthlyRate = this.interestRate / 12 / 100;

    for (let i = 0; i < this.term * 12; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      schedule.push({ month: i + 1, principal: principal, interest: interest, balance: balance });
    }

    return schedule;
  }
}

// LoanApp.js
import Config from './Config.js';
import { Loan } from './Loan.js';
import { Graph } from './Graph.js';
import { DateUtil } from './Date.js';

export class LoanApp {
  constructor() {
    this.config = Config;
    this.loan = null;
    this.graph = new Graph('loanGraph');
  }

  initialize() {
    document.getElementById('appTitle').textContent = this.config.appName;
    document.getElementById('calculateButton').addEventListener('click', () => this.calculateLoan());
  }

  calculateLoan() {
    const principal = parseFloat(document.getElementById('principal').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const term = parseInt(document.getElementById('term').value);

    this.loan = new Loan(principal, interestRate, term);
    this.displayResults();
    this.renderGraph();
  }

  displayResults() {
    const monthlyPayment = this.loan.calculateMonthlyPayment();
    document.getElementById('monthlyPayment').textContent = monthlyPayment.toFixed(2);
  }

  renderGraph() {
    const schedule = this.loan.getAmortizationSchedule();
    const data = {
      labels: schedule.map(item => `Month ${item.month}`),
      datasets: [{
        label: 'Remaining Balance',
        data: schedule.map(item => item.balance),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    this.graph.render(data, options);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new LoanApp();
  app.initialize();
});

// ResultBar.js
export class ResultBar {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
  }

  update(content) {
    this.element.textContent = content;
  }
}

// TotalResults.js
import { Loan } from './Loan.js';

export class TotalResults {
  constructor(loans) {
    this.loans = loans.map(loanData => new Loan(loanData.principal, loanData.interestRate, loanData.term));
  }

  calculateTotalMonthlyPayment() {
    return this.loans.reduce((total, loan) => total + loan.calculateMonthlyPayment(), 0);
  }

  displayResults(elementId) {
    const totalMonthlyPayment = this.calculateTotalMonthlyPayment();
    document.getElementById(elementId).textContent = `Total Monthly Payment: ${totalMonthlyPayment.toFixed(2)}`;
  }
}

// Unburyme.js
import { LoanApp } from './LoanApp.js';

document.addEventListener('DOMContentLoaded', () => {
  const loanApp = new LoanApp();
  loanApp.initialize();
});

// interface.js
import { Loan } from './Loan.js';

export class Interface {
  constructor() {
    this.loan = null;
  }

  createLoan(principal, interestRate, term) {
    this.loan = new Loan(principal, interestRate, term);
  }

  displayLoanDetails(elementId) {
    if (this.loan) {
      const details = `
        Principal: ${this.loan.principal}
        Interest Rate: ${this.loan.interestRate}
        Term: ${this.loan.term}
        Monthly Payment: ${this.loan.calculateMonthlyPayment().toFixed(2)}
      `;
      document.getElementById(elementId).textContent = details;
    }
  }
}
