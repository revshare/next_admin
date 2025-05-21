"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Customer, columns } from "@/app/customers/columns";
import { DataTable } from "@/app/customers/data-table";
import CustomerForm from "@/components/customers/CustomerForm";

async function getListPost() {
  try {
    const response = await fetch("http://localhost:3000/customers/api/", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getListPost:", error);
    return null;
  }
}

export default function CustomerPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isPending, startTransition] = useTransition();

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    const data = await getListPost();
    setCustomers(data); // adjust based on your API response shape
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    const formData = new FormData();
    formData.append("id", id);

    const response = await fetch("http://localhost:3000/customers/api/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      startTransition(() => {
        fetchCustomers(); // refresh after delete
      });
    } else {
      alert("Delete failed");
    }
  };

  // Edit handler
  // const handleEdit = (customer: Customer) => {
  //   setEditingCustomer(customer);
  // };

  const handleEdit = (customer: Customer) => {
    //console.log(customer);
    router.push(`customers/edit/${customer._id}`);
  };

  // Close edit form handler
  // const closeEditForm = () => {
  //   setEditingCustomer(null);
  // };

  return (
    <>
      {isPending && <div className="p-4 text-center">Loading...</div>}

      <DataTable columns={columns(handleEdit, handleDelete)} data={customers} />
    </>
  );
}
