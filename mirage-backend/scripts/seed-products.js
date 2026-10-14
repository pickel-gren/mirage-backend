import { db, queryClient } from "../src/db/client.js";
import { products } from "../src/db/schema/products.js";

const productData = [
  {
    id: "1",
    name: "Platinum",
    price: "9.99",
    category: "roles",
    image: "/platinum.png",
    details: "Benefits: Custom Tag, Profile Badge, Access to VIP Channels",
    active: true,
  },
  {
    id: "2",
    name: "Elite",
    price: "19.99",
    category: "roles",
    image: "/elite.png",
    details:
      "Benefits: Custom Tag, Profile Badge, VIP Channels, Monthly Credits",
    active: true,
  },
  {
    id: "3",
    name: "Supreme",
    price: "34.99",
    category: "roles",
    image: "/supreme.png",
    details: "12 XP Flux",
    active: true,
  },
  {
    id: "4",
    name: "Ultimate",
    price: "59.99",
    category: "roles",
    image: "/ultimate.png",
    details:
      "All previous benefits + exclusive badge and channel access",
    active: true,
  },
  {
    id: "5",
    name: "Emerald",
    price: "99.99",
    category: "roles",
    image: "/emerald.png",
    details:
      "All previous benefits + emerald badge and priority support",
    active: true,
  },
  {
    id: "6",
    name: "Pinnacle",
    price: "199.99",
    category: "roles",
    image: "/pinnacle.png",
    details: "All previous benefits + pinnacle badge, top-tier perks",
    active: true,
  },
  {
    id: "7",
    name: "Duo",
    price: "0.99",
    category: "diamonds",
    image: "/diamond_tier_1.png",
    details: "Worth 150K ingame diamonds",
    active: true,
  },
  {
    id: "8",
    name: "Prime",
    price: "2.49",
    category: "diamonds",
    image: "/diamond_tier_2.png",
    details: "Worth 500K ingame diamonds",
    active: true,
  },
  {
    id: "9",
    name: "Elite",
    price: "4.99",
    category: "diamonds",
    image: "/diamond_tier_3.png",
    details:
      "1.5M Diamonds + 150K BONUS. Worth 1.65M ingame diamonds",
    active: true,
  },
  {
    id: "10",
    name: "Fortune Chest",
    price: "9.99",
    category: "diamonds",
    image: "/diamond_tier_4.png",
    details:
      "4M Diamonds + 600K BONUS. Worth 4.6M ingame diamonds",
    active: true,
  },
  {
    id: "11",
    name: "Executive Case",
    price: "14.99",
    category: "diamonds",
    image: "/diamond_tier_5.png",
    details:
      "8M Diamonds + 2M BONUS. Worth 10M ingame diamonds",
    active: true,
  },
  {
    id: "12",
    name: "Royal Vault",
    price: "24.99",
    category: "diamonds",
    image: "/diamond_tier_6.png",
    details:
      "15M Diamonds + 5M BONUS. Worth 20M ingame diamonds",
    active: true,
  },
  {
    id: "13",
    name: "$10 Gift Card",
    price: "10.00",
    category: "gift_cards",
    image: "/gift.png",
    details: "Redeemable for any purchase. Valid for 1 year.",
    active: true,
  },
  {
    id: "14",
    name: "$25 Gift Card",
    price: "25.00",
    category: "gift_cards",
    image: "/gift.png",
    details:
      "Redeemable for any purchase. Valid for 1 year. Includes bonus $5 credit.",
    active: true,
  },
  {
    id: "15",
    name: "$50 Gift Card",
    price: "50.00",
    category: "gift_cards",
    image: "/gift.png",
    details:
      "Redeemable for any purchase. Valid for 1 year. Includes bonus $10 credit.",
    active: true,
  },
];

try {
  await db.transaction(async (tx) => {
    for (const product of productData) {
      await tx
        .insert(products)
        .values(product)
        .onConflictDoUpdate({
          target: products.id,
          set: {
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            details: product.details,
            active: product.active,
            updatedAt: new Date(),
          },
        });
    }
  });

  console.log(`Seeded ${productData.length} products.`);
} finally {
  await queryClient.end();
}
