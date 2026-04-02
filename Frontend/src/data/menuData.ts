import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.jpg";
import dish5 from "@/assets/dish-5.jpg";
import dish6 from "@/assets/dish-6.jpg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isVeg: boolean;
  ingredients?: string[];
}

export const categories = ["Starters", "Main Course", "Pizza & Pasta", "Desserts", "Salads", "Biryani"];

export const menuItems: MenuItem[] = [
  // Starters
  { id: "7",  name: "Paneer Tikka",          description: "Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions.",          category: "Starters",      price: 220, image: dish1, isAvailable: true,  isVeg: true,  ingredients: ["Paneer", "Bell peppers", "Onions", "Yogurt", "Tandoori masala"] },
  { id: "9",  name: "Chicken Seekh Kebab",   description: "Minced chicken mixed with spices, shaped on skewers and grilled over charcoal.",           category: "Starters",      price: 260, image: dish3, isAvailable: true,  isVeg: false, ingredients: ["Minced chicken", "Onion", "Green chilli", "Garam masala", "Coriander"] },
  { id: "10", name: "Samosa (2 pcs)",         description: "Crispy golden pastry filled with spiced potatoes and peas, served with mint chutney.",     category: "Starters",      price: 80,  image: dish5, isAvailable: true,  isVeg: true,  ingredients: ["Potato", "Peas", "Pastry", "Cumin", "Coriander"] },
  { id: "11", name: "Spring Rolls",           description: "Crispy vegetable-stuffed rolls served with sweet chilli dipping sauce.",                   category: "Starters",      price: 140, image: dish3, isAvailable: true,  isVeg: true,  ingredients: ["Cabbage", "Carrot", "Noodles", "Spring roll sheets", "Soy sauce"] },
  { id: "12", name: "Chicken 65",             description: "Deep-fried spicy chicken bites tossed with curry leaves and green chillies.",              category: "Starters",      price: 240, image: dish1, isAvailable: true,  isVeg: false, ingredients: ["Chicken", "Red chilli", "Curry leaves", "Yogurt", "Ginger-garlic"] },

  // Main Course
  { id: "1",  name: "Butter Chicken",         description: "Creamy tomato-based curry with tender chicken pieces, garnished with cream and cilantro.", category: "Main Course",   price: 320, image: dish1, isAvailable: true,  isVeg: false, ingredients: ["Chicken", "Tomato", "Cream", "Butter", "Spices", "Cilantro"] },
  { id: "3",  name: "Grilled Salmon",          description: "Fresh Atlantic salmon fillet grilled with herbs and served with lemon butter sauce.",      category: "Main Course",   price: 450, image: dish3, isAvailable: true,  isVeg: false, ingredients: ["Salmon fillet", "Lemon", "Herbs", "Butter", "Garlic"] },
  { id: "13", name: "Dal Makhani",             description: "Slow-cooked black lentils simmered overnight with butter, cream and aromatic spices.",    category: "Main Course",   price: 240, image: dish6, isAvailable: true,  isVeg: true,  ingredients: ["Black lentils", "Butter", "Cream", "Tomato", "Spices"] },
  { id: "14", name: "Palak Paneer",            description: "Fresh cottage cheese cubes in a smooth, spiced spinach gravy.",                           category: "Main Course",   price: 260, image: dish5, isAvailable: true,  isVeg: true,  ingredients: ["Paneer", "Spinach", "Onion", "Tomato", "Cream", "Spices"] },
  { id: "15", name: "Mutton Rogan Josh",       description: "Slow-braised Kashmiri mutton in a bold, aromatic red gravy.",                             category: "Main Course",   price: 420, image: dish1, isAvailable: true,  isVeg: false, ingredients: ["Mutton", "Kashmiri chilli", "Yogurt", "Fennel", "Whole spices"] },

  // Pizza & Pasta
  { id: "2",  name: "Margherita Pizza",        description: "Classic thin-crust pizza with fresh mozzarella, basil, and San Marzano tomato sauce.",    category: "Pizza & Pasta", price: 280, image: dish2, isAvailable: true,  isVeg: true,  ingredients: ["Pizza dough", "Mozzarella", "Tomato sauce", "Fresh basil", "Olive oil"] },
  { id: "8",  name: "Pasta Alfredo",           description: "Creamy fettuccine alfredo with parmesan and garlic butter sauce.",                        category: "Pizza & Pasta", price: 260, image: dish2, isAvailable: true,  isVeg: true,  ingredients: ["Fettuccine", "Parmesan", "Cream", "Garlic", "Butter"] },
  { id: "16", name: "Chicken BBQ Pizza",       description: "Smoky BBQ chicken pizza with caramelised onions, jalapeños and mozzarella.",              category: "Pizza & Pasta", price: 340, image: dish2, isAvailable: true,  isVeg: false, ingredients: ["Chicken", "BBQ sauce", "Mozzarella", "Onion", "Jalapeño"] },
  { id: "17", name: "Penne Arrabbiata",        description: "Penne tossed in a fiery tomato and garlic sauce with fresh basil.",                       category: "Pizza & Pasta", price: 230, image: dish2, isAvailable: true,  isVeg: true,  ingredients: ["Penne", "Tomato", "Garlic", "Red chilli", "Basil"] },

  // Biryani
  { id: "6",  name: "Hyderabadi Biryani",      description: "Fragrant basmati rice layered with aromatic spices, saffron, and fried onions.",          category: "Biryani",       price: 350, image: dish6, isAvailable: true,  isVeg: false, ingredients: ["Basmati rice", "Saffron", "Spices", "Onions", "Yogurt", "Mint"] },
  { id: "18", name: "Veg Dum Biryani",         description: "Aromatic basmati rice slow-cooked with seasonal vegetables and whole spices.",            category: "Biryani",       price: 280, image: dish6, isAvailable: true,  isVeg: true,  ingredients: ["Basmati rice", "Mixed vegetables", "Saffron", "Whole spices", "Fried onions"] },
  { id: "19", name: "Lucknowi Biryani",        description: "Delicate Awadhi-style biryani with tender mutton and subtle fragrant spices.",            category: "Biryani",       price: 390, image: dish6, isAvailable: true,  isVeg: false, ingredients: ["Basmati rice", "Mutton", "Kewra water", "Whole spices", "Saffron"] },

  // Salads
  { id: "5",  name: "Caesar Salad",            description: "Crisp romaine lettuce with parmesan shavings, croutons, and classic Caesar dressing.",    category: "Salads",        price: 200, image: dish5, isAvailable: true,  isVeg: true,  ingredients: ["Romaine lettuce", "Parmesan", "Croutons", "Caesar dressing", "Anchovies"] },
  { id: "20", name: "Greek Salad",             description: "Fresh cucumber, tomato, olives and feta cheese tossed in olive oil and oregano.",         category: "Salads",        price: 180, image: dish5, isAvailable: true,  isVeg: true,  ingredients: ["Cucumber", "Tomato", "Feta", "Olives", "Olive oil", "Oregano"] },
  { id: "21", name: "Kachumber Salad",         description: "Classic Indian salad of diced onion, tomato, cucumber with lemon and chaat masala.",      category: "Salads",        price: 120, image: dish5, isAvailable: true,  isVeg: true,  ingredients: ["Onion", "Tomato", "Cucumber", "Lemon", "Chaat masala"] },

  // Desserts
  { id: "4",  name: "Chocolate Lava Cake",     description: "Rich dark chocolate cake with a molten center, dusted with powdered sugar.",              category: "Desserts",      price: 180, image: dish4, isAvailable: true,  isVeg: true,  ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar", "Flour"] },
  { id: "22", name: "Gulab Jamun",             description: "Soft milk-solid dumplings soaked in rose-flavoured sugar syrup, served warm.",            category: "Desserts",      price: 120, image: dish6, isAvailable: true,  isVeg: true,  ingredients: ["Khoya", "Flour", "Sugar syrup", "Rose water", "Cardamom"] },
  { id: "23", name: "Rasmalai",                description: "Soft cottage cheese patties soaked in chilled saffron-infused sweetened milk.",           category: "Desserts",      price: 150, image: dish4, isAvailable: true,  isVeg: true,  ingredients: ["Chenna", "Milk", "Saffron", "Cardamom", "Pistachios"] },
  { id: "24", name: "Mango Kulfi",             description: "Traditional Indian ice cream made with condensed milk and fresh Alphonso mango pulp.",    category: "Desserts",      price: 130, image: dish4, isAvailable: true,  isVeg: true,  ingredients: ["Condensed milk", "Mango pulp", "Cardamom", "Pistachios"] },
];

// Mock orders
export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: { menuId: string; name: string; qty: number; price: number }[];
  totalPrice: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  createdAt: string;
  payment: string;
}

