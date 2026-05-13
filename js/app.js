import { PRODUCTS, PRODUCT_TYPES, TYPES } from "./data.js";
import {
  getCart,
  saveCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  cartTotal,
  getAccount,
  saveAccount,
} from "./store.js";

const PAGE_SIZE = 8;

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

const VALID_ROUTES = ["home", "products", "cart", "checkout", "account"];

/** Scoped CSS for shadow-DOM islands only (catalog grid, cart table, forms). */
function islandStyles() {
  return `
    :host {
      display: block;
      font-family: "DM Sans", system-ui, sans-serif;
      color: #0f172a;
      --bg: #f8fafc;
      --card: #ffffff;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
      --muted: #64748b;
      --border: #e2e8f0;
      --radius: 12px;
      --shadow: 0 1px 3px rgb(15 23 42 / 0.08), 0 8px 24px rgb(15 23 42 / 0.06);
    }
    * { box-sizing: border-box; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    button {
      font: inherit;
      cursor: pointer;
      border: none;
      border-radius: 10px;
      padding: 0.55rem 1rem;
      background: var(--accent);
      color: white;
      font-weight: 600;
    }
    button:hover { background: var(--accent-hover); }
    button.secondary {
      background: #f1f5f9;
      color: #0f172a;
    }
    button.secondary:hover { background: #e2e8f0; }
    button.danger {
      background: #fef2f2;
      color: #b91c1c;
    }
    button.danger:hover { background: #fee2e2; }
    input, select, textarea {
      font: inherit;
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      width: 100%;
      background: #fff;
    }
    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
      color: #334155;
    }
    .field { margin-bottom: 1rem; }
    h2 { font-size: 1.15rem; margin: 0 0 0.75rem; }
  `;
}

