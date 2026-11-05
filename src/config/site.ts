/* -------------------------------------------------------
   src/config/site.ts
   EDIT YOUR PERSONAL CONTENT HERE.
------------------------------------------------------- */

const raw = (file: string) =>
  `https://raw.githubusercontent.com/deepikaboominathan/email-assets/main/${encodeURIComponent(file)}`;

export const site = {
  title: "The Dark Knight & The Magic of Maikey",

  name: "Maithreyan",
  batman: "Batman",
  maikey: "Maikey",

  birthday: "1 November",

  intro: [
    "Somewhere in this universe,",
    "someone extraordinary was born.",
    "Maithreyan.",
    "The one I call Batman.",
  ],

  introButton: "ENTER THE STORY",

  /* -------------------------------------------------------
     GIFT CHAPTER
  ------------------------------------------------------- */

  gift: {
    text: "Your birthday mission begins here, Batman.",
    button: "UNBOX YOUR SURPRISE",
    surprise: "Mission unlocked: this whole night is for you.",
    next: "CONTINUE",
  },

  /* -------------------------------------------------------
     PHOTOS  (Memories flip cards AND Maikey's chapter slideshow)
  ------------------------------------------------------- */

  memoriesTitle: "THE BATCAVE ARCHIVE",

  photos: [
    {
      title: "My favorite human",
      message:
        "Some people make ordinary moments feel extraordinary. You're one of them.",
      image: raw("WhatsApp Image 2026-11-05 at 7.51.04 PM.jpeg"),
    },
    {
      title: "A little piece of home",
      message:
        "No matter how much time passes, some people always feel like home.",
      image: raw("WhatsApp Image 2026-11-05 at 7.52.21 PM.jpeg"),
    },
    {
      title: "The little things",
      message:
        "It's the little things with you that become the biggest memories.",
      image: raw("WhatsApp Image 2026-11-05 at 7.51.04 PM (1).jpeg"),
    },
    {
      title: "My favorite moments",
      message: "My favorite memories aren't places. They're moments with you.",
      image: raw("WhatsApp Image 2026-11-05 at 7.51.04 PM (2).jpeg"),
    },
    {
      title: "Our story",
      message:
        "You're my favorite plot twist, my favorite person, and my favorite story.",
      image: raw("WhatsApp Image 2026-11-05 at 7.52.21 PM (1).jpeg"),
    },
    {
      title: "Page after page",
      message:
        "Every memory with you is a page I would happily read again and again.",
      image: raw("WhatsApp Image 2026-11-05 at 7.52.21 PM (2).jpeg"),
    },
    {
      title: "Just us",
      message: "In every frame, the best part is always the company.",
      image: raw("WhatsApp Image 2026-11-05 at 7.51.04 PM (3).jpeg"),
    },
    {
      title: "Pure happiness",
      message: "Happiness looks a lot like these moments with you.",
      image: raw("WhatsApp Image 2026-11-05 at 7.51.04 PM (5).jpeg"),
    },
    {
      title: "Always by your side",
      message:
        "Wherever life takes us, I'm so glad I get to share the journey with you.",
      image: raw("WhatsApp Image 2026-11-05 at 7.52.21 PM (3).jpeg"),
    },
  ],

  /* photo used on the LAST page (portrait + letter background) */
  finalPhoto: raw("WhatsApp Image 2026-11-05 at 7.51.04 PM.jpeg"),

  /* -------------------------------------------------------
     MAIKEY'S CHAPTER
  ------------------------------------------------------- */

  maikeyChapter: {
    lines: [
      "Every Batman has a story.",
      "But mine has a little magic too.",
      "That magic has a name...",
      "MAIKEY.",
    ],

    message:
      "Some people enter your life and become a part of your universe. You're one of those people, Maikey.",
  },

  /* -------------------------------------------------------
     SONGS CHAPTER
  ------------------------------------------------------- */

  songsTitle: "OUR SOUNDTRACK",
  songsLine: "These songs remind me of you.",

  songs: [
    {
      title: "Unnai Thedi",
      artist: "Tamilslvn, Kayani",
      url: "https://open.spotify.com/track/19txwBWUs7ZgPEgRL9vQnT",
      cover: "https://i.scdn.co/image/ab67616d0000b2734e3ec0d09fbe2a67d60ec8e8",
      note: "Some songs say what words can't.",
    },
    {
      title: "The metro proposal",
      artist: "Sai Abhyankkar",
      url: "https://open.spotify.com/track/6PquoDUmNQpYa7ndyjUDWz",
      cover: "https://i.scdn.co/image/ab67616d0000b2738ca83dac6f71689736ee81e0",
      note: "For all the moments that feel like a movie scene.",
    },
    {
      title: "Alaakaa Loova (Unplugged)",
      artist: "Sai Abhyankkar, Rokesh",
      url: "https://open.spotify.com/track/4mAv9CWBlfLSkzOtdTxdX0",
      cover: "https://i.scdn.co/image/ab67616d0000b273ca2efa994564dc3df504b40c",
      note: "A little song that reminds me of you.",
    },
    {
      title: "Oorum Blood",
      artist: "Sai Abhyankkar, Paal Dabba, Bhumi, Deepthi Suresh",
      url: "https://open.spotify.com/track/6EzB9lIW27iSTd0c2V4t3K",
      cover: "https://i.scdn.co/image/ab67616d0000b2737b5fd77735d2fa9cc7e982df",
      note: "Because some people just run in your blood.",
    },
    {
      title: "KALYANI (with Shreya Ghoshal) - Remix",
      artist: "ARJN, KDS, FIFTY4, Shreya Ghoshal",
      url: "https://open.spotify.com/track/2y8mkajKikV5S1PRCMQ5WL",
      cover: "https://i.scdn.co/image/ab67616d0000b2739aa819fdf84c78fc1976391d",
      note: "Play this one when you're smiling for no reason.",
    },
    {
      title: "Pesamale",
      artist: "Siri Xander, Arra Aria Khayal",
      url: "https://open.spotify.com/track/2lo95sXI2RkrXLOYTXpZwe",
      cover: "https://i.scdn.co/image/ab67616d0000b273d1f46cbae07d00b319018f98",
      note: "For the things we don't even need to say.",
    },
    {
      title: "IMAYE",
      artist: "Shabir Sulthan, Srinisha Jayaseelan, Roshan Jamrock",
      url: "https://open.spotify.com/track/5PL0PtPlaSjH6eQdA9WfFS",
      cover: "https://i.scdn.co/image/ab67616d0000b273caea7d3a6dcf0b3a89dd226f",
      note: "Always watching over the ones who matter most.",
    },
    {
      title: 'Pattampoochi (From "Vishwanath & Sons")',
      artist: "G. V. Prakash, Sublahshini, Arunraja Kamaraj",
      url: "https://open.spotify.com/track/1DgQIai8yxUNhNeYVfaqT9",
      cover: "https://i.scdn.co/image/ab67616d0000b273711f89a98be6dfa5a096878a",
      note: "Light, happy, and a little bit like you.",
    },
    {
      title: "Amsham - അംശം",
      artist: "Aksomaniac, M.H.R, Bhumi, Circle Tone",
      url: "https://open.spotify.com/track/0Dt5EqEckM8jcfMYEdlx2Z",
      cover: "https://i.scdn.co/image/ab67616d0000b273530e627d6b4aced65e1ccf4a",
      note: "You'll always be a part of my story.",
    },
  ],

  /* -------------------------------------------------------
     VIDEO CHAPTER
  ------------------------------------------------------- */

  birthdayVideo: raw("WhatsApp Video 2026-11-05 at 7.53.35 PM.mp4"),

  /* -------------------------------------------------------
     STORY CHAPTER  (shown as a handwritten letter)
  ------------------------------------------------------- */

  story: {
    heading: "There's Something...",
    intro: "Some words deserve their own little moment.",
    button: "OPEN THE LETTER",

    to: "To my Maithreyan,",

    body: [
      "I'll always be there for you, even if you avoid me, hurt me, or ignore me. Whenever you want me, I'll be there.",
      "You will always be my special person. You came into my life like magic, and you're still just like that.",
      "You make me feel so comfortable, and you will always be special to me.",
      "And whatever promise I made to you, I will always keep it.",
    ],

    signoff: "By your special friend, Deepu",
  },

  /* -------------------------------------------------------
     BIRTHDAY CAKE
  ------------------------------------------------------- */

  birthdayWish: {
    headline: "HAPPY BIRTHDAY, MAITHREYAN!",

    sub: "To my Batman, my Maikey, and one of the most special people in my life...",

    message:
      "Happy birthday, Maikey. You deserve all the happiness, love, and magic this universe has to offer.",
  },

  /* -------------------------------------------------------
     FINAL LETTER
  ------------------------------------------------------- */

  finalIntro: [
    "Before you leave, Batman...",
    "There's one last thing I want to tell you.",
  ],

  letter: [
    "I'm really sorry for wishing you late. I can't believe I forgot to wish you on your special day.",

    "I know your birthday was on 1 November, and I should have wished you on time. I'm sorry, Maikey.",

    "Even though my wish came late, you and your happiness are still important to me.",

    "I hope this new year of your life brings you endless happiness, peace, success, and everything your heart wishes for.",

    "Happy belated birthday, my Batman. ❤️",
  ],

  finale: [
    "Some wishes may arrive late...",
    "But the love behind them is always real.",
    "Happy Belated Birthday, Maikey. ❤️",
  ],
};