import { splitPayment } from "./math.ts";

if ((window as any).__paylater) {
  throw new Error('paylater.js has already been loaded. Remove the duplicate script tag.');
}
(window as any).__paylater = true;

const priceEls = document.querySelectorAll<HTMLElement>('[data-paylater-amount]');

priceEls.forEach(el => {
  const attr = el.dataset.paylaterAmount;
  const amt = parseFloat(attr ?? ''); // default amt to 0 if undefined

  if (!attr || isNaN(amt) || amt <= 0) { // handle cases where attributes are missing, not a number or less than 0
    console.warn('paylater.js: invalid or missing data-paylater-amount on element', el);
    return;
  }

  const amtInCents = Math.round(amt * 100);
  const perPayment = splitPayment(amtInCents, 4);

  const formatter = new Intl.NumberFormat(navigator.language, { // use browser locale to handle currency formatting
    style: 'currency',
    currency: el.dataset.paylaterCurrency ?? 'USD', // default to USD if undefined
  });

  const msgEl = document.createElement('p');
  msgEl.className = 'paylater-message';
  msgEl.textContent = `or 4 payments of ${formatter.format(perPayment / 100)}`;
  el.insertAdjacentElement('afterend', msgEl);
});
