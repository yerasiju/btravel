"use client";

import AdminAuth from "../../../components/auth/AdminAuth";

const AdminLogin = () => {
  return (
    <div className="admin-login-page">
      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-6 col-lg-8">
            <AdminAuth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
