import { BaseEmail } from "@/emails/layouts/BaseEmail";
import { Header } from "@/emails/components/Header";
import { Footer } from "@/emails/components/Footer";

// Stub — needs real copy before use. Welcome email for new Dream Deferred
// community members/subscribers.
export function Welcome() {
  return (
    <BaseEmail>
      <Header />
      {/* TODO */}
      <Footer />
    </BaseEmail>
  );
}
