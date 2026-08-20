export type PaymentMethod = "Cash" | "UPI" | "Card";

export type Ingredient = {
  id: string;
  name: string;
  stock: number;
  unit: "g" | "kg" | "ml" | "l" | "pcs";
  lowStockAt: number;
};

export type RecipeIngredient = {
  ingredientId: string;
  quantityPerServing: number;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  recipe: RecipeIngredient[];
};

export type CartItem = MenuItem & { quantity: number };

export type Bill = {
  id: string;
  billNumber: number;
  createdAt: string;
  cashier: string;
  outlet: string;
  items: { menuItemId: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
};

export const initialIngredients: Ingredient[] = [
  { id: "paneer", name: "Paneer", stock: 20000, unit: "g", lowStockAt: 3000 },
  { id: "butter", name: "Butter", stock: 5000, unit: "g", lowStockAt: 1000 },
  { id: "cream", name: "Cream", stock: 5000, unit: "ml", lowStockAt: 1000 },
  { id: "rice", name: "Rice", stock: 25000, unit: "g", lowStockAt: 5000 },
  { id: "flour", name: "Flour", stock: 20000, unit: "g", lowStockAt: 4000 },
  { id: "oil", name: "Cooking Oil", stock: 15000, unit: "ml", lowStockAt: 3000 },
  { id: "vegetables", name: "Mixed Vegetables", stock: 15000, unit: "g", lowStockAt: 3000 },
];

export const menuItems: MenuItem[] = [
  { id: "pbm", name: "Paneer Butter Masala", category: "Main Course", price: 220, recipe: [{ ingredientId: "paneer", quantityPerServing: 200 }, { ingredientId: "butter", quantityPerServing: 20 }, { ingredientId: "cream", quantityPerServing: 30 }] },
  { id: "ptikka", name: "Paneer Tikka", category: "Starters", price: 240, recipe: [{ ingredientId: "paneer", quantityPerServing: 180 }, { ingredientId: "butter", quantityPerServing: 15 }] },
  { id: "vbiryani", name: "Veg Biryani", category: "Main Course", price: 180, recipe: [{ ingredientId: "rice", quantityPerServing: 250 }, { ingredientId: "vegetables", quantityPerServing: 150 }, { ingredientId: "oil", quantityPerServing: 20 }] },
  { id: "dal", name: "Dal Makhani", category: "Main Course", price: 160, recipe: [{ ingredientId: "butter", quantityPerServing: 10 }] },
  { id: "naan", name: "Butter Naan", category: "Main Course", price: 45, recipe: [{ ingredientId: "flour", quantityPerServing: 90 }, { ingredientId: "butter", quantityPerServing: 8 }] },
  { id: "hakka", name: "Veg Hakka Noodles", category: "Chinese", price: 170, recipe: [{ ingredientId: "vegetables", quantityPerServing: 120 }, { ingredientId: "oil", quantityPerServing: 15 }] },
  { id: "manchurian", name: "Veg Manchurian", category: "Chinese", price: 160, recipe: [{ ingredientId: "vegetables", quantityPerServing: 150 }, { ingredientId: "flour", quantityPerServing: 50 }, { ingredientId: "oil", quantityPerServing: 20 }] },
  { id: "lassi", name: "Sweet Lassi", category: "Beverages", price: 80, recipe: [{ ingredientId: "cream", quantityPerServing: 50 }] },
  { id: "coldcoffee", name: "Cold Coffee", category: "Beverages", price: 120, recipe: [{ ingredientId: "cream", quantityPerServing: 60 }] },
  { id: "gulab", name: "Gulab Jamun", category: "Desserts", price: 90, recipe: [] },
  { id: "brownie", name: "Chocolate Brownie", category: "Desserts", price: 140, recipe: [] },
  { id: "samosa", name: "Paneer Samosa", category: "Starters", price: 90, recipe: [{ ingredientId: "paneer", quantityPerServing: 60 }, { ingredientId: "flour", quantityPerServing: 30 }, { ingredientId: "oil", quantityPerServing: 15 }] },
];

export function calculateTotals(items: CartItem[], discount: number, taxRate = 5) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const safeDiscount = Math.max(0, Math.min(discount, subtotal));
  const taxable = subtotal - safeDiscount;
  const tax = Math.round((taxable * taxRate) / 100);
  return { subtotal, discount: safeDiscount, tax, total: taxable + tax };
}

export function deductInventory(ingredients: Ingredient[], items: CartItem[]) {
  const next = ingredients.map((ingredient) => ({ ...ingredient }));
  for (const item of items) {
    for (const recipePart of item.recipe) {
      const ingredient = next.find((entry) => entry.id === recipePart.ingredientId);
      if (!ingredient) continue;
      ingredient.stock = Math.max(0, ingredient.stock - recipePart.quantityPerServing * item.quantity);
    }
  }
  return next;
}
