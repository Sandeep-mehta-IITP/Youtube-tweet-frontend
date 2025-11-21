import React, { useEffect, useRef, useState } from "react";
import VideoGrid from "@/components/Video/VideoGrid";
import { useGetVideosByOptionQuery } from "@/features/auth/paginationApi";

function FeedVideos() {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  const sectionRef = useRef();
  const fetchedPagesRef = useRef(new Set());
  const dataRef = useRef();

  const { data, isFetching, isLoading, error } = useGetVideosByOptionQuery(
    { page },
    { refetchOnMountOrArgChange: true }
  );

  // Update dataRef for fresh access
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  console.log("Query params:", { page });
  console.log("Full data from API:", {
    hasNextPage: data?.data?.hasNextPage,
    nextPage: data?.data?.nextPage,
    totalDocs: data?.data?.totalDocs,
    docsLength: data?.data?.docs?.length,
    firstDocId: data?.data?.docs?.[0]?._id
  });
  console.log("Error:", error);
  console.log("allVideos state length:", allVideos.length);

  // Merge effect
  useEffect(() => {
    if (!data?.data?.docs) return;

    const docs = data.data.docs;
    if (docs.length === 0) {
      console.log(`Page ${page}: No videos (end of list?)`);
      return;
    }

    if (!fetchedPagesRef.current.has(page)) {
      console.log(`Merging page ${page}: +${docs.length} videos (total will be ${allVideos.length + docs.length})`);
      setAllVideos((prev) => {
        const newVideos = page === 1 ? docs : [...prev, ...docs];
        console.log("New allVideos length:", newVideos.length);
        return newVideos;
      });
      fetchedPagesRef.current.add(page);
    } else {
      console.log(`Page ${page} already fetched, skipping`);
    }
  }, [data]);

  // Scroll effect with dynamic threshold
  useEffect(() => {
    const section = document.getElementById("scrollable_results_screen");
    if (!section) {
      console.warn("Scrollable section not found!");
      return;
    }
    sectionRef.current = section;

    if (page === 1) {
      section.scrollTo({ top: 0, behavior: "smooth" });
    }

    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollHeight = section.scrollHeight;
        const clientHeight = section.clientHeight;
        const scrolledValue = section.scrollTop + clientHeight;
        const buffer = Math.max(100, clientHeight * 0.1);  // Dynamic: 10% of viewport or 100px
        const threshold = scrollHeight - buffer;
        const nearBottom = scrolledValue >= threshold;
        console.log("Scroll check:", { 
          scrolledValue, scrollHeight, clientHeight, buffer, threshold, nearBottom 
        });
        
        if (nearBottom) {
          const latestData = dataRef.current?.data;
          console.log("Latest data in scroll:", { hasNextPage: latestData?.hasNextPage, nextPage: latestData?.nextPage });
          
          if (
            latestData?.hasNextPage &&
            !fetchedPagesRef.current.has(latestData.nextPage)
          ) {
            console.log("🎉 Triggering next page:", latestData.nextPage);
            setPage(latestData.nextPage);
          } else {
            console.log("No next page or already fetched");
          }
        } else {
          console.log("Not near bottom yet – scroll more! (Current progress: ", Math.round((scrolledValue / scrollHeight) * 100), "%)");
        }
      }, 150);
    };

    section.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      section.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // TEMPORARY: Test button for manual load next (remove after fix)
  const loadNextManually = () => {
    const latestData = dataRef.current?.data;
    if (latestData?.hasNextPage && !fetchedPagesRef.current.has(latestData.nextPage)) {
      console.log("Manual trigger: Loading page", latestData.nextPage);
      setPage(latestData.nextPage);
    }
  };

  if (error) {
    return <div className="flex justify-center p-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div>
      <VideoGrid
        videos={allVideos}
        loading={isLoading}
        fetching={isFetching && allVideos.length > 0}
      />
      {/* TEMP: Button for testing – place below grid */}
      {data?.data?.hasNextPage && (
        <button 
          onClick={loadNextManually}
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Load Next (Test)
        </button>
      )}
    </div>
  );
}

export default FeedVideos;