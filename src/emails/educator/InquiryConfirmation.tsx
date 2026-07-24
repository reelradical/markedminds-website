import { BaseEmail } from "@/emails/layouts/BaseEmail";
import { Header } from "@/emails/components/Header";
import { Footer } from "@/emails/components/Footer";

// Stub — needs real copy before use. Sent to an educator confirming an
// inquiry was received (Educator Strategy Consultation, AI-Supported
// Planning Session, Coding Integration Planning Session, etc.).
export function InquiryConfirmation() {
  return (
    <BaseEmail>
      <Header />
      {/* TODO */}
      <Footer />
    </BaseEmail>
  );
}
