import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "../../components/Navbar"
export default function Page({children}) {
    return (
        <>
            {/* <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}> */}
        
        <Navbar/>
         {children}
        {/* </ClerkProvider> */}
        </>
    );
}