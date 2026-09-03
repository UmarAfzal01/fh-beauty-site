import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

export const metadata = {
  title: 'Bella Beauty',
  description: 'Advanced Aesthetic Medicine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}