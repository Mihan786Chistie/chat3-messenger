import { Poppins } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "@/providers/wagmiProvider";
import ReduxProvider from "@/providers/reduxProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "3Chat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReduxProvider>
          <WagmiProvider>{children}</WagmiProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
