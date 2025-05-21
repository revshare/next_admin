"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { useActionState } from "react";
import { useForm } from "@conform-to/react"; // ✅ Importing the correct useForm

import {
  create_customer,
  edit_customer,
} from "../../controller/customerController";

import { parseWithZod } from "@conform-to/zod";
//import { CustomerFormValues, customerSchema } from "@/lib/customerSchema";
import { customerSchema, type CustomerFormValues } from "@/lib/customerSchema";

//export default function AddCustomerForm() {
export default function CustomerForm({
  customer,
}: {
  customer?: CustomerFormValues;
}) {
  //const actualAction = create_customer;
  const isEditMode = !!customer;
  const actualAction = isEditMode ? edit_customer : create_customer;

  const [formState, formAction] = useActionState(actualAction, {});

  const [form, fields] = useForm<CustomerFormValues>({
    defaultValue: customer,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: customerSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Card className="mx-auto  p-3 shadow-lg">
      <CardHeader>
        <CardTitle>Add Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <form id={form.id} onSubmit={form.onSubmit} action={formAction}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="mb-2" htmlFor="first_name">
                First Name
              </Label>
              <Input
                key={fields.first_name.key}
                id="first_name"
                placeholder="First Name"
                autoComplete="off"
                name={fields.first_name.name}
                defaultValue={fields.first_name.initialValue}
              />
              <p className="text-red-400 text-sm">{fields.first_name.errors}</p>
            </div>
            <div>
              <Label className="mb-2" htmlFor="middle_name">
                Middle Name
              </Label>
              <Input
                key={fields.middle_name.key}
                id="middle_name"
                placeholder="Middle Name"
                autoComplete="off"
                name={fields.middle_name.name}
                defaultValue={fields.middle_name.initialValue}
              />
              <p className="text-red-400 text-sm">
                {fields.middle_name.errors}
              </p>
            </div>
            <div>
              <Label className="mb-2" htmlFor="last_name">
                Last Name
              </Label>
              <Input
                key={fields.last_name.key}
                id="last_name"
                placeholder="Last Name"
                autoComplete="off"
                name={fields.last_name.name}
                defaultValue={fields.last_name.initialValue}
                required
              />
              <p className="text-red-400 text-sm">{fields.last_name.errors}</p>
            </div>

            <div>
              <Label className="mb-2" htmlFor="email">
                Email Address
              </Label>
              <Input
                key={fields.email.key}
                id="email"
                name={fields.email.name}
                type="email"
                placeholder="Email"
                defaultValue={fields.email.initialValue}
                required
              />
              <p className="text-red-400 text-sm">{fields.email.errors}</p>
            </div>

            <div>
              <Label className="mb-2" htmlFor="phone">
                Mobile Number
              </Label>
              <Input
                key={fields.phone.key}
                id="phone"
                name={fields.phone.name}
                defaultValue={fields.phone.initialValue}
                type="text"
                inputMode="numeric"
                maxLength={15}
                placeholder="+639000000000"
                required
                onChange={(e) => {
                  const input = e.target.value;

                  // Auto-convert if user starts with 0
                  if (input.startsWith("0")) {
                    e.target.value = "+63" + input.slice(1);
                  }

                  // Optional: restrict to digits after +63
                  if (!/^\+639\d{0,9}$/.test(e.target.value)) {
                    e.target.value = e.target.value.slice(0, 13); // Enforce max format
                  }
                }}
              />
              <p className="text-red-400 text-sm">{fields.phone.errors}</p>
            </div>

            <div>
              <Label className="mb-2" htmlFor="dob">
                Date of Birth
              </Label>
              <Input
                key={fields.dob.key}
                id="dob"
                name={fields.dob.name}
                defaultValue={fields.dob.initialValue}
                type="date"
                required
              />
              <p className="text-red-400 text-sm">{fields.dob.errors}</p>
            </div>

            <div className="md:col-span-3">
              <Label className="mb-2" htmlFor="address">
                Address
              </Label>
              <Textarea
                key={fields.address.key}
                id="address"
                placeholder="Address"
                autoComplete="off"
                name={fields.address.name}
                defaultValue={fields.address.initialValue}
              />
              <p className="text-red-400 text-sm">{fields.address.errors}</p>
            </div>
          </div>

          <div className="mt-6 text-left">
            {isEditMode && (
              <Input type="hidden" name="_id" value={customer?._id} />
            )}
            {/* <Button type="submit">Submit</Button> */}
            <Button type="submit">{isEditMode ? "Update" : "Submit"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