function homePageHtml(nProducts, nTypes) {
  return `
    <div class="page-home">
      <p class="shadow-note">
        Shell + sections below live in the <strong>light DOM</strong> (normal document tree). Visit <a href="#products">Products</a> to see the catalog grid inside its own <strong>shadow root</strong>.
      </p>
      <div class="layout">
        <div>
          <section class="hero">
            <span class="badge">Shadow DOM storefront</span>
            <h1>Light DOM pages, shadow DOM widgets</h1>
            <p>
              Browse a larger catalog with filters and pagination, build a cart that persists locally, walk through checkout,
              and manage an account — interactive islands (catalog, cart, checkout, account form) use shadow DOM; this landing copy stays in the light tree so host-page CSS can theme it like any normal page.
            </p>
            <button type="button" class="action" id="cta-products">Browse ${nProducts} products</button>
          </section>

          <section class="block">
            <h2>At a glance</h2>
            <p class="lead">
              Shadow Shop is a static demo you can extend: swap images, wire APIs, or embed this shell inside a host page without colliding with global styles on encapsulated widgets.
            </p>
            <div class="stats" aria-label="Store highlights">
              <div class="stat"><b>${nProducts}</b><span>demo SKUs</span></div>
              <div class="stat"><b>${nTypes}</b><span>categories</span></div>
              <div class="stat"><b>24/7</b><span>imaginary support</span></div>
              <div class="stat"><b>0</b><span>servers required</span></div>
            </div>
          </section>

          <section class="block">
            <h2>Why this demo</h2>
            <p class="lead">
              Each encapsulated widget is a custom element with its own shadow tree. Marketing sections can stay in light DOM for CMS-driven styling; cart and catalog stay predictable inside shadows.
            </p>
            <div class="cards">
              <div class="card"><h3>Hybrid layout</h3><p>Long-form pages in light DOM; product grid and cart table in shadow islands.</p></div>
              <div class="card"><h3>Pagination</h3><p>Eight items per page on the catalog island.</p></div>
              <div class="card"><h3>Filters</h3><p>Narrow the grid by product type inside the catalog shadow tree.</p></div>
              <div class="card"><h3>Cart sync</h3><p>Add from the grid; quantities and removals stay in localStorage.</p></div>
              <div class="card"><h3>Checkout flow</h3><p>Shipping + summary encapsulated in one checkout island.</p></div>
              <div class="card"><h3>Account island</h3><p>Profile form scoped separately from the page chrome.</p></div>
            </div>
          </section>

          <section class="block band">
            <h2>Light DOM vs shadow islands</h2>
            <p>
              Use light DOM for SEO-heavy landing copy, editorial layouts, and anything your CMS should style with ordinary CSS.
              Put interactive commerce widgets (grid, line items, payment UI) in shadow roots when you need strong encapsulation or embed the same bundle on third-party sites.
            </p>
            <p style="margin-top:1rem;margin-bottom:0">
              This page adds extra sections so you can scroll through long-form content the same way you would on a production landing page.
            </p>
          </section>

          <section class="block">
            <h2>Shipping, returns, and care</h2>
            <div class="two cols">
              <div class="card">
                <h3>Delivery windows</h3>
                <p>Metro orders ship in two business days in this fictional universe. Rural routes add one to three days depending on carrier partnerships.</p>
              </div>
              <div class="card">
                <h3>Returns</h3>
                <p>Unopened demo items may be “returned” by clearing localStorage — a cheeky reminder that persistence here is only in your browser.</p>
              </div>
              <div class="card">
                <h3>Packaging</h3>
                <p>Imaginary orders use recycled paper inserts and paper tape. Real integrations would pull packaging rules from your OMS.</p>
              </div>
              <div class="card">
                <h3>Product care</h3>
                <p>Apparel: cold wash, line dry. Electronics: avoid moisture. Home goods: check materials before microwaving.</p>
              </div>
            </div>
          </section>

          <section class="block two cols">
            <div>
              <h2>What shoppers say</h2>
              <p class="lead" style="margin-bottom:1rem">Synthetic quotes for layout — replace with real reviews from your CMS.</p>
              <blockquote class="quote">
                “Pagination and filters feel snappy. I like that the cart badge updates without reloading the page.”
                <footer>— Jordan M., early visitor</footer>
              </blockquote>
              <blockquote class="quote" style="margin-top:1rem">
                “Splitting light pages from shadow widgets made it obvious what hosts can theme vs what stays isolated.”
                <footer>— Priya S., product designer</footer>
              </blockquote>
            </div>
            <div>
              <h2>FAQ</h2>
              <details>
                <summary>Which parts use shadow DOM?</summary>
                <p>Product catalog (filter + grid + pager), cart line items, checkout form + summary, and account form. Everything else you see on those routes is light DOM.</p>
              </details>
              <details>
                <summary>Can I embed this in WordPress?</summary>
                <p>Yes. Load the script bundle, drop <code>&lt;shop-root&gt;&lt;/shop-root&gt;</code> where you want the app, and ensure module paths resolve.</p>
              </details>
              <details>
                <summary>Where do product images come from?</summary>
                <p>picsum.photos with deterministic seeds per SKU.</p>
              </details>
              <details>
                <summary>How do I add more SKUs?</summary>
                <p>Edit <code>js/data.js</code> — filters derive from the dataset automatically.</p>
              </details>
            </div>
          </section>

          <section class="block">
            <h2>Stay in the loop</h2>
            <p class="lead">Newsletter UI only — hook this form to your ESP when you go live.</p>
            <div class="news">
              <input type="email" placeholder="you@example.com" aria-label="Email for newsletter" />
              <button type="button" class="action" id="cta-news">Notify me</button>
            </div>
          </section>

          <section class="block">
            <p class="lead" style="margin-bottom:0.75rem;text-align:center">Trusted by pretend teams everywhere</p>
            <div class="partners">
              <span>Nimbus Labs</span>
              <span>Harbor Commerce</span>
              <span>Northwind Outfitters</span>
              <span>Pixel Foundry</span>
              <span>Atlas Logistics</span>
            </div>
          </section>

          <section class="block cta-foot">
            <h2>Ready to browse?</h2>
            <p>Open the products grid (shadow island) to explore filters, pagination, and add-to-cart.</p>
            <button type="button" class="action" id="cta-products-2">Browse products</button>
          </section>
        </div>

        <aside>
          <div class="ad" style="margin-bottom: 1rem;">
            <strong>Sponsored</strong>
            Upgrade your workflow with premium templates. These rail cards are light DOM — easy to replace with ad tags.
          </div>
          <div class="ad" style="margin-bottom: 1rem;">
            <strong>Seasonal sale</strong>
            Fictional 20% off sitewide this weekend — swap this block for a live campaign widget when you connect an ad server.
          </div>
          <div class="ad">
            <strong>Featured partner</strong>
            Placeholder placement for co-marketing.
          </div>
        </aside>
      </div>
    </div>
  `;
}

