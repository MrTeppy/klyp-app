export default function Home() {
  const posts = [
    {
      name: "Charlie",
      time: "2h",
      song: "Sunflower",
      artist: "Rex Orange County",
      caption: "late night drives\nhit different.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      friends: "Klyped by 7 friends",
    },
    {
      name: "Mina",
      time: "40m",
      song: "Sparks",
      artist: "Coldplay",
      caption: "rain on the window\nsame song again.",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
      friends: "Klyped by 3 friends",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4efe8] text-[#111]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-5">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111] text-2xl font-bold text-[#d7a96b] shadow-md">
              K
            </div>
            <div className="tracking-[0.45em] text-lg font-semibold">KLYP</div>
          </div>

          <button className="rounded-full bg-[#111] px-5 py-2 text-sm font-medium text-white shadow-sm">
            + Post
          </button>
        </header>

        {/* Hero text */}
        <section className="mb-6">
          <h1 className="text-[58px] leading-none tracking-tight">
            KLYP
            <br />
            is{" "}
            <span className="font-serif italic text-[62px]">different.</span>
          </h1>

          <p className="mt-4 text-xl leading-7 text-[#5d554e]">
            Not just a post.
            <br />A shared memory.
          </p>

          <div className="mt-6 h-[2px] w-20 bg-[#b08a56]" />
        </section>

        {/* Feed tabs */}
        <nav className="mb-4 flex gap-6 border-b border-[#ddd3c7] text-sm font-medium text-[#7a7168]">
          <button className="border-b-2 border-[#111] pb-3 text-[#111]">
            Friends
          </button>
          <button className="pb-3">For You</button>
          <button className="pb-3">Saved</button>
        </nav>

        {/* Feed */}
        <section className="space-y-5">
          {posts.map((post) => (
            <article
              key={post.song}
              className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-4 shadow-[0_12px_35px_rgba(55,39,20,0.08)]"
            >
              {/* User row */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#d7a96b] to-[#111]" />
                  <div>
                    <p className="font-semibold">{post.name}</p>
                    <p className="text-xs text-[#82766b]">{post.time}</p>
                  </div>
                </div>

                <button className="text-xl leading-none text-[#82766b]">•••</button>
              </div>

              {/* Music card */}
              <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#eee6dc] p-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-[#111]">
                    <img
                      src={post.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{post.song}</p>
                    <p className="text-xs text-[#6d6258]">{post.artist}</p>
                  </div>
                </div>

                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fffaf3] shadow-sm">
                  ▶
                </button>
              </div>

              {/* Caption */}
              <p className="mb-4 whitespace-pre-line font-serif text-[25px] leading-7">
                {post.caption}
              </p>

              {/* Image */}
              <div className="overflow-hidden rounded-[24px]">
                <img
                  src={post.image}
                  alt=""
                  className="h-[430px] w-full object-cover"
                />
              </div>

              {/* Friends row */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <span className="h-7 w-7 rounded-full border-2 border-[#fffaf3] bg-[#111]" />
                    <span className="h-7 w-7 rounded-full border-2 border-[#fffaf3] bg-[#b08a56]" />
                    <span className="h-7 w-7 rounded-full border-2 border-[#fffaf3] bg-[#d8c1a3]" />
                    <span className="h-7 w-7 rounded-full border-2 border-[#fffaf3] bg-[#6b625a]" />
                  </div>

                  <p className="text-xs text-[#82766b]">{post.friends}</p>
                </div>

                <button className="text-2xl">♡</button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#ded2c5] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md justify-around px-6 py-4 text-sm">
          <button>Home</button>
          <button>Explore</button>
          <button className="rounded-full bg-[#111] px-5 py-2 text-white">
            +
          </button>
          <button>Friends</button>
          <button>Profile</button>
        </div>
      </div>
    </main>
  );
}
