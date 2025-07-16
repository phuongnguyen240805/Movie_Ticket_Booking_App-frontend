import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ClerkProvider } from '@clerk/clerk-react';

import App from './App';
import { routesConfig } from './configs';
import GlobalStyle from './components/GlobalStyle';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={routesConfig.homePage}>
      <BrowserRouter>
        <GlobalStyle>
          <App />
        </GlobalStyle>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