function wireHome(outlet) {
  const goProducts = () => {
    window.location.hash = "products";
  };
  outlet.querySelector("#cta-products")?.addEventListener("click", goProducts);
  outlet.querySelector("#cta-products-2")?.addEventListener("click", goProducts);
  outlet.querySelector("#cta-news")?.addEventListener("click", () => {
    alert("Demo only — connect your email API to capture signups.");
  });
}

function productsPageHtml() {
  return `
    <div class="page-products">
      <p class="shadow-note">
        Title and long copy below are <strong>light DOM</strong>. Only the <code>&lt;shop-catalog&gt;</code> widget (filter + product grid + pagination) is rendered inside a <strong>shadow root</strong>.
      </p>
      <h1>Products</h1>
      <p class="lead">
        ${PRODUCTS.length} items across ${TYPES.length} categories — filter and paginate (${PAGE_SIZE} per page), then add to your cart.
        Scroll past the island for sizing notes and fulfillment copy (still light DOM).
      </p>
      <shop-catalog></shop-catalog>

      <div class="below-fold">
        <h2>Using this catalog</h2>
        <p class="longcopy">
          The catalog island keeps card styles private to that subtree. Change <code>PAGE_SIZE</code> in <code>js/app.js</code> if you want more rows per screen.
        </p>

        <h2>Category snapshots</h2>
        <div class="tip-grid">
          <div class="tip"><strong>Electronics</strong> Cables, deskside peripherals, and small gadgets — check voltage and regional plugs before checkout in a real store.</div>
          <div class="tip"><strong>Apparel</strong> Unisex sizing in this demo. Use filters to focus on one department while you compare colors and materials.</div>
          <div class="tip"><strong>Home</strong> Kitchen, décor, and everyday utilities. Bundle-friendly: add multiple lines to see the cart math update.</div>
          <div class="tip"><strong>Beauty</strong> Topicals for demonstration only — always patch test real cosmetics and read ingredient lists.</div>
          <div class="tip"><strong>Sports</strong> Training accessories with varied price points so totals look realistic when you test checkout.</div>
        </div>

        <h2>Fulfillment &amp; expectations</h2>
        <p class="longcopy">
          This project does not call a warehouse API. Treat shipping timelines, inventory counts, and backorder messages as static copy you can replace once you connect ERP or commerce APIs.
        </p>

        <div class="banner">
          <strong>Prototyping tip:</strong> keep high-resolution photography in light DOM if you need shared <code>&lt;picture&gt;</code> art direction with the host — or keep imagery inside the catalog island for full encapsulation.
        </div>

        <h2>Accessibility checklist</h2>
        <p class="longcopy">
          When you extend the grid, preserve keyboard focus order: pagination buttons should stay adjacent to the list in the tab sequence, and filter controls should announce changes to screen readers via live regions if you fetch new pages from a server.
        </p>

        <h2>More placeholder detail</h2>
        <p class="longcopy">
          Loyalty points, gift messages, and subscription frequency are common upsells on product pages. This block mimics the vertical rhythm of those modules so you can eyeball spacing without touching cart logic.
        </p>
        <p class="longcopy" style="margin-top:1rem">
          If you need infinite scroll instead of numbered pages, swap the pager inside <code>shop-catalog</code> for an IntersectionObserver that appends batches.
        </p>
      </div>
    </div>
  `;
}

