"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import HotelForm from "../../../../../components/admin/HotelForm";
import { Building, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";

const EditHotel = () => {
  const params = useParams();
  const hotelId = params?.id;

  // Отладочная информация
  console.log("EditHotel params:", params);
  console.log("Hotel ID:", hotelId);

  // Проверка на валидность ID
  if (!hotelId) {
    return (
      <div className="admin-edit-hotel min-vh-100 bg-light py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="alert alert-danger">
                <h4>Error</h4>
                <p>Hotel ID is missing. Please check the URL.</p>
                <Link href="/admin/dashboard" className="btn btn-primary">
                  <ArrowLeft size={16} className="me-1" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-edit-hotel min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link
                    href="/admin/dashboard"
                    className="text-decoration-none"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit Hotel
                </li>
              </ol>
            </nav>

            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <div className="bg-warning text-white rounded-circle p-3 me-3">
                  <Edit style={{ width: "24px", height: "24px" }} />
                </div>
                <div>
                  <h1 className="h3 mb-1">Edit Hotel</h1>
                  <p className="text-muted mb-0">
                    Update hotel information (ID: {String(hotelId)})
                  </p>
                </div>
              </div>

              <Link
                href="/admin/dashboard"
                className="btn btn-outline-secondary"
              >
                <ArrowLeft size={16} className="me-1" />
                Back to Dashboard
              </Link>
            </div>

            <Suspense
              fallback={
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Loading hotel data...</p>
                </div>
              }
            >
              <HotelForm hotelId={String(hotelId)} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHotel;
