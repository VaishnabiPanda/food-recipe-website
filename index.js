const chatbot = document.querySelector(".recipe-chatbot");
const chatToggle = document.querySelector(".chat-toggle");
const chatClose = document.querySelector(".chat-close");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatMessages = document.querySelector("#chat-messages");
const suggestionButtons = document.querySelectorAll(".chat-suggestions button");
const pageLoader = document.querySelector("#page-loader");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeText = document.querySelector(".theme-text");
const stateSearch = document.querySelector("#state-search");
const filterButtons = document.querySelectorAll(".filter-button");
const filterStatus = document.querySelector("#filter-status");
const foodCards = document.querySelectorAll(".food-card");
let activeFilter = "all";

function hidePageLoader() {
    if (!pageLoader) {
        return;
    }

    pageLoader.classList.add("is-hidden");
}

window.addEventListener("load", () => {
    window.setTimeout(hidePageLoader, 450);
});

window.setTimeout(hidePageLoader, 2200);

function getSavedTheme() {
    try {
        return localStorage.getItem("foodRecipeTheme");
    } catch (error) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("foodRecipeTheme", theme);
    } catch (error) {
        // Theme still changes for this visit if storage is unavailable.
    }
}

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
    themeIcon.textContent = isDark ? "L" : "D";
    themeText.textContent = isDark ? "Light" : "Dark";
}

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
applyTheme(getSavedTheme() || preferredTheme);

const recipeData = [
    {
        state: "Goa",
        page: "goarecipe.html",
        dishes: ["Goan Fish Curry", "Pork Vindaloo", "Xacuti", "Bebinca", "Prawn Balchao", "Sorpotel"],
        quick: "Try Goan Fish Curry if you want something coastal, spicy, and ready in about 30 minutes."
    },
    {
        state: "Punjab",
        page: "punjabrecipe.html",
        dishes: ["Sarson Da Saag", "Chole", "Rajma", "Paneer Tikka", "Butter Chicken", "Makki Di Roti"],
        quick: "Paneer Tikka is a good starter, while Chole is perfect for a filling meal."
    },
    {
        state: "Odisha",
        page: "odiarecipe.html",
        dishes: ["Dahi Baingan", "Khechudi", "Dalma", "Pakhala Bhata", "Chhena Poda", "Adisa Pitha"],
        quick: "Dalma is comforting and balanced with dal, vegetables, and mild spices."
    },
    {
        state: "Andhra Pradesh",
        page: "andhrafoodrecipes.html",
        dishes: ["Pulihora", "Dondakaya Fry", "Gongura Pickle", "Pesarattu", "Medu Vada", "Punugulu", "Curd Rice"],
        quick: "Pulihora is tangy and quick; Pesarattu is a great protein-rich breakfast."
    },
    {
        state: "Gujarat",
        page: "gujratrecipie.html",
        dishes: ["Dhokla", "Undhiyu", "Khandvi", "Handvo", "Sev Tameta Nu Shaak", "Thepla"],
        quick: "Dhokla and Thepla are friendly choices for quick snacks."
    },
    {
        state: "Rajasthan",
        page: "rajasthanrecipe.html",
        dishes: ["Dal Baati Churma", "Gatte Ki Sabzi", "Laal Maas", "Ker Sangri", "Pyaaz Kachori", "Ghevar"],
        quick: "Gatte Ki Sabzi is a strong pick when you want a rich vegetarian curry."
    },
    {
        state: "Tamil Nadu",
        page: "tamilnadurecipe.html",
        dishes: ["Idli Sambar", "Masala Dosa", "Chettinad Chicken", "Pongal", "Rasam", "Payasam"],
        quick: "Rasam is fast and light; Pongal is warm, simple, and filling."
    },
    {
        state: "Telangana",
        page: "telanganarecipe.html",
        dishes: ["Hyderabadi Biryani", "Sarva Pindi", "Sakinalu", "Pachi Pulusu", "Kodi Kura", "Qubani Ka Meetha"],
        quick: "Sarva Pindi is crisp and homely; Hyderabadi Biryani is the celebration dish."
    },
    {
        state: "West Bengal",
        page: "westbengalrecipe.html",
        dishes: ["Shorshe Ilish", "Kosha Mangsho", "Luchi Alur Dom", "Chingri Malai Curry", "Shukto", "Rasgulla"],
        quick: "Luchi Alur Dom is a lovely vegetarian comfort meal."
    },
    {
        state: "Kerala",
        page: "keralarecipe.html",
        dishes: ["Appam with Stew", "Puttu Kadala", "Avial", "Kerala Fish Molee", "Malabar Biryani", "Payasam"],
        quick: "Avial is a colourful vegetarian dish, and Appam with Stew is soft and mild."
    }
];

