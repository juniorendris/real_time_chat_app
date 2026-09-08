import { useState } from "react";
import useMutateQuery from "../hooks/useMutateQuery.js";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "../api/api.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function SignupPage() {
  const queryClient=useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { mutate, isPending} = useMutateQuery({
    method: "POST",
    url: "/auth/sign_up", 
    data: formData,
  });
const HandleSign = (e) => {
    e.preventDefault();
    mutate(undefined, {
      onSuccess: async (data) => {
        // 1. Save the access token in memory & localStorage
        setAccessToken(data.ACCESS_TOKEN);

        // 2. Force React Query to fetch /auth/me using the new token
        // and wait for it to finish so the app knows the user is logged in
        await queryClient.invalidateQueries({ queryKey: ["/authuser"] });

        // 3. Safely navigate to the homepage and clear history
        navigate("/", { replace: true });
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || error.message || "Signup failed";
        toast.error(errorMessage);
        console.log(error);
      },
    });
  };
  return (
    <div className="flex items-center  justify-center h-screen w-full">
      <div className="card card-side bg-base-100 shadow-sm mx-w-200  ap-3 p-3">
        <div className="card-body">
          <div className="flex items-start justify-center w-60 self-center">
            <img src="/logo.png" className="h-33 w-42 " alt="logo" />
          </div>
          <p className="card-title text-yellow-500">
            Join the Wollo University Community
          </p>
          {/* form */}
          <form onSubmit={HandleSign} className="w-full max-w-md space-y-4">
            <label className="input validator rounded-xl w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="text"
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="3"
                maxLength="30"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }));
                }}
                title="Only letters, numbers or dash"
              />
            </label>
            <p className="validator-hint hidden ">
              Must be 3 to 30 characters
              <br />
              containing only letters, numbers or dash
            </p>
            <label className="input validator rounded-xl w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                placeholder="mail@site.com"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                }}
              />
            </label>
            <div className="validator-hint hidden">
              Enter valid email address
            </div>
            <label className="input validator rounded-xl w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
          <input
  type="password"
  required
  placeholder="Password"
  minLength={8}
  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d\s]{8,}"
  value={formData.password}
  onChange={(e) => {
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  }}
  title="At least 8 characters, including a number, lowercase letter, and uppercase letter. Spaces are allowed."
/>
            </label>
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br />
              At least one number <br />
              At least one lowercase letter <br />
              At least one uppercase letter
            </p>
          

              <label className="label">
                <input type="checkbox" defaultChecked className="checkbox" />I
                agree to the Terms & Conditions.
              </label>
            
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary rounded-xl block w-full"
            >
              {isPending && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              Create acounte
            </button>
          </form>
          <div className="flex items-center justify-center">
            <p className="text-lg">
              Already have an account?
              <a href="/login" className="link link-primary ml-3 text-base">
                Sign in
              </a>
            </p>
          </div>
        </div>
        {/* right-side */}
        <figure className="h-120">
          <img className="object-cover w-full h-full sm:hidden md:block" src="/right-img.jpg" alt="Movie" />
        </figure>
      </div>
    </div>
  );
}

export default SignupPage;
