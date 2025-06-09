// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   addDoc,
//   collection,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../../firebase-config";
// import {
//   Save,
//   X,
//   Plus,
//   Trash2,
//   Upload,
//   MapPin,
//   DollarSign,
//   Star,
//   Users,
//   Building,
//   Tag,
//   Image as ImageIcon,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";

// // Импортируем безопасные функции
// import {
//   fixLocationObjects,
//   safeString,
//   safeNumber,
//   SafeRender,
// } from "../../utils/globalLocationFix";

// const HotelForm = ({ hotelId }) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [validationErrors, setValidationErrors] = useState({});
//   const [formData, setFormData] = useState({
//     title: "",
//     location: "",
//     price: "",
//     ratings: "",
//     numberOfReviews: "",
//     city: "",
//     category: "hotel",
//     tag: "",
//     slideImg: [""],
//     img: "",
//     description: "",
//     amenities: [],
//     address: "",
//     phone: "",
//     email: "",
//     checkInTime: "15:00",
//     checkOutTime: "11:00",
//     cancellationPolicy: "free",
//     status: "active",
//   });

//   const cities = [
//     { value: "new_york", label: "New York" },
//     { value: "london", label: "London" },
//     { value: "paris", label: "Paris" },
//     { value: "istanbul", label: "Istanbul" },
//     { value: "tokyo", label: "Tokyo" },
//     { value: "dubai", label: "Dubai" },
//     { value: "singapore", label: "Singapore" },
//     { value: "barcelona", label: "Barcelona" },
//   ];

//   const categories = [
//     { value: "hotel", label: "Hotel" },
//     { value: "resort", label: "Resort" },
//     { value: "boutique", label: "Boutique Hotel" },
//     { value: "hostel", label: "Hostel" },
//     { value: "apartment", label: "Apartment" },
//     { value: "villa", label: "Villa" },
//     { value: "guesthouse", label: "Guest House" },
//   ];

//   const amenitiesList = [
//     "Free WiFi",
//     "Swimming Pool",
//     "Fitness Center",
//     "Spa",
//     "Restaurant",
//     "Bar",
//     "Room Service",
//     "Laundry",
//     "Parking",
//     "Airport Shuttle",
//     "Pet Friendly",
//     "Business Center",
//     "Conference Room",
//     "Concierge",
//   ];

//   // УЛЬТРА-БЕЗОПАСНАЯ функция для обработки данных из Firebase
//   const safeDataHandler = (data) => {
//     // Сначала применяем глобальную защиту
//     const globallyFixed = fixLocationObjects(data);

//     const safeData = {};

//     // Обработка каждого поля с проверкой типа
//     Object.keys(formData).forEach((key) => {
//       const value = globallyFixed[key];

//       if (key === "slideImg") {
//         safeData[key] = Array.isArray(value) && value.length > 0 ? value : [""];
//       } else if (key === "amenities") {
//         safeData[key] = Array.isArray(value) ? value : [];
//       } else if (key === "location") {
//         safeData[key] = safeString(value);
//       } else if (
//         key === "price" ||
//         key === "ratings" ||
//         key === "numberOfReviews"
//       ) {
//         safeData[key] = safeNumber(value, formData[key]);
//       } else {
//         safeData[key] = safeString(value, formData[key]);
//       }
//     });

//     return safeData;
//   };

//   useEffect(() => {
//     if (hotelId) {
//       fetchHotel();
//     }
//   }, [hotelId]);

//   const fetchHotel = async () => {
//     try {
//       setLoading(true);
//       const docRef = doc(db, "hotels", hotelId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         console.log("Raw hotel data:", data); // Для отладки

//         const safeData = safeDataHandler(data);
//         console.log("Safe hotel data:", safeData); // Для отладки

//         setFormData(safeData);
//       } else {
//         setError("Hotel not found");
//       }
//     } catch (error) {
//       setError("Failed to fetch hotel data");
//       console.error("Error fetching hotel:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!safeString(formData.title).trim()) errors.title = "Title is required";
//     if (!safeString(formData.location).trim())
//       errors.location = "Location is required";
//     if (!formData.price || safeNumber(formData.price) <= 0)
//       errors.price = "Valid price is required";
//     if (
//       !formData.ratings ||
//       safeNumber(formData.ratings) < 0 ||
//       safeNumber(formData.ratings) > 5
//     ) {
//       errors.ratings = "Rating must be between 0 and 5";
//     }
//     if (!formData.numberOfReviews || safeNumber(formData.numberOfReviews) < 0) {
//       errors.numberOfReviews = "Valid number of reviews is required";
//     }
//     if (!formData.city) errors.city = "City is required";
//     if (!formData.category) errors.category = "Category is required";

