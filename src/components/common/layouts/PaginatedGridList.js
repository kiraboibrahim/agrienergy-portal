import { useEffect, useState, useRef } from "react";
import GridList from "./GridList";
import isEmpty from "../../../utils/isEmpty";
import { CircularProgress, Box } from "@mui/joy";

export default function PaginatedGridList({
  data,
  renderItem,
  renderEmpty,
  onSelectPage,
  isFetching = false,
}) {
  const { data: items, meta } = data || {};
  const [accumulatedItems, setAccumulatedItems] = useState([]);
  const sentinelRef = useRef(null);

  const currentPage = meta?.currentPage || 1;
  const totalPages = meta?.totalPages || 1;

  // Reset or accumulate items depending on page number
  useEffect(() => {
    if (items) {
      if (currentPage === 1) {
        setAccumulatedItems(items);
      } else {
        setAccumulatedItems((prev) => {
          // Avoid duplicate items by checking ID
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = items.filter((item) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });
      }
    } else {
      setAccumulatedItems([]);
    }
  }, [items, currentPage]);

  // Set up intersection observer for infinite scroll sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || isEmpty(meta)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isFetching && currentPage < totalPages) {
          onSelectPage(currentPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [meta, currentPage, totalPages, isFetching, onSelectPage]);

  return (
    <>
      <GridList
        items={accumulatedItems}
        renderItem={renderItem}
        renderEmpty={renderEmpty}
      />

      {/* Sentinel element for infinite scrolling detection */}
      {!isEmpty(meta) && currentPage < totalPages && (
        <Box ref={sentinelRef} sx={{ height: "20px", my: 2 }} />
      )}

      {/* Subtle loader at the bottom during page-fetch */}
      {isFetching && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress color="success" size="sm" />
        </Box>
      )}
    </>
  );
}