const vegDishes = [
    "Dhokla", "Thepla", "Dalma", "Pakhala Bhata", "Gatte Ki Sabzi", "Avial",
    "Pongal", "Rasam", "Sarva Pindi", "Luchi Alur Dom", "Kafuli", "Chole"
];

const quickDishes = [
    "Goan Fish Curry", "Rasam", "Aloo Pitika", "Dhokla", "Kothimbir Vadi",
    "Pachi Pulusu", "Curd Rice", "Dondakaya Fry", "Aloo Ke Gutke"
];

function matchesSearch(card, query) {
    const searchableText = [
        card.dataset.state || "",
        card.dataset.dishes || "",
        card.textContent || ""
    ].join(" ");

    return searchableText.toLowerCase().includes(query);
}

function matchesFilter(card, filter) {
    if (filter === "all") {
        return true;
    }

    return (card.dataset.tags || "").split(" ").includes(filter);
}

function updateFilterStatus(visibleCount, query) {
    const totalCount = foodCards.length;
    const label = visibleCount === 1 ? "state" : "states";
    const filterText = activeFilter === "all" ? "all categories" : activeFilter;
    const searchText = query ? ` matching "${query}"` : "";

    filterStatus.textContent = visibleCount > 0
        ? `Showing ${visibleCount} of ${totalCount} ${label} in ${filterText}${searchText}.`
        : `No states found in ${filterText}${searchText}. Try a different search or filter.`;
}

function applyStateFilters() {
    const query = stateSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    foodCards.forEach((card) => {
        const isVisible = matchesSearch(card, query) && matchesFilter(card, activeFilter);

        card.classList.toggle("is-hidden", !isVisible);

        if (isVisible) {
            visibleCount += 1;
        }
    });

    updateFilterStatus(visibleCount, query);
}

