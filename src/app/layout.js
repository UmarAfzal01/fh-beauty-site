import Script from "next/script";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { CartProvider } from "@/context/CartContext";
import FloatingCart from "@/components/FloatingCart";
import CartSidebar from "@/components/CartSidebar";
import AppointmentBanner from "@/components/AppointmentBanner";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Script */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2116771122565508');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body>
        {/* Noscript fallback for Meta Pixel */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2116771122565508&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>

        <SessionProvider session={session}>
          <SmoothScroll>
            {/* <Header/> */}
            <CartProvider>
              <CartSidebar />
              {children}
              <AppointmentBanner/>
              <FloatingCart />
            </CartProvider>
            <Toaster />
            {/* <Footer/> */}
          </SmoothScroll>
        </SessionProvider>
      </body>
    </html>
  );
}