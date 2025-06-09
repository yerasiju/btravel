// utils/api.js
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
} from "firebase/firestore";

// Импортируем db
import { db } from "../firebase-config";

// УЛЬТРА-БЕЗОПАСНАЯ функция для извлечения строки из location
const extractLocationString = (locationData) => {
  if (!locationData) return "";

  // Если это строка - возвращаем как есть
  if (typeof locationData === "string") {
    return locationData.trim();
  }

  // Если это объект - извлекаем строковое представление
  if (typeof locationData === "object" && locationData !== null) {
    // Приоритет: city, country -> address -> city -> country
    if (locationData.city && locationData.country) {
      return `${String(locationData.city)}, ${String(locationData.country)}`;
    }
    if (locationData.address && locationData.city) {
      return `${String(locationData.address)}, ${String(locationData.city)}`;
    }
    if (locationData.city) {
      return String(locationData.city);
    }
    if (locationData.address) {
      return String(locationData.address);
    }
    if (locationData.country) {
      return String(locationData.country);
    }

    // Если ничего не найдено, возвращаем пустую строку
    return "";
  }

  // Для всех остальных типов
  return String(locationData || "");
};

// КРИТИЧЕСКИ ВАЖНАЯ функция для полной нормализации данных отеля
const normalizeHotelData = (doc) => {
  if (!doc || !doc.data) {
    console.warn("Invalid document:", doc);
    return null;
  }

  const data = doc.data();

  // Извлекаем все возможные поля location и ПРИНУДИТЕЛЬНО конвертируем в строку
  const locationString =
    extractLocationString(data.location) ||
    extractLocationString(data.city) ||
    extractLocationString(data.address) ||
    "";

  // Создаем полностью безопасный объект отеля
  const normalizedHotel = {
    id: String(doc.id || ""),
    _id: String(doc.id || ""),

    // Основная информация - ВСЁ СТРОКИ
    name: String(data.name || "Hotel Name"),
    description: String(data.description || ""),

    // Локация - ВСЕГДА ТОЛЬКО СТРОКА, НИКОГДА ОБЪЕКТ
    location: locationString,

    // УДАЛЯЕМ locationData полностью, чтобы избежать рендеринга объектов
    // locationData: null,

    // Цены - ТОЛЬКО ЧИСЛА
    price: Number(data.price || data.basePrice || data.pricePerNight || 0),

    // Рейтинги - ТОЛЬКО ЧИСЛА
    rating: Number(data.rating || data.starRating || data.overallRating || 5),
    starRating: Number(data.starRating || data.rating || 5),
    overallRating: Number(data.overallRating || data.rating || 4.5),

    // Изображения - ТОЛЬКО МАССИВ СТРОК
    images: Array.isArray(data.images)
      ? data.images.map((img) => String(img || ""))
      : data.image
      ? [String(data.image)]
      : [],

    // Удобства - ТОЛЬКО МАССИВ СТРОК
    amenities: Array.isArray(data.amenities)
      ? data.amenities.map((amenity) => String(amenity || ""))
      : Array.isArray(data.facilities)
      ? data.facilities.map((facility) => String(facility || ""))
      : [],

    // Булевые значения
    featured: Boolean(data.featured),
    available: data.available !== false,

    // Даты - СТРОКИ
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() ||
      (data.createdAt ? String(data.createdAt) : new Date().toISOString()),
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() ||
      (data.updatedAt ? String(data.updatedAt) : new Date().toISOString()),

    // Дополнительные поля - ТОЛЬКО СТРОКИ
    category: String(data.category || ""),
    type: String(data.type || "hotel"),
    address: String(data.address || ""),
    city: String(data.city || ""),
    country: String(data.country || ""),

    // КРИТИЧЕСКИ ВАЖНО: НЕ ВКЛЮЧАЕМ НИКАКИЕ ОБЪЕКТЫ
    // НЕ включаем: coordinates, nearbyAttractions и другие сложные объекты
  };

  // Логируем для отладки
  console.log("✅ Normalized hotel (all safe types):", {
    id: typeof normalizedHotel.id,
    name: typeof normalizedHotel.name,
    location: typeof normalizedHotel.location,
    price: typeof normalizedHotel.price,
    rating: typeof normalizedHotel.rating,
  });

  return normalizedHotel;
};

class ApiClient {
  constructor() {
    this.db = null;
    this.hotelsCollection = null;
    this.initialized = false;
  }

