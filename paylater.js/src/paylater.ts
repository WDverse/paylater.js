const priceEls = document.querySelectorAll<HTMLElement>('[data-paylater-amount]');

priceEls.forEach (el => {
  const amt =  parseFloat(el.dataset.paylaterAmount ?? '0');
  const perPayment = (amt / 4).toFixed(2);
  const msgEl = document.createElement('p');
  msgEl.className = 'paylater-message';
  msgEl.textContent = `or 4 payments of $${perPayment}`;
  el.insertAdjacentElement('afterend', msgEl)
})