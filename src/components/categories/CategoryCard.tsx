import type { CategoryView } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { format } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { Card, CardHead, CardSummary, CardTitle } from "@/components/ui";

/** Head: the two counts. Plate: the category name. Body: its one-line scope. */
export function CategoryCard({ category, locale, d, large }: { category: CategoryView; locale: Locale; d: Dictionary; large?: boolean }) {
  const t = category.t;
  const concepts = format(category.conceptCount === 1 ? d.category.conceptCountOne : d.category.conceptCount, { count: category.conceptCount });
  const philosophers = format(category.philosopherCount === 1 ? d.category.philosopherCountOne : d.category.philosopherCount, { count: category.philosopherCount });
  return (
    <Card>
      <CardHead meta={`${concepts} · ${philosophers}`} />
      <CardTitle href={href(locale, "categories", t.slug)} size={large ? "large" : "default"}>{t.title}</CardTitle>
      <CardSummary>{t.summary}</CardSummary>
    </Card>
  );
}
