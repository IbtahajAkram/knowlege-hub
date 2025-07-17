import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Skill Hub",
  description: "Skills Hub - Your Gateway to Learning and Growth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#EBE7FF] h-full">
          <ToastContainer/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
