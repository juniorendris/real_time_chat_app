import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import useMutateQuery from "../hooks/useMutateQuery.js";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { skills } from "../assets/skills.js";
import { languages } from "../assets/languages.js";
import { countries } from "../assets/countries.js";

function OnboardingPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useAuthUser();
  const user = data?.user || {};

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    image: user.image || "",
    skill: user.skill || "",
    language: user.language || "",
    location: user.location || "",
    bio: user.bio || "",
  });

  const { mutate, isPending } = useMutateQuery({
    method: "PATCH",
    url: "/user/onboarding",
    queryKey: "/authuser",
    data: formData,
  });

  const HandleSign = (e) => {
    e.preventDefault();

    mutate(undefined, {
      onSuccess: async (data) => {
        toast.success(data.message || "Successful");

        await queryClient.invalidateQueries({
          queryKey: ["/authuser"],
        });

        navigate("/", { replace: true });
      },

      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";

        toast.error(errorMessage);
        console.log(error);
      },
    });
  };

  const profileAvator = () => {
    const randomSeed = Math.random().toString(36).substring(2, 9);

    const avatarUrl = `https://api.dicebear.com/10.x/avataaars/svg?borderRadius=50&translateX=0&translateY=0&scale=1&seed=${randomSeed}`;

    setFormData((prev) => ({
      ...prev,
      image: avatarUrl,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full py-6 px-4">
      <div className="card card-side bg-base-100 shadow-md w-150 rounded-sm p-3 my-auto">
        <div className="card-body w-full p-3">
          <form onSubmit={HandleSign}>
            {/* HEADER */}
            <div className="flex flex-col justify-center items-center gap-3">
              <h2 className="card-title text-yellow-400 text-2xl">
                Complete Your Profile
              </h2>

              <p className="para text-sm">
                Please complete your profile to continue
              </p>

              {/* AVATAR */}
              <div
                className={`avatar ${
                  navigator.onLine ? "avatar-online" : "avatar-offline"
                }`}
              >
                <div className="w-20 rounded-full bg-amber-50">
                  <img
                    alt="profile"
                    src={
                      formData.image ||
                      "https://api.dicebear.com/10.x/avataaars/svg?seed=default"
                    }
                  />
                </div>
              </div>

              {/* RANDOM PROFILE BUTTON */}
              <p
                onClick={profileAvator}
                className="btn btn-primary w-36 h-9 min-h-0 text-xs rounded-3xl cursor-pointer"
              >
                <RefreshCw size={16} />
                Profile
              </p>
            </div>

            {/* FULL NAME + LOCATION */}
            <div className="flex gap-5 mt-5">
              {/* FULL NAME */}
              <div className="flex flex-col flex-1">
                <label className="mb-1 text-sm font-medium">Full Name:</label>

                <label className="input validator rounded-3xl input-info h-11 min-h-0 text-sm">
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
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </g>
                  </svg>

                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }));
                    }}
                  />
                </label>
              </div>

              {/* LOCATION */}
              <div className="flex flex-col flex-1">
                <label className="mb-1 text-sm font-medium">Location:</label>

                <select
                  value={formData.location}
                  required
                  className="select select-info rounded-3xl w-full h-11 min-h-0 text-sm"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                >
                  <option disabled value="">
                    Select location
                  </option>

                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SKILL + LANGUAGE */}
            <div className="flex gap-5 mt-4">
              {/* SKILL */}
              <div className="flex flex-col flex-1">
                <label className="mb-1 text-sm font-medium">Skill:</label>

                <select
                  value={formData.skill}
                  required
                  className="select select-info w-full rounded-3xl h-11 min-h-0 text-sm"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      skill: e.target.value,
                    }));
                  }}
                >
                  <option disabled value="">
                    Pick a skill
                  </option>

                  {skills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              {/* LANGUAGE */}
              <div className="flex flex-col flex-1">
                <label className="mb-1 text-sm font-medium">Language:</label>

                <select
                  value={formData.language}
                  required
                  className="select select-info w-full rounded-3xl h-11 min-h-0 text-sm"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }));
                  }}
                >
                  <option disabled value="">
                    Pick a language
                  </option>

                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BIO */}
            <div className="w-full mt-4">
              <fieldset className="fieldset w-full">
                <label className="mb-1 font-medium text-sm">Your Bio:</label>

                <textarea
                  placeholder="Type your bio"
                  value={formData.bio}
                  className="textarea textarea-accent w-full rounded-3xl h-20 py-2.5 text-sm"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }));
                  }}
                />
              </fieldset>
            </div>

            {/* SUBMIT */}
            <div className="w-full mt-6">
              <button
                type="submit"
                className="btn btn-block rounded-3xl btn-primary h-12 min-h-0 text-base"
                disabled={isPending}
              >
                {isPending && (
                  <span className="loading loading-spinner loading-md"></span>
                )}
                Complete Onboarding
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