export const mockOrders: Order[] = [
  { id: "ORD-001", userId: "u1", customerName: "Rahul Sharma", phone: "+91 98765 43210", address: "12, MG Road, Mumbai", items: [{ menuId: "1", name: "Butter Chicken", qty: 2, price: 320 }, { menuId: "6", name: "Hyderabadi Biryani", qty: 1, price: 350 }], totalPrice: 990, status: "preparing", createdAt: "2026-03-05T18:30:00", payment: "COD" },
  { id: "ORD-002", userId: "u2", customerName: "Priya Patel", phone: "+91 87654 32109", address: "45, Park Street, Delhi", items: [{ menuId: "2", name: "Margherita Pizza", qty: 1, price: 280 }, { menuId: "5", name: "Caesar Salad", qty: 1, price: 200 }], totalPrice: 480, status: "pending", createdAt: "2026-03-06T12:15:00", payment: "Razorpay" },
  { id: "ORD-003", userId: "u3", customerName: "Ankit Verma", phone: "+91 76543 21098", address: "78, Lake Road, Bangalore", items: [{ menuId: "3", name: "Grilled Salmon", qty: 1, price: 450 }, { menuId: "4", name: "Chocolate Lava Cake", qty: 2, price: 180 }], totalPrice: 810, status: "delivered", createdAt: "2026-03-04T20:00:00", payment: "COD" },
  { id: "ORD-004", userId: "u1", customerName: "Rahul Sharma", phone: "+91 98765 43210", address: "12, MG Road, Mumbai", items: [{ menuId: "7", name: "Paneer Tikka", qty: 3, price: 220 }], totalPrice: 660, status: "ready", createdAt: "2026-03-06T14:00:00", payment: "COD" },
  { id: "ORD-005", userId: "u4", customerName: "Sneha Gupta", phone: "+91 65432 10987", address: "23, Jubilee Hills, Hyderabad", items: [{ menuId: "8", name: "Pasta Alfredo", qty: 2, price: 260 }], totalPrice: 520, status: "cancelled", createdAt: "2026-03-03T19:45:00", payment: "Razorpay" },
];

