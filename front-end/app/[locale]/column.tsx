import { ColumnDef } from "@tanstack/react-table";
import { Animal } from "../../types/profile";
import { Trash2, Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import { useState } from "react";
import EditProfileForm from "@/components/FormEditProfile";

export function getColumns(): ColumnDef<Animal>[] {
  const t = useTranslations(); // Use translation hook inside a function
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: t("Are you sure"),
      text: t("You won't be able to revert this"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("Yes, delete it"),
      cancelButtonText: t("Cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/deleteProfile/${id}`,
            {
              method: "DELETE",
            }
          );

          const result = await response.json();

          if (result.results) {
            Swal.fire(
              t("Deleted!"),
              t("Profile has been deleted"),
              "success"
            ).then(() => {
              window.location.reload(); // Refresh the page after deletion
            });
          } else {
            Swal.fire(
              t("Error!"),
              t("Failed to delete profile") + result.message,
              "error"
            );
          }
        } catch (error) {
          Swal.fire(
            t("Error!"),
            t("An error occurred") + (error as Error).message,
            "error"
          );
        }
      }
    });
  };

  return [
    {
      accessorKey: "id",
      header: t("id"),
    },
    {
      accessorKey: "image",
      header: t("image"),
      cell: ({ row }) => (
        <img
          src={`http://localhost:8080/images/${row.original.image}`}
          alt={row.original.name}
          className="w-20 h-20 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: t("name"),
    },
    {
      accessorKey: "lastname",
      header: t("lastname"),
      cell: ({ row }) => row.original.lastname || "N/A",
    },
    {
      accessorKey: "birthday",
      header: t("birthday"),
      cell: ({ row }) => new Date(row.original.birthday).toLocaleDateString(),
    },
    {
      accessorKey: "gender",
      header: t("gender"),
    },
    {
      accessorKey: "animal_type",
      header: t("animal_type"),
    },
    {
      accessorKey: "action",
      header: t("action"),
      cell: ({ row }) => (
        <div className="space-x-4">
          {/* Edit Button */}
          <button
            className="text-blue-500"
            onClick={() => {
              setSelectedProfileId(String(row.original.id));
              setIsEditOpen(true);
            }}
          >
            <Edit2 size={25} />
          </button>

          {/* Delete Button */}
          <button
            className="text-red-500"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 size={25} />
          </button>

          {/* Render Edit Profile Form when a profile is selected */}
          {isEditOpen && selectedProfileId === String(row.original.id) && (
            <EditProfileForm profileId={selectedProfileId} open={isEditOpen} setOpen={setIsEditOpen} />
          )}
        </div>
      ),
    },
  ];
}
