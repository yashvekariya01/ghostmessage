'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-black text-white selection:bg-white selection:text-black">
        <section className="text-center mb-12 md:mb-20 space-y-6">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter lg:leading-[1.1]">
            Dive into the World of <br className="hidden md:block" /> 
            <span className="text-zinc-500">Anonymous Feedback</span>
          </h1>
          <p className="max-w-[600px] mx-auto text-zinc-400 text-lg md:text-xl font-medium tracking-tight">
            ghostmessage — Where your identity remains a secret, and your voice is heard.
          </p>
          <div className="flex justify-center pt-4">
             <Link href="/sign-up">
                <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-8 py-6 rounded-full text-lg active:scale-95 transition-all">
                    Get Started
                </Button>
             </Link>
          </div>
        </section>

        {/* Carousel for Messages */}
        <div className="w-full max-w-lg md:max-w-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
            <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
            >
            <CarouselContent>
                {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4 md:basis-1/2 lg:basis-1/1">
                    <Card className="bg-zinc-950 border-zinc-800 backdrop-blur-sm h-full">
                    <CardHeader>
                        <CardTitle className="text-xl text-white font-bold tracking-tight">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                                <Mail className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-zinc-300 leading-relaxed">{message.content}</p>
                                <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                                    {message.received}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    </Card>
                </CarouselItem>
                ))}
            </CarouselContent>
            </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-8 md:p-12 bg-black border-t border-zinc-900 text-zinc-500 text-sm font-medium tracking-tight">
        © 2026 <span className="text-white">ghostmessage</span>. Crafted with precision.
      </footer>
    </>
  );
}
