import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./ThemeToggler";

const Header = () => {
    return (
        <header className="flex justify-between items-center p-2 sticky top-0 left-0 dark:bg-black/80 bg-white/80 backdrop-blur-sm z-50 border-b">
            <Link href="/" className="flex items-center space-x-2">
                <div className="w-fit">
                    <Image
                        src="https://www.shareicon.net/download/128x128//2015/09/21/644087_arrow_512x512.png"
                        alt="logo"
                        className="dark:invert p-2"
                        height={50}
                        width={50}
                    />
                </div>
                <h1 className="font-bold text-xl">Upload</h1>
            </Link>
            {/* Theme Toggler */}
            <div className="px-5 flex space-x-2 items-center">
                <ThemeToggle />
                <UserButton />
                <SignedOut>
                    <SignInButton mode="modal">
                        Sign In
                    </SignInButton>
                </SignedOut>
            </div>
        </header>
    );
};

export default Header;
