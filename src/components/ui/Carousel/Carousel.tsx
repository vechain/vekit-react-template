import { themeColors } from "@/theme/colors";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { useRef, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { useBreakpointValue } from "@/hooks";

const PaginationButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  children: ReactNode;
}) => {
  return (
    <Text
      as="span"
      height="32px"
      width="32px"
      aspectRatio="1/1"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={themeColors.toggle.background}
      border="1px solid"
      borderColor={themeColors.toggle.border}
      color={isActive ? "text.primary" : "text.secondary"}
      borderRadius="full"
      onClick={isActive ? onClick : undefined}
      cursor={isActive ? "pointer" : "auto"}
      _hover={{
        bg: isActive ? "background.primary" : "toggle.background",
      }}
      userSelect="none"
    >
      {children}
    </Text>
  );
};

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemWidth?: number;
  itemSpacing?: number;
  onItemClick?: (index: number, e?: React.MouseEvent) => void;
  onSelectItem?: (item: T) => void;
  wideMode?: boolean;
  blurSideItems?: boolean;
  isMobile?: boolean;
}

export const Carousel = <T,>({
  items,
  renderItem,
  itemWidth = 300,
  itemSpacing = 0,
  onItemClick,
  onSelectItem,
  wideMode = true,
  blurSideItems = true,
  isMobile: _isMobile,
}: CarouselProps<T>) => {
  const breakpointValue = useBreakpointValue({ base: true, md: false });
  const isMobile = _isMobile ?? breakpointValue;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTimeout, setTransitionTimeout] = useState<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(null);
  const [clickedOnButton, setClickedOnButton] = useState(false);
  const [clickedEvent, setClickedEvent] = useState<React.MouseEvent | null>(null);

  // Helper function to handle smooth index transitions
  const updateActiveIndex = useCallback(
    (newIndex: number, instant = false) => {
      if (instant) {
        setActiveIndex(newIndex);
        return;
      }

      setIsTransitioning(true);

      // Clear any existing timeout
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
      }

      // Set a timeout to match the scroll animation duration
      const timeout = setTimeout(() => {
        setActiveIndex(newIndex);
        setIsTransitioning(false);
      }, 300); // Match the scroll animation duration

      setTransitionTimeout(timeout);
    },
    [transitionTimeout]
  );

  const virtualItems = items;

  // Calculate the total width needed to allow the last item to be centered
  const totalWidth =
    items.length === 1
      ? "100%" // Full width when there's only one item
      : isMobile || wideMode
        ? `${items.length * itemWidth + (items.length - 1) * itemSpacing}px`
        : `${
            items.length * itemWidth + (items.length - 1) * itemSpacing + (itemWidth + itemSpacing)
          }px`;

  const cardMargin = useMemo(() => {
    if (blurSideItems) {
      return `calc((100% - ${itemWidth}px) / 2)`;
    }
    return 0;
  }, [blurSideItems, itemWidth]);

  const paginationDotsCount = useMemo(() => {
    return items.length - (isMobile || blurSideItems ? 0 : 2);
  }, [items.length, isMobile, blurSideItems]);

  const hidePagination = useMemo(() => {
    return !isMobile && paginationDotsCount < 2;
  }, [isMobile, paginationDotsCount]);

  // Technically with 256px maxWidth, the max is 28 dots
  // But we'll use 20 to be safe (edge case)
  const MAX_MOBILE_PAGINATION_DOTS = 20;

  const paginationDotsMapping = () => {
    if (isMobile && paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS) return null;
    return Array.from({ length: paginationDotsCount }).map((_, index) => (
      <Box
        key={index}
        width="full"
        height="4px"
        borderRadius="full"
        bg={index === activeIndex ? "white" : "#FFFFFF1A"}
        mx={1}
        cursor="pointer"
        onClick={() => scrollToItem(index)}
        transition="background-color 0.3s ease"
        _hover={{ bg: index === activeIndex ? "white" : "#FFFFFFA0" }}
        hidden={isMobile && paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS}
      />
    ));
  };

  // Function to scroll to a specific item (no wrap-around)
  const scrollToItem = (index: number) => {
    if (!carouselRef.current || items.length <= 1) return;

    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    const scrollPosition = clampedIndex * (itemWidth + itemSpacing);

    carouselRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
    setTimeout(() => {
      updateActiveIndex(clampedIndex);
      onSelectItem?.(items[clampedIndex]);
    }, 0);
  };

  // Detect which item is visible when scrolling
  const handleScroll = useCallback(() => {
    if (!carouselRef.current || items.length <= 1 || isDragging) return;

    const scrollPosition = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollPosition / (itemWidth + itemSpacing));
    const clampedIndex = Math.max(0, Math.min(newIndex, items.length - 1));

    if (clampedIndex !== activeIndex && !isTransitioning) {
      updateActiveIndex(clampedIndex, true);
      onSelectItem?.(items[clampedIndex]);
    }
  }, [
    itemWidth,
    itemSpacing,
    activeIndex,
    items,
    onSelectItem,
    isDragging,
    isTransitioning,
    updateActiveIndex,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;

    // Check if the click was on a button or inside a button
    const target = e.target as HTMLElement;
    const isButton = target.closest("button") !== null;
    setClickedOnButton(isButton);

    // If clicking on a button, don't start drag detection
    if (isButton) {
      return;
    }

    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
    setDragDistance(0);

    // Store the clicked item index and event if clicking on an item
    const itemElement = target.closest("[data-item-index]");
    if (itemElement) {
      const index = parseInt(itemElement.getAttribute("data-item-index") || "-1", 10);
      setClickedItemIndex(index);
      setClickedEvent(e);
    } else {
      setClickedItemIndex(null);
      setClickedEvent(null);
    }

    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isMobile) return;

    // If the initial mouseDown was on a button, don't trigger carousel click
    if (clickedOnButton) {
      setClickedOnButton(false);
      setClickedItemIndex(null);
      setClickedEvent(null);
      return;
    }

    // If the user didn't drag more than 3 pixels and we have a clicked item, trigger the click
    if (dragDistance <= 3 && clickedItemIndex !== null && onItemClick) {
      onItemClick(clickedItemIndex, clickedEvent || undefined);
      // Don't snap to nearest item when a click is detected to prevent interference
      setIsDragging(false);
      setClickedItemIndex(null);
      setClickedEvent(null);
      return;
    }

    setIsDragging(false);
    setClickedItemIndex(null);
    setClickedEvent(null);

    // Snap to nearest item only when not clicking
    if (carouselRef.current && items.length > 1) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / (itemWidth + itemSpacing));
      scrollToItem(newIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isMobile || !carouselRef.current || items.length <= 1) return;

    const x = e.pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    let newScrollLeft = scrollLeft - walk;

    // Get the current scroll boundaries
    const viewWidth = carouselRef.current.clientWidth;
    const maxScroll = carouselRef.current.scrollWidth - viewWidth;

    // Clamp within bounds (no infinite wrapping)
    if (newScrollLeft < 0) newScrollLeft = 0;
    if (newScrollLeft > maxScroll) newScrollLeft = maxScroll;

    carouselRef.current.scrollLeft = newScrollLeft;

    // Track the drag distance
    const currentDistance = Math.abs(x - startX);
    setDragDistance(currentDistance);

    e.preventDefault();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setClickedItemIndex(null);
      setClickedOnButton(false);
      setClickedEvent(null);

      // Snap to nearest item when mouse leaves
      if (carouselRef.current && items.length > 1) {
        const scrollPosition = carouselRef.current.scrollLeft;
        const newIndex = Math.round(scrollPosition / (itemWidth + itemSpacing));
        scrollToItem(newIndex);
      }
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex, handleScroll, items.length]);

  // Ensure initial position is at the start
  useEffect(() => {
    if (carouselRef.current && items.length > 1) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [items.length]);

  // Cleanup transition timeout
  useEffect(() => {
    return () => {
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
      }
    };
  }, [transitionTimeout]);

  // Call onSelectItem for initial item
  useEffect(() => {
    if (items.length > 0) {
      onSelectItem?.(items[activeIndex]);
    }
  }, [activeIndex, items, onSelectItem]);

  // Calculate item styles based on distance from active index
  const getItemStyles = (index: number) => {
    const distance = Math.abs(index - activeIndex);

    if (distance === 0 || !blurSideItems) {
      return {
        transform: "scale(1)",
        filter: "blur(0)",
        opacity: 1,
        zIndex: 2,
      };
    } else {
      return {
        transform: "scale(0.85)",
        filter: "blur(4px)",
        opacity: 0.6,
        zIndex: 0,
      };
    }
  };

  return (
    <Flex direction="column" width="full" align="center">
      <Box
        ref={carouselRef}
        overflowX="auto"
        width="full"
        maxWidth={"100%"}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          cursor: !isMobile ? (isDragging ? "grabbing" : "grab") : "default",
          userSelect: "none",
        }}
        px={5}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Flex
          direction="row"
          justifyContent={!isMobile && items.length <= 3 ? "center" : "flex-start"}
          pb={hidePagination ? 0 : 2}
          width={!isMobile && items.length <= 3 ? "100%" : totalWidth}
          position="relative"
          ml={cardMargin}
          mr={cardMargin}
          pointerEvents={isDragging ? "none" : "auto"}
        >
          {virtualItems.map((item, itemIndex) => {
            const styles = getItemStyles(itemIndex);
            return (
              <Box
                key={itemIndex}
                minWidth={items.length === 1 ? "100%" : `${itemWidth}px`}
                maxWidth={items.length === 1 ? "100%" : `${itemWidth}px`}
                mr={itemIndex < items.length - 1 ? `${itemSpacing}px` : 0}
                data-item-index={itemIndex}
                onClick={isMobile && onItemClick ? () => onItemClick(itemIndex) : undefined}
                cursor={onItemClick ? "pointer" : "default"}
                style={styles}
                transition="all 0.3s ease-in-out"
                justifyItems={items.length === 1 ? "center" : "flex-start"}
                _hover={{
                  transform:
                    !isDragging && styles.transform.replace("scale(", "scale(") === "scale(1)"
                      ? "scale(1.05)"
                      : styles.transform,
                }}
              >
                {renderItem(item, itemIndex)}
              </Box>
            );
          })}
        </Flex>
      </Box>

      <HStack
        hidden={hidePagination}
        alignItems="center"
        justifyContent="center"
        w="full"
        gap={2}
        mt={{ base: 4, md: 2 }}
        px={4}
      >
        <PaginationButton onClick={() => scrollToItem(activeIndex - 1)} isActive={activeIndex > 0}>
          ←
        </PaginationButton>
        {/* Pagination Dots */}
        <Flex
          justify="center"
          maxWidth={{
            base: "256px",
            md: paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS ? "full" : "256px",
          }}
          w="full"
        >
          {paginationDotsMapping()}
        </Flex>
        <PaginationButton
          onClick={() => scrollToItem(activeIndex + 1)}
          isActive={activeIndex < paginationDotsCount - 1}
        >
          →
        </PaginationButton>
      </HStack>
    </Flex>
  );
};
