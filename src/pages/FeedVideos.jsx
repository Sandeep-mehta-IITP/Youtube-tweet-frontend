import React, { useEffect, useRef, useState } from "react";
import VideoGrid from "@/components/Video/VideoGrid";
import { useGetVideosByOptionQuery } from "@/features/auth/paginationApi";

function FeedVideos() {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);

  // determin the bottom of page for fetching videos
  const sectionRef = useRef();

  // track fetched page for optimization
  const fetchedPagesRef = useRef(new Set());

  const { data, isFetching, isLoading } = useGetVideosByOptionQuery({ page });

  console.log("data from API:", data);
console.log("allVideos state:", allVideos);

  // Merge pages into local state
  useEffect(() => {
    if (data?.data?.docs && !fetchedPagesRef.current.has(page)) {
      setAllVideos((prev) =>
        page === 1 ? data.data.docs : [...prev, ...data.data.docs]
      );
      fetchedPagesRef.current.add(page);
    }
  }, [data, page]);

  useEffect(() => {
    sectionRef.current = document.getElementById("scrollable_results_screen");
    sectionRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    // Scroll event for infinite scroll
    const handleScroll = () => {
      const section = sectionRef.current;
      const scrollHeight = section.scrollHeight;
      const scrolledValue = section.clientHeight + section.scrollTop;

      if (scrolledValue + 5 > scrollHeight) {
        const currentPagingInfo = data?.data;
        if (
          currentPagingInfo?.hasNextPage &&
          !fetchedPagesRef.current.has(currentPagingInfo.nextPage)
        ) {
          setPage(currentPagingInfo.nextPage);
        }
      }
    };

    sectionRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      sectionRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  return (
    <VideoGrid
      videos={allVideos}
      loading={isLoading && !fetchedPagesRef.current.has(1)}
      fetching={isFetching && allVideos.length > 0}
    />
  );
}

export default FeedVideos;
