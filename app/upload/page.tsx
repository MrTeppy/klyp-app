export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[#f4efe8] px-4 py-6 text-[#111]">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="tracking-[0.4em] text-sm font-semibold text-[#9b7a4d]">
              KLYP
            </p>
            <h1 className="mt-2 font-serif text-5xl italic">new memory</h1>
          </div>

          <a
            href="/feed"
            className="rounded-full bg-[#111] px-4 py-2 text-sm text-white"
          >
            Cancel
          </a>
        </header>

        <section className="rounded-[32px] border border-[#e0d6ca] bg-[#fffaf3] p-5 shadow-[0_18px_45px_rgba(55,39,20,0.10)]">
          <label className="mb-5 flex h-72 cursor-pointer flex-col items-center justify-center rounded-[26px] border border-dashed border-[#c9b89f] bg-[#f7efe5] text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#111] text-2xl text-[#d7a96b]">
              +
            </div>
            <p className="text-lg font-semibold">Add photos</p>
            <p className="mt-1 text-sm text-[#74695f]">
              choose the moment you want to klyp
            </p>
            <input type="file" className="hidden" multiple accept="image/*" />
          </label>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6d6258]">
                Caption
              </label>
              <textarea
                placeholder="late night drives hit different..."
                className="h-28 w-full resize-none rounded-2xl border border-[#e0d6ca] bg-[#fdf8f0] p-4 font-serif text-xl outline-none placeholder:text-[#b3a79a]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6d6258]">
                Song
              </label>
              <div className="flex items-center gap-3 rounded-2xl bg-[#eee6dc] p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111] text-[#d7a96b]">
                  ♪
                </div>
                <input
                  placeholder="Search or add a song"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8b8075]"
                />
                <button className="rounded-full bg-[#fffaf3] px-3 py-2 text-xs shadow-sm">
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6d6258]">
                Who can see it?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-2xl bg-[#111] px-4 py-3 text-sm text-white">
                  Friends
                </button>
                <button className="rounded-2xl border border-[#d8c9b8] bg-[#fdf8f0] px-4 py-3 text-sm">
                  Private
                </button>
              </div>
            </div>

            <button className="mt-3 w-full rounded-full bg-[#111] py-4 text-base font-semibold text-white shadow-lg">
              Post to KLYP
            </button>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-[#7d7166]">
          One song. Many perspectives.
        </p>
      </div>
    </main>
  );
}
