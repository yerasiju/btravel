"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultFooter from "@/components/footer/default";
import HeaderDark from "@/components/header/headerdark/index";
import {
  Heart,
  MapPin,
  Star,
  Search,
  Filter,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Users,
  Calendar,
  CreditCard,
  Award,
  Clock,
  Eye,
  Shield,
  Zap,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import api from "../../../utils/api";

const HotelListV2 = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: 2,
    rooms: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Guest Info, 3: Confirmation
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching hotels...");

      const response = await api.getHotels();
      console.log("Hotels fetched:", response);

      if (response && response.hotels) {
        setHotels(response.hotels);
      } else if (Array.isArray(response)) {
        setHotels(response);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (hotel, event) => {
    event.stopPropagation();
    setSelectedHotel(hotel);
    setShowBookingModal(true);
    setBookingStep(1);
    setBookingSuccess(false);
  };

  const toggleFavorite = (hotelId, event) => {
    event.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(hotelId)) {
        newFavorites.delete(hotelId);
      } else {
        newFavorites.add(hotelId);
      }
      return newFavorites;
    });
  };

  const handleBookingSubmit = async () => {
    setBookingLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would make actual API call to book the hotel
      const bookingPayload = {
        hotelId: selectedHotel.id,
        ...bookingData,
        totalPrice: calculateTotalPrice(),
        bookingDate: new Date().toISOString(),
      };

      console.log("Booking submitted:", bookingPayload);

      setBookingSuccess(true);
      setBookingStep(3);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedHotel) return 0;
    const nights = Math.ceil(
      (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) /
        (1000 * 60 * 60 * 24)
    );
    const basePrice = getPrice(selectedHotel) * nights * bookingData.rooms;
    const taxes = basePrice * 0.15; // 15% tax
    return basePrice + taxes;
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedHotel(null);
    setBookingStep(1);
    setBookingSuccess(false);
    setBookingData({
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      guests: 2,
      rooms: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    });
  };

  // Безопасная функция для рендеринга значений
  const safeRender = (value, fallback = "Not specified") => {
    if (value === null || value === undefined) {
      return fallback;
    }

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }

    // Если это объект, не рендерим его напрямую
    if (typeof value === "object") {
      console.warn("Attempted to render object:", value);
      return fallback;
    }

    return String(value);
  };

  // Улучшенная функция для извлечения строки локации
  const getLocationString = (hotel) => {
    if (!hotel) return "Location not specified";

    try {
      // Если location уже строка и не пустая
      if (typeof hotel.location === "string" && hotel.location.trim()) {
        return hotel.location.trim();
      }

      // Если location это объект
      if (hotel.location && typeof hotel.location === "object") {
        const { city, country, address } = hotel.location;

        if (city && country) {
          return `${city}, ${country}`;
        } else if (city) {
          return city;
        } else if (country) {
          return country;
        } else if (address && typeof address === "string") {
          return address;
        }
      }

      // Проверяем locationData (из исправленного API)
      if (hotel.locationData && typeof hotel.locationData === "object") {
        const { city, country, address } = hotel.locationData;

        if (city && country) {
          return `${city}, ${country}`;
        } else if (city) {
          return city;
        } else if (country) {
          return country;
        } else if (address && typeof address === "string") {
          return address;
        }
      }

      // Проверяем отдельные поля city, country
      if (hotel.city && hotel.country) {
        return `${hotel.city}, ${hotel.country}`;
      } else if (hotel.city) {
        return hotel.city;
      } else if (hotel.country) {
        return hotel.country;
      } else if (hotel.address && typeof hotel.address === "string") {
        return hotel.address;
      }

      return "Location not specified";
    } catch (error) {
      console.error("Error in getLocationString:", error, hotel);
      return "Location not specified";
    }
  };

  // Безопасная функция для получения цены
  const getPrice = (hotel) => {
    const price = hotel.price || hotel.basePrice || hotel.pricePerNight;
    if (typeof price === "number" && price > 0) {
      return price;
    }
    return Math.floor(Math.random() * 300) + 70; // Fallback random price
  };

  // Безопасная функция для получения рейтинга
  const getRating = (hotel) => {
    const rating = hotel.rating || hotel.starRating || hotel.overallRating;
    if (typeof rating === "number" && rating > 0) {
      return rating;
    }
    return 5; // Default rating
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (!hotel) return false;

    const locationStr = getLocationString(hotel);
    const hotelName = safeRender(hotel.name, "");
    const hotelDescription = safeRender(hotel.description, "");
    const searchLower = searchTerm.toLowerCase();

    return (
      hotelName.toLowerCase().includes(searchLower) ||
      locationStr.toLowerCase().includes(searchLower) ||
      hotelDescription.toLowerCase().includes(searchLower)
    );
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return getPrice(a) - getPrice(b);
      case "price-high":
        return getPrice(b) - getPrice(a);
      case "rating":
        return getRating(b) - getRating(a);
      case "name":
        return safeRender(a.name, "").localeCompare(safeRender(b.name, ""));
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const renderStars = (rating) => {
    const starCount = Math.floor(getRating({ rating })) || 5;
    return (
      <div className="d-flex align-items-center">
        {Array.from({ length: starCount }, (_, index) => (
          <span
            key={index}
            className="text-warning me-1"
            style={{ fontSize: "14px" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <HeaderDark />
        <div
          className="bg-light py-5"
          style={{ minHeight: "100vh", marginTop: "80px" }}
        >
          <div
            className="container"
            style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}
          >
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary mx-auto mb-4"
                style={{ width: "3rem", height: "3rem" }}
              ></div>
              <h3 className="h4 text-dark">Loading hotels...</h3>
            </div>
          </div>
        </div>
        <DefaultFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderDark />
        <div
          className="bg-light py-5"
          style={{ minHeight: "100vh", marginTop: "80px" }}
        >
          <div
            className="container"
            style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}
          >
            <div className="text-center py-5">
              <div className="alert alert-danger">
                <h4>Error loading hotels</h4>
                <p>{safeRender(error)}</p>
                <button onClick={fetchHotels} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
        <DefaultFooter />
      </>
    );
  }

  return (
    <>
      <HeaderDark />
      <div
        className="bg-light"
        style={{
          minHeight: "100vh",
          marginTop: "80px",
          paddingTop: "30px",
          paddingBottom: "60px",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}
        >
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-9">
              {/* Search Section */}
              <div className="row mb-4">
                <div className="col-md-8">
                  <div className="position-relative">
                    <Search
                      className="position-absolute text-muted"
                      style={{
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "18px",
                        height: "18px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search hotels..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control ps-5"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rated</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              {/* Hotel Cards */}
              <div className="row g-3">
                {sortedHotels.map((hotel, index) => {
                  // Дополнительная проверка на валидность отеля
                  if (!hotel || !hotel.id) {
                    console.warn("Invalid hotel object:", hotel);
                    return null;
                  }

                  return (
                    <div key={hotel.id} className="col-12">
                      <div className="card border shadow-sm h-100">
                        <div className="row g-0">
                          {/* Hotel Image */}
                          <div className="col-md-4">
                            <div
                              className="position-relative"
                              style={{ height: "200px" }}
                            >
                              <img
                                src={
                                  (hotel.images && hotel.images[0]) ||
                                  "/api/placeholder/300/200"
                                }
                                alt={safeRender(hotel.name, "Hotel")}
                                className="img-fluid w-100 h-100 rounded-start"
                                style={{ objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/300/200";
                                }}
                              />

                              {/* Favorite Button */}
                              <button
                                onClick={(e) => toggleFavorite(hotel.id, e)}
                                className="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-2 p-2"
                                style={{ width: "36px", height: "36px" }}
                              >
                                <Heart
                                  style={{ width: "16px", height: "16px" }}
                                  className={
                                    favorites.has(hotel.id)
                                      ? "text-danger"
                                      : "text-muted"
                                  }
                                  fill={
                                    favorites.has(hotel.id)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                            </div>
                          </div>

                          {/* Hotel Information */}
                          <div className="col-md-5">
                            <div className="card-body">
                              {/* Hotel Name and Stars */}
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="card-title text-primary fw-bold mb-1">
                                  {safeRender(hotel.name, "Hotel Name")}
                                </h5>
                                {renderStars(getRating(hotel))}
                              </div>

                              {/* Location */}
                              <div className="d-flex align-items-center text-muted mb-2">
                                <MapPin
                                  style={{ width: "14px", height: "14px" }}
                                  className="me-1"
                                />
                                <small>{getLocationString(hotel)}</small>
                                <small
                                  className="ms-2 text-primary"
                                  style={{ cursor: "pointer" }}
                                >
                                  Show on map
                                </small>
                                <small className="ms-2">
                                  • 2 km to city center
                                </small>
                              </div>

                              {/* Room Type */}
                              <div className="mb-3">
                                <div className="fw-semibold">King Room</div>
                                <small className="text-muted">
                                  1 extra-large double bed
                                </small>
                              </div>

                              {/* Amenities */}
                              <div className="d-flex gap-3 mb-3">
                                <div className="d-flex align-items-center">
                                  <Coffee
                                    style={{ width: "16px", height: "16px" }}
                                    className="me-1"
                                  />
                                  <small>Breakfast</small>
                                </div>
                                <div className="d-flex align-items-center">
                                  <Wifi
                                    style={{ width: "16px", height: "16px" }}
                                    className="me-1"
                                  />
                                  <small>WiFi</small>
                                </div>
                                <div className="d-flex align-items-center">
                                  <Users
                                    style={{ width: "16px", height: "16px" }}
                                    className="me-1"
                                  />
                                  <small>Spa</small>
                                </div>
                                <div className="d-flex align-items-center">
                                  <Dumbbell
                                    style={{ width: "16px", height: "16px" }}
                                    className="me-1"
                                  />
                                  <small>Bar</small>
                                </div>
                              </div>

                              {/* Cancellation */}
                              <div className="text-success mb-2">
                                <small className="fw-semibold">
                                  Free cancellation
                                </small>
                              </div>
                              <small className="text-muted">
                                You can cancel later, so lock in this great
                                price today
                              </small>
                            </div>
                          </div>

                          {/* Rating and Price */}
                          <div className="col-md-3">
                            <div className="card-body text-end h-100 d-flex flex-column justify-content-between">
                              {/* Rating */}
                              <div className="mb-3">
                                <div className="d-flex align-items-center justify-content-end mb-1">
                                  <div className="me-2">
                                    <div className="fw-bold small">
                                      Exceptional
                                    </div>
                                    <small className="text-muted">
                                      3,014 reviews
                                    </small>
                                  </div>
                                  <div
                                    className="bg-primary text-white px-2 py-1 rounded fw-bold"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {getRating(hotel).toFixed(1)}
                                  </div>
                                </div>
                              </div>

                              {/* Price */}
                              <div>
                                <div className="text-end mb-2">
                                  <small className="text-muted">
                                    8 nights, 2 adult
                                  </small>
                                </div>
                                <div className="h4 fw-bold text-dark mb-1">
                                  US${getPrice(hotel)}
                                </div>
                                <div className="small text-muted mb-3">
                                  +US$828 taxes and charges
                                </div>
                                <button
                                  onClick={(e) => handleBookNow(hotel, e)}
                                  className="btn btn-success btn-sm px-3 py-2 d-flex align-items-center justify-content-center w-100"
                                >
                                  <CreditCard
                                    style={{ width: "16px", height: "16px" }}
                                    className="me-2"
                                  />
                                  <span>Book Now</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {sortedHotels.length === 0 && !loading && (
                <div className="text-center py-5">
                  <h4 className="text-muted">No hotels found</h4>
                  <p className="text-muted">
                    {searchTerm
                      ? `No hotels match "${searchTerm}". Try a different search.`
                      : "No hotels available at the moment."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="btn btn-primary"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar with Filters */}
            <div className="col-lg-3">
              <div className="sticky-top" style={{ top: "120px" }}>
                {/* Mobile Filter Toggle */}
                <div className="d-lg-none mb-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-between"
                  >
                    <span>Filters</span>
                    <ChevronDown
                      className={`transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                      style={{ width: "16px", height: "16px" }}
                    />
                  </button>
                </div>

                {/* Filter Panel */}
                <div
                  className={`${showFilters ? "d-block" : "d-none"} d-lg-block`}
                >
                  <div className="card border shadow-sm">
                    <div className="card-header bg-white">
                      <h6 className="mb-0 fw-bold">Filters</h6>
                    </div>
                    <div className="card-body">
                      {/* Sort Options */}
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-3">Sort by</h6>
                        <div className="list-group list-group-flush">
                          <button
                            className={`list-group-item list-group-item-action border-0 px-0 ${
                              sortBy === "featured" ? "active" : ""
                            }`}
                            onClick={() => setSortBy("featured")}
                          >
                            Featured
                          </button>
                          <button
                            className={`list-group-item list-group-item-action border-0 px-0 ${
                              sortBy === "price-low" ? "active" : ""
                            }`}
                            onClick={() => setSortBy("price-low")}
                          >
                            Price: Low to High
                          </button>
                          <button
                            className={`list-group-item list-group-item-action border-0 px-0 ${
                              sortBy === "price-high" ? "active" : ""
                            }`}
                            onClick={() => setSortBy("price-high")}
                          >
                            Price: High to Low
                          </button>
                          <button
                            className={`list-group-item list-group-item-action border-0 px-0 ${
                              sortBy === "rating" ? "active" : ""
                            }`}
                            onClick={() => setSortBy("rating")}
                          >
                            Best Rated
                          </button>
                          <button
                            className={`list-group-item list-group-item-action border-0 px-0 ${
                              sortBy === "name" ? "active" : ""
                            }`}
                            onClick={() => setSortBy("name")}
                          >
                            Name
                          </button>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-3">Price Range</h6>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="price1"
                          />
                          <label className="form-check-label" htmlFor="price1">
                            $0 - $100
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="price2"
                          />
                          <label className="form-check-label" htmlFor="price2">
                            $100 - $300
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="price3"
                          />
                          <label className="form-check-label" htmlFor="price3">
                            $300+
                          </label>
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-3">Star Rating</h6>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="star5"
                          />
                          <label className="form-check-label" htmlFor="star5">
                            ★★★★★ (5 stars)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="star4"
                          />
                          <label className="form-check-label" htmlFor="star4">
                            ★★★★ (4 stars)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="star3"
                          />
                          <label className="form-check-label" htmlFor="star3">
                            ★★★ (3 stars)
                          </label>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-3">Amenities</h6>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="wifi"
                          />
                          <label className="form-check-label" htmlFor="wifi">
                            Free WiFi
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="breakfast"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="breakfast"
                          >
                            Breakfast Included
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="spa"
                          />
                          <label className="form-check-label" htmlFor="spa">
                            Spa
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="gym"
                          />
                          <label className="form-check-label" htmlFor="gym">
                            Fitness Center
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedHotel && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {bookingSuccess
                    ? "Booking Confirmed!"
                    : `Book ${safeRender(selectedHotel.name)}`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeBookingModal}
                ></button>
              </div>

              <div className="modal-body">
                {bookingSuccess ? (
                  // Success Step
                  <div className="text-center">
                    <div className="mb-4">
                      <div
                        className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <Check size={40} />
                      </div>
                    </div>
                    <h4 className="text-success mb-3">Booking Confirmed!</h4>
                    <p className="mb-4">
                      Your reservation has been successfully created.
                    </p>

                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Booking Details</h6>
                        <div className="row">
                          <div className="col-6">
                            <strong>Hotel:</strong>
                            <br />
                            {safeRender(selectedHotel.name)}
                          </div>
                          <div className="col-6">
                            <strong>Location:</strong>
                            <br />
                            {getLocationString(selectedHotel)}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-6">
                            <strong>Check-in:</strong>
                            <br />
                            {new Date(bookingData.checkIn).toLocaleDateString()}
                          </div>
                          <div className="col-6">
                            <strong>Check-out:</strong>
                            <br />
                            {new Date(
                              bookingData.checkOut
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-6">
                            <strong>Guests:</strong>
                            <br />
                            {bookingData.guests} guests
                          </div>
                          <div className="col-6">
                            <strong>Rooms:</strong>
                            <br />
                            {bookingData.rooms} room
                            {bookingData.rooms > 1 ? "s" : ""}
                          </div>
                        </div>
                        <hr />
                        <div className="text-center">
                          <strong className="h5">
                            Total: US${calculateTotalPrice().toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-muted small">
                      A confirmation email has been sent to {bookingData.email}
                    </p>
                  </div>
                ) : bookingStep === 1 ? (
                  // Step 1: Booking Details
                  <div>
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <img
                          src={
                            (selectedHotel.images && selectedHotel.images[0]) ||
                            "/api/placeholder/300/200"
                          }
                          alt={safeRender(selectedHotel.name)}
                          className="img-fluid rounded"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/300/200";
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <h5 className="text-primary">
                          {safeRender(selectedHotel.name)}
                        </h5>
                        <p className="text-muted mb-2">
                          <MapPin size={16} className="me-1" />
                          {getLocationString(selectedHotel)}
                        </p>
                        <div className="d-flex align-items-center mb-2">
                          {renderStars(getRating(selectedHotel))}
                          <span className="ms-2 badge bg-primary">
                            {getRating(selectedHotel).toFixed(1)}
                          </span>
                        </div>
                        <div className="h5 text-dark">
                          US${getPrice(selectedHotel)}{" "}
                          <small className="text-muted">/night</small>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Check-in Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={bookingData.checkIn}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              checkIn: e.target.value,
                            })
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Check-out Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={bookingData.checkOut}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              checkOut: e.target.value,
                            })
                          }
                          min={bookingData.checkIn}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Number of Guests</label>
                        <select
                          className="form-select"
                          value={bookingData.guests}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guests: parseInt(e.target.value),
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num} guest{num > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Number of Rooms</label>
                        <select
                          className="form-select"
                          value={bookingData.rooms}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              rooms: parseInt(e.target.value),
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} room{num > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Price Summary</h6>
                        <div className="d-flex justify-content-between mb-2">
                          <span>
                            US${getPrice(selectedHotel)} ×{" "}
                            {Math.ceil(
                              (new Date(bookingData.checkOut) -
                                new Date(bookingData.checkIn)) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nights × {bookingData.rooms} room
                            {bookingData.rooms > 1 ? "s" : ""}
                          </span>
                          <span>
                            US$
                            {(
                              getPrice(selectedHotel) *
                              Math.ceil(
                                (new Date(bookingData.checkOut) -
                                  new Date(bookingData.checkIn)) /
                                  (1000 * 60 * 60 * 24)
                              ) *
                              bookingData.rooms
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Taxes & fees</span>
                          <span>
                            US$
                            {(
                              getPrice(selectedHotel) *
                              Math.ceil(
                                (new Date(bookingData.checkOut) -
                                  new Date(bookingData.checkIn)) /
                                  (1000 * 60 * 60 * 24)
                              ) *
                              bookingData.rooms *
                              0.15
                            ).toFixed(2)}
                          </span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold h5">
                          <span>Total</span>
                          <span>US${calculateTotalPrice().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Step 2: Guest Information
                  <div>
                    <h5 className="mb-4">Guest Information</h5>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={bookingData.firstName}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={bookingData.lastName}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className="form-control"
                          value={bookingData.email}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={bookingData.phone}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              phone: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={bookingData.specialRequests}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            specialRequests: e.target.value,
                          })
                        }
                        placeholder="Any special requests or requirements..."
                      ></textarea>
                    </div>

                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-2">Booking Summary</h6>
                        <div className="row small">
                          <div className="col-6">
                            <strong>Hotel:</strong>{" "}
                            {safeRender(selectedHotel.name)}
                          </div>
                          <div className="col-6">
                            <strong>Dates:</strong>{" "}
                            {new Date(bookingData.checkIn).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              bookingData.checkOut
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="row small mt-2">
                          <div className="col-6">
                            <strong>Guests:</strong> {bookingData.guests}
                          </div>
                          <div className="col-6">
                            <strong>Total:</strong> US$
                            {calculateTotalPrice().toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {bookingSuccess ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={closeBookingModal}
                  >
                    Close
                  </button>
                ) : bookingStep === 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setBookingStep(2)}
                    disabled={
                      !bookingData.checkIn ||
                      !bookingData.checkOut ||
                      new Date(bookingData.checkOut) <=
                        new Date(bookingData.checkIn)
                    }
                  >
                    Continue
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setBookingStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleBookingSubmit}
                      disabled={
                        bookingLoading ||
                        !bookingData.firstName ||
                        !bookingData.lastName ||
                        !bookingData.email ||
                        !bookingData.phone
                      }
                    >
                      {bookingLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard size={16} className="me-2" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DefaultFooter />

      <style jsx>{`
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .list-group-item.active {
          background-color: #0d6efd;
          border-color: #0d6efd;
          color: white;
        }

        .sticky-top {
          z-index: 1020;
        }

        @media (max-width: 991.98px) {
          .sticky-top {
            position: relative !important;
            top: auto !important;
          }
        }

        .modal {
          z-index: 1055;
        }

        .modal-backdrop {
          z-index: 1050;
        }
      `}</style>
    </>
  );
};

export default HotelListV2;
