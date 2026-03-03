import { Inter, Fira_Code } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

/* Global styles */
import '@/styles/global.css';

/* Layout */
import '@/components/Layout/Layout.css';

/* Component styles */
import '@/components/Header/Header.css';
import '@/components/Footer/Footer.css';
import '@/components/Logo/Logo.css';
import '@/components/UserMenu/UserMenu.css';
import '@/components/CodeBlock/CodeBlock.css';
import '@/components/DailyQuiz/DailyQuiz.css';
import '@/components/Navigation/Navigation.css';
import '@/components/ProgressBar/ProgressBar.css';
import '@/components/ProtectedRoute/ProtectedRoute.css';

/* Page styles */
import '@/views/Home/Home.css';
import '@/views/Login/Login.css';
import '@/views/Register/Register.css';
import '@/views/Profile/Profile.css';
import '@/views/PlaywrightBasics/PlaywrightBasics.css';
import '@/views/TypeScriptBasics/TypeScriptBasics.css';
import '@/views/POM/POM.css';
import '@/views/K6/K6.css';
import '@/views/Postman/Postman.css';
import '@/views/QACI/QACI.css';
import '@/views/News/News.css';
import '@/views/AIEval/AIEval.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://tsplaywrightsite.vercel.app'),
  title: {
    default: 'Playwright & TypeScript Academy',
    template: '%s | Playwright & TS Academy',
  },
  description: 'Learn Playwright & TypeScript test automation from zero to enterprise-level. Complete guide with Page Object Model, best practices, and real examples.',
  openGraph: {
    type: 'website',
    title: 'Playwright & TypeScript Academy',
    description: 'Master test automation with structured learning paths. Learn Playwright, TypeScript, and Page Object Model with daily challenges and real-world examples.',
    url: 'https://tsplaywrightsite.vercel.app',
    siteName: 'Playwright & TypeScript Academy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playwright & TypeScript Academy',
    description: 'Master test automation with structured learning paths.',
    images: ['/og-image.png'],
  },
  other: {
    'impact-site-verification': 'cbd5ae50-782e-4283-8bb6-aa2c709a0953',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body>
        <AuthProvider>
          <div className="layout">
            <Header />
            <main className="layout__main">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
