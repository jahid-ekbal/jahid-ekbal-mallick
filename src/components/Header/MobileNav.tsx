"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcnui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon">
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-75 sm:w-100">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigation Menu
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col items-center gap-4">
          <SheetClose asChild>
            <Link
              href="/home"
              className="hover:text-primary text-lg font-medium transition-colors">
              Home
            </Link>
            <Link
              href="/projects"
              className="hover:text-primary text-lg font-medium transition-colors">
              Projects
            </Link>
            <Link
              href="/skills"
              className="hover:text-primary text-lg font-medium transition-colors">
              Skills
            </Link>
            <Link
              href="/tweet"
              className="hover:text-primary text-lg font-medium transition-colors">
              Tweet
            </Link>
            <Link
              href="/about"
              className="hover:text-primary text-lg font-medium transition-colors">
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary text-lg font-medium transition-colors">
              Contact
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
