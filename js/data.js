/** Product type keys — order defines filter dropdown order after "all". */
export const TYPES = ["electronics", "apparel", "home", "beauty", "sports"];

const BASE_NAMES = {
  electronics: [
    "Noise Cancelling Buds",
    "Smart Watch Pro",
    "USB-C Hub",
    "Portable Charger",
    "Webcam HD",
    "Mechanical Keyboard",
    "Bluetooth Speaker",
    "4K Monitor Arm",
    "SSD Enclosure",
    "Mesh Wi-Fi Node",
    "Drawing Tablet",
    "Ring Light Kit",
    "Laptop Stand",
    "Noise Gate Interface",
    "Ergo Mouse",
  ],
  apparel: [
    "Organic Tee",
    "Merino Hoodie",
    "Trail Sneakers",
    "Canvas Cap",
    "Running Shorts",
    "Wool Socks",
    "Denim Jacket",
    "Packable Rain Shell",
    "Fleece Zip",
    "Leather Belt",
    "Linen Shirt",
    "Base Layer Tights",
    "Knit Beanie",
    "Court Shoes",
  ],
  home: [
    "Ceramic Mug Set",
    "Desk Lamp",
    "Throw Blanket",
    "Plant Stand",
    "Storage Basket",
    "Coasters",
    "Cast Iron Skillet",
    "Glass Carafe",
    "Bamboo Cutting Board",
    "Scented Candle Trio",
    "Wall Clock",
    "Picture Frames",
    "Door Draft Stopper",
    "Kitchen Scale",
  ],
  beauty: [
    "SPF Day Cream",
    "Hyaluronic Serum",
    "Vitamin C Drops",
    "Lip Balm Duo",
    "Clay Mask Jar",
    "Micellar Water",
    "Retinol Night Cream",
    "Body Lotion",
    "Hand Cream",
    "Brow Gel",
    "Mascara",
    "Face Oil",
    "Exfoliating Scrub",
    "Sheet Mask Set",
  ],
  sports: [
    "Yoga Mat",
    "Resistance Bands",
    "Foam Roller",
    "Insulated Bottle",
    "Jump Rope",
    "Ankle Weights",
    "Bike Gloves",
    "Swim Goggles",
    "Tennis Balls",
    "Hiking Poles",
    "Cooling Towel",
    "Wrist Wraps",
    "Knee Sleeves",
    "Gym Towel Pack",
  ],
};

/** How many SKUs to generate per category (pagination + scroll on catalog). */
const COUNT_PER_TYPE = {
  electronics: 34,
  apparel: 30,
  home: 28,
  beauty: 26,
  sports: 32,
};

function titleFor(type, index) {
  const bases = BASE_NAMES[type];
  const base = bases[index % bases.length];
  const edition = Math.floor(index / bases.length);
  return edition === 0 ? base : `${base} — Edition ${edition + 1}`;
}

function seedProducts() {
  const list = [];
  let id = 1;
  for (const type of TYPES) {
    const n = COUNT_PER_TYPE[type] ?? 24;
    for (let i = 0; i < n; i += 1) {
      list.push({
        id,
        name: titleFor(type, i),
        type,
        price: Math.round((12 + id * 5.3 + (i % 7) * 2.1) * 100) / 100,
        image: `https://picsum.photos/seed/shadowshop-${id}/480/360`,
      });
      id += 1;
    }
  }
  return list;
}

export const PRODUCTS = seedProducts();

export const PRODUCT_TYPES = ["all", ...TYPES];
