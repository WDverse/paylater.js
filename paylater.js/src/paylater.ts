import { splitPayment } from "./math.ts";
const priceEls = document.querySelectorAll<HTMLElement>('[data-paylater-amount]');

priceEls.forEach (el => {
  const amt = parseFloat(el.dataset.paylaterAmount ?? '0'); // default amt to 0 if undefined
  const amtInCents = Math.round(amt * 100);
  const perPayment = splitPayment(amtInCents, 4);

  const formatter = new Intl.NumberFormat(navigator.language, { //use browser locale to handle currency formatting
    style: 'currency',
    currency: el.dataset.paylaterCurrency ?? 'USD', // default to USD if undefined
  });

  const msgEl = document.createElement('p');
  msgEl.className = 'paylater-message';
  msgEl.textContent = `or 4 payments of ${formatter.format(perPayment / 100)}`;
  el.insertAdjacentElement('afterend', msgEl)
})