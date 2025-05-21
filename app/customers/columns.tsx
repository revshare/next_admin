"use client";
import Link from "next/link"; // add this at the top if not already imported
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Customer = {
  _id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  dob: string;
  email: string;
  address: string;
};

//export const columns: ColumnDef<Customer>[] = [
export const columns = (
  handleEdit: (customer: Customer) => void,
  handleDelete: (id: string) => void
): ColumnDef<Customer>[] => [
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const cust = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            {/* <DropdownMenuItem onClick={() => handleEdit(cust)}>
              Edit
            </DropdownMenuItem> */}
            <DropdownMenuItem asChild>
              <Link href={`/customers/edit/${cust._id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(cust._id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "middle_name",
    header: "Middle Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-right">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);

  //     return <div className="text-right font-medium">{formatted}</div>;
  //   },
  // },
];
