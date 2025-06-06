import { Poppins } from "next/font/google";
import "./globals.css";
const poppins = Poppins({
  variable: "poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Store It",
  description: "A web application for managing files and storage usage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