const nutritionData = {
    "goan fish curry": {
        name: "Goan Fish Curry",
        amount: "1 bowl, about 250 g",
        calories: "260 kcal",
        protein: "24 g",
        carbs: "9 g",
        fat: "14 g",
        fiber: "2 g",
        nutrition: "Fish gives lean protein and omega-3 fats; coconut and spices add minerals and flavour.",
        benefits: "Supports muscle repair, keeps meals filling, and can be good for heart-friendly fats when cooked with moderate oil."
    },
    "pork vindaloo": {
        name: "Pork Vindaloo",
        amount: "1 serving, about 220 g",
        calories: "430 kcal",
        protein: "27 g",
        carbs: "8 g",
        fat: "31 g",
        fiber: "1 g",
        nutrition: "Pork provides protein, iron, zinc, and B vitamins; vinegar and spices make it sharp and rich.",
        benefits: "Helpful for high-energy meals, but best eaten in moderate portions because it is higher in fat."
    },
    "bebinca": {
        name: "Bebinca",
        amount: "1 slice, about 80 g",
        calories: "310 kcal",
        protein: "5 g",
        carbs: "38 g",
        fat: "16 g",
        fiber: "1 g",
        nutrition: "Eggs and coconut milk add fat and some protein; sugar and flour make it energy dense.",
        benefits: "A festive energy-rich dessert. Enjoy as a small portion after a balanced meal."
    },
    "prawn balchao": {
        name: "Prawn Balchao",
        amount: "1 serving, about 180 g",
        calories: "260 kcal",
        protein: "25 g",
        carbs: "10 g",
        fat: "13 g",
        fiber: "2 g",
        nutrition: "Prawns are rich in protein, selenium, and vitamin B12; vinegar-spice masala adds strong flavour.",
        benefits: "Good for a protein-focused seafood meal, especially with rice and vegetables."
    },
    "sarson da saag": {
        name: "Sarson Da Saag",
        amount: "1 bowl, about 250 g",
        calories: "220 kcal",
        protein: "9 g",
        carbs: "18 g",
        fat: "12 g",
        fiber: "7 g",
        nutrition: "Mustard greens, spinach, and bathua bring fiber, iron, folate, calcium, and antioxidants.",
        benefits: "Supports digestion and micronutrient intake; pair with makki di roti for a filling meal."
    },
    "chole": {
        name: "Chole",
        amount: "1 bowl, about 240 g",
        calories: "330 kcal",
        protein: "15 g",
        carbs: "48 g",
        fat: "9 g",
        fiber: "12 g",
        nutrition: "Chickpeas provide plant protein, complex carbs, fiber, iron, and folate.",
        benefits: "Keeps you full for longer and supports steady energy when cooked with moderate oil."
    },
    "rajma": {
        name: "Rajma",
        amount: "1 bowl, about 240 g",
        calories: "300 kcal",
        protein: "14 g",
        carbs: "45 g",
        fat: "7 g",
        fiber: "11 g",
        nutrition: "Kidney beans add plant protein, fiber, potassium, iron, and slow-digesting carbohydrates.",
        benefits: "Good for fullness and everyday energy, especially with rice and salad."
    },
    "paneer tikka": {
        name: "Paneer Tikka",
        amount: "6 pieces, about 180 g",
        calories: "360 kcal",
        protein: "18 g",
        carbs: "12 g",
        fat: "26 g",
        fiber: "2 g",
        nutrition: "Paneer gives calcium and protein; capsicum and onion add vitamin C and crunch.",
        benefits: "Useful as a high-protein vegetarian starter, but portion size matters because paneer is rich."
    },
    "butter chicken": {
        name: "Butter Chicken",
        amount: "1 bowl, about 250 g",
        calories: "480 kcal",
        protein: "30 g",
        carbs: "14 g",
        fat: "34 g",
        fiber: "2 g",
        nutrition: "Chicken gives protein; tomato and spices add antioxidants; butter and cream raise fat content.",
        benefits: "Good protein dish for an occasional rich meal. Balance it with roti, rice, or salad."
    },
    "makki di roti": {
        name: "Makki Di Roti",
        amount: "1 roti, about 90 g",
        calories: "210 kcal",
        protein: "5 g",
        carbs: "42 g",
        fat: "3 g",
        fiber: "5 g",
        nutrition: "Maize flour offers complex carbs, fiber, magnesium, and a naturally gluten-free base.",
        benefits: "Gives steady energy and pairs well with leafy saag for a balanced plate."
    },
    "dalma": {
        name: "Dalma",
        amount: "1 bowl, about 250 g",
        calories: "240 kcal",
        protein: "11 g",
        carbs: "36 g",
        fat: "6 g",
        fiber: "8 g",
        nutrition: "Toor dal and vegetables provide plant protein, fiber, potassium, folate, and vitamin A.",
        benefits: "A balanced everyday dish that supports digestion, fullness, and steady energy."
    },
    "pakhala bhata": {
        name: "Pakhala Bhata",
        amount: "1 bowl, about 300 g",
        calories: "210 kcal",
        protein: "5 g",
        carbs: "42 g",
        fat: "3 g",
        fiber: "2 g",
        nutrition: "Rice, water, and curd make it hydrating; curd can add probiotics and calcium.",
        benefits: "Cooling and light, especially in hot weather. Add vegetables or dal for more protein."
    },
    "chhena poda": {
        name: "Chhena Poda",
        amount: "1 slice, about 90 g",
        calories: "290 kcal",
        protein: "9 g",
        carbs: "32 g",
        fat: "14 g",
        fiber: "1 g",
        nutrition: "Chhena gives protein and calcium; sugar and semolina add quick energy.",
        benefits: "A calcium-rich dessert, best enjoyed as a small sweet serving."
    },
    "pulihora": {
        name: "Pulihora",
        amount: "1 plate, about 220 g",
        calories: "330 kcal",
        protein: "7 g",
        carbs: "56 g",
        fat: "10 g",
        fiber: "4 g",
        nutrition: "Rice gives energy; peanuts and dals add protein, healthy fats, and crunch.",
        benefits: "A filling travel-friendly meal. Add curd or dal if you want more protein."
    },
    "dondakaya fry": {
        name: "Dondakaya Fry",
        amount: "1 serving, about 160 g",
        calories: "180 kcal",
        protein: "4 g",
        carbs: "16 g",
        fat: "11 g",
        fiber: "5 g",
        nutrition: "Ivy gourd adds fiber and plant nutrients; peanuts or coconut add fats and minerals.",
        benefits: "A lighter vegetable side that supports fiber intake when cooked with moderate oil."
    },
    "pesarattu": {
        name: "Pesarattu",
        amount: "2 medium dosas, about 180 g",
        calories: "300 kcal",
        protein: "16 g",
        carbs: "46 g",
        fat: "6 g",
        fiber: "9 g",
        nutrition: "Green gram is rich in plant protein, fiber, folate, magnesium, and iron.",
        benefits: "A strong breakfast choice for protein, fullness, and slow energy release."
    },
    "curd rice": {
        name: "Curd Rice",
        amount: "1 bowl, about 250 g",
        calories: "260 kcal",
        protein: "8 g",
        carbs: "42 g",
        fat: "7 g",
        fiber: "1 g",
        nutrition: "Curd adds calcium, protein, and probiotics; rice gives easy energy.",
        benefits: "Gentle, cooling, and useful as a light comfort meal."
    },
    "dhokla": {
        name: "Dhokla",
        amount: "4 pieces, about 160 g",
        calories: "230 kcal",
        protein: "9 g",
        carbs: "34 g",
        fat: "6 g",
        fiber: "4 g",
        nutrition: "Gram flour gives plant protein and fiber; steaming keeps it lighter than fried snacks.",
        benefits: "A good light snack that is filling without being too heavy."
    },
    "thepla": {
        name: "Thepla",
        amount: "2 medium theplas, about 120 g",
        calories: "300 kcal",
        protein: "8 g",
        carbs: "48 g",
        fat: "9 g",
        fiber: "7 g",
        nutrition: "Wheat and methi leaves provide carbs, fiber, iron, and plant compounds.",
        benefits: "Good for travel and steady energy; pair with curd for more protein."
    },
    "undhiyu": {
        name: "Undhiyu",
        amount: "1 bowl, about 250 g",
        calories: "360 kcal",
        protein: "10 g",
        carbs: "42 g",
        fat: "18 g",
        fiber: "10 g",
        nutrition: "Mixed winter vegetables, sesame, coconut, and peanuts add fiber, minerals, and healthy fats.",
        benefits: "Nutrient-dense and filling, especially as a vegetable-rich main dish."
    },
    "handvo": {
        name: "Handvo",
        amount: "2 slices, about 180 g",
        calories: "310 kcal",
        protein: "11 g",
        carbs: "44 g",
        fat: "10 g",
        fiber: "6 g",
        nutrition: "Rice, lentils, and bottle gourd provide carbs, protein, fiber, and moisture.",
        benefits: "A balanced snack or breakfast with better protein than many refined-flour snacks."
    },
    "dal baati churma": {
        name: "Dal Baati Churma",
        amount: "1 plate, about 350 g",
        calories: "650 kcal",
        protein: "20 g",
        carbs: "82 g",
        fat: "28 g",
        fiber: "12 g",
        nutrition: "Mixed dal gives protein and fiber; baati and churma make it energy dense.",
        benefits: "A hearty meal for high energy needs. Keep ghee moderate for a lighter plate."
    },
    "gatte ki sabzi": {
        name: "Gatte Ki Sabzi",
        amount: "1 bowl, about 220 g",
        calories: "320 kcal",
        protein: "13 g",
        carbs: "28 g",
        fat: "17 g",
        fiber: "5 g",
        nutrition: "Besan dumplings add plant protein and fiber; curd gravy adds calcium.",
        benefits: "A protein-rich vegetarian curry that is satisfying with roti."
    },
    "laal maas": {
        name: "Laal Maas",
        amount: "1 bowl, about 240 g",
        calories: "520 kcal",
        protein: "32 g",
        carbs: "8 g",
        fat: "40 g",
        fiber: "2 g",
        nutrition: "Mutton is rich in protein, iron, zinc, and B12; chili and spices add flavour.",
        benefits: "Useful for a high-protein meal, but it is rich and best eaten occasionally."
    },
    "idli sambar": {
        name: "Idli Sambar",
        amount: "2 idlis with 1 bowl sambar, about 300 g",
        calories: "330 kcal",
        protein: "12 g",
        carbs: "60 g",
        fat: "5 g",
        fiber: "7 g",
        nutrition: "Fermented rice-urad batter and dal sambar add carbs, protein, fiber, and minerals.",
        benefits: "Light, filling, and digestion-friendly for breakfast or dinner."
    },
    "masala dosa": {
        name: "Masala Dosa",
        amount: "1 dosa, about 250 g",
        calories: "420 kcal",
        protein: "10 g",
        carbs: "64 g",
        fat: "14 g",
        fiber: "6 g",
        nutrition: "Fermented batter gives carbs and some protein; potato masala adds potassium and energy.",
        benefits: "A satisfying meal; add sambar for extra protein and fiber."
    },
    "pongal": {
        name: "Pongal",
        amount: "1 bowl, about 250 g",
        calories: "310 kcal",
        protein: "10 g",
        carbs: "48 g",
        fat: "9 g",
        fiber: "5 g",
        nutrition: "Rice and moong dal provide carbs, plant protein, and easy digestion.",
        benefits: "Gentle, warm, and filling; good when you want a simple comfort meal."
    },
    "rasam": {
        name: "Rasam",
        amount: "1 bowl, about 220 g",
        calories: "90 kcal",
        protein: "3 g",
        carbs: "14 g",
        fat: "3 g",
        fiber: "2 g",
        nutrition: "Tamarind, tomato, pepper, cumin, garlic, and dal water add minerals and antioxidants.",
        benefits: "Light and warming; works well as a low-calorie side with rice."
    },
    "hyderabadi biryani": {
        name: "Hyderabadi Biryani",
        amount: "1 plate, about 350 g",
        calories: "620 kcal",
        protein: "28 g",
        carbs: "78 g",
        fat: "22 g",
        fiber: "3 g",
        nutrition: "Rice gives energy; meat adds protein, iron, and B vitamins; spices add aroma.",
        benefits: "A filling celebration meal. Add raita and salad for balance."
    },
    "sarva pindi": {
        name: "Sarva Pindi",
        amount: "1 serving, about 180 g",
        calories: "330 kcal",
        protein: "9 g",
        carbs: "48 g",
        fat: "12 g",
        fiber: "6 g",
        nutrition: "Rice flour, chana dal, peanuts, and sesame add carbs, plant protein, fats, and minerals.",
        benefits: "A filling snack with more texture and protein than plain fried snacks."
    },
    "kodi kura": {
        name: "Kodi Kura",
        amount: "1 bowl, about 240 g",
        calories: "360 kcal",
        protein: "30 g",
        carbs: "10 g",
        fat: "22 g",
        fiber: "2 g",
        nutrition: "Chicken adds lean protein; tomato, onion, and spices add flavour and micronutrients.",
        benefits: "Good protein curry for lunch or dinner when balanced with rice or roti."
    },
    "luchi alur dom": {
        name: "Luchi Alur Dom",
        amount: "2 luchis with alur dom, about 260 g",
        calories: "520 kcal",
        protein: "9 g",
        carbs: "68 g",
        fat: "24 g",
        fiber: "6 g",
        nutrition: "Potatoes provide potassium and carbs; luchi adds quick energy.",
        benefits: "A comforting festive meal, best balanced with a lighter dish later."
    },
    "shorshe ilish": {
        name: "Shorshe Ilish",
        amount: "1 serving, about 200 g",
        calories: "390 kcal",
        protein: "25 g",
        carbs: "5 g",
        fat: "30 g",
        fiber: "1 g",
        nutrition: "Hilsa is rich in protein and omega-3 fats; mustard adds sharp flavour and minerals.",
        benefits: "A protein-rich fish dish with heart-friendly fats, though it is naturally oily."
    },
    "rasgulla": {
        name: "Rasgulla",
        amount: "2 pieces, about 100 g",
        calories: "210 kcal",
        protein: "5 g",
        carbs: "42 g",
        fat: "3 g",
        fiber: "0 g",
        nutrition: "Chhena adds some protein and calcium; sugar syrup adds quick carbohydrates.",
        benefits: "A lighter milk sweet than many fried desserts, but still best in small portions."
    },
    "appam with stew": {
        name: "Appam with Stew",
        amount: "2 appams with 1 bowl stew, about 320 g",
        calories: "430 kcal",
        protein: "10 g",
        carbs: "62 g",
        fat: "16 g",
        fiber: "5 g",
        nutrition: "Fermented rice appams give carbs; coconut milk and vegetables add fats and minerals.",
        benefits: "Mild and filling; add chicken or kadala if you want more protein."
    },
    "puttu kadala": {
        name: "Puttu Kadala",
        amount: "1 plate, about 320 g",
        calories: "520 kcal",
        protein: "18 g",
        carbs: "78 g",
        fat: "16 g",
        fiber: "14 g",
        nutrition: "Rice flour and black chickpeas bring carbs, plant protein, fiber, iron, and folate.",
        benefits: "A hearty breakfast that keeps you full for longer."
    },
    "avial": {
        name: "Avial",
        amount: "1 bowl, about 240 g",
        calories: "220 kcal",
        protein: "5 g",
        carbs: "22 g",
        fat: "12 g",
        fiber: "7 g",
        nutrition: "Mixed vegetables, curd, and coconut add fiber, potassium, calcium, and healthy fats.",
        benefits: "A vegetable-rich dish that supports fiber and micronutrient intake."
    },
    "malabar biryani": {
        name: "Malabar Biryani",
        amount: "1 plate, about 350 g",
        calories: "610 kcal",
        protein: "27 g",
        carbs: "76 g",
        fat: "23 g",
        fiber: "3 g",
        nutrition: "Rice and chicken provide energy and protein; nuts and ghee add richness.",
        benefits: "A complete festive meal. Pair with salad or raita to lighten it."
    },
    "payasam": {
        name: "Payasam",
        amount: "1 small bowl, about 150 g",
        calories: "260 kcal",
        protein: "6 g",
        carbs: "38 g",
        fat: "9 g",
        fiber: "1 g",
        nutrition: "Milk adds calcium and protein; nuts add minerals; sugar or jaggery adds sweetness.",
        benefits: "A nourishing dessert in small servings, especially when made with milk and nuts."
    }
};