  // Ленивая инициализация - вызывается при первом использовании
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      console.log("🔄 Initializing Firebase API client...");

      // Проверяем что db доступен
      if (!db) {
        throw new Error("Firestore database is not available");
      }

      // Проверяем что это действительно экземпляр Firestore
      if (!db.app || typeof db.app.name !== "string") {
        throw new Error("Invalid Firestore instance");
      }

      this.db = db;
      this.hotelsCollection = collection(this.db, "hotels");
      this.initialized = true;

      console.log("✅ Firebase API client initialized successfully");
      console.log("📊 Connected to project:", this.db.app.name);
    } catch (error) {
      console.error("❌ Failed to initialize Firebase API client:", error);
      throw new Error(`API initialization failed: ${error.message}`);
    }
  }

  // Проверяем инициализацию перед каждым запросом
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  // Проверка подключения к Firebase
  async testConnection() {
    try {
      await this.ensureInitialized();
      console.log("🔍 Testing Firebase connection...");

      const testQuery = query(this.hotelsCollection, limit(1));
      await getDocs(testQuery);
      console.log("✅ Firebase connection successful");
      return true;
    } catch (error) {
      console.error("❌ Firebase connection failed:", error);
      return false;
    }
  }

  // Получить все отели без фильтров
  async getAllHotelsRaw() {
    try {
      await this.ensureInitialized();
      console.log("📥 Fetching all hotels from Firestore...");

      const snapshot = await getDocs(this.hotelsCollection);

      if (snapshot.empty) {
        console.log("⚠️ No hotels found in collection");
        return [];
      }

      const hotels = snapshot.docs
        .map((doc) => normalizeHotelData(doc))
        .filter((hotel) => hotel !== null); // Убираем невалидные отели

      console.log(
        "✅ Successfully fetched and normalized hotels:",
        hotels.length
      );

      // ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА: убеждаемся что нет объектов
      hotels.forEach((hotel, index) => {
        Object.keys(hotel).forEach((key) => {
          const value = hotel[key];
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            console.error(
              `🚨 CRITICAL: Found object in hotel[${index}].${key}:`,
              value
            );
            // Заменяем объект на строку
            hotel[key] = String(value);
          }
        });
      });

      return hotels;
    } catch (error) {
      console.error("❌ Error fetching all hotels:", error);

      // Проверяем типы ошибок
      if (error.code === "permission-denied") {
        console.error("🚫 Permission denied - check Firestore rules");
        console.error("💡 Make sure your Firestore rules allow read access");
      } else if (error.code === "unavailable") {
        console.error("🌐 Firestore service unavailable");
      }

      return []; // Возвращаем пустой массив для graceful degradation
    }
  }

  // Получить отели с фильтрами и пагинацией
  async getHotelsByFilters(params = {}) {
    try {
      await this.ensureInitialized();
      console.log("🔍 Firebase API: Getting hotels with filters:", params);

      // Сначала получаем все отели, затем фильтруем на клиенте
      const allHotels = await this.getAllHotelsRaw();
      console.log("📊 Total hotels fetched:", allHotels.length);

      let filteredHotels = [...allHotels];

      // Применяем фильтры на клиенте
      if (
        params.location &&
        params.location !== "" &&
        params.location !== "All Locations"
      ) {
        const locationLower = String(params.location).toLowerCase();
        filteredHotels = filteredHotels.filter((hotel) => {
          // Проверяем ТОЛЬКО строковое поле location
          const locationMatch =
            hotel.location &&
            String(hotel.location).toLowerCase().includes(locationLower);

          const nameMatch =
            hotel.name &&
            String(hotel.name).toLowerCase().includes(locationLower);

          return locationMatch || nameMatch;
        });
        console.log("🌍 After location filter:", filteredHotels.length);
      }

      // Фильтр по цене
      if (params.priceMin && !isNaN(params.priceMin)) {
        filteredHotels = filteredHotels.filter((hotel) => {
          return Number(hotel.price) >= Number(params.priceMin);
        });
        console.log("💰 After min price filter:", filteredHotels.length);
      }

      if (params.priceMax && !isNaN(params.priceMax)) {
        filteredHotels = filteredHotels.filter((hotel) => {
          return Number(hotel.price) <= Number(params.priceMax);
        });
        console.log("💰 After max price filter:", filteredHotels.length);
      }

      // Фильтр по звездности
      if (params.starRating && !isNaN(params.starRating)) {
        filteredHotels = filteredHotels.filter((hotel) => {
          return Number(hotel.starRating) >= Number(params.starRating);
        });
        console.log("⭐ After star rating filter:", filteredHotels.length);
      }

      // Фильтр по общему рейтингу
      if (params.rating && !isNaN(params.rating)) {
        filteredHotels = filteredHotels.filter((hotel) => {
          return Number(hotel.overallRating) >= Number(params.rating);
        });
        console.log("📊 After overall rating filter:", filteredHotels.length);
      }

      // Фильтр по удобствам
      if (
        params.amenities &&
        Array.isArray(params.amenities) &&
        params.amenities.length > 0
      ) {
        filteredHotels = filteredHotels.filter((hotel) => {
          return params.amenities.every((amenity) =>
            hotel.amenities.some((ha) =>
              String(ha).toLowerCase().includes(String(amenity).toLowerCase())
            )
          );
        });
        console.log("🏨 After amenities filter:", filteredHotels.length);
      }

      // Сортировка
      switch (params.sortBy) {
        case "price-low":
        case "price_asc":
          filteredHotels.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "price-high":
        case "price_desc":
          filteredHotels.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case "rating":
        case "rating_desc":
          filteredHotels.sort(
            (a, b) => Number(b.starRating) - Number(a.starRating)
          );
          break;
        case "name":
        case "name_asc":
          filteredHotels.sort((a, b) =>
            String(a.name).localeCompare(String(b.name))
          );
          break;
        case "name_desc":
          filteredHotels.sort((a, b) =>
            String(b.name).localeCompare(String(a.name))
          );
          break;
        case "featured":
          filteredHotels.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return Number(b.starRating) - Number(a.starRating);
          });
          break;
        default:
          filteredHotels.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
      }

      // Пагинация
      const page = parseInt(params.page) || 1;
      const pageLimit = parseInt(params.limit) || 10;
      const startIndex = (page - 1) * pageLimit;
      const endIndex = startIndex + pageLimit;
      const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

      console.log("✅ Firebase API: Final result:", {
        total: filteredHotels.length,
        page: page,
        limit: pageLimit,
        returned: paginatedHotels.length,
      });

      return {
        hotels: paginatedHotels,
        pagination: {
          total: filteredHotels.length,
          page: page,
          totalPages: Math.ceil(filteredHotels.length / pageLimit),
          limit: pageLimit,
        },
      };
    } catch (error) {
      console.error("❌ Firebase API Error in getHotelsByFilters:", error);

      return {
        hotels: [],
        pagination: {
          total: 0,
          page: 1,
          totalPages: 0,
          limit: parseInt(params.limit) || 10,
        },
        error: String(error.message),
      };
    }
  }

  // Получить отель по ID
  async getHotelById(id) {
    try {
      await this.ensureInitialized();
      console.log("🔍 Getting hotel by ID:", id);

      const docRef = doc(this.db, "hotels", String(id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const hotel = normalizeHotelData(docSnap);
        if (hotel) {
          console.log("✅ Hotel found:", hotel.name);
          return hotel;
        } else {
          throw new Error("Hotel data is invalid");
        }
      } else {
        throw new Error("Hotel not found");
      }
    } catch (error) {
      console.error("❌ Error fetching hotel by ID:", error);
      throw new Error(`Failed to fetch hotel: ${String(error.message)}`);
    }
  }

  // Поиск отелей
  async searchHotels(searchTerm) {
    try {
      await this.ensureInitialized();
      console.log("🔍 Firebase API: Searching hotels for:", searchTerm);

      const allHotels = await this.getAllHotelsRaw();

      const filteredHotels = allHotels.filter((hotel) => {
        const searchLower = String(searchTerm).toLowerCase();
        return (
          String(hotel.name).toLowerCase().includes(searchLower) ||
          String(hotel.location).toLowerCase().includes(searchLower) ||
          String(hotel.description).toLowerCase().includes(searchLower)
        );
      });

      return {
        hotels: filteredHotels,
        total: filteredHotels.length,
      };
    } catch (error) {
      console.error("❌ Error searching hotels:", error);
      throw error;
    }
  }

  // Получить все отели (базовый метод)
  async getHotels(params = {}) {
    try {
      await this.ensureInitialized();
      console.log("🏨 Firebase API: Getting all hotels with params:", params);

      const allHotels = await this.getAllHotelsRaw();
      const limitCount = params.limit || 50;
      const limitedHotels = allHotels.slice(0, limitCount);

      console.log("✅ Returning hotels:", limitedHotels.length);

      return {
        hotels: limitedHotels,
        pagination: {
          total: allHotels.length,
          page: 1,
          totalPages: Math.ceil(allHotels.length / limitCount),
          limit: limitCount,
        },
      };
    } catch (error) {
      console.error("❌ Error in getHotels:", error);
      throw new Error(`Failed to get hotels: ${String(error.message)}`);
    }
  }

  // Получить рекомендуемые отели
  async getFeaturedHotels(limitCount = 6) {
    try {
      await this.ensureInitialized();
      const allHotels = await this.getAllHotelsRaw();
      const featuredHotels = allHotels
        .filter((hotel) => hotel.featured === true)
        .slice(0, limitCount);

      return featuredHotels;
    } catch (error) {
      console.error("❌ Error fetching featured hotels:", error);
      throw error;
    }
  }

  // Получить локации
  async getLocations() {
    try {
      await this.ensureInitialized();
      const allHotels = await this.getAllHotelsRaw();
      const locations = new Set();

      allHotels.forEach((hotel) => {
        // Добавляем только строковое поле location
        if (hotel.location && typeof hotel.location === "string") {
          locations.add(hotel.location);
        }

        // Добавляем city и country как отдельные локации
        if (hotel.city) locations.add(String(hotel.city));
        if (hotel.country) locations.add(String(hotel.country));
        if (hotel.city && hotel.country) {
          locations.add(`${String(hotel.city)}, ${String(hotel.country)}`);
        }
      });

      return Array.from(locations).sort();
    } catch (error) {
      console.error("❌ Error fetching locations:", error);
      throw error;
    }
  }

  // Получить предложения для поиска
  async getSearchSuggestions(query) {
    try {
      await this.ensureInitialized();
      console.log("💡 Firebase API: Getting search suggestions for:", query);

      const allHotels = await this.getAllHotelsRaw();
      const locations = new Set();
      const suggestions = [];

      // Собираем уникальные локации
      allHotels.forEach((hotel) => {
        if (hotel.location) locations.add(String(hotel.location));
        if (hotel.city) locations.add(String(hotel.city));
        if (hotel.country) locations.add(String(hotel.country));
      });

      const queryLower = String(query).toLowerCase();

      // Добавляем локации
      Array.from(locations).forEach((location) => {
        if (String(location).toLowerCase().includes(queryLower)) {
          suggestions.push({
            text: String(location),
            subtitle: "City",
            type: "city",
          });
        }
      });

      // Добавляем отели
      allHotels.forEach((hotel) => {
        if (
          hotel.name &&
          String(hotel.name).toLowerCase().includes(queryLower)
        ) {
          suggestions.push({
            text: String(hotel.name),
            subtitle: String(hotel.location || "Hotel"),
            type: "hotel",
            id: String(hotel.id),
          });
        }
      });

      return {
        suggestions: suggestions.slice(0, 10),
      };
    } catch (error) {
      console.error("❌ Error getting search suggestions:", error);

      // Возвращаем базовые предложения в случае ошибки
      const defaultSuggestions = [
        { text: "London", subtitle: "United Kingdom", type: "city" },
        { text: "New York", subtitle: "United States", type: "city" },
        { text: "Paris", subtitle: "France", type: "city" },
        { text: "Tokyo", subtitle: "Japan", type: "city" },
        { text: "Dubai", subtitle: "UAE", type: "city" },
      ].filter((item) =>
        String(item.text).toLowerCase().includes(String(query).toLowerCase())
      );

      return { suggestions: defaultSuggestions };
    }
  }
}

// Создаем и экспортируем экземпляр
const api = new ApiClient();

// Экспортируем методы с привязкой к контексту
export default api;

export const getHotels = (...args) => api.getHotels(...args);
export const getHotelById = (...args) => api.getHotelById(...args);
export const getHotelsByFilters = (...args) => api.getHotelsByFilters(...args);
export const searchHotels = (...args) => api.searchHotels(...args);
export const getSearchSuggestions = (...args) =>
  api.getSearchSuggestions(...args);
export const getFeaturedHotels = (...args) => api.getFeaturedHotels(...args);
export const testConnection = (...args) => api.testConnection(...args);
