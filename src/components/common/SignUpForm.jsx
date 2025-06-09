"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.code === "auth/email-already-in-use"
          ? "Email is already registered"
          : "Failed to register. Please try again."
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
          Already have an account yet?{" "}
          <Link href="/login" className="text-blue-1">
            Log in
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
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <label className="lh-1 text-14 text-light-1">First Name</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <label className="lh-1 text-14 text-light-1">Last Name</label>
        </div>
      </div>
      {/* End .col */}

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
            minLength="6"
          />
          <label className="lh-1 text-14 text-light-1">Password</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
          />
          <label className="lh-1 text-14 text-light-1">Confirm Password</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="d-flex ">
          <div className="form-checkbox mt-5">
            <input type="checkbox" name="name" />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon icon-check" />
            </div>
          </div>
          <div className="text-15 lh-15 text-light-1 ml-10">
            Email me exclusive Agoda promotions. I can opt out later as stated
            in the Privacy Policy.
          </div>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <button
          type="submit"
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
          <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default SignUpForm;
