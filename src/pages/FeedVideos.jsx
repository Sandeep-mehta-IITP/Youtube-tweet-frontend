import React, { useEffect, useRef, useState, useMemo } from "react";
import VideoGrid from "@/components/Video/VideoGrid";
import { useGetVideosByOptionQuery } from "@/features/auth/paginationApi";
import { useSelector } from "react-redux";

function FeedVideos() {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false); 
  const fetchedPagesRef = useRef(new Set());
  const dataRef = useRef();
  const lastVideoRef = useRef(null);

  const queryParams = useMemo(() => ({ page }), [page]);

  const { data, isFetching, isLoading, error } = useGetVideosByOptionQuery(
    queryParams,
    { skip: false } // Ensure always fetch
  );

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
      setIsLoadingMore(false); //  Stop loader once merged
    }
  }, [data]);

  //  Refined IntersectionObserver: Early trigger + Local loader
  useEffect(() => {
    if (allVideos.length === 0 || !lastVideoRef.current) return; // Wait for initial load

    const container = document.getElementById("scrollable_results_screen");
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoadingMore) { // Prevent duplicates
          const latest = dataRef.current?.data;
          if (latest?.hasNextPage && !fetchedPagesRef.current.has(latest.nextPage)) {
            console.log("🎉 Triggering next page:", latest.nextPage);
            setIsLoadingMore(true); //  Start loader immediately
            setPage(latest.nextPage);
          }
        }
      },
      {
        root: container,
        rootMargin: "300px 0px 0px 0px", //  Bigger margin: Preload 300px early (YouTube-style)
        threshold: 0, // Trigger as soon as it enters margin
      }
    );

    observer.observe(lastVideoRef.current);

    return () => observer.disconnect();
  }, [allVideos, isLoadingMore, asideOpen]); // Re-observe on content/aside change

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Error: {error.message}
        <button onClick={() => window.location.reload()} className="ml-2 px-4 py-2 bg-red-600 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <VideoGrid
        videos={allVideos}
        loading={isLoading}
        fetching={isFetching || isLoadingMore} // Use local state for reliable loader
        lastVideoRef={lastVideoRef}
        hasMore={data?.data?.hasNextPage || false}
      />
    </div>
  );
}

export default FeedVideos;