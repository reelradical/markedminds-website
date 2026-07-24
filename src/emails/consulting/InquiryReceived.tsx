import { BaseEmail } from "@/emails/layouts/BaseEmail";
import { Header } from "@/emails/components/Header";
import { Footer } from "@/emails/components/Footer";

// Stub — needs real copy before use. Sent confirming a general consulting
// inquiry was received.
export function InquiryReceived() {
  return (
    <BaseEmail>
      <Header />
      {/* TODO */}
      <Footer />
    </BaseEmail>
  );
}
