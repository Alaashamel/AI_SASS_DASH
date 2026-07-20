import { AuthSidebar } from "@/components/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <AuthSidebar />
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
