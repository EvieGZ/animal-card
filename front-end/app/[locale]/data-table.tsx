"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl"; // Import translation hook
import { getColumns } from "./column";
import { Animal } from "@/types/profile";
import MultiStepForm from "@/components/FormAddProfile";
import { Search } from "lucide-react";

export default function AnimalsTable() {
  const t = useTranslations();
  const [data, setData] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/profile");
        const result = await response.json();
        if (result.results) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(
      (animal) =>
        animal.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        animal.lastname?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        false ||
        animal.gender.toLowerCase().includes(globalFilter.toLowerCase()) ||
        animal.animal_type.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [data, globalFilter]);

  const resetFilters = () => {
    setGlobalFilter(""); // Reset global filter
  };

  const columns = getColumns(); // Generate translated columns inside the component

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // Default rows per page
      },
    },
  });

  return (
    <div className="container mx-auto mb-8">
      {/* Title and Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <MultiStepForm />
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border p-2 pl-10 rounded"
            />
          </div>
          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="bg-yellow-950 text-white px-4 py-2 rounded hover:bg-yellow-900"
          >
            {t("reset")}
          </button>
        </div>
      </div>

      {/* Error Handling */}
      {loading && <p>{t("loading")}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <div className="tableBody overflow-y-auto">
          <table className="table-auto w-full text-center border-collapse">
            <thead className="bg-yellow-950 text-white sticky top-0 shadow-md z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="mt-2 p-3">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="odd:bg-white even:bg-yellow-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-gray-500"
                  >
                    {t("no_data_message")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          {t("rows_per_page")}:{" "}
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-2 mt-4">
          {/* Previous Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border px-4 py-2 rounded disabled:opacity-50"
          >
            {t("< Previous")}
          </button>

          {/* Page Numbers */}
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === table.getPageCount() ||
                (page >= table.getState().pagination.pageIndex &&
                  page <= table.getState().pagination.pageIndex + 2)
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && page !== array[index - 1] + 1 && <span>...</span>}
                <button
                  onClick={() => table.setPageIndex(page - 1)}
                  className={`px-3 py-1 rounded ${
                    table.getState().pagination.pageIndex + 1 === page
                      ? "bg-yellow-950 text-white"
                      : "border"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          {/* Next Button */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border px-4 py-2 rounded disabled:opacity-50"
          >
            {t("Next >")}
          </button>
        </div>
      </div>
    </div>
  );
}
