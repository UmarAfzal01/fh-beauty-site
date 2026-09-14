import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <SmoothScroll>
            {/* <Header/> */}
            {children}
            <Toaster />
            {/* <Footer/> */}
          </SmoothScroll>
        </SessionProvider>
      </body>
    </html>
  );
}