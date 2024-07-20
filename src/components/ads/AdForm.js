import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createAd } from "../../services/adService";
import { toast } from "react-toastify";
import Spinner from "../common/Spinner";

// Define Yup validation schema
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  image: yup
    .mixed()
    .test("fileRequired", "Image is required", (value) => {
      return value && value.length > 0;
    })
    .test("fileType", "Unsupported file format", (value) => {
      return (
        value && value[0] && ["image/jpeg", "image/png"].includes(value[0].type)
      );
    })
    .test("fileSize", "File too large", (value) => {
      return value && value[0] && value[0].size <= 2000000; // 2MB
    }),
});

const AdForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.image && data.image[0]) formData.append("image", data.image[0]);

    try {
      setLoading(true);
      const response = await createAd(formData, token);

      if (response.statusCode === 200) {
        setLoading(false);
        toast.success("Advertisement Created Successfully", {
          position: "top-right",
        });
      } else {
        toast.error("Something Went Wrong! Please try after some time", {
          position: "top-right",
        });
        setLoading(false);
      }
      // Clear form state after successful submission
      reset();
      navigate("/");
    } catch (error) {
      console.error("Error creating Advertisement", error.message);
      setLoading(false);
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-4xl text-center mt-8">
        <h1 className="text-4xl font-bold">Welcome to Ad Portal</h1>
        <p className="text-lg text-gray-700 mt-4">
          Post and view advertisements easily.
        </p>
      </div>

      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-center">Create Advertisement</h2>
        {loading && <Spinner />}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title")}
              className={`block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className={`block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              {...register("image")}
              className={`block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.image ? "border-red-500" : ""
              }`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdForm;
