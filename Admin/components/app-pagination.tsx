"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

function windowed(cur: number, max: number, r = 2) {
  const out: (number | "...")[] = [1];
  const s = Math.max(2, cur - r);
  const e = Math.min(max - 1, cur + r);
  if (s > 2) out.push("...");
  for (let p = s; p <= e; p++) out.push(p);
  if (e < max - 1) out.push("...");
  if (max > 1) out.push(max);
  return out;
}

export function AppPagination({
  total,
  perPage = 10,
  pageParam = "page",
}: {
  total: number;
  perPage?: number;
  pageParam?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const current = Math.max(1, Number(sp.get(pageParam) ?? 1));
  const pages = Math.max(1, Math.ceil(total / perPage));

  const href = (p: number) => {
    const q = new URLSearchParams(sp);
    q.set(pageParam, String(p));
    return `${pathname}?${q.toString()}`;
  };

  const go = (p: number) => router.push(href(p), { scroll: false });

  const win = windowed(current, pages, 2);

  return (
    <Pagination>
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <PaginationPrevious
            href={href(Math.max(1, current - 1))}
            aria-disabled={current === 1}
            tabIndex={current === 1 ? -1 : undefined}
            onClick={(e) => {
              if (current === 1) return;
              e.preventDefault();
              go(current - 1);
            }}
            onMouseEnter={() => {
              if (current > 1) router.prefetch(href(current - 1));
            }}
          />
        </PaginationItem>

        {/* Numbers */}
        {win.map((p, i) =>
          p === "..." ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={href(p)}
                isActive={p === current}
                onClick={(e) => {
                  e.preventDefault();
                  go(p);
                }}
                onMouseEnter={() => router.prefetch(href(p))}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href={href(Math.min(pages, current + 1))}
            aria-disabled={current === pages}
            tabIndex={current === pages ? -1 : undefined}
            onClick={(e) => {
              if (current === pages) return;
              e.preventDefault();
              go(current + 1);
            }}
            onMouseEnter={() => {
              if (current < pages) router.prefetch(href(current + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
