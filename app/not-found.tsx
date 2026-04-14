import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Страница не найдена</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Проверьте адрес или вернитесь на главную.
        </p>
      </div>
      <Button asChild>
        <Link href="/">На главную</Link>
      </Button>
    </div>
  );
}