function cartPageHtml() {
  return `
    <div class="page-cart">
      <p class="shadow-note">
        Headline and intro are <strong>light DOM</strong>. Line items, totals, and actions live inside <code>&lt;shop-cart-panel&gt;</code> (<strong>shadow root</strong>).
      </p>
      <h1>Cart</h1>
      <p class="lead">Items you added on the Products page. Quantities update here and stay in localStorage.</p>
      <shop-cart-panel></shop-cart-panel>
    </div>
  `;
}

function checkoutPageHtml() {
  return `
    <div class="page-checkout">
      <p class="shadow-note">
        Intro text is <strong>light DOM</strong>. Shipping, payment, and order summary are encapsulated in <code>&lt;shop-checkout-panel&gt;</code> (<strong>shadow root</strong>).
      </p>
      <h1>Checkout</h1>
      <p class="lead">Shipping and payment placeholders — submit to complete the demo order and clear the cart.</p>
      <shop-checkout-panel></shop-checkout-panel>
    </div>
  `;
}

function accountPageHtml() {
  return `
    <div class="page-account">
      <p class="shadow-note">
        Page title and disclaimer are <strong>light DOM</strong>. The profile form is <code>&lt;shop-account-panel&gt;</code> (<strong>shadow root</strong>).
      </p>
      <h1>Account</h1>
      <p class="lead">Profile fields are stored locally for this demo (including password — do not use real secrets).</p>
      <shop-account-panel></shop-account-panel>
    </div>
  `;
}

/** Product grid + filter + pagination — shadow DOM only. */
class ShopCatalog extends HTMLElement {
  constructor() {
    super();
    this._filter = "all";
    this._page = 1;
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    this._root = root;
    root.innerHTML = `
      <style>${islandStyles()}</style>
      <style>
        .toolbar {
          display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end;
          margin-bottom: 1.25rem;
        }
        .toolbar .field { margin: 0; min-width: 180px; }
        .grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        }
        article {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
        }
        article img { width: 100%; height: 160px; object-fit: cover; display: block; background: #f1f5f9; }
        .body { padding: 1rem; flex: 1; display: flex; flex-direction: column; }
        .meta { font-size: 0.8rem; color: var(--muted); text-transform: capitalize; margin-bottom: 0.25rem; }
        .title { font-weight: 700; margin: 0 0 0.5rem; font-size: 1.05rem; }
        .price { font-weight: 700; color: var(--accent); margin-top: auto; }
        .pager {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          margin-top: 1.5rem; flex-wrap: wrap;
        }
        .pager span { color: var(--muted); font-size: 0.9rem; }
      </style>
      <div class="toolbar">
        <div class="field">
          <label for="type-filter">Type</label>
          <select id="type-filter"></select>
        </div>
      </div>
      <div class="grid" id="grid"></div>
      <div class="pager" id="pager"></div>
    `;

    const sel = root.getElementById("type-filter");
    PRODUCT_TYPES.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t === "all" ? "All types" : t;
      sel.appendChild(opt);
    });
    sel.value = this._filter;
    sel.addEventListener("change", () => {
      this._filter = sel.value;
      this._page = 1;
      this._render();
    });

    this._render();
  }

  _filtered() {
    if (this._filter === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.type === this._filter);
  }

  _render() {
    const root = this._root;
    const list = this._filtered();
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (this._page > totalPages) this._page = totalPages;
    const start = (this._page - 1) * PAGE_SIZE;
    const slice = list.slice(start, start + PAGE_SIZE);

    const grid = root.getElementById("grid");
    grid.innerHTML = slice
      .map(
        (p) => `
      <article data-id="${p.id}">
        <img src="${escapeHtml(p.image)}" alt="" width="480" height="360" loading="lazy" />
        <div class="body">
          <div class="meta">${escapeHtml(p.type)}</div>
          <div class="title">${escapeHtml(p.name)}</div>
          <div class="price">$${p.price.toFixed(2)}</div>
          <button type="button" class="add" style="margin-top:0.75rem;width:100%">Add to cart</button>
        </div>
      </article>
    `
      )
      .join("");

    grid.querySelectorAll(".add").forEach((btn, i) => {
      btn.addEventListener("click", () => addToCart(slice[i]));
    });

    const pager = root.getElementById("pager");
    pager.innerHTML = `
      <button type="button" class="secondary" id="prev" ${this._page <= 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${this._page} of ${totalPages}</span>
      <button type="button" class="secondary" id="next" ${this._page >= totalPages ? "disabled" : ""}>Next</button>
    `;
    const prev = pager.querySelector("#prev");
    const next = pager.querySelector("#next");
    if (!prev.disabled)
      prev.addEventListener("click", () => {
        this._page -= 1;
        this._render();
      });
    if (!next.disabled)
      next.addEventListener("click", () => {
        this._page += 1;
        this._render();
      });
  }
}

