// ============================================================
// EDITABLE CAFE DATA — update business info, menu, hours here.
// ============================================================

export const CAFE = {
  name: "The Chill Deck Rooftop Cafe",
  concept:
    "A cozy, vibrant pure-vegetarian rooftop cafe for casual meetups, coffee breaks, laptop working and evening hangouts under the open sky.",
  rating: 4.9,
  cost: "₹200–₹400 per person (approx. ₹500 for two)",
  address: "402/3, Gali Number 2, Near Axis Bank, Rooftop, Raja Park, Jaipur, Rajasthan 302004",
  phone: "+91 63754 09049",
  tel: "tel:+916375409049",
  whatsapp: "https://wa.me/916375409049",
  reserve:
    "https://www.swiggy.com/restaurants/jaipur/raja-park/the-chill-deck-rooftop-cafe-1429166/dineout",
  maps: "https://www.google.com/maps/search/?api=1&query=The+Chill+Deck+Rooftop+Cafe+Raja+Park+Jaipur",
  mapEmbed:
    "https://www.google.com/maps?q=The+Chill+Deck+Rooftop+Cafe+Raja+Park+Jaipur&output=embed",
};

/** Hours in minutes from midnight (IST). close > 1440 means past midnight. index 0 = Sunday */
export const HOURS: { day: string; open: number; close: number; label: string }[] = [
  { day: "Sunday", open: 660, close: 1500, label: "11:00 AM – 1:00 AM" },
  { day: "Monday", open: 660, close: 1440, label: "11:00 AM – 12:00 AM" },
  { day: "Tuesday", open: 660, close: 1440, label: "11:00 AM – 12:00 AM" },
  { day: "Wednesday", open: 660, close: 1440, label: "11:00 AM – 12:00 AM" },
  { day: "Thursday", open: 660, close: 1500, label: "11:00 AM – 1:00 AM" },
  { day: "Friday", open: 660, close: 1500, label: "11:00 AM – 1:00 AM" },
  { day: "Saturday", open: 660, close: 1500, label: "11:00 AM – 1:00 AM" },
];

/** Current day index + minutes in Jaipur time */
export function jaipurNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

export function isOpenNow() {
  const { day, minutes } = jaipurNow();
  const today = HOURS[day]!;
  if (minutes >= today.open && minutes < today.close) return true;
  const prev = HOURS[(day + 6) % 7]!;
  return prev.close > 1440 && minutes < prev.close - 1440;
}

export type MenuGroup = { title: string; items: string[] };
export type MenuTab = { id: string; label: string; groups: MenuGroup[] };

/** Items listed here get the amber "Cafe Specialty" badge */
export const SPECIALTIES = ["Cheesy Popstick", "The Chill Deck Special Tea", "The Chill Deck Special"];

