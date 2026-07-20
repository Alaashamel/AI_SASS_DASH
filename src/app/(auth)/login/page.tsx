import Link from "next/link";
import { LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
