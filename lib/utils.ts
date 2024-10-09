import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A utility function for logging debug information in development environments.
 * 
 * This function logs messages to the console, but only when the application
 * is running in a development environment. It's useful for debugging and
 * tracking application flow without cluttering production logs.
 * 
 * @param {string} name - The name or identifier for the debug message.
 *                        This could be a component name, function name,
 *                        or any string that helps identify where the debug
 *                        message is coming from.
 * 
 * @param {string} event - The actual debug message or event description.
 *                         This should contain the information you want to log.
 * 
 * @example
 * // Usage in a component
 * debug("UserProfile", "Fetching user data");
 * 
 * @example
 * // Usage in a function
 * debug("calculateTotalPrice", `Input values: ${price}, ${quantity}`);
 * 
 * @returns {void}
 * 
 * @remarks
 * - This function only logs messages when NODE_ENV is set to 'development'.
 * - In production builds, this function will not output anything, ensuring
 *   no debug messages are accidentally exposed in production environments.
 * - The output format is: "<name>: <event>"
 */
export function debug(name: string, event: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name}: ${event}`);
  }
}