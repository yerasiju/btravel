// utils/globalLocationFix.js

import React from "react";

/**
 * Безопасная функция для получения строки
 * @param {any} value - Значение для конвертации
 * @param {string} fallback - Значение по умолчанию
 * @returns {string}
 */
export const safeString = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "boolean") {
    return value.toString();
  }

  // Если это объект, пытаемся извлечь полезную информацию
  if (typeof value === "object") {
    return extractLocationString(value) || fallback;
  }

  try {
    return String(value);
  } catch (error) {
    console.warn("Error converting to string:", error, value);
    return fallback;
  }
};

/**
 * Безопасная функция для получения числа
 * @param {any} value - Значение для конвертации
 * @param {number} fallback - Значение по умолчанию
 * @returns {number}
 */
export const safeNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return fallback;
};

/**
 * Извлекает строку локации из объекта
 * @param {any} locationObj - Объект локации
 * @returns {string}
 */
export const extractLocationString = (locationObj) => {
  if (!locationObj || typeof locationObj !== "object") {
    return "";
  }

  try {
    // Специальная обработка для объекта с ключами {country, city, coordinates, address, nearbyAttractions}
    if (locationObj.city && locationObj.country) {
      return `${locationObj.city}, ${locationObj.country}`;
    }

    if (locationObj.address && typeof locationObj.address === "string") {
      return locationObj.address;
    }

    if (locationObj.city && typeof locationObj.city === "string") {
      return locationObj.city;
    }

    if (locationObj.country && typeof locationObj.country === "string") {
      return locationObj.country;
    }

    // Проверяем другие возможные поля
    const possibleFields = [
      "formatted_address",
      "description",
      "name",
      "region",
      "state",
      "place_name",
      "display_name",
      "label",
      "title",
    ];

    for (const field of possibleFields) {
      if (locationObj[field] && typeof locationObj[field] === "string") {
        return locationObj[field];
      }
    }

    // Последняя попытка - берем первое строковое значение
    for (const key in locationObj) {
      const value = locationObj[key];
      if (typeof value === "string" && value.trim() && key !== "coordinates") {
        return value.trim();
      }
    }

    return "";
  } catch (error) {
    console.warn("Error extracting location string:", error, locationObj);
    return "";
  }
};

/**
 * АГРЕССИВНАЯ функция для исправления всех объектов в данных
 * @param {any} data - Данные для исправления
 * @returns {any} - Исправленные данные
 */
export const fixLocationObjects = (data) => {
  if (!data) return data;

  // Если это массив, обрабатываем каждый элемент
  if (Array.isArray(data)) {
    return data.map((item) => fixLocationObjects(item));
  }

  // Если это не объект, возвращаем как есть
  if (typeof data !== "object") {
    return data;
  }

  // Если это React элемент, не трогаем
  if (React.isValidElement(data)) {
    return data;
  }

  // Создаем копию объекта
  const fixed = { ...data };

  // АГРЕССИВНО исправляем все поля, которые могут быть объектами
  for (const key in fixed) {
    const value = fixed[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !React.isValidElement(value)
    ) {
      // Если это похоже на объект локации
      if (
        key.toLowerCase().includes("location") ||
        key.toLowerCase().includes("address") ||
        (value.city && value.country) ||
        (value.coordinates && value.address)
      ) {
        const locationString = extractLocationString(value);
        fixed[key] = locationString || "Location not specified";

        // Сохраняем оригинал для отладки
        fixed[`_original_${key}`] = value;

        console.log(
          `🔧 Fixed location object in ${key}:`,
          value,
          "→",
          fixed[key]
        );
      } else {
        // Рекурсивно обрабатываем другие объекты
        fixed[key] = fixLocationObjects(value);
      }
    }
  }

  return fixed;
};

/**
 * УЛЬТРА-АГРЕССИВНАЯ функция для поиска и исправления всех объектов
 * @param {any} data - Данные для исправления
 * @returns {any} - Исправленные данные
 */
