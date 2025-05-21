import { getUserFromCookie } from "../../lib/getUser";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import Link from "next/link";
import CustomerPage from "@/components/customers/CustomerPage";

// async function getData(): Promise<Customer[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       _id: "728ed52f",
//       first_name: "reuben",
//       middle_name: "lanuza",
//       last_name: "Baltazar",
//       dob: "1990-05-31",
//       phone: "098846832424",
//       email: "m@example.com",
//       address: "test",
//     },
//   ];
// }

export default async function Page() {
  const user = await getUserFromCookie();
  if (!user) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Customers</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div> */}
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <h1 className="text-white-600 ml-5 text-xl mt-5">Customers</h1>

            <div className="flex justify-end mr-5">
              <Link href="/customers/Add/">
                <Button className="flex items-center gap-2">
                  <CiCirclePlus className="w-5 h-5" />
                  Add
                </Button>
              </Link>
            </div>
            <div className="container mx-auto py-10 pl-5 pr-5">
              <CustomerPage />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
