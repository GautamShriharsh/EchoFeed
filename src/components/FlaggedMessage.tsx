import { ShieldAlert, Eye } from "lucide-react";
import { Button } from "./ui/button";

type FlaggedMessageProps = {
  category?: string;
  onReveal: () => void;
};

function formatCategory(category?: string) {
  if (!category) return "Flagged Content";
  return category
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default function FlaggedMessage({
  category,
  onReveal,
}: FlaggedMessageProps) {
  return (
    <div className="w-full p-0 mt-1.5">
      {/* Top Header Row: Badge & Category */}
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-red-400 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
            AI Moderated
          </span>
        </div>

        <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-300 border border-red-500/20">
          {formatCategory(category)}
        </span>
      </div>

      {/* Description — Added text-center */}
      <p className="text-sm text-gray-400 leading-relaxed text-center">
        This message was hidden because it was flagged for potential violations.
      </p>

      {/* Action Button — Removed pr-6 for true center alignment */}
      <div className="flex items-center justify-center w-full">
        <Button
          onClick={onReveal}
          size="sm"
          variant="ghost"
          className="
            h-8 px-4
            w-50
            text-red-200 hover:text-white
            hover:cursor-pointer
            bg-transparent hover:bg-transparent 
            text-sm font-medium 
            transition-all duration-200 
            flex items-center justify-center gap-1
            mt-0
          "
        >
          <Eye className="h-3.5 w-3.5" />
          Reveal anyway
        </Button>
      </div>
    </div>
  );
}