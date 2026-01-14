/**
 * Scrolls all scrollable containers and the window to the top
 * Useful when you need to ensure scroll to top regardless of which element is scrollable
 */
export const scrollToTop = () => {
  // Find all elements with overflow-y auto/scroll and scroll them all
  const allScrollableElements = Array.from(document.querySelectorAll("*")).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.overflowY === "auto" || style.overflowY === "scroll";
  }) as HTMLElement[];

  allScrollableElements.forEach((el) => {
    el.scrollTop = 0;
  });

  // Also scroll window as fallback
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Retry after render to override any browser scroll restoration
  setTimeout(() => {
    allScrollableElements.forEach((el) => {
      el.scrollTop = 0;
    });
    window.scrollTo(0, 0);
  }, 0);

  setTimeout(() => {
    allScrollableElements.forEach((el) => {
      el.scrollTop = 0;
    });
    window.scrollTo(0, 0);
  }, 100);
};