// Mock reservations
export interface Reservation {
  id: string;
  userId: string | null;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

export const mockReservations: Reservation[] = [
  { id: "RES-001", userId: "u1", name: "Rahul Sharma", phone: "+91 98765 43210", guests: 4, date: "2026-03-07", time: "19:30", notes: "Anniversary dinner, need a quiet corner", status: "confirmed" },
  { id: "RES-002", userId: null, name: "Meera Iyer", phone: "+91 87654 32100", guests: 2, date: "2026-03-08", time: "20:00", notes: "", status: "confirmed" },
  { id: "RES-003", userId: "u3", name: "Ankit Verma", phone: "+91 76543 21098", guests: 8, date: "2026-03-06", time: "13:00", notes: "Birthday party, need cake arrangement", status: "completed" },
  { id: "RES-004", userId: null, name: "Kavita Singh", phone: "+91 65432 10987", guests: 3, date: "2026-03-09", time: "18:30", notes: "Vegetarian only", status: "confirmed" },
  { id: "RES-005", userId: "u2", name: "Priya Patel", phone: "+91 87654 32109", guests: 6, date: "2026-03-05", time: "21:00", notes: "", status: "cancelled" },
];

// Mock users for admin
export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
  createdAt: string;
  lastLogin: string;
  totalOrders: number;
}

export const mockUsers: AppUser[] = [
  { id: "u1", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", role: "user", createdAt: "2025-06-15", lastLogin: "2026-03-06", totalOrders: 12 },
  { id: "u2", name: "Priya Patel", email: "priya.patel@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", role: "user", createdAt: "2025-09-20", lastLogin: "2026-03-05", totalOrders: 8 },
  { id: "u3", name: "Ankit Verma", email: "ankit.verma@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit", role: "user", createdAt: "2025-11-01", lastLogin: "2026-03-04", totalOrders: 5 },
  { id: "u4", name: "Sneha Gupta", email: "sneha.gupta@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", role: "user", createdAt: "2026-01-10", lastLogin: "2026-03-03", totalOrders: 3 },
  { id: "a1", name: "Admin Chef", email: "admin@athenura.in", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin", role: "admin", createdAt: "2025-01-01", lastLogin: "2026-03-06", totalOrders: 0 },
];

// Gallery images by category
export interface GalleryItem {
  image: string;
  title: string;
  category: string;
}

export const galleryCategories = ["Starters", "Main Course", "Pizza & Pasta", "Desserts", "Salads", "Biryani"];

export const galleryItems: GalleryItem[] = [
  { image: dish1, title: "Butter Chicken", category: "Main Course" },
  { image: dish3, title: "Grilled Salmon", category: "Main Course" },
  { image: dish1, title: "Paneer Tikka", category: "Starters" },
  { image: dish5, title: "Samosa Platter", category: "Starters" },
  { image: dish3, title: "Spring Rolls", category: "Starters" },
  { image: dish2, title: "Margherita Pizza", category: "Pizza & Pasta" },
  { image: dish2, title: "Pasta Alfredo", category: "Pizza & Pasta" },
  { image: dish4, title: "Chocolate Lava Cake", category: "Desserts" },
  { image: dish6, title: "Gulab Jamun", category: "Desserts" },
  { image: dish4, title: "Rasmalai", category: "Desserts" },
  { image: dish5, title: "Caesar Salad", category: "Salads" },
  { image: dish5, title: "Greek Salad", category: "Salads" },
  { image: dish6, title: "Hyderabadi Biryani", category: "Biryani" },
  { image: dish6, title: "Lucknowi Biryani", category: "Biryani" },
  { image: dish3, title: "Chicken Seekh Kebab", category: "Starters" },
];

// Legacy flat gallery (keep for backward compat)
export const galleryImages = [dish1, dish2, dish3, dish4, dish5, dish6, dish1, dish2, dish3];

// Featured / most-ordered items for homepage & footer
export const featuredMenuItems = menuItems.filter((item) =>
  ["1", "6", "7", "4"].includes(item.id)
);