//     // Validate at least one image
//     const validImages = (formData.slideImg || []).filter(
//       (img) => safeString(img).trim() !== ""
//     );
//     if (validImages.length === 0) {
//       errors.slideImg = "At least one image is required";
//     }

//     // Validate email format if provided
//     if (formData.email && !/\S+@\S+\.\S+/.test(safeString(formData.email))) {
//       errors.email = "Valid email is required";
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear validation error when user starts typing
//     if (validationErrors[name]) {
//       setValidationErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleImageChange = (index, value) => {
//     const newImages = [...(formData.slideImg || [""])];
//     newImages[index] = value;
//     setFormData((prev) => ({
//       ...prev,
//       slideImg: newImages,
//     }));

//     // Clear validation error
//     if (validationErrors.slideImg) {
//       setValidationErrors((prev) => ({
//         ...prev,
//         slideImg: "",
//       }));
//     }
//   };

//   const addImageField = () => {
//     setFormData((prev) => ({
//       ...prev,
//       slideImg: [...(prev.slideImg || [""]), ""],
//     }));
//   };

//   const removeImageField = (index) => {
//     if ((formData.slideImg || [""]).length > 1) {
//       const newImages = (formData.slideImg || [""]).filter(
//         (_, i) => i !== index
//       );
//       setFormData((prev) => ({
//         ...prev,
//         slideImg: newImages,
//       }));
//     }
//   };

//   const handleAmenityChange = (amenity) => {
//     const currentAmenities = formData.amenities || [];
//     const updatedAmenities = currentAmenities.includes(amenity)
//       ? currentAmenities.filter((a) => a !== amenity)
//       : [...currentAmenities, amenity];

//     setFormData((prev) => ({
//       ...prev,
//       amenities: updatedAmenities,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setError("Please fix the validation errors");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const hotelData = {
//         ...formData,
//         price: safeNumber(formData.price),
//         ratings: safeNumber(formData.ratings),
//         numberOfReviews: safeNumber(formData.numberOfReviews),
//         slideImg: (formData.slideImg || [""]).filter(
//           (img) => safeString(img).trim() !== ""
//         ),
//         updatedAt: new Date().toISOString(),
//         // Убеждаемся что location - строка
//         location: safeString(formData.location),
//       };

//       console.log("Saving hotel data:", hotelData); // Для отладки

//       if (hotelId) {
//         // Update existing hotel
//         await updateDoc(doc(db, "hotels", hotelId), hotelData);
//         setSuccess("Hotel updated successfully!");
//       } else {
//         // Add new hotel
//         hotelData.createdAt = new Date().toISOString();
//         hotelData.id = Date.now().toString();
//         await setDoc(doc(db, "hotels", hotelData.id), hotelData);
//         setSuccess("Hotel added successfully!");
//       }

//       // Redirect after success
//       setTimeout(() => {
//         router.push("/admin/dashboard");
//       }, 2000);
//     } catch (error) {
//       setError("Failed to save hotel: " + safeString(error.message));
//       console.error("Error saving hotel:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && hotelId) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "400px" }}
//       >
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-3" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p>Loading hotel data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="hotel-form bg-white rounded shadow-sm p-4">
//       <div className="d-flex align-items-center justify-content-between mb-4">
//         <h2 className="h3 mb-0 text-primary">
//           <Building
//             className="me-2"
//             style={{ width: "24px", height: "24px" }}
//           />
//           {hotelId ? "Edit Hotel" : "Add New Hotel"}
//         </h2>
//         <button
//           type="button"
//           onClick={() => router.push("/admin/dashboard")}
//           className="btn btn-outline-secondary"
//         >
//           <X style={{ width: "16px", height: "16px" }} className="me-1" />
//           Cancel
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger d-flex align-items-center">
//           <AlertCircle
//             style={{ width: "20px", height: "20px" }}
//             className="me-2"
//           />
//           <SafeRender>{error}</SafeRender>
//         </div>
//       )}

