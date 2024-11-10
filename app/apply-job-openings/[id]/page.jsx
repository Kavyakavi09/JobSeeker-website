"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams,useRouter } from "next/navigation";

const ApplyForJobForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      qualification: "",
      passedOutYear: "",
      experience: "",
      email: user?.Email || "",
      phone: user?.Phone || "",
      resume: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3).max(50).required("Name is required"),
      qualification: Yup.string().min(2).max(100).required("Qualification is required"),
      passedOutYear: Yup.string().matches(/^\d{4}$/, "Invalid year").required("Passed out year is required"),
      experience: Yup.string()
      .oneOf([
        "fresher",
        "< 1 year",
        "< 2 years",
        "< 3 years",
        "< 4 years",
        "< 5 years",
        "> 5 years",
      ])
      .required("Experience is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string().matches(/^[0-9]{10}$/, "Invalid phone number").required("Phone number is required"),
      resume: Yup.string()
        .min(100, "Resume must be at least 100 characters")
        .max(2000, "Resume must be less than 2000 characters")
        .required("Resume is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch("/api/apply-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            jobId:id,
          }),
        });

        const data = await response.json();
        if (response.ok) {
            router.push("/job-openings")
        } else {
          setErrorMessage(data.message || "Failed to apply for job");
        }
      } catch (error) {
        setErrorMessage("An error occurred while applying for the job");
      }
    },
  });

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white shadow-lg p-6 w-full max-w-3xl overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-5 text-center">Apply For Job</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...formik.getFieldProps("name")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Qualification</label>
            <input
              type="text"
              {...formik.getFieldProps("qualification")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.qualification && formik.errors.qualification
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.qualification && formik.errors.qualification && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.qualification}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Passed Out Year</label>
            <input
              type="text"
              {...formik.getFieldProps("passedOutYear")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.passedOutYear && formik.errors.passedOutYear
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.passedOutYear && formik.errors.passedOutYear && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.passedOutYear}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Experience</label>
            <select
              {...formik.getFieldProps("experience")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.experience && formik.errors.experience
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" label="Select experience level" />
              <option value="fresher" label="Fresher" />
              <option value="< 1 year" label="< 1 year" />
              <option value="< 2 years" label="< 2 years" />
              <option value="< 3 years" label="< 3 years" />
              <option value="< 4 years" label="< 4 years" />
              <option value="< 5 years" label="< 5 years" />
              <option value="> 5 years" label="> 5 years" />
            </select>
            {formik.touched.experience &&
              formik.errors.experience && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.experience}
                </p>
              )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...formik.getFieldProps("email")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              {...formik.getFieldProps("phone")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.phone && formik.errors.phone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Resume</label>
            <textarea
              {...formik.getFieldProps("resume")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.resume && formik.errors.resume
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              rows="4"
            ></textarea>
            {formik.touched.resume && formik.errors.resume && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.resume}</p>
            )}
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600"
              onClick={e => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForJobForm;