/** Cart table + totals — shadow DOM only. */
class ShopCartPanel extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    this._root = root;
    root.innerHTML = `
      <style>${islandStyles()}</style>
      <style>
        table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }
        th, td { text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
        th { background: #f8fafc; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
        tr:last-child td { border-bottom: none; }
        .thumb { width: 72px; height: 54px; object-fit: cover; border-radius: 8px; background: #f1f5f9; }
        .qty { display: flex; align-items: center; gap: 0.5rem; }
        .qty input { width: 4rem; }
        .totals { margin-top: 1rem; text-align: right; font-size: 1.15rem; font-weight: 700; }
        .empty { padding: 2rem; text-align: center; color: var(--muted); background: #f8fafc; border-radius: var(--radius); border: 1px dashed var(--border); }
      </style>
      <div id="container"></div>
    `;
    this._paint();
    window.addEventListener("shadow-shop-cart", () => this._paint());
  }

  _paint() {
    const cart = getCart();
    const el = this._root.getElementById("container");
    if (cart.length === 0) {
      el.innerHTML = `<div class="empty">Your cart is empty. <a href="#products">Browse products</a>.</div>`;
      return;
    }
    el.innerHTML = `
      <table>
        <thead><tr><th></th><th>Product</th><th>Price</th><th>Qty</th><th></th></tr></thead>
        <tbody id="tbody"></tbody>
      </table>
      <div class="totals" id="total"></div>
      <p style="margin-top:1rem"><button type="button" id="checkout">Proceed to checkout</button></p>
    `;
    const tbody = el.querySelector("#tbody");
    tbody.innerHTML = cart
      .map(
        (l) => `
      <tr data-id="${l.id}">
        <td><img class="thumb" src="${escapeHtml(l.image)}" alt="" /></td>
        <td>
          <div style="font-weight:600">${escapeHtml(l.name)}</div>
          <div style="font-size:0.8rem;color:var(--muted);text-transform:capitalize">${escapeHtml(l.type)}</div>
        </td>
        <td>$${l.price.toFixed(2)}</td>
        <td>
          <div class="qty">
            <input type="number" min="1" max="99" value="${l.qty}" aria-label="Quantity for ${escapeHtml(l.name)}" />
          </div>
        </td>
        <td><button type="button" class="danger remove">Remove</button></td>
      </tr>
    `
      )
      .join("");

    tbody.querySelectorAll("tr").forEach((row) => {
      const id = Number(row.dataset.id);
      const input = row.querySelector('input[type="number"]');
      input.addEventListener("change", () => {
        const v = parseInt(input.value, 10);
        updateCartQty(id, Number.isFinite(v) ? v : 1);
        this._paint();
      });
      row.querySelector(".remove").addEventListener("click", () => {
        removeFromCart(id);
        this._paint();
      });
    });

    el.querySelector("#total").textContent = `Total: $${cartTotal(cart).toFixed(2)}`;
    el.querySelector("#checkout").addEventListener("click", () => {
      window.location.hash = "checkout";
    });
  }
}

