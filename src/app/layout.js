import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Bella Beauty',
  description: 'Advanced Aesthetic Medicine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <Header/>
          {children}
          <Footer/>
        </SmoothScroll>
      </body>
    </html>
  );
}