import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Care.IO",
  description: "Trusted Baby & Elderly Care Service Platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Toaster position="top-right" reverseOrder={false} />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