/** Checkout form + summary — shadow DOM only. */
class ShopCheckoutPanel extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>${islandStyles()}</style>
      <style>
        .split {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 800px) {
          .split { grid-template-columns: 1fr 320px; align-items: start; }
        }
        .panel {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          box-shadow: var(--shadow);
        }
        .payment-list {
          display: grid;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        .payment-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: #fff;
        }
        .payment-item input[type="radio"] {
          width: auto;
          margin-top: 0.2rem;
        }
        .payment-item .label-text {
          display: block;
          font-weight: 700;
          margin-bottom: 0.15rem;
        }
        .payment-item .hint {
          display: block;
          color: var(--muted);
          font-size: 0.85rem;
          line-height: 1.45;
        }
        .method-fields {
          margin-bottom: 1rem;
          padding: 0.85rem;
          border: 1px dashed var(--border);
          border-radius: 10px;
          background: #f8fafc;
        }
        .method-fields[hidden] { display: none; }
        .mini {
          color: var(--muted);
          font-size: 0.82rem;
          margin: 0.2rem 0 0;
          line-height: 1.4;
        }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.95rem; }
        .summary-total { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border); font-weight: 700; font-size: 1.1rem; }
      </style>
      <div class="split">
        <form id="form" class="panel">
          <h2>Shipping</h2>
          <div class="field"><label for="full">Full name</label><input id="full" name="full" required autocomplete="name" /></div>
          <div class="field"><label for="line1">Address line 1</label><input id="line1" name="line1" required autocomplete="address-line1" /></div>
          <div class="field"><label for="line2">Address line 2</label><input id="line2" name="line2" autocomplete="address-line2" /></div>
          <div class="field"><label for="city">City</label><input id="city" name="city" required autocomplete="address-level2" /></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="field"><label for="state">State</label><input id="state" name="state" required autocomplete="address-level1" /></div>
            <div class="field"><label for="zip">Postal code</label><input id="zip" name="zip" required autocomplete="postal-code" /></div>
          </div>
          <div class="field"><label for="phone">Phone number</label><input id="phone" name="phone" required inputmode="tel" autocomplete="tel" /></div>

          <h2 style="margin-top:1rem">Payment</h2>
          <div class="payment-list">
            <label class="payment-item">
              <input type="radio" name="paymentMethod" value="upi" checked />
              <span>
                <span class="label-text">UPI</span>
                <span class="hint">Pay via UPI ID or app (Google Pay, PhonePe, Paytm).</span>
              </span>
            </label>
            <label class="payment-item">
              <input type="radio" name="paymentMethod" value="card" />
              <span>
                <span class="label-text">Credit / Debit Card</span>
                <span class="hint">Visa, Mastercard, RuPay, and AmEx supported in this demo.</span>
              </span>
            </label>
            <label class="payment-item">
              <input type="radio" name="paymentMethod" value="cod" />
              <span>
                <span class="label-text">Cash on Delivery</span>
                <span class="hint">Pay at delivery for eligible orders under Rs. 5000.</span>
              </span>
            </label>
            <label class="payment-item">
              <input type="radio" name="paymentMethod" value="wallet" />
              <span>
                <span class="label-text">Wallet</span>
                <span class="hint">Use your store wallet balance or linked prepaid wallet.</span>
              </span>
            </label>
            <label class="payment-item">
              <input type="radio" name="paymentMethod" value="netbanking" />
              <span>
                <span class="label-text">Net Banking</span>
                <span class="hint">Choose your bank and continue to secure login.</span>
              </span>
            </label>
          </div>

          <div class="method-fields" data-method="upi">
            <div class="field"><label for="upiId">UPI ID</label><input id="upiId" name="upiId" placeholder="name@bank" /></div>
            <p class="mini">A collect request will be sent to your UPI app.</p>
          </div>

          <div class="method-fields" data-method="card" hidden>
            <div class="field"><label for="card">Card number</label><input id="card" name="card" inputmode="numeric" placeholder="4242 4242 4242 4242" autocomplete="cc-number" /></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div class="field"><label for="exp">Expiry</label><input id="exp" name="exp" placeholder="MM/YY" autocomplete="cc-exp" /></div>
              <div class="field"><label for="cvc">CVC</label><input id="cvc" name="cvc" autocomplete="cc-csc" /></div>
            </div>
          </div>

          <div class="method-fields" data-method="cod" hidden>
            <div class="field">
              <label for="codNote">Delivery instruction</label>
              <input id="codNote" name="codNote" placeholder="Landmark, gate code, preferred slot" />
            </div>
            <p class="mini">Keep exact change ready when possible for faster handoff.</p>
          </div>

          <div class="method-fields" data-method="wallet" hidden>
            <div class="field"><label for="walletId">Wallet ID / mobile</label><input id="walletId" name="walletId" inputmode="tel" /></div>
            <p class="mini">Available balance and OTP verification will be shown in real integrations.</p>
          </div>

          <div class="method-fields" data-method="netbanking" hidden>
            <div class="field">
              <label for="bankName">Select bank</label>
              <select id="bankName" name="bankName">
                <option value="">Choose bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          </div>

          <h2 style="margin-top:1rem">Billing extras</h2>
          <div class="field">
            <label><input type="checkbox" name="sameAddress" checked style="width:auto;margin-right:0.5rem;" /> Billing address same as shipping</label>
          </div>
          <div class="field"><label for="notes">Order note</label><textarea id="notes" name="notes" rows="3" placeholder="Any special instructions for packing or delivery"></textarea></div>
          <button type="submit">Place order</button>
        </form>
        <div class="panel" id="summary-panel"></div>
      </div>
    `;

    const methodInputs = root.querySelectorAll('input[name="paymentMethod"]');
    const methodBlocks = root.querySelectorAll(".method-fields");
    const syncMethodSections = () => {
      const selected = root.querySelector('input[name="paymentMethod"]:checked')?.value || "upi";
      methodBlocks.forEach((block) => {
        block.hidden = block.getAttribute("data-method") !== selected;
      });
    };
    methodInputs.forEach((input) => input.addEventListener("change", syncMethodSections));
    syncMethodSections();

    const paintSummary = () => {
      const cart = getCart();
      const panel = root.getElementById("summary-panel");
      if (cart.length === 0) {
        panel.innerHTML = `<p style="color:var(--muted);margin:0">Cart is empty. <a href="#products">Add items</a> first.</p>`;
        return;
      }
      panel.innerHTML = `
        <h2>Order summary</h2>
        ${cart
          .map(
            (l) =>
              `<div class="summary-row"><span>${escapeHtml(l.name)} × ${l.qty}</span><span>$${(l.price * l.qty).toFixed(2)}</span></div>`
          )
          .join("")}
        <div class="summary-total"><div class="summary-row"><span>Total</span><span>$${cartTotal(cart).toFixed(2)}</span></div></div>
      `;
    };
    paintSummary();
    window.addEventListener("shadow-shop-cart", paintSummary);

    root.getElementById("form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (getCart().length === 0) {
        alert("Your cart is empty.");
        return;
      }
      const method = root.querySelector('input[name="paymentMethod"]:checked')?.value || "upi";
      saveCart([]);
      alert(`Thanks — demo order placed with ${method.toUpperCase()}. Cart cleared.`);
      window.location.hash = "home";
    });
  }
}

/** Account form — shadow DOM only. */
class ShopAccountPanel extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    const acc = getAccount();
    root.innerHTML = `
      <style>${islandStyles()}</style>
      <style>
        .panel {
          max-width: 480px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          box-shadow: var(--shadow);
        }
        .hint { font-size: 0.85rem; color: var(--muted); margin-top: 0.25rem; }
      </style>
      <form id="form" class="panel">
        <div class="field">
          <label for="firstName">First name</label>
          <input id="firstName" name="firstName" autocomplete="given-name" value="${escapeAttr(acc.firstName)}" />
        </div>
        <div class="field">
          <label for="lastName">Last name</label>
          <input id="lastName" name="lastName" autocomplete="family-name" value="${escapeAttr(acc.lastName)}" />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" value="${escapeAttr(acc.email)}" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="new-password" value="${escapeAttr(acc.password)}" />
          <div class="hint">Demo only — stored in plain text in localStorage.</div>
        </div>
        <button type="submit">Save profile</button>
      </form>
    `;
    root.getElementById("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      saveAccount({
        firstName: String(fd.get("firstName") || ""),
        lastName: String(fd.get("lastName") || ""),
        email: String(fd.get("email") || ""),
        password: String(fd.get("password") || ""),
      });
      alert("Profile saved.");
    });
  }
}

/** App shell — light DOM only (no shadow root on the whole site). */
class ShopRoot extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="shop-shell">
        <header>
          <a class="brand" href="#home">Shadow Shop</a>
          <nav id="nav">
            <a href="#home" data-route="home">Home</a>
            <a href="#products" data-route="products">Products</a>
            <a href="#cart" data-route="cart">Cart<span class="cart-badge" id="badge" hidden>0</span></a>
            <a href="#checkout" data-route="checkout">Checkout</a>
            <a href="#account" data-route="account">Account</a>
          </nav>
        </header>
        <main class="page-outlet" id="outlet"></main>
      </div>
    `;

    this._outlet = this.querySelector("#outlet");
    this._nav = this.querySelector("#nav");
    this._badge = this.querySelector("#badge");

    const updateBadge = () => {
      const n = getCart().reduce((s, l) => s + l.qty, 0);
      this._badge.textContent = String(n);
      this._badge.hidden = n === 0;
    };
    updateBadge();
    window.addEventListener("shadow-shop-cart", updateBadge);

    const render = () => {
      const raw = (window.location.hash.replace(/^#/, "") || "home").toLowerCase();
      const route = VALID_ROUTES.includes(raw) ? raw : "home";
      const outlet = this._outlet;
      outlet.innerHTML = "";

      switch (route) {
        case "products":
          outlet.innerHTML = productsPageHtml();
          break;
        case "cart":
          outlet.innerHTML = cartPageHtml();
          break;
        case "checkout":
          outlet.innerHTML = checkoutPageHtml();
          break;
        case "account":
          outlet.innerHTML = accountPageHtml();
          break;
        default:
          outlet.innerHTML = homePageHtml(PRODUCTS.length, TYPES.length);
          wireHome(outlet);
      }

      this._nav.querySelectorAll("a[data-route]").forEach((a) => {
        a.classList.toggle("active", a.dataset.route === route);
      });
    };

    window.addEventListener("hashchange", render);
    render();
  }
}

customElements.define("shop-catalog", ShopCatalog);
customElements.define("shop-cart-panel", ShopCartPanel);
customElements.define("shop-checkout-panel", ShopCheckoutPanel);
customElements.define("shop-account-panel", ShopAccountPanel);
customElements.define("shop-root", ShopRoot);
