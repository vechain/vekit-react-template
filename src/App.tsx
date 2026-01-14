import { Box, Container, VStack, Spinner, Center } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RouteType, ROUTES } from "./utils/routes";
import { useAnalytics } from "@/hooks";
import { Suspense } from "react";
import { useKitLanguageSync } from "./hooks/useKitLanguageSync";

const AppContent = () => {
  useKitLanguageSync();

  // Initialize analytics
  useAnalytics();

  return (
    <Container maxW="container.lg" flex="1">
      <VStack align="stretch" gap={4} py={8}>
        <Suspense
          fallback={
            <Center minH="50vh">
              <Spinner size="xl" />
            </Center>
          }
        >
          <Routes>
            {ROUTES.map((route: RouteType) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </VStack>
    </Container>
  );
};

const App = () => {
  return (
    <Box h="full">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Box>
  );
};

export default App;
