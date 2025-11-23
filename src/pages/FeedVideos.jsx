import React, { useEffect, useRef, useState, useMemo } from "react";
import VideoGrid from "@/components/Video/VideoGrid";
import { useGetVideosByOptionQuery } from "@/features/auth/paginationApi";
import { useSelector } from "react-redux";

function FeedVideos() {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  const fetchedPagesRef = useRef(new Set());
  const dataRef = useRef();
  const lastVideoRef = useRef(null);

  const queryParams = useMemo(() => ({ page }), [page]);

  const { data, isFetching, isLoading, error } =
    useGetVideosByOptionQuery(queryParams);

  const asideOpen = useSelector((state) => state.ui.asideOpen);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Merge videos when data arrives
  useEffect(() => {
    if (!data?.data?.docs) return;

    const docs = data.data.docs;

    if (!fetchedPagesRef.current.has(page)) {
      setAllVideos((prev) =>
        page === 1 ? docs : [...prev, ...docs]
      );

      fetchedPagesRef.current.add(page);
    }
  }, [data]);

  // 🔥 IntersectionObserver for auto load
  useEffect(() => {
    const container = document.getElementById("scrollable_results_screen");
    if (!container) return;
    if (!lastVideoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          const latest = dataRef.current?.data;
          if (latest?.hasNextPage) {
            setPage(latest.nextPage);
          }
        }
      },
      {
        root: container,
        rootMargin: "200px 0px 0px 0px",
      }
    );

    observer.observe(lastVideoRef.current);

    return () => observer.disconnect();
  }, [allVideos, asideOpen]);

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <VideoGrid
        videos={allVideos}
        loading={isLoading}
        fetching={isFetching && allVideos.length > 0}
        lastVideoRef={lastVideoRef}
      />
    </div>
  );
}

export default FeedVideos;
