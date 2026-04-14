import { Card, CardContent } from "@/components/ui/card";

const BENEFITS = [
  {
    title: "Оценка ниши по ключевым метрикам",
    description:
      "Смотрите общий score ниши, уровень спроса, конкуренции и потенциальную прибыль в одном месте.",
  },
  {
    title: "Прогноз по выручке и окупаемости",
    description:
      "Оценивайте, сколько может принести ниша через месяц, полгода или год с учётом ваших целей.",
  },
  {
    title: "Рекомендации под ваш бюджет и риск",
    description:
      "Получайте подборку ниш, которые подходят под ваш горизонт, стартовый бюджет и допустимый уровень риска.",
  },
] as const;

export function HeroBenefits() {
  return (
    <section className="space-y-4">
      <div className="max-w-2xl space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight">Что вы получаете в одном сервисе</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Вся ключевая аналитика по нишам собрана в единой структуре: от оценки потенциала до
          рекомендаций под ваши бизнес-ограничения.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((item) => (
          <Card key={item.title} className="h-full border-border/80 bg-card/90 shadow-sm">
            <CardContent className="flex h-full flex-col gap-2 p-5">
              <h3 className="text-base font-semibold leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