export const MENU: MenuTab[] = [
  {
    id: "hot",
    label: "Hot Beverages",
    groups: [
      { title: "Chai", items: ["Ghar Wali Chai", "Ginger Tea", "Masala Tea", "Ginger & Cardamom Tea", "Saffron Tea", "The Chill Deck Special Tea"] },
      { title: "Milkless Tea", items: ["Black Tea", "Green Tea", "Lemon Tea", "Lemon Honey Tea"] },
      { title: "Hot Coffee", items: ["Black Coffee", "Hand-Beaten Desi Coffee", "Cappuccino"] },
    ],
  },
  {
    id: "cold",
    label: "Cold Drinks & Shakes",
    groups: [
      { title: "Thick Shakes", items: ["Cold Coffee", "Oreo", "Kit Kat", "Brownie", "Chocolate", "Ferrero Rocher", "Black Currant", "Nutella"] },
      { title: "Iced Teas & Mojitos", items: ["Modi Nagar Shikanji", "Lemon Mint Iced Tea", "Peach Iced Tea", "Virgin Mint Mojito", "Watermelon Mojito", "Cranberry Mojito", "Red Bull Iced Tea"] },
    ],
  },
  {
    id: "bites",
    label: "Quick Bites",
    groups: [
      { title: "Snacks", items: ["Bun Maska", "Plain Poha", "Paneer Poha", "Vada Pav", "Bhel Puri", "Chilli Cheese Toast", "Cheese Garlic Bread", "French Fries", "Cheesy Popstick", "Plain Nachos", "Cheese Baked Nachos", "Nachos Platter"] },
      { title: "Healthy Bites", items: ["Peanut Chaat", "Crispy Corn", "Sautéed Vegetables", "Sautéed Vegetables with Rice"] },
    ],
  },
  {
    id: "italian",
    label: "Italian & Continental",
    groups: [
      { title: "Pizzas", items: ["Margherita Pizza", "OTC Pizza", "Cheese Corn Pizza", "Tandoori Paneer Pizza", "Farm Fresh Pizza", "The Chill Deck Special Pizza"] },
      { title: "Pastas", items: ["Alfredo Pasta", "Arrabbiata Pasta", "Italian Pink Sauce Pasta", "Pesto Pasta", "The Chill Deck Special Pasta"] },
      { title: "Sizzlers", items: ["Mexican Sizzler", "Italian Sizzler", "Chinese Sizzler"] },
    ],
  },
  {
    id: "burgers",
    label: "Burgers & Sandwiches",
    groups: [
      { title: "Burgers", items: ["Aloo Tikki Burger", "Veg Burger", "Cheese Burger", "Double Tikki Burger"] },
      { title: "Sandwiches", items: ["Mumbai Sandwich", "Veg Cheese Sandwich", "Corn Cheese Sandwich", "Tandoori Paneer Sandwich", "Green Great Cheese Sandwich", "The Chill Deck Special Sandwich"] },
    ],
  },
  {
    id: "chinese",
    label: "Chinese & Street Food",
    groups: [
      { title: "Rolls & Chinese", items: ["Veg Roll", "Paneer Capsicum Roll", "Paneer Bhurji Roll", "Spring Roll", "Chinese Bhel", "Veg Hakka Noodles", "Garlic Noodles", "Chilli Potato", "Honey Chilli Potato", "Fried Rice", "Veg Manchurian", "Chilli Paneer", "Hara Bhara Kabab"] },
    ],
  },
  {
    id: "indian",
    label: "North Indian",
    groups: [
      { title: "Mains", items: ["Sev Tamatar", "Dal Tadka", "Dal Fry", "Mix Veg", "Paneer Butter Masala", "Paneer Lababdar", "Kadhai Paneer"] },
      { title: "Breads", items: ["Tawa Roti", "Butter Tawa Roti", "Plain Paratha", "Laccha Paratha"] },
      { title: "Parathas", items: ["Aloo Pyaaz Paratha", "Mix Veg Paratha", "Hari Mirch Paratha", "Paneer Paratha"] },
      { title: "Raita", items: ["Boondi Raita", "Mix Veg Raita", "Mint Raita"] },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    groups: [
      { title: "Sweet Endings", items: ["Vanilla Ice Cream", "Strawberry Ice Cream", "Chocolate Ice Cream", "Black Currant Ice Cream", "Brownie with Ice Cream", "Hot Brownie Fudge"] },
    ],
  },
];

export const COMBOS = [
  { name: "Combo 1", items: "Aloo Tikki Burger + French Fries + Masala Tea" },
  { name: "Combo 2", items: "Masala Maggi + Vada Pav + Cold Drink" },
  { name: "Combo 3", items: "OTC Pizza + Aloo Masala Sandwich + Cold Drink or 2 Teas" },
  { name: "Combo 4 · Family Pack", items: "Any 2 Pizzas + 2 Pastas + Cheese Garlic Bread + 6 Mocktails/Shakes" },
];

export const REVIEWS = [
  { text: "The sunset view from the deck with a kulhad of masala chai is unbeatable. Our new go-to spot in Raja Park.", who: "Sample guest · Friends' hangout" },
  { text: "Quiet afternoons, good Wi-Fi vibes and a great cappuccino — perfect for getting some work done.", who: "Sample guest · Solo work session" },
  { text: "Acoustic night was magical. The fairy lights, the music and the Cheesy Popstick — loved every bit.", who: "Sample guest · Date night" },
  { text: "Celebrated a birthday here with the family pack. Pizzas and pastas disappeared in minutes!", who: "Sample guest · Birthday hangout" },
  { text: "Pure veg, pocket-friendly and the staff is super warm. The thick Oreo shake is a must.", who: "Sample guest · Evening visit" },
];
