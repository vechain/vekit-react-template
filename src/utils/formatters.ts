import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { BLOCK_TIME_IN_SECONDS } from "./constants";

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(duration);

/**
 * Utility functions for formatting data using day.js and Intl.NumberFormat
 */

// Number formatters
const numberFormatter = new Intl.NumberFormat("en-US");

/**
 * Format a number with commas as thousands separators using Intl.NumberFormat
 * @param num - Number or string to format
 * @returns Formatted string with commas
 */
export const formatWithCommas = (num: string | number): string => {
  const value = Number(num);
  if (isNaN(value)) return "0";
  return numberFormatter.format(value);
};

/**
 * Convert blocks to seconds
 * @param blocks - Number of blocks to convert
 * @returns Number of seconds equivalent to the given blocks
 */
export const blocksToSeconds = (blocks: number): number => {
  return blocks * BLOCK_TIME_IN_SECONDS;
};

/**
 * Format a duration in milliseconds to a human readable string using day.js
 * @param durationMs - Duration in milliseconds (string or number)
 * @param abbreviate - Whether to abbreviate the units
 * @returns Formatted string like "2 days", "3 hours", "45 minutes" or "2d 3h 45m"
 */
export const formatDuration = (
  durationMs: string | number,
  abbreviate: boolean = false
): string => {
  const ms = Number(durationMs);
  if (isNaN(ms) || ms <= 0) return `${abbreviate ? "0s" : "0 seconds"}`;

  const duration = dayjs.duration(ms);

  if (duration.asYears() >= 1) {
    const years = Math.ceil(duration.asYears());
    return `${years}${abbreviate ? "y" : ` year${years === 1 ? "" : "s"}`}`;
  }

  if (duration.asMonths() >= 1) {
    const months = Math.ceil(duration.asMonths());
    return `${months}${abbreviate ? "mo" : ` month${months === 1 ? "" : "s"}`}`;
  }

  if (duration.asDays() >= 1) {
    const days = Math.ceil(duration.asDays());
    return `${days}${abbreviate ? "d" : ` day${days === 1 ? "" : "s"}`}`;
  }

  if (duration.asHours() >= 1) {
    const hours = Math.ceil(duration.asHours());
    return `${hours}${abbreviate ? "h" : ` hour${hours === 1 ? "" : "s"}`}`;
  }

  if (duration.asMinutes() >= 1) {
    const minutes = Math.ceil(duration.asMinutes());
    return `${minutes}${abbreviate ? "m" : ` minute${minutes === 1 ? "" : "s"}`}`;
  }

  const seconds = Math.ceil(duration.asSeconds());
  return `${seconds}${abbreviate ? "s" : ` second${seconds === 1 ? "" : "s"}`}`;
};

/**
 * Formats a duration in milliseconds to a human readable string that includes two units.
 * e.g. "5d 14h", "1h 56m", "34m 12s"
 * @param durationMs - Duration in milliseconds (string or number)
 * @returns Formatted string with the two largest non-zero units
 */
export const formatDurationWithNextUnit = (durationMs: string | number): string => {
  const ms = Number(durationMs);
  if (isNaN(ms) || ms <= 0) return "0s";

  const duration = dayjs.duration(ms);

  const units = [
    { label: "y", value: duration.years() },
    { label: "mo", value: duration.months() },
    { label: "d", value: duration.days() },
    { label: "h", value: duration.hours() },
    { label: "m", value: duration.minutes() },
    { label: "s", value: Math.floor(duration.seconds()) },
  ];

  // Pick the first two non-zero units
  const result: string[] = [];
  for (const { label, value } of units) {
    if (value > 0) {
      result.push(`${value}${label}`);
      if (result.length === 2) break;
    }
  }

  // If less than 2 units, pad with the next smallest
  if (result.length === 1) {
    // find the next non-zero or zero unit after the first
    const firstIdx = units.findIndex((u) => `${u.value}${u.label}` === result[0]);
    for (let i = firstIdx + 1; i < units.length; i++) {
      result.push(`${units[i].value}${units[i].label}`);
      break;
    }
  }

  // If all are zero, return "0s"
  if (result.length === 0) {
    return "0s";
  }

  return result.join(" ");
};

/**
 * Format a duration in seconds to a human readable string using day.js
 * @param durationSeconds - Duration in seconds (string or number)
 * @returns Formatted string like "in 2 days", "in 3 hours", "in 45 minutes"
 */
export const formatDurationSeconds = (
  durationSeconds: string | number,
  abbreviate: boolean = false
): string => {
  const seconds = Number(durationSeconds);
  return formatDuration(seconds * 1000, abbreviate);
};

/**
 * Abbreviate a number with k, M or B suffix using Intl.NumberFormat
 * @param amount - Number or string to abbreviate
 * @returns Abbreviated string like "1k", "3.2M" or "1.5B"
 */
export const abbreviateAmount = (amount: number | string, decimals = 1): string => {
  const num = Number(amount);

  if (isNaN(num) || Number(num) === 0) return "0";

  if (Math.abs(num) < 10 ** -decimals) {
    return "<0." + "0".repeat(decimals - 1) + "1";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(num);
};

/**
 * Convert timestamp to formatted date string
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted date string in DD/MM/YYYY, HH:mm format
 */
const timestampToDate = (timestamp: number, showHours: boolean = true): string => {
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const dateWithoutHours = `${day}/${month}/${year}`;
  if (showHours) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${dateWithoutHours}, ${hours}:${minutes}:${seconds}`;
  }
  return dateWithoutHours;
};

/**
 * Convert timestamp in seconds to formatted date string
 * @param timestampSeconds - Timestamp in seconds
 * @returns Formatted date string in DD/MM/YYYY, HH:mm format
 */
export const timestampSecondsToDate = (
  timestampSeconds: number,
  showHours: boolean = true
): string => {
  return timestampToDate(timestampSeconds * 1000, showHours);
};

/**
 * Returns time elapsed since a timestamp in ms, in friendly english using Intl.RelativeTimeFormat
 * @param timestamp - timestamp in ms
 * @returns Human readable elapsed time, e.g. "2 hours ago", "just now"
 */
export const timeSince = (timestamp: number): string => {
  const now = Date.now();
  let diffMs = now - timestamp;

  if (isNaN(diffMs)) return "";

  // Handle future timestamps
  if (diffMs < 0) diffMs = 0;

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return rtf.format(-seconds, "second");

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, "minute");

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");

  const days = Math.floor(hours / 24);
  if (days < 7) return rtf.format(-days, "day");

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return rtf.format(-weeks, "week");

  const months = Math.floor(days / 30.44);
  if (months < 12) return rtf.format(-months, "month");

  const years = Math.floor(days / 365.25);
  return rtf.format(-years, "year");
};

/**
 * Returns the number of seconds that have passed since the given timestamp (in seconds).
 * @param timestampSeconds - timestamp in seconds
 * @returns Number of seconds elapsed since the timestamp
 */
export const secondsSinceTimestamp = (timestampSeconds: number): number => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds - timestampSeconds;
};

export const onKeyDownNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
    ",",
  ];

  if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key) && !(e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
};
