import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { loginHandler } = useAuth();
  const navigate = useNavigate();

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Store token in local storage
      localStorage.setItem("token", token);

      // Login successful, set token
      loginHandler(token);

      toast.success("Login successful", {
        position: "top-right",
      });

      // Redirect after successful sign-in
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Error signing in", {
        position: "top-right",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      console.log("login response", response);
      if (response.statusCode === 200) {
        // Assuming successful login returns a token
        const { token } = response.data;

        // Save token to local storage
        localStorage.setItem("token", token);

        // Login successful, set token
        loginHandler(response.data.token);

        // Show success toast
        toast.success(response.message, {
          position: "top-right",
        });

        // Redirect to homepage or dashboard
        navigate("/");
      } else {
        // Show toast
        toast.error(response.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error logging in", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        const { status, data } = error.response;

        if (status === 401) {
          // Unauthorized error handling
          toast.error(data.message || "Unauthorized", {
            position: "top-right",
          });
        } else {
          // Other server errors
          toast.error(`Server Error: ${status} - ${data.message}`, {
            position: "top-right",
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("No response from server", {
          position: "top-right",
        });
      } else {
        // Other errors
        console.error("Error during request:", error.message);
        toast.error("An error occurred", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleSignInWithGoogle}
          className="w-full px-4 py-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
