import { redirect } from "next/navigation";

// The prototype is a single self-contained file living in /public.
// This route just gives it a clean URL: /prototype -> /prototype.html
export function GET() {
  redirect("/prototype.html");
}
