import { useGetAllVideosQuery } from "@/features/auth/videoApi";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoList from "../Video/VideoList";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search_query") || "";

  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);

  const sectionRef = useRef();
  const fetchedNewRef = useRef(new Set());

  // Fetch current page videos using RTK Query
  const { data, isFetching, isLoading } = useGetAllVideosQuery(
    { search: searchQuery, page, limit: 10 },
    {
      skip: !searchQuery,
    }
  );

  const videos = data?.data?.docs || [];
  const hasNextPage = data?.data?.hasNextPage;

  // reset when search query changes
  useEffect(() => {
    setAllVideos([]);
    setPage(1);
    fetchedNewRef.current = new Set();
  }, [searchQuery]);

  // Append new videos when pages changes
  useEffect(() => {
    if (videos.length && !fetchedNewRef.current.has(page)) {
      setAllVideos((prev) => (page === 1 ? videos : [...prev, ...videos]));
      fetchedNewRef.current.add(page);
    }
  }, [videos, page]);

  // Infinite scrolling handler
  useEffect(() => {
    const section = document.getElementById("scrollable_results_screen");
    if (!section) return;

    const handleScroll = () => {
      const scrollHeight = section.scrollHeight;
      const scrolledValue = section.scrollTop + section.clientHeight;

      if (scrolledValue + 5 > scrollHeight && hasNextPage && !isFetching) {
        setPage((prev) => prev + 1);
      }
    };

    section.addEventListener("scroll", handleScroll);
    return () => section.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetching]);

  console.log("videos in search result", allVideos);
  

  return (
    <div id="scrollable_results_screen">
      <VideoList
        videos={allVideos}
        loading={isLoading && page === 1}
        fetching={isFetching && allVideos.length > 0}
      />
    </div>
  );
};

export default SearchResult;
