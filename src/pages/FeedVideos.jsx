import React, { useEffect, useRef, useState } from "react";
import VideoGrid from "@/components/Video/VideoGrid";
import { useGetVideosByOptionQuery } from "@/features/auth/videosApi";

function FeedVideos() {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  
  const sectionRef = useRef();
  const fetchedPagesRef = useRef(new Set());

  const { data, isFetching, isLoading } = useGetVideosByOptionQuery({ page });

  // Merge pages into local state
  useEffect(() => {
    if (data?.videos && !fetchedPagesRef.current.has(page)) {
      setAllVideos(prev => page === 1 ? data.videos : [...prev, ...data.videos]);
      fetchedPagesRef.current.add(page);
    }
  }, [data, page]);

  // Scroll event for infinite scroll
  useEffect(() => {
    sectionRef.current = document.getElementById("scrollable_results_screen");
    sectionRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    const handleScroll = () => {
      const section = sectionRef.current;
      const scrollHeight = section.scrollHeight;
      const scrolledValue = section.clientHeight + section.scrollTop;

      if (scrolledValue + 5 > scrollHeight) {
        const currentPagingInfo = data?.pagingInfo;
        if (currentPagingInfo?.hasNextPage && !fetchedPagesRef.current.has(currentPagingInfo.nextPage)) {
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
