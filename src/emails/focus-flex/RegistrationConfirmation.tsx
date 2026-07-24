import { BaseEmail } from "@/emails/layouts/BaseEmail";
import { Header } from "@/emails/components/Header";
import { Footer } from "@/emails/components/Footer";

// Stub — needs real copy before use. Sent to a parent/family confirming
// Focus + FLEX Academy registration.
export function RegistrationConfirmation() {
  return (
    <BaseEmail>
      <Header />
      {/* TODO */}
      <Footer />
    </BaseEmail>
  );
}
