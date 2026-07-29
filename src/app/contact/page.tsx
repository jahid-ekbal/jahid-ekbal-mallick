import { ContactSection } from "@/components/ContactSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Jahid Ekbal Mallick",
  description:
    "Connect with Jahid Ekbal Mallick on social media or send a direct message.",
};

const ContactPage = () => {
  return <ContactSection />;
};

export default ContactPage;
