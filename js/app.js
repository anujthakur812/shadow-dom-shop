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

function baseChromeStyles() {
  return `
    :host {
      display: block;
      font-family: "DM Sans", system-ui, sans-serif;
      font-optical-sizing: auto;
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
    h1 { font-size: 1.75rem; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
    h2 { font-size: 1.2rem; margin: 0 0 0.75rem; }
    p.lead { color: var(--muted); margin: 0 0 1.25rem; line-height: 1.6; }
  `;
}

class ShopHome extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    const nProducts = PRODUCTS.length;
    const nTypes = TYPES.length;
    root.innerHTML = `
      <style>${baseChromeStyles()}</style>
      <style>
        .layout { display: grid; gap: 1.5rem; }
        @media (min-width: 900px) {
          .layout { grid-template-columns: 1fr 280px; align-items: start; }
        }
        .hero {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%);
          color: white;
          padding: 2rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }
        .hero h1 { color: white; font-size: 2rem; }
        .hero p { opacity: 0.95; margin: 0 0 1rem; line-height: 1.65; }
        .cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
          box-shadow: var(--shadow);
        }
        .card h3 { margin: 0 0 0.35rem; font-size: 1rem; }
        .card p { margin: 0; font-size: 0.9rem; color: var(--muted); line-height: 1.5; }
        .ad {
          background: var(--card);
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius);
          padding: 1rem;
          text-align: center;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .ad strong { display: block; color: #0f172a; margin-bottom: 0.35rem; }
        .badge { display: inline-block; background: rgb(255 255 255 / 0.2); padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; margin-bottom: 0.75rem; }
        section.block { margin-top: 2.25rem; }
        section.block:first-of-type { margin-top: 0; }
        .stats {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          box-shadow: var(--shadow);
        }
        .stat { text-align: center; }
        .stat b { display: block; font-size: 1.5rem; color: var(--accent); }
        .stat span { font-size: 0.85rem; color: var(--muted); }
        .band {
          background: #0f172a;
          color: #e2e8f0;
          border-radius: var(--radius);
          padding: 1.5rem;
          line-height: 1.65;
        }
        .band h2 { color: #fff; }
        .two {
          display: grid;
          gap: 1.25rem;
        }
        @media (min-width: 800px) {
          .two.cols { grid-template-columns: 1fr 1fr; align-items: start; }
        }
        .quote {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem 1.15rem;
          box-shadow: var(--shadow);
          font-size: 0.95rem;
          color: #334155;
        }
        .quote footer { margin-top: 0.65rem; font-size: 0.8rem; color: var(--muted); }
        details {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0.65rem 1rem;
          margin-bottom: 0.5rem;
        }
        details summary { cursor: pointer; font-weight: 600; }
        details p { margin: 0.5rem 0 0; color: var(--muted); font-size: 0.92rem; line-height: 1.55; }
        .news {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          background: linear-gradient(90deg, #eff6ff, #f8fafc);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem 1.25rem;
        }
        .news input { flex: 1 1 200px; margin: 0; }
        .news button { white-space: nowrap; }
        .partners {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.25rem;
          justify-content: center;
          color: var(--muted);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .partners span { opacity: 0.85; }
        .cta-foot {
          text-align: center;
          padding: 2rem 1rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }
        .cta-foot p { color: var(--muted); margin: 0 0 1rem; max-width: 520px; margin-left: auto; margin-right: auto; line-height: 1.6; }
      </style>

      <div class="layout">
        <div>
          <section class="hero">
            <span class="badge">Shadow DOM storefront</span>
            <h1>Everything lives inside shadow roots</h1>
            <p>
              Browse a larger catalog with filters and pagination, build a cart that persists locally, walk through checkout,
              and manage an account — all rendered as custom elements so each screen keeps its own styles and DOM subtree.
            </p>
            <button type="button" id="cta-products">Browse ${nProducts} products</button>
          </section>

          <section class="block">
            <h2>At a glance</h2>
            <p class="lead">
              Shadow Shop is a static demo you can extend: swap images, wire APIs, or embed this shell inside a host page without
              style collisions.
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
              Each route mounts a different custom element. Global CSS from the outer document does not pierce the shadow boundary,
              and component CSS does not leak outward — useful for micro-frontends, design systems, and third-party widgets.
            </p>
            <div class="cards">
              <div class="card"><h3>Encapsulation</h3><p>Buttons, cards, and forms inherit the same tokens inside each shadow tree.</p></div>
              <div class="card"><h3>Pagination</h3><p>Eight items per page on the catalog so lists stay scannable.</p></div>
              <div class="card"><h3>Filters</h3><p>Narrow the grid by product type; counts update with the dataset.</p></div>
              <div class="card"><h3>Cart sync</h3><p>Add from the grid; quantities and removals stay in localStorage.</p></div>
              <div class="card"><h3>Checkout flow</h3><p>Placeholder shipping and card fields mirror a real funnel.</p></div>
              <div class="card"><h3>Account island</h3><p>Profile fields live in their own shadow root for clarity.</p></div>
            </div>
          </section>

          <section class="block band">
            <h2>How Shadow DOM helps storefronts</h2>
            <p>
              Marketing sites often load analytics snippets, chat widgets, and A/B testing overlays that redefine base styles.
              When your commerce UI sits in an open shadow root, your typography, spacing, and focus rings stay faithful to the
              design you ship — even if the parent page changes fonts or link colors. You can still pass data in via attributes,
              properties, or events, which keeps the boundary flexible without sacrificing predictability.
            </p>
            <p style="margin-top:1rem;margin-bottom:0">
              This page adds extra sections so you can scroll through long-form content the same way you would on a production landing page:
              social proof, FAQs, shipping notes, and newsletter capture — all co-located with the hero without breaking encapsulation.
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
                <p>Apparel: cold wash, line dry. Electronics: avoid moisture. Home goods: check materials before microwaving — standard retail copy fits neatly here.</p>
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
                “The shadow DOM explanation on the home page actually helped our team explain isolation to stakeholders.”
                <footer>— Priya S., product designer</footer>
              </blockquote>
            </div>
            <div>
              <h2>FAQ</h2>
              <details>
                <summary>Is my payment data stored?</summary>
                <p>No. Checkout fields are a UI mock. Nothing is transmitted or stored except what your browser keeps in localStorage for the demo cart and account form.</p>
              </details>
              <details>
                <summary>Can I embed this in WordPress or another CMS?</summary>
                <p>Yes. Load the script bundle, drop <code>&lt;shop-root&gt;&lt;/shop-root&gt;</code> where you want the island, and ensure module paths resolve. You may need to adjust asset URLs.</p>
              </details>
              <details>
                <summary>Where do product images come from?</summary>
                <p>picsum.photos with deterministic seeds per SKU so thumbnails stay consistent between visits.</p>
              </details>
              <details>
                <summary>How do I add even more catalog rows?</summary>
                <p>Edit <code>js/data.js</code> — increase counts per type or append new categories, then reload. Filters derive from the dataset automatically.</p>
              </details>
            </div>
          </section>

          <section class="block">
            <h2>Stay in the loop</h2>
            <p class="lead">Newsletter UI only — hook this form to your ESP when you go live.</p>
            <div class="news">
              <input type="email" placeholder="you@example.com" aria-label="Email for newsletter" />
              <button type="button" id="cta-news">Notify me</button>
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
            <p>Open the products grid to explore filters, pagination, and add-to-cart — then scroll this page anytime you need a long-form landing layout reference.</p>
            <button type="button" id="cta-products-2">Browse products</button>
          </section>
        </div>

        <aside>
          <div class="ad" style="margin-bottom: 1rem;">
            <strong>Sponsored</strong>
            Upgrade your workflow with premium templates. Shadow boundaries keep ad slots isolated from host page CSS.
          </div>
          <div class="ad" style="margin-bottom: 1rem;">
            <strong>Seasonal sale</strong>
            Fictional 20% off sitewide this weekend — swap this block for a live campaign widget when you connect an ad server.
          </div>
          <div class="ad">
            <strong>Featured partner</strong>
            Placeholder placement for co-marketing. Sticky positioning can be added in the shell if you want the rail to follow scroll.
          </div>
        </aside>
      </div>
    `;
    const goProducts = () => {
      window.location.hash = "products";
    };
    root.getElementById("cta-products").addEventListener("click", goProducts);
    root.getElementById("cta-products-2").addEventListener("click", goProducts);
    root.getElementById("cta-news").addEventListener("click", () => {
      alert("Demo only — connect your email API to capture signups.");
    });
  }
}