//       {success && (
//         <div className="alert alert-success d-flex align-items-center">
//           <CheckCircle
//             style={{ width: "20px", height: "20px" }}
//             className="me-2"
//           />
//           <SafeRender>{success}</SafeRender>
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="row">
//           {/* Basic Information */}
//           <div className="col-md-6">
//             <div className="card mb-4">
//               <div className="card-header">
//                 <h5 className="mb-0">Basic Information</h5>
//               </div>
//               <div className="card-body">
//                 <div className="mb-3">
//                   <label className="form-label">
//                     <Building
//                       style={{ width: "16px", height: "16px" }}
//                       className="me-1"
//                     />
//                     Hotel Title *
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={safeString(formData.title)}
//                     onChange={handleChange}
//                     className={`form-control ${
//                       validationErrors.title ? "is-invalid" : ""
//                     }`}
//                     placeholder="Enter hotel name"
//                   />
//                   {validationErrors.title && (
//                     <div className="invalid-feedback">
//                       <SafeRender>{validationErrors.title}</SafeRender>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">
//                     <MapPin
//                       style={{ width: "16px", height: "16px" }}
//                       className="me-1"
//                     />
//                     Location *
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={safeString(formData.location)}
//                     onChange={handleChange}
//                     className={`form-control ${
//                       validationErrors.location ? "is-invalid" : ""
//                     }`}
//                     placeholder="Enter location"
//                   />
//                   {validationErrors.location && (
//                     <div className="invalid-feedback">
//                       <SafeRender>{validationErrors.location}</SafeRender>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Full Address</label>
//                   <textarea
//                     name="address"
//                     value={safeString(formData.address)}
//                     onChange={handleChange}
//                     className="form-control"
//                     rows="2"
//                     placeholder="Enter full address"
//                   />
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         <DollarSign
//                           style={{ width: "16px", height: "16px" }}
//                           className="me-1"
//                         />
//                         Price per Night *
//                       </label>
//                       <input
//                         type="number"
//                         name="price"
//                         value={safeString(formData.price)}
//                         onChange={handleChange}
//                         className={`form-control ${
//                           validationErrors.price ? "is-invalid" : ""
//                         }`}
//                         placeholder="0"
//                         min="0"
//                         step="0.01"
//                       />
//                       {validationErrors.price && (
//                         <div className="invalid-feedback">
//                           <SafeRender>{validationErrors.price}</SafeRender>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         <Star
//                           style={{ width: "16px", height: "16px" }}
//                           className="me-1"
//                         />
//                         Rating *
//                       </label>
//                       <input
//                         type="number"
//                         name="ratings"
//                         value={safeString(formData.ratings)}
//                         onChange={handleChange}
//                         className={`form-control ${
//                           validationErrors.ratings ? "is-invalid" : ""
//                         }`}
//                         step="0.1"
//                         min="0"
//                         max="5"
//                         placeholder="0.0"
//                       />
//                       {validationErrors.ratings && (
//                         <div className="invalid-feedback">
//                           <SafeRender>{validationErrors.ratings}</SafeRender>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">
//                     <Users
//                       style={{ width: "16px", height: "16px" }}
//                       className="me-1"
//                     />
//                     Number of Reviews *
//                   </label>
//                   <input
//                     type="number"
//                     name="numberOfReviews"
//                     value={safeString(formData.numberOfReviews)}
//                     onChange={handleChange}
//                     className={`form-control ${
//                       validationErrors.numberOfReviews ? "is-invalid" : ""
//                     }`}
//                     min="0"
//                     placeholder="0"
//                   />
//                   {validationErrors.numberOfReviews && (
//                     <div className="invalid-feedback">
//                       <SafeRender>
//                         {validationErrors.numberOfReviews}
//                       </SafeRender>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Category and Details */}
//           <div className="col-md-6">
//             <div className="card mb-4">
//               <div className="card-header">
//                 <h5 className="mb-0">Category & Details</h5>
//               </div>
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">City *</label>
//                       <select
//                         name="city"
//                         value={safeString(formData.city)}
//                         onChange={handleChange}
//                         className={`form-select ${
//                           validationErrors.city ? "is-invalid" : ""
//                         }`}
//                       >
//                         <option value="">Select City</option>
//                         {cities.map((city) => (
//                           <option key={city.value} value={city.value}>
//                             {city.label}
//                           </option>
//                         ))}
//                       </select>
//                       {validationErrors.city && (
//                         <div className="invalid-feedback">
//                           <SafeRender>{validationErrors.city}</SafeRender>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Category *</label>
//                       <select
//                         name="category"
//                         value={safeString(formData.category, "hotel")}
//                         onChange={handleChange}
//                         className={`form-select ${
//                           validationErrors.category ? "is-invalid" : ""
//                         }`}
//                       >
//                         {categories.map((category) => (
//                           <option key={category.value} value={category.value}>
//                             {category.label}
//                           </option>
//                         ))}
//                       </select>
//                       {validationErrors.category && (
//                         <div className="invalid-feedback">
//                           <SafeRender>{validationErrors.category}</SafeRender>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">
//                     <Tag
//                       style={{ width: "16px", height: "16px" }}
//                       className="me-1"
//                     />
//                     Tags
//                   </label>
//                   <input
//                     type="text"
//                     name="tag"
//                     value={safeString(formData.tag)}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="luxury, business, family-friendly"
//                   />
//                   <small className="form-text text-muted">
//                     Separate tags with commas
//                   </small>
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Description</label>
//                   <textarea
//                     name="description"
//                     value={safeString(formData.description)}
//                     onChange={handleChange}
//                     className="form-control"
//                     rows="4"
//                     placeholder="Describe the hotel..."
//                   />
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Phone</label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={safeString(formData.phone)}
//                         onChange={handleChange}
//                         className="form-control"
//                         placeholder="+1 234 567 8900"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={safeString(formData.email)}
//                         onChange={handleChange}
//                         className={`form-control ${
//                           validationErrors.email ? "is-invalid" : ""
//                         }`}
//                         placeholder="hotel@example.com"
//                       />
//                       {validationErrors.email && (
//                         <div className="invalid-feedback">
//                           <SafeRender>{validationErrors.email}</SafeRender>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Images Section */}
//         <div className="card mb-4">
//           <div className="card-header">
//             <h5 className="mb-0">
//               <ImageIcon
//                 style={{ width: "20px", height: "20px" }}
//                 className="me-2"
//               />
//               Hotel Images *
//             </h5>
//           </div>
//           <div className="card-body">
//             {(formData.slideImg || [""]).map((img, index) => (
//               <div key={index} className="row mb-3 align-items-center">
//                 <div className="col-md-10">
//                   <input
//                     type="url"
//                     value={safeString(img)}
//                     onChange={(e) => handleImageChange(index, e.target.value)}
//                     placeholder="Enter image URL"
//                     className="form-control"
//                   />
//                 </div>
//                 <div className="col-md-2">
//                   <button
//                     type="button"
//                     onClick={() => removeImageField(index)}
//                     className="btn btn-outline-danger btn-sm w-100"
//                     disabled={(formData.slideImg || [""]).length === 1}
//                   >
//                     <Trash2 style={{ width: "16px", height: "16px" }} />
//                   </button>
//                 </div>
//               </div>
//             ))}

