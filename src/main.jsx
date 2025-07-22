import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ClerkProvider } from '@clerk/clerk-react';

import App from './App';
import { routesConfig } from './configs';
import GlobalStyle from './components/GlobalStyle';
import ScrollToTop from './components/ScrollToTop'; // tự cuộn top khi thay đổi đường dẫn
import { AppProvider } from './context/AppContext';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={routesConfig.homePage}>
      <BrowserRouter>
        <AppProvider>
          <GlobalStyle>
            <ScrollToTop />
            <App />
          </GlobalStyle>
        </AppProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
