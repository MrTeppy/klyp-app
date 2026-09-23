import { RetroBox, RetroShell } from "@/components/KlypRetro";

export default function TermsPage() {
  return (
    <RetroShell title="Terms" subtitle="basic rules">
      <RetroBox title="Terms of Use">
        <div className="space-y-3 leading-6">
          <p>
            By using Klyp, you agree not to abuse the site, spam people, harass
            users, impersonate others, or post anything illegal.
          </p>
          <p>
            You are responsible for what you post. Klyp can remove accounts or
            content that breaks the rules.
          </p>
          <p>
            This is an early version of the site, so features may change as the
            app improves.
          </p>
        </div>
      </RetroBox>
    </RetroShell>
  );
}
