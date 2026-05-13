const types = ["electronics", "apparel", "home"];

const titles = {
  electronics: ["Noise Cancelling Buds", "Smart Watch Pro", "USB-C Hub", "Portable Charger", "Webcam HD", "Mechanical Keyboard"],
  apparel: ["Organic Tee", "Merino Hoodie", "Trail Sneakers", "Canvas Cap", "Running Shorts", "Wool Socks"],
  home: ["Ceramic Mug Set", "Desk Lamp", "Throw Blanket", "Plant Stand", "Storage Basket", "Coasters"],
};

function seedProducts() {
  const list = [];
  let id = 1;
  for (const type of types) {
    const names = titles[type];
    names.forEach((name, idx) => {
      list.push({
        id,
        name,
        type,
        price: Math.round((15 + id * 7 + idx * 3) * 100) / 100,
        image: `https://picsum.photos/seed/shadowshop-${id}/480/360`,
      });
      id += 1;
    });
  }
  return list;
}

export const PRODUCTS = seedProducts();

export const PRODUCT_TYPES = ["all", ...types];
