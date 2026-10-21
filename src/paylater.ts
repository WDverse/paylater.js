import { splitPayment } from "./math.ts";

class PaylaterMessage extends HTMLElement {
  static get observedAttributes() {
    return ['amount', 'currency'];
  }

  #observer: IntersectionObserver | null = null;
  #hasRendered = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.style.display = 'block'; // give the host real box geometry so IntersectionObserver can track its position; must happen after construction, since a custom element constructor must not add attributes (setting any `this.style.*` property writes the `style` attribute)
    this.#observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.#hasRendered = true;
          this._render();
          this.#observer?.disconnect();
          this.#observer = null;
        }
      },
      { rootMargin: '200px' }, // start rendering slightly before it enters the viewport
    );
    this.#observer.observe(this);
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return; // setAttribute fires this even with an unchanged value
    if (!this.#hasRendered) return; // not visible yet; will render with current attributes once it is
    this._render();
  }

  refresh() {
    // manual escape hatch: force a render now regardless of viewport position,
    // and promote to "rendered" state so later attribute changes keep being picked up
    this.#hasRendered = true;
    this.#observer?.disconnect();
    this.#observer = null;
    this._render();
  }

  _render() {
    this.shadowRoot!.replaceChildren(); // clear any previous render before rebuilding

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

function refreshAll() {
  document.querySelectorAll<PaylaterMessage>('paylater-message').forEach((el) => el.refresh());
}

// Safety net for merchants whose own price-update code never calls Paylater.refresh():
// watch the whole document for amount/currency attribute changes on any paylater-message
// element and refresh it automatically. Redundant with attributeChangedCallback for the
// common case (setAttribute already triggers that), but catches it regardless of how the
// attribute ends up changed.
new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && mutation.target instanceof PaylaterMessage) {
      mutation.target.refresh();
    }
  }
}).observe(document.documentElement, {
  subtree: true,
  attributes: true,
  attributeFilter: ['amount', 'currency'],
});

(window as any).Paylater = { refresh: refreshAll };