//             {validationErrors.slideImg && (
//               <div className="text-danger mb-2">
//                 <SafeRender>{validationErrors.slideImg}</SafeRender>
//               </div>
//             )}

//             <button
//               type="button"
//               onClick={addImageField}
//               className="btn btn-outline-primary"
//             >
//               <Plus
//                 style={{ width: "16px", height: "16px" }}
//                 className="me-1"
//               />
//               Add Image
//             </button>
//           </div>
//         </div>

//         {/* Amenities Section */}
//         <div className="card mb-4">
//           <div className="card-header">
//             <h5 className="mb-0">Amenities</h5>
//           </div>
//           <div className="card-body">
//             <div className="row">
//               {amenitiesList.map((amenity, index) => (
//                 <div key={index} className="col-md-3 mb-2">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id={`amenity-${index}`}
//                       checked={(formData.amenities || []).includes(amenity)}
//                       onChange={() => handleAmenityChange(amenity)}
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor={`amenity-${index}`}
//                     >
//                       {amenity}
//                     </label>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Policy Section */}
//         <div className="card mb-4">
//           <div className="card-header">
//             <h5 className="mb-0">Policies & Times</h5>
//           </div>
//           <div className="card-body">
//             <div className="row">
//               <div className="col-md-4">
//                 <div className="mb-3">
//                   <label className="form-label">Check-in Time</label>
//                   <input
//                     type="time"
//                     name="checkInTime"
//                     value={safeString(formData.checkInTime, "15:00")}
//                     onChange={handleChange}
//                     className="form-control"
//                   />
//                 </div>
//               </div>
//               <div className="col-md-4">
//                 <div className="mb-3">
//                   <label className="form-label">Check-out Time</label>
//                   <input
//                     type="time"
//                     name="checkOutTime"
//                     value={safeString(formData.checkOutTime, "11:00")}
//                     onChange={handleChange}
//                     className="form-control"
//                   />
//                 </div>
//               </div>
//               <div className="col-md-4">
//                 <div className="mb-3">
//                   <label className="form-label">Cancellation Policy</label>
//                   <select
//                     name="cancellationPolicy"
//                     value={safeString(formData.cancellationPolicy, "free")}
//                     onChange={handleChange}
//                     className="form-select"
//                   >
//                     <option value="free">Free Cancellation</option>
//                     <option value="24h">24 Hours Notice</option>
//                     <option value="48h">48 Hours Notice</option>
//                     <option value="non-refundable">Non-Refundable</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Status</label>
//               <select
//                 name="status"
//                 value={safeString(formData.status, "active")}
//                 onChange={handleChange}
//                 className="form-select"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//                 <option value="draft">Draft</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="d-flex justify-content-end gap-2">
//           <button
//             type="button"
//             onClick={() => router.push("/admin/dashboard")}
//             className="btn btn-outline-secondary"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? (
//               <>
//                 <div
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                 >
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 {hotelId ? "Updating..." : "Adding..."}
//               </>
//             ) : (
//               <>
//                 <Save
//                   style={{ width: "16px", height: "16px" }}
//                   className="me-1"
//                 />
//                 {hotelId ? "Update Hotel" : "Add Hotel"}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default HotelForm;
