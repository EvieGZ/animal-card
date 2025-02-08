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

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ birthmark?: string }>({});

  const [formData, setFormData] = useState<addProfile>({
    image: null, // Image will be stored as a File object
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

  // Load saved form data from localStorage (excluding image)
  useEffect(() => {
    const savedData = localStorage.getItem("multiStepFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData((prev) => ({ ...prev, ...parsedData }));
    }
  }, []);

  // Auto-save form data (excluding image) to localStorage
  useEffect(() => {
    const { image, ...dataToSave } = formData;
    localStorage.setItem("multiStepFormData", JSON.stringify(dataToSave));
  }, [formData]);

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Submit form to API
  const handleSubmit = async () => {
    // Validate birthmark
    if (formData.birthmark < 0) {
      setErrors({ birthmark: t("Birthmark must be a positive number") });
      return;
    } else {
      setErrors({});
    }

    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("lastname", formData.lastname || ""); // Allow null
      formDataToSend.append("description", formData.description || ""); // Allow null
      formDataToSend.append("birthday", formData.birthday);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("birthmark", formData.birthmark.toString());
      formDataToSend.append("animal_type", formData.animal_type);
      formDataToSend.append("address_id", formData.address_id || ""); // Allow null
      formDataToSend.append("owner_id", formData.owner_id || ""); // Allow null
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("http://localhost:8080/api/addProfile", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.results) {
        resetForm();
        Swal.fire({
          title: `${t("Success")}`,
          text: `${t("profile_added")}`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      } else {
        setMessage("Error: " + result.message);
      }
    } catch (error) {
      setMessage("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form and clear localStorage
  const resetForm = () => {
    setFormData({
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
    setStep(1);
    setOpen(false);
    localStorage.removeItem("multiStepFormData");
  };

  return (
    <div>
      {/* Open Form Button */}
      <Button
        className="btnAdd hover:bg-lime-700"
        onClick={() => setOpen(true)}
      >
        {t("Add")}
      </Button>

      {/* Modal */}
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

          {/* Step 1 - Basic Info */}
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
                placeholder={t("name_placeholder")}
                required
              />

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

          {/* Step 2 - Additional Info */}
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
                required
              />

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

              <label className="block mb-2 mt-4">
                {t("birthmark")}
                <span className="text-red-500">*</span> :
              </label>
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

          {/* Step 3 - Animal Details */}
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

              {/*<label className="block mt-4 mb-2">Address ID (Optional):</label>
              <Input
                type="number"
                name="address_id"
                value={formData.address_id}
                onChange={handleChange}
                placeholder="Enter address ID"
              />

              <label className="block mt-4 mb-2">Owner ID (Optional):</label>
              <Input
                type="number"
                name="owner_id"
                value={formData.owner_id}
                onChange={handleChange}
                placeholder="Enter owner ID"
              />*/}
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

              {formData.image && typeof formData.image === "object" && (
                <img
                  src={URL.createObjectURL(formData.image)}
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
                {formData.image && typeof formData.image === "object" && (
                  <img
                    src={URL.createObjectURL(formData.image)}
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
                  <strong>{t("birthmark")} :</strong> {formData.birthmark}
                </p>
                <p>
                  <strong>{t("animal_type")} :</strong> {formData.animal_type}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigation & Submit Buttons */}
          <div className="flex justify-between mt-4">
            {step > 1 && <Button onClick={prevStep}>{t("Back")}</Button>}
            {step < 4 ? (
              <Button onClick={nextStep}>{t("Next")}</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? t("Submitting") : t("Finish")}
              </Button>
            )}
          </div>

          {message && (
            <p className="mt-4 text-center text-red-500">{message}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