function openChat() {
    chatbot.classList.add("is-open");
    chatToggle.setAttribute("aria-expanded", "true");
    chatInput.focus();
}

function closeChat() {
    chatbot.classList.remove("is-open");
    chatToggle.setAttribute("aria-expanded", "false");
    chatToggle.focus();
}

function addMessage(text, type = "bot") {
    const message = document.createElement("div");
    message.className = `chat-message ${type}-message`;
    if (type === "user") {
        message.textContent = text;
    } else {
        message.innerHTML = text;
    }
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function normalize(text) {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function dishList(data) {
    return data.dishes.join(", ");
}

function recipeLink(data, label = "Open recipe page") {
    return `<br><a href="${data.page}">${label}</a>`;
}

function findState(question) {
    return recipeData.find((item) => normalize(question).includes(normalize(item.state)));
}

function findDish(question) {
    const cleaned = normalize(question);
    return recipeData.find((item) =>
        item.dishes.some((dish) => cleaned.includes(normalize(dish)))
    );
}

function findNutrition(question) {
    const cleaned = normalize(question);
    return Object.keys(nutritionData)
        .sort((a, b) => b.length - a.length)
        .find((dish) => cleaned.includes(dish));
}

function nutritionReply(dishKey) {
    const data = nutritionData[dishKey];

    return `<strong>${data.name} health benefits</strong><br>` +
        `<strong>Amount:</strong> ${data.amount}<br>` +
        `<strong>Approx nutrition:</strong> ${data.calories}, protein ${data.protein}, carbs ${data.carbs}, fat ${data.fat}, fiber ${data.fiber}.<br>` +
        `<strong>Benefits:</strong> ${data.benefits}<br>` +
        `<strong>Nutrition note:</strong> ${data.nutrition}<br>` +
        `Values are approximate and change with portion size, oil, sugar, and cooking style.`;
}

function buildReply(question) {
    const cleaned = normalize(question);
    const matchedState = findState(question);
    const matchedDishState = findDish(question);
    const matchedNutrition = findNutrition(question);
    const asksHealth = cleaned.includes("benefit") || cleaned.includes("benifit") ||
        cleaned.includes("healthy") || cleaned.includes("health") ||
        cleaned.includes("calorie") || cleaned.includes("nutrition") ||
        cleaned.includes("protein");

    if (cleaned.includes("hello") || cleaned.includes("hi") || cleaned.includes("hey")) {
        return "Hi! I can help you choose a state, find vegetarian ideas, suggest quick recipes, show health benefits, or send you to a recipe page.";
    }

    if (asksHealth && matchedNutrition) {
        return nutritionReply(matchedNutrition);
    }

    if (asksHealth) {
        return "Tell me the dish name too, like \"benefits of Dalma\" or \"calories in Dhokla\". I can show amount, calories, protein, carbs, fat, fiber, and health benefits for popular dishes.";
    }

    if (cleaned.includes("vegetarian") || cleaned.includes("veg")) {
        return `Good vegetarian picks: ${vegDishes.join(", ")}. Ask for any state name if you want a more specific list.`;
    }

    if (cleaned.includes("quick") || cleaned.includes("fast") || cleaned.includes("easy")) {
        return `For quick cooking, try ${quickDishes.join(", ")}. Most of these are around 30 to 40 minutes.`;
    }

    if (cleaned.includes("ingredient") && matchedDishState) {
        return `${matchedDishState.state} has that dish in its recipe page. Open it to see the full ingredient list and cooking time.${recipeLink(matchedDishState, `Open ${matchedDishState.state} recipes`)}`;
    }

    if ((cleaned.includes("time") || cleaned.includes("cook")) && matchedDishState) {
        return `The ${matchedDishState.state} recipe page includes cooking time for each dish, including the one you asked about.${recipeLink(matchedDishState, "Check cooking time")}`;
    }

    if (matchedState) {
        return `${matchedState.state} recipes here include: ${dishList(matchedState)}. ${matchedState.quick}${recipeLink(matchedState, `Open ${matchedState.state} recipes`)}`;
    }

    if (cleaned.includes("suggest") || cleaned.includes("recommend") || cleaned.includes("what should")) {
        return "Start with Dhokla for a light snack, Dalma for a balanced meal, Goan Fish Curry for seafood, or Luchi Alur Dom for a comforting vegetarian plate.";
    }

    if (cleaned.includes("state") || cleaned.includes("list")) {
        return "You can explore the state cards on this page. Try asking: Goa, Punjab, Odisha, Gujarat, Rajasthan, Kerala, Tamil Nadu, Telangana, or West Bengal.";
    }

    return "I can help with state dishes, vegetarian options, quick recipes, ingredients, cooking times, and health benefits. Try asking: \"benefits of Dalma\" or \"calories in Dhokla\".";
}

chatToggle.addEventListener("click", openChat);
chatClose.addEventListener("click", closeChat);

themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    saveTheme(nextTheme);
});

stateSearch.addEventListener("input", applyStateFilters);

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.toggle("is-active", item === button);
        });

        applyStateFilters();
    });
});

applyStateFilters();

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = chatInput.value.trim();

    if (!question) {
        chatInput.focus();
        return;
    }

    addMessage(question, "user");
    chatInput.value = "";

    window.setTimeout(() => {
        addMessage(buildReply(question), "bot");
    }, 250);
});

suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const question = button.dataset.question;
        chatInput.value = question;
        chatForm.requestSubmit();
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatbot.classList.contains("is-open")) {
        closeChat();
    }
});
