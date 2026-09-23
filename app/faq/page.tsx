import { RetroBox, RetroShell } from "@/components/KlypRetro";

export default function FAQPage() {
  return (
    <RetroShell title="FAQ" subtitle="quick answers">
      <RetroBox title="Frequently Asked Questions">
        <div className="space-y-3 leading-6">
          <div>
            <strong>What is Klyp?</strong>
            <br />
            A music social app where posts are built around songs, captions, and memories.
          </div>

          <div>
            <strong>Can I post without a song?</strong>
            <br />
            Yes. You can post a caption, image, song, or all three.
          </div>

          <div>
            <strong>Where do song previews come from?</strong>
            <br />
            The song search uses Apple/iTunes preview links.
          </div>

          <div>
            <strong>Can I message people?</strong>
            <br />
            Yes, the messages page is being built around friend conversations.
          </div>
        </div>
      </RetroBox>
    </RetroShell>
  );
}
