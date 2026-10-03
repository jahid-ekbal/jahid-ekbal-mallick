"use client";

import { useState } from "react";
import { Loader2, Printer } from "lucide-react";

import { Button } from "@/components/shadcnui/button";

const ResumePrintButton = () => {
  const [printing, setPrinting] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      className="print:hidden"
      disabled={printing}
      onClick={() => {
        setPrinting(true);
        setTimeout(() => {
          window.print();
          setPrinting(false);
        }, 300);
      }}>
      Print / Save PDF
      {printing ?
        <Loader2
          data-icon="inline-end"
          className="animate-spin"
        />
      : <Printer
          data-icon="inline-end"
          className="transition-transform duration-200 group-hover/button:not-disabled:scale-110"
        />
      }
    </Button>
  );
};

export default ResumePrintButton;
