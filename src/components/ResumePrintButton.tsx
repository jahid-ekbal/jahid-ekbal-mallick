"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/shadcnui/button";

const ResumePrintButton = () => (
  <Button
    variant={"outline"}
    size={"sm"}
    className="print:hidden"
    onClick={() => window.print()}>
    Print / Save PDF <Printer data-icon="inline-end" />
  </Button>
);

export default ResumePrintButton;
