import { GoalsForm } from "@/features/onboarding/goals-form";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Цели для расчёта</h1>
        <p className="text-sm text-muted-foreground">
          Задайте ожидания по выручке, риску и горизонту — пересоберём рейтинг ниш и формулировки
          рекомендаций.
        </p>
      </div>
      <GoalsForm />
    </div>
  );
}
