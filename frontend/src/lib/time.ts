function humanizeDateRelative(date: Date | string | number): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4)
    return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
}
function humanizeDate(
  date: Date | string | number,
  includeTime: boolean = false
): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long", // Use 'short' for "Oct" instead of "October"
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "numeric";
    options.minute = "numeric";
    options.hour12 = true; // To display in 12-hour format with AM/PM
  }

  const targetDate = new Date(date);
  return targetDate.toLocaleDateString("en-US", options);
}

export { humanizeDateRelative, humanizeDate };
