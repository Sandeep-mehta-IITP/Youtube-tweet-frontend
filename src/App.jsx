import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import { Bounce, ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";

import Feed from "./components/Layout/Feed";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./app/Slices/authSlice";
import { healthCheck } from "./app/Slices/healthCheckSlice";
import { Loader } from "lucide-react";
import SupportPage from "./pages/SupportPage";
import FeedVideos from "./pages/FeedVideos";
import GuestComponent from "./components/GuestPages/GuestComponent";
import AuthLayout from "./components/auth/AuthLayout";
import VideoDetails from "./pages/VideoDetails";
import PlaylistVideos from "./components/Playlist/PlaylistVideos";
import ChannelPlaylists from "./components/Playlist/ChannelPlaylists";
import EmptyTweet from "./components/Tweet/EmptyTweet";
import TweetLayout from "./components/Tweet/TweetLayout";
import ChannelTweets from "./components/Tweet/ChannelTweets";
import FeedTweets from "./pages/FeedTweets";
import GuestHistory from "./components/GuestPages/GuestHistory";
import WatchHistory from "./pages/History";
import LikedVideos from "./pages/LikedVideos";
import GuestLikedVideos from "./components/GuestPages/GuestLikedVideos";
import Subscribed from "./components/Subscription/Subscribed";
import GuestMyChannel from "./components/GuestPages/GuestMyChannel";
import Channel from "./pages/Channel";
import GuestTweets from "./components/GuestPages/GuestTweets";

function App() {
  const dispatch = useDispatch();

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(healthCheck()).then(() => {
      dispatch(getCurrentUser()).then(() => {
        setInitialLoading(false);
      });
    });

    const Interval = setInterval(
      () => {
        dispatch(healthCheck());
      },
      5 * 60 * 1000
    );

    return () => clearInterval(Interval);
  }, [dispatch]);

  if (initialLoading) {
    return (
      <div className="h-screen w-full bg-[#121212] text-[#f6f5f6] overflow-y-auto flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 animate-spin font-semibold text-sky-400" />
          <h1 className="text-3xl font-bold mt-8 text-pink-500">
            Please wait....
          </h1>
          <h1 className="text-xl mt-4">
            Refresh the page if it takes too long...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />

      <Routes>
        <Route
          path="/signup"
          element={
            <AuthLayout authentication={false}>
              <SignupPage />
            </AuthLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout authentication={false}>
              <LoginPage />
            </AuthLayout>
          }
        />

        <Route path="/" element={<Feed />}>
          {/* <Route index element={<HomePage />} /> "/" route */}
          {/* More child routes can be added */}
          <Route path="" element={<FeedVideos />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="guest" element={<GuestComponent />} />

          {/* Playlists */}
          <Route path="playlist/:playlistId" element={<PlaylistVideos />} />

          <Route path="/watch/:videoId" element={<VideoDetails />} />

          {/* Home Page Feed Tweets */}
          <Route
            path="feed/tweets"
            element={
              <AuthLayout authentication guestComponent={<GuestTweets />}>
                <FeedTweets />
              </AuthLayout>
            }
          />

          {/* All other channels */}
          <Route path="user/:username" element={<Channel />}>
            <Route
              path="playlists"
              element={<ChannelPlaylists owner={false} />}
            />
            <Route path="tweet" element={<ChannelTweets owner={false} />} />
            <Route path="subscribed" element={<Subscribed owner={false} />} />
          </Route>

          {/* Watch history */}
          <Route
            path="feed/history"
            element={
              <AuthLayout
                authentication={true}
                guestComponent={<GuestHistory />}
              >
                <WatchHistory />
              </AuthLayout>
            }
          />

          {/* Liked videos */}
          <Route
            path="feed/liked-videos"
            element={
              <AuthLayout
                authentication={true}
                guestComponent={<GuestLikedVideos />}
              >
                <LikedVideos />
              </AuthLayout>
            }
          />

          {/* Channel Subscriptions for currently logged in user */}
          <Route
            path="/channel/:username"
            element={
              <AuthLayout authentication guestComponent={<GuestMyChannel />}>
                <Channel owner />
              </AuthLayout>
            }
          >
            <Route path="subscribed" element={<Subscribed owner />} />
            <Route path="playlists" element={<ChannelPlaylists owner />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
