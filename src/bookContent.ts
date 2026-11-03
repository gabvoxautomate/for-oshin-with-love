export type Chapter = {
  number: number;
  title: string;
  image: string;
  alt: string;
  pages: string[][];
};

export const chapters: Chapter[] = [
  {
    number: 1,
    title: "SOME PEOPLE ARE A GIFT",
    image: "/images/oshin-chapter-1.png",
    alt: "Oshin smiling in a coral gele and pale-blue embroidered lace dress.",
    pages: [
      [
        "Oshin Racheal Caroline Dorcas…",
        "There are people we meet, and there are people God allows to become a part of our story.",
        "You are one of those people to me.",
      ],
      [
        "I honestly don't know if I have always had the right words to express just how dear you are to my heart, but I hope you know this:",
        "You matter to me. Deeply.",
        "Your presence in my life is one of those gifts I may never be able to fully explain, but I will always be grateful for.",
        "And if I could preserve some people and some moments in my heart forever, you would certainly be among them.",
      ],
    ],
  },
  {
    number: 2,
    title: "MORE THAN WORDS CAN SAY",
    image: "/images/oshin-chapter-2.jpg",
    alt: "Oshin smiling in a white dress, white fascinator, and pearl earrings.",
    pages: [
      [
        "Somewhere along the way, you stopped being just a friend.",
        "You became someone whose happiness matters to me.",
        "Someone whose pain I care about.",
        "Someone I want to see win.",
        "Someone whose smile can genuinely make my heart glad.",
      ],
      [
        "You became a sister to my soul.",
        "And perhaps that is why sometimes I struggle to put what I feel into words.",
        "Because some relationships are simply too precious to be reduced to a few sentences.",
      ],
      [
        "You are one of those people I thank God for.",
        "And no matter how many years pass, I hope you will always remember that there is someone out here who genuinely cares about you—not because of what you can give, but simply because you are you.",
      ],
    ],
  },
  {
    number: 3,
    title: "I SEE YOU",
    image: "/images/oshin-chapter-3.jpg",
    alt: "Oshin in a white polo shirt with lush green vegetation behind her.",
    pages: [
      [
        "I hope you know that I see more than the person everyone else sees.",
        "I see your strength.",
        "I see your heart.",
        "I see your struggles.",
        "I see the things you don't always say.",
        "I see the beautiful person you are becoming.",
        "And I am proud of you.",
      ],
      [
        "Not because you have figured everything out—you haven't, and neither have I.",
        "But because you keep becoming.",
        "You keep growing.",
        "You keep learning.",
        "You keep moving.",
      ],
      [
        "And I want you to know that I will always desire to see you become the very best version of who God has created you to be.",
        "Not the version the world demands.",
        "Not the version people expect.",
        "But the woman God has designed you to become.",
      ],
    ],
  },
  {
    number: 4,
    title: "WHAT I WISH FOR YOU",
    image: "/images/oshin-chapter-4.jpg",
    alt: "Oshin smiling in a pink T-shirt outdoors.",
    pages: [
      [
        "As you step into another year, there are so many things I could wish for you.",
        "But beyond the ordinary wishes of happiness, success and long life, I desire something deeper.",
        "I want to see you fulfilled.",
        "I want to see your dreams take shape.",
        "I want to see your efforts become testimonies.",
      ],
      [
        "I want to see the things you have prayed about become realities.",
        "I want to see you walk boldly into everything God has prepared for you.",
        "And when the journey gets difficult, I hope you remember that you don't have to have everything figured out at once.",
      ],
      [
        "Take your steps.",
        "Grow through your seasons.",
        "Trust God.",
        "And keep becoming.",
        "Because there is still so much ahead of you.",
        "And I genuinely want to be around to witness it.",
      ],
    ],
  },
  {
    number: 5,
    title: "NOVEMBER 10",
    image: "/images/oshin-chapter-5.jpg",
    alt: "Oshin smiling in a white button-up shirt, pink headband, and jeans.",
    pages: [
      [
        "November 10.",
        "A beautiful reminder that, on this day, the world received you.",
        "And somehow, years later, my own little corner of the world became better because our paths crossed.",
        "Happy Birthday, Oshin Racheal Caroline Dorcas. ❤️",
      ],
      [
        "I don't know what the future holds, but I know what I desire for you.",
        "I desire to see you happy.",
        "I desire to see you fulfilled.",
        "I desire to see you become all that God has placed inside you.",
        "I desire to see your dreams, prayers, efforts and expectations come into fruition over your life.",
      ],
      [
        "And perhaps more than anything else, I want you to know that I care.",
        "I care about the woman you are becoming.",
        "I care about your journey.",
        "I care about your joy.",
        "I care about your future.",
        "And I love seeing you grow.",
      ],
      [
        "So, as you begin another chapter, please remember this:",
        "You are loved.",
        "You are valued.",
        "You are remembered.",
        "And you are deeply cherished.",
      ],
      [
        "Happy Birthday, my dearest friend.",
        "May this chapter be kinder, deeper, brighter and more beautiful than the ones before it.",
        "And may I have the privilege of watching many of your beautiful desires and expectations become reality.",
      ],
      [
        "With love and a heart that genuinely cares,",
        "Timileyin Joseph ❤️",
      ],
    ],
  },
];

export type BookPage =
  | { kind: "front-cover" }
  | { kind: "chapter"; chapter: Chapter }
  | { kind: "text"; chapter: Chapter; paragraphs: string[] }
  | { kind: "memory"; title: string; image: string; alt: string }
  | { kind: "back-cover" };

export const bookPages: BookPage[] = [
  { kind: "front-cover" },
  ...chapters.flatMap((chapter) => [
    { kind: "chapter" as const, chapter },
    ...chapter.pages.map((paragraphs) => ({
      kind: "text" as const,
      chapter,
      paragraphs,
    })),
  ]),
  {
    kind: "memory",
    title: "A moment to keep",
    image: "/images/oshin-memory-1.jpg",
    alt: "Oshin smiling in a black outfit and tan cap.",
  },
  {
    kind: "memory",
    title: "Together",
    image: "/images/oshin-friendship.jpg",
    alt: "Oshin and Timileyin sharing a close selfie outdoors.",
  },
  {
    kind: "memory",
    title: "A memory in red",
    image: "/images/oshin-memory-2.jpg",
    alt: "Oshin smiling in a red dress outdoors.",
  },
  { kind: "back-cover" },
];
