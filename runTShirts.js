import { db } from "./db/index.js";
import { RunTShirts } from "./db/schema.js";

const tShirts = [
  {
    size: "S",
    price: 399,
    stock: 20,
  },
  {
    size: "M",
    price: 399,
    stock: 50,
  },
  {
    size: "L",
    price: 399,
    stock: 50,
  },
  {
    size: "XL",
    price: 449,
    stock: 30,
  },
  {
    size: "XXL",
    price: 499,
    stock: 20,
  },
];

try {
  await db.insert(RunTShirts).values(tShirts);

  console.log("✅ T-Shirt data successfully inserted");

  process.exit(0);
} catch (error) {
  console.error("❌ Failed to insert T-Shirt data:");
  console.error(error);

  process.exit(1);
}