export const ultraFixAllObjects = (data) => {
  if (!data) return data;

  // Если это массив, обрабатываем каждый элемент
  if (Array.isArray(data)) {
    return data.map((item) => ultraFixAllObjects(item));
  }

  // Если это не объект, возвращаем как есть
  if (typeof data !== "object") {
    return data;
  }

  // Если это React элемент, не трогаем
  if (React.isValidElement(data)) {
    return data;
  }

  // Создаем копию объекта
  const fixed = {};

  // Обрабатываем каждое поле
  for (const key in data) {
    const value = data[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !React.isValidElement(value)
    ) {
      // Если объект содержит подозрительные ключи
      const suspiciousKeys = [
        "country",
        "city",
        "coordinates",
        "address",
        "nearbyAttractions",
      ];
      const hasSuspiciousKeys = suspiciousKeys.some((k) => k in value);

      if (hasSuspiciousKeys) {
        console.warn(`🚨 Found suspicious object in ${key}:`, value);
        fixed[key] = extractLocationString(value) || "Location not specified";
      } else {
        // Рекурсивно обрабатываем
        fixed[key] = ultraFixAllObjects(value);
      }
    } else {
      fixed[key] = value;
    }
  }

  return fixed;
};

/**
 * Компонент для безопасного рендеринга значений
 * Предотвращает ошибку "Objects are not valid as a React child"
 */
export const SafeRender = ({ children, fallback = "" }) => {
  try {
    // Если children - это null или undefined
    if (children === null || children === undefined) {
      return fallback;
    }

    // Если children - это объект (но не React элемент)
    if (typeof children === "object" && !React.isValidElement(children)) {
      console.warn("SafeRender: Attempted to render object:", children);

      // Пытаемся извлечь строку из объекта
      if (children.city && children.country) {
        return `${children.city}, ${children.country}`;
      }

      if (children.address) {
        return children.address;
      }

      if (children.name) {
        return children.name;
      }

      // Если не можем извлечь строку, возвращаем fallback
      return fallback;
    }

    // Если children - это массив
    if (Array.isArray(children)) {
      return children.map((child, index) => (
        <SafeRender key={index} fallback={fallback}>
          {child}
        </SafeRender>
      ));
    }

    return children;
  } catch (error) {
    console.warn("SafeRender error:", error, children);
    return fallback;
  }
};

/**
 * Нормализует данные отеля, исправляя все проблемные поля
 * @param {object} hotel - Данные отеля
 * @returns {object} - Нормализованные данные
 */
export const normalizeHotelData = (hotel) => {
  if (!hotel) return hotel;

  try {
    // Применяем ультра-агрессивную фиксацию
    const ultraFixed = ultraFixAllObjects(hotel);
    const normalized = fixLocationObjects(ultraFixed);

    // Дополнительные проверки и исправления
    const result = {
      ...normalized,
      id: safeString(normalized.id),
      name: safeString(normalized.name, "Hotel Name"),
      description: safeString(normalized.description, ""),
      price: safeNumber(normalized.price, 100),
      rating: safeNumber(normalized.rating, 4.5),
      starRating: safeNumber(normalized.starRating, 5),
      images: Array.isArray(normalized.images) ? normalized.images : [],
      amenities: Array.isArray(normalized.amenities)
        ? normalized.amenities
        : [],
      location: safeString(normalized.location, "Location not specified"),
      city: safeString(normalized.city, ""),
      country: safeString(normalized.country, ""),
      address: safeString(normalized.address, ""),
    };

    // Финальная проверка - убираем все объекты
    for (const key in result) {
      if (
        typeof result[key] === "object" &&
        result[key] !== null &&
        !Array.isArray(result[key])
      ) {
        console.warn(`🚨 Removing object from ${key}:`, result[key]);
        result[key] = safeString(result[key], "");
      }
    }

    return result;
  } catch (error) {
    console.error("Error normalizing hotel data:", error, hotel);
    return hotel;
  }
};

/**
 * Отладочная функция для поиска всех объектов в данных
 * @param {any} data - Данные для проверки
 * @param {string} context - Контекст для логирования
 */
export const debugCheckForObjects = (data, context = "Unknown") => {
  if (!data) return;

  const foundObjects = [];

  const checkValue = (value, path = "") => {
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !React.isValidElement(value)
    ) {
      foundObjects.push({ path: `${context}${path}`, value });
      console.warn(`🚨 Found object in ${context}${path}:`, value);
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        checkValue(item, `${path}[${index}]`);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((key) => {
        checkValue(value[key], `${path}.${key}`);
      });
    }
  };

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      checkValue(item, `[${index}]`);
    });
  } else {
    checkValue(data);
  }

  return foundObjects;
};

// Экспорт по умолчанию
export default {
  safeString,
  safeNumber,
  extractLocationString,
  fixLocationObjects,
  ultraFixAllObjects,
  SafeRender,
  normalizeHotelData,
  debugCheckForObjects,
};
