import { permanentRedirect } from "next/navigation";

// Programs content has been consolidated into the broader Our Work
// portfolio page as part of the Marked Minds brand repositioning.
export default function ProgramsPage() {
  permanentRedirect("/our-work");
}
