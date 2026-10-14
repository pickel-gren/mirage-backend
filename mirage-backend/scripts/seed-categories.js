import { db, queryClient } from "../src/db/client.js";
import { categories } from "../src/db/schema/categories.js";

const categoryData = [
  {
    key: "roles",
    label: "Roles",
    description: "Upgrade your Mirage experience.",
    icon: "/role.png",
    detailsMode: "modal",
    sortOrder: 1,
    active: true,
  },
  {
    key: "diamonds",
    label: "Diamonds",
    description: "Buy in-game diamonds instantly.",
    icon: "/diamond.png",
    detailsMode: "inline",
    sortOrder: 2,
    active: true,
  },
  {
    key: "gift_cards",
    label: "Gift Cards",
    description: "Perfect gifts for your friends.",
    icon: "/gifticon.png",
    detailsMode: "inline",
    sortOrder: 3,
    active: true,
  },
];

try {
  await db.transaction(async (tx) => {
    for (const category of categoryData) {
      await tx
        .insert(categories)
        .values(category)
        .onConflictDoUpdate({
          target: categories.key,
          set: {
            label: category.label,
            description: category.description,
            icon: category.icon,
            detailsMode: category.detailsMode,
            sortOrder: category.sortOrder,
            active: category.active,
            updatedAt: new Date(),
          },
        });
    }
  });

  console.log(`Seeded ${categoryData.length} categories.`);
} finally {
  await queryClient.end();
}
