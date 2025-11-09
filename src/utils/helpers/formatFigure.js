// Time stamp format
export const formatTimestamp = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
};


// video ki duration ko ek user friendly timing me format krna
export const formatVideoDuration = (duration) => {
  let totalSeconds = Math.floor(duration);

  // let seconds = totalSeconds % 60 < 9 ? "0" + (totalSeconds % 60) : totalSeconds % 60
  let seconds = String(totalSeconds % 60).padStart(2, "0");
  let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  let hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
};


// date ko format krna -> DD / MM / YYYY
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const days = date.getDate();
  const months = date.getMonth() + 1;

  const day = String(days).padStart(2, "0");
  const month = String(months).padStart(2, "0");

  return `${day}/${month}/${date.getFullYear()}`;
};


// word -> Subscriber, Like, Comment, Tweet ko singular and plural me format krna
export const formatCount = (count, str = "Subscriber") => {
  if (count === 0) {
    return `No ${str.toLowerCase()}s yet`;
  }

  const word = count === 1 ? str : str + "s";

  return `${count} ${word}`;
};


export const formatDateFigure = (dateObj) => {
  if (!dateObj) return "";

  // If it's an object like {date, month, year}
  if (typeof dateObj === "object" && dateObj.date && dateObj.month && dateObj.year) {
    const { date, month, year } = dateObj;

    // Convert numeric month to readable name (e.g. 11 -> Nov)
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthName = monthNames[month - 1] || month;

    return `${date} ${monthName} ${year}`;
  }

  // Otherwise if it's a string (ISO date)
  const d = new Date(dateObj);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};