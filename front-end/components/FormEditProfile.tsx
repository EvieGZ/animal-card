"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { addProfile } from "@/types/profile";
import Swal from "sweetalert2";

export default function EditProfileForm({
  profileId,
  open,
  setOpen,
}: {
  profileId: string;
  open: boolean;
  setOpen: (state: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<addProfile>({
    image: null,
    name: "",
    lastname: "",
    description: "",
    birthday: "",
    gender: "",
    birthmark: 0,
    animal_type: "",
    address_id: "",
    owner_id: "",
  });

  const t = useTranslations();

  // Fetch profile data when profileId changes
  useEffect(() => {
    if (profileId && open) {
      fetch(`http://localhost:8080/api/profile/${profileId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setFormData({
              image: data.data.image || null,
              name: data.data.name || "",
              lastname: data.data.lastname || "",
              description: data.data.description || "",
              birthday: data.data.birthday
                ? new Date(data.data.birthday).toISOString().split("T")[0]
                : "", // Convert to YYYY-MM-DD
              gender: data.data.gender || "",
              birthmark: data.data.birthmark || 0,
              animal_type: data.data.animal_type || "",
              address_id: data.data.address_id || "",
              owner_id: data.data.owner_id || "",
            });
          } else {
            setMessage("Profile not found.");
          }
        })
        .catch(() => setMessage("Failed to load profile data."));
    }
  }, [profileId, open]);

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // Validate required fields for each step
  const validateStep = () => {
    let newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = t("Name_required");
    }

    if (step === 2) {
      if (!formData.birthday.trim())
        newErrors.birthday = t("Birthday_required");
      if (!formData.gender.trim()) newErrors.gender = t("Gender_required");
    }

    if (step === 3) {
      if (!formData.animal_type.trim())
        newErrors.animal_type = t("Animal_type_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit updated profile to API
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("lastname", formData.lastname || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("birthday", formData.birthday);
      formDataToSend.append("gender", formData.gender);
        formDataToSend.append("birthmark", String(formData.birthmark));
      formDataToSend.append("animal_type", formData.animal_type);
      formDataToSend.append("address_id", formData.address_id || "");
      formDataToSend.append("owner_id", formData.owner_id || "");

      if (formData.image && typeof formData.image !== "string") {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        `http://localhost:8080/api/editProfile/${profileId}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (result.results) {
        setOpen(false);
        Swal.fire({
          title: `${t("Success")}`,
          text: `${t("profile_updated")}`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: result.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Failed to update profile. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-md p-6 modal"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {t("Step")} {step} {t("of")} 4
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div>
            <label className="block mb-2">
              {t("name")}
              <span className="text-red-500">*</span> :
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
            <label className="block mt-4 mb-2">
              {t("lastname")} ({t("Optional")}):{" "}
            </label>
            <Input
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder={t("lastname_placeholder")}
            />

            <label className="block mt-4 mb-2">
              {t("description")} ({t("Optional")}):
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("description_placeholder")}
              className="border p-2 w-full rounded"
              rows={4}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block mb-2">
              {t("birthday")}
              <span className="text-red-500">*</span> :
            </label>
            <Input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />
            {errors.birthday && (
              <p className="text-red-500">{errors.birthday}</p>
            )}

            <label className="block mt-4 mb-2">
              {t("gender")}
              <span className="text-red-500">*</span> :
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="mr-2"
                />
                {t("Male")}
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="mr-2"
                />
                {t("Female")}
              </label>
            </div>

            <label className="block mb-2">{t("birthmark")}:</label>
            <Input
              type="number"
              name="birthmark"
              value={formData.birthmark ?? ""} // Ensures 0 is displayed correctly
              onChange={(e) => {
                const value =
                  e.target.value === "" ? "" : Number(e.target.value); // Allows empty string and 0
                setFormData({ ...formData, birthmark: value as number });
              }}
              className="border p-2 w-full rounded"
              required
            />
            {errors.birthmark && (
              <p className="text-red-500 mt-1">{errors.birthmark}</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block mb-2">
              {t("Animal_type")}
              <span className="text-red-500">*</span> :
            </label>
            <select
              name="animal_type"
              value={formData.animal_type}
              onChange={(e) =>
                setFormData({ ...formData, animal_type: e.target.value })
              }
              className="border p-2 w-full rounded"
              required
            >
              <option value="">{t("Select_animal_type")}</option>
              <option value="Mammals">{t("Mammals")}</option>
              <option value="Birds">{t("Birds")}</option>
              <option value="Reptiles">{t("Reptiles")}</option>
              <option value="Amphibians">{t("Amphibians")}</option>
              <option value="Fish">{t("Fish")}</option>
              <option value="Insects">{t("Insects")}</option>
              <option value="Arachnids">{t("Arachnids")}</option>
              <option value="Mollusks">{t("Mollusks")}</option>
              <option value="Crustaceans">{t("Crustaceans")}</option>
            </select>
            {errors.animal_type && (
              <p className="text-red-500">{errors.animal_type}</p>
            )}

            <h2 className="mb-2 mt-4">
              {t("Upload_pet_image")}
              <span className="text-red-500">*</span> :
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />

            {/* Display existing image or new preview */}
            {formData.image && (
              <img
                src={
                  typeof formData.image === "string"
                    ? `http://localhost:8080/images/${formData.image}`
                    : URL.createObjectURL(formData.image)
                }
                alt="Profile Preview"
                className="w-24 h-24 object-cover rounded mt-2"
              />
            )}
          </div>
        )}

        {/* Step 4 - Upload Image & Summary */}
        {step === 4 && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mt-2">{t("pet_profile")} :</h2>
              {formData.image && (
                <img
                  src={
                    typeof formData.image === "string"
                      ? `http://localhost:8080/images/${formData.image}`
                      : URL.createObjectURL(formData.image)
                  }
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded mt-2"
                />
              )}
              <p>
                <strong>{t("name")} :</strong> {formData.name}
              </p>
              <p>
                <strong>{t("lastname")} :</strong> {formData.lastname}
              </p>
              <p>
                <strong>{t("description")} :</strong> {formData.description}
              </p>
              <p>
                <strong>{t("birthday")} :</strong> {formData.birthday}
              </p>
              <p>
                <strong>{t("gender")} :</strong> {formData.gender}
              </p>
              <p>
                <strong>{t("animal_type")} :</strong> {formData.animal_type}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 && <Button onClick={prevStep}>{t("Back")}</Button>}
          {step < 4 ? (
            <Button onClick={nextStep}>{t("Next")}</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? t("Updating") : t("Update")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
