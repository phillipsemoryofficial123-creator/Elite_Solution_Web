import type { Metadata } from "next";
import { KeywordsPanel } from "@/components/admin/keywords-panel";
import { EmptyState } from "@/components/admin/empty-state";
import {
  findCannibalization,
  listCompetitors,
  listKeywords,
  listRankings,
} from "@/lib/seo/keyword-actions";
import { canMutateContent, getSeoSession } from "@/lib/seo/auth";

export const metadata: Metadata = {
  title: "Keywords",
};

export default async function AdminKeywordsPage() {
  const session = await getSeoSession();
  const [keywordsResult, rankingsResult, competitorsResult, canniResult] =
    await Promise.all([
      listKeywords(),
      listRankings(),
      listCompetitors(),
      findCannibalization(),
    ]);

  const hardFail =
    !keywordsResult.ok &&
    !rankingsResult.ok &&
    !competitorsResult.ok &&
    !canniResult.ok;

  const firstError =
    (!keywordsResult.ok && keywordsResult.error) ||
    (!rankingsResult.ok && rankingsResult.error) ||
    (!competitorsResult.ok && competitorsResult.error) ||
    (!canniResult.ok && canniResult.error) ||
    "Keywords module unavailable.";

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Research</p>
          <h1>Keywords</h1>
          <p>
            Track target keywords, intent groups, and manual ranking history.
            Volume and difficulty are never invented.
          </p>
        </div>
      </header>

      {hardFail ? (
        <EmptyState title="Keywords unavailable" description={firstError} />
      ) : (
        <KeywordsPanel
          keywords={keywordsResult.ok ? keywordsResult.data : []}
          rankings={rankingsResult.ok ? rankingsResult.data : []}
          competitors={competitorsResult.ok ? competitorsResult.data : []}
          cannibalization={canniResult.ok ? canniResult.data : []}
          canEdit={canMutateContent(session?.role)}
        />
      )}
    </div>
  );
}
