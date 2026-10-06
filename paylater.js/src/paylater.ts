import { splitPayment } from "./math.ts";

class PaylaterMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this.shadowRoot!.hasChildNodes()) return; // guard against re-render if reconnected to the DOM

    const attr = this.getAttribute('amount'); // get attribute in string
    const amt = parseFloat(attr ?? ''); // convert string attribute to a number and default value to NaN if undefined

    if (!attr || isNaN(amt) || amt <= 0) { // handle cases where attributes are missing, not a number or less than 0
      console.warn('paylater-message: invalid or missing amount attribute on element', this);
      return;
    }

    const amtInCents = Math.round(amt * 100);
    const perPayment = splitPayment(amtInCents, 4);

    const formatter = new Intl.NumberFormat(navigator.language, { // use browser locale to handle currency formatting
      style: 'currency',
      currency: this.getAttribute('currency') ?? 'USD', // default to USD if undefined
    });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        font-family: system-ui, sans-serif;
        font-size: 14px;
        color: #333;
      }
      p {
        margin: 0;
      }
    `;

    const msgEl = document.createElement('p');
    msgEl.textContent = `or 4 payments of ${formatter.format(perPayment / 100)}`;
    this.shadowRoot!.append(style, msgEl);
  }
}

customElements.define('paylater-message', PaylaterMessage);
