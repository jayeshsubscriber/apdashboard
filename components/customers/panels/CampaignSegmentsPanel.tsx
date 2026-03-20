"use client";

import { segmentTiles } from "../data";

export function CampaignSegmentsPanel() {
  return (
    <section className="p-3">
      <h3 className="text-base font-semibold tracking-tight text-foreground">Campaign segments</h3>
      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {segmentTiles.map((tile) => (
          <article key={tile.id} className="rounded-md border border-border px-3 py-2">
            <div className="text-xs text-muted-foreground">{tile.title}</div>
            <div className="mt-1 inline-flex rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {tile.count} Clients
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
