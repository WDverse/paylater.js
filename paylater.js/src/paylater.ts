import { splitPayment } from "./math.ts";
const priceEls = document.querySelectorAll<HTMLElement>('[data-paylater-amount]');

priceEls.forEach (el => {
  const amt =  parseFloat(el.dataset.paylaterAmount ?? '0');
  const amtInCents = Math.round(amt * 100);
  const perPayment = splitPayment(amtInCents, 4);
  const displayedPrice = (perPayment/100).toFixed(2);

  const msgEl = document.createElement('p');
  msgEl.className = 'paylater-message';
  msgEl.textContent = `or 4 payments of $${displayedPrice}`;
  el.insertAdjacentElement('afterend', msgEl)
})