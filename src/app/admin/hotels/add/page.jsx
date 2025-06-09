"use client";

import { Suspense } from "react";
import HotelForm from "../../../../components/admin/HotelForm";
import { Building, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const AddHotel = () => {
  return (
    <div className="admin-add-hotel min-vh-100 bg-light py-4">
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
                  Add Hotel
                </li>
              </ol>
            </nav>

            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle p-3 me-3">
                  <Plus style={{ width: "24px", height: "24px" }} />
                </div>
                <div>
                  <h1 className="h3 mb-1">Add New Hotel</h1>
                  <p className="text-muted mb-0">Create a new hotel listing</p>
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
                  <p className="text-muted">Loading form...</p>
                </div>
              }
            >
              <HotelForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHotel;
