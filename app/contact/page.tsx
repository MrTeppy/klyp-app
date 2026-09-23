import { RetroBox, RetroShell } from "@/components/KlypRetro";

export default function ContactPage() {
  return (
    <RetroShell title="Contact" subtitle="get in touch">
      <div className="grid gap-2 md:grid-cols-[1fr_240px]">
        <RetroBox title="Contact Klyp">
          <p className="mb-3 leading-6">
            For now, contact is simple: message the creator or report issues through
            the profile report button once it is fully wired in.
          </p>
          <p className="leading-6">
            If something breaks, screenshot the error and send it over.
          </p>
        </RetroBox>

        <RetroBox title="Bug reports">
          <p className="leading-5">
            Include the page, what you clicked, and the exact error message.
          </p>
        </RetroBox>
      </div>
    </RetroShell>
  );
}