class ShopProducts extends HTMLElement {
  constructor() {
    super();
    this._filter = "all";
    this._page = 1;
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    this._root = root;
    root.innerHTML = `
      <style>${baseChromeStyles()}</style>
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
        .below-fold {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }
        .below-fold h2 { margin-top: 1.75rem; }
        .below-fold h2:first-child { margin-top: 0; }
        .tip-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }
        .tip {
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem 1.1rem;
          font-size: 0.92rem;
          line-height: 1.55;
          color: #334155;
        }
        .tip strong { display: block; color: #0f172a; margin-bottom: 0.35rem; }
        .banner {
          background: linear-gradient(90deg, #1e3a8a, #4338ca);
          color: #e0e7ff;
          border-radius: var(--radius);
          padding: 1.25rem 1.5rem;
          margin-top: 1.5rem;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .banner strong { color: #fff; }
        .longcopy { color: var(--muted); line-height: 1.65; font-size: 0.95rem; max-width: 72ch; }
      </style>
      <h1>Products</h1>
      <p class="lead">
        ${PRODUCTS.length} items across ${TYPES.length} categories — filter, paginate (${PAGE_SIZE} per page), and add to your cart.
        Scroll past the grid for sizing notes, fulfillment copy, and care tips.
      </p>
      <div class="toolbar">
        <div class="field">
          <label for="type-filter">Type</label>
          <select id="type-filter"></select>
        </div>
      </div>
      <div class="grid" id="grid"></div>
      <div class="pager" id="pager"></div>

      <div class="below-fold">
        <h2>Using this catalog</h2>
        <p class="longcopy">
          Pagination keeps the shadow tree lighter: only the current page of cards is in the DOM at once, which helps slower devices
          while still giving you many SKUs to browse. Change <code style="background:#f1f5f9;padding:0.1rem 0.35rem;border-radius:6px;font-size:0.85em">PAGE_SIZE</code>
          in <code style="background:#f1f5f9;padding:0.1rem 0.35rem;border-radius:6px;font-size:0.85em">app.js</code> if you want more rows per screen.
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
          This project does not call a warehouse API. Treat shipping timelines, inventory counts, and backorder messages as static copy
          you can replace once you connect ERP or commerce APIs. The long section exists so product and marketing stakeholders can scroll
          through realistic density while reviewing the layout inside the shadow boundary.
        </p>

        <div class="banner">
          <strong>Prototyping tip:</strong> keep high-resolution photography outside the shadow if you need <code>&lt;picture&gt;</code> art direction shared with the host —
          or colocate assets here for full encapsulation. Either pattern works with web components.
        </div>

        <h2>Accessibility checklist</h2>
        <p class="longcopy">
          When you extend the grid, preserve keyboard focus order: pagination buttons should stay adjacent to the list in the tab sequence,
          and filter controls should announce changes to screen readers via live regions if you fetch new pages from a server.
        </p>

        <h2>More placeholder detail</h2>
        <p class="longcopy">
          Loyalty points, gift messages, and subscription frequency are common upsells on product pages. This block mimics the vertical rhythm
          of those modules so you can eyeball spacing, ad slots, and cross-sells without touching cart logic. Duplicate or trim these paragraphs
          to match your brand voice.
        </p>
        <p class="longcopy" style="margin-top:1rem">
          If you need infinite scroll instead of numbered pages, swap the pager for an IntersectionObserver that appends batches — the shadow
          DOM pattern stays the same. Remember to virtualize rows if you render hundreds of nodes simultaneously.
        </p>
      </div>
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

class ShopCart extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    this._root = root;
    root.innerHTML = `
      <style>${baseChromeStyles()}</style>
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
      <h1>Cart</h1>
      <p class="lead">Items you added on the Products page. Quantities update here and stay in localStorage.</p>
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

class ShopCheckout extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>${baseChromeStyles()}</style>
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
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.95rem; }
        .summary-total { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border); font-weight: 700; font-size: 1.1rem; }
      </style>
      <h1>Checkout</h1>
      <p class="lead">Shipping and payment placeholders — submit to complete the demo order and clear the cart.</p>
      <div class="split">
        <form id="form" class="panel">
          <h2>Shipping</h2>
          <div class="field"><label for="full">Full name</label><input id="full" name="full" required autocomplete="name" /></div>
          <div class="field"><label for="line1">Address line 1</label><input id="line1" name="line1" required autocomplete="address-line1" /></div>
          <div class="field"><label for="city">City</label><input id="city" name="city" required autocomplete="address-level2" /></div>
          <div class="field"><label for="zip">Postal code</label><input id="zip" name="zip" required autocomplete="postal-code" /></div>
          <h2 style="margin-top:1rem">Payment</h2>
          <div class="field"><label for="card">Card number</label><input id="card" name="card" inputmode="numeric" placeholder="4242 4242 4242 4242" autocomplete="cc-number" /></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="field"><label for="exp">Expiry</label><input id="exp" name="exp" placeholder="MM/YY" autocomplete="cc-exp" /></div>
            <div class="field"><label for="cvc">CVC</label><input id="cvc" name="cvc" autocomplete="cc-csc" /></div>
          </div>
          <button type="submit">Place order</button>
        </form>
        <div class="panel" id="summary-panel"></div>
      </div>
    `;

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
      saveCart([]);
      alert("Thanks — demo order placed. Cart cleared.");
      window.location.hash = "home";
    });
  }
}

class ShopAccount extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    const acc = getAccount();
    root.innerHTML = `
      <style>${baseChromeStyles()}</style>
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
      <h1>Account</h1>
      <p class="lead">Profile fields are stored locally for this demo (including password — do not use real secrets).</p>
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

