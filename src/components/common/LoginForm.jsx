"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Check if user is admin
      if (userCredential.user.email === "admin@btravel.com") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
          ? "Invalid email or password"
          : "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="row y-gap-20" onSubmit={handleSubmit}>
      <div className="col-12">
        <h1 className="text-22 fw-500">Welcome back</h1>
        <p className="mt-10">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-blue-1">
            Sign up for free
          </Link>
        </p>
      </div>
      {/* End .col */}

      {error && (
        <div className="col-12">
          <div className="error-message">{error}</div>
        </div>
      )}

      <div className="col-12">
        <div className="form-input">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label className="lh-1 text-14 text-light-1">Email</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label className="lh-1 text-14 text-light-1">Password</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <a href="#" className="text-14 fw-500 text-blue-1 underline">
          Forgot your password?
        </a>
      </div>
      {/* End .col */}

      <div className="col-12">
        <button
          type="submit"
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
          <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default LoginForm;
