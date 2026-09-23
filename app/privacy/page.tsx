import { RetroBox, RetroShell } from "@/components/KlypRetro";

export default function PrivacyPage() {
  return (
    <RetroShell title="Privacy" subtitle="how data works">
      <RetroBox title="Privacy Policy">
        <div className="space-y-3 leading-6">
          <p>
            Klyp stores the account and profile details you provide, including your
            username, display name, posts, friendships, and messages.
          </p>
          <p>
            Your login is handled through Supabase Auth. Do not share your password
            with anyone.
          </p>
          <p>
            Posts may be visible to other users depending on how the app is set up.
            Private messages should only be visible to the people in the conversation.
          </p>
        </div>
      </RetroBox>
    </RetroShell>
  );
}