class ShopRoot extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>${baseChromeStyles()}</style>
      <style>
        .shell {
          min-height: 100vh;
          background: linear-gradient(180deg, #eef2ff 0%, var(--bg) 32%);
          padding: 1rem clamp(1rem, 4vw, 2rem) 2rem;
        }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .brand {
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.03em;
          color: #0f172a;
          text-decoration: none;
        }
        .brand:hover { text-decoration: none; opacity: 0.85; }
        nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem 0.75rem;
          align-items: center;
        }
        nav a {
          padding: 0.35rem 0.65rem;
          border-radius: 999px;
          color: #334155;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
        }
        nav a:hover { background: #e2e8f0; text-decoration: none; }
        nav a.active { background: #dbeafe; color: #1e40af; }
        .cart-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.25rem;
          height: 1.25rem;
          padding: 0 0.35rem;
          margin-left: 0.25rem;
          font-size: 0.7rem;
          font-weight: 700;
          background: var(--accent);
          color: white;
          border-radius: 999px;
        }
        main { max-width: 1100px; margin: 0 auto; }
      </style>
      <div class="shell">
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
        <main id="outlet"></main>
      </div>
    `;

    this._outlet = root.getElementById("outlet");
    this._nav = root.getElementById("nav");
    this._badge = root.getElementById("badge");

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
      this._outlet.innerHTML = "";
      let el;
      switch (route) {
        case "products":
          el = document.createElement("shop-products");
          break;
        case "cart":
          el = document.createElement("shop-cart");
          break;
        case "checkout":
          el = document.createElement("shop-checkout");
          break;
        case "account":
          el = document.createElement("shop-account");
          break;
        default:
          el = document.createElement("shop-home");
      }
      this._outlet.appendChild(el);

      this._nav.querySelectorAll("a[data-route]").forEach((a) => {
        a.classList.toggle("active", a.dataset.route === route);
      });
    };

    window.addEventListener("hashchange", render);
    render();
  }
}

customElements.define("shop-home", ShopHome);
customElements.define("shop-products", ShopProducts);
customElements.define("shop-cart", ShopCart);
customElements.define("shop-checkout", ShopCheckout);
customElements.define("shop-account", ShopAccount);
customElements.define("shop-root", ShopRoot);
