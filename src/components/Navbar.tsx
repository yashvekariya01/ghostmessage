'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;

  return (
    <nav className="p-4 md:p-6 border-b border-zinc-800 bg-black/80 backdrop-blur-md text-white sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="text-2xl font-extrabold tracking-tighter mb-4 md:mb-0">
          ghostmessage
        </a>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm font-medium">
              Welcome, <span className="text-white">{user.username || user.email}</span>
            </span>
            <Button 
                onClick={() => signOut()} 
                variant="outline"
                className="w-full md:w-auto border-zinc-800 hover:bg-zinc-900 active:scale-95 transition-all"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" className="w-full md:w-auto border-zinc-800 hover:bg-zinc-900 active:scale-95 transition-all">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
