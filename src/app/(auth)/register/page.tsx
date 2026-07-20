import Link from "next/link";
import { RegisterForm } from "@/components/auth";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
