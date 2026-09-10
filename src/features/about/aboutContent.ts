export interface AboutSection {
  title: string;
  paragraphs: string[];
}

export const techStack: string[] = [
  "Svelte",
  "C++",
  "C",
  "C#",
  "ASP.NET",
  "JavaScript/TypeScript",
  "React",
  "React Native",
  "HTML/CSS",
  "MySQL",
  "PostgreSQL",
  "Firebase",
  "API integration",
  "Docker",
  "QEMU",
  "Claude",
  "Codex",
];

export const aboutSections: AboutSection[] = [
  {
    title: "Background",
    paragraphs: [
      "My interest for this field started in my teenage years, tinkering with blogg.no and Nettby (Norway's answer to MySpace, more or less), spending hours customizing HTML and CSS until it looked right. That blog went through more redesigns than I can count, and eventually I started sneaking in JavaScript too with buttons, little interactive bits, anything that felt like magic at the time. I dreamt of becoming a web or graphic designer, but somehow never chased it.",
      "In high school I did some programming courses, and they were, unsurprisingly in hindsight, the only subjects I actually excelled in. I considered computer engineering back then, but the math and physics scared me off before I even tried. So I studied to become a teacher instead. Then, during my final semester, one course changed everything: digitalization in schools. It focused on what programming actually is and how it could be woven into teaching, across subjects and age groups. It was the first time I realized, a little too late, that I'd picked the wrong degree.",
      "It didn't take many years after that before I changed my direction in life entirely and went for computer engineering. Terrifying, if I'm honest. I had no idea if I'd actually be good at it. It was challenging, but was also worth it. I've learned more about myself in this field than I expected to, stumbled into interests I didn't know I had, and felt a kind of confidence in my own ability I'd never experienced before. What drives me is exactly that: the feeling of sitting with a problem for days, sometimes weeks, and finally cracking it. Understanding how a whole application fits together, how every piece talks to each other. Even something as small as a button changing color on hover still, genuinely, delights me.",
    ],
  },
  {
    title: "Experience",
    paragraphs: [
      "I have a bachelor's in computer engineering from the University of Agder where I specialized in software development. Over the three years I got to experience a wide range of subjects: foundational programming in C and C++, operating systems, microcontrollers, algorithms and data structures, software architecture and design, databases, DevOps, application development in React, and web development with C#, HTML/CSS and ASP.NET. The coursework gave me a solid, varied foundation across the stack, not just one corner of it.",
      "While doing my bachelor's degree, I had the opportunity to join [Utel](https://utel.tech/) as an intern. The work I did was mainly in frontend, but I ended up getting my hands into testing as well, a subject I'd found boring at university and assumed would never be \"my thing.\" Somehow, I ended up writing my bachelor's thesis on AI-assisted testing, a spark lit during the internship that grew into one of the most interesting things I worked on. Life comes at you fast.",
      "Most of my work was frontend development in Svelte and TypeScript, with some detours into backend tasks, API integration, and UX along the way. Working in a real business context taught me things university never could through collaborating across roles, and the fact that you can't fix everything. You learn to prioritize what actually matters (a button doesn't need to be perfectly centered as long as it works, right?). I continued part-time alongside writing my thesis, followed by a summer position. One of the bigger lessons I learned: progress isn't only about building new things. Small maintenance and polish done consistently, adds up to a meaningfully better product.",
      "Some of the components in the [projects section](/projects) started as real work for Utel: the multiselect and tooltip were built there and are still in production today. Although my professional experience has been frontend heavy so far, I'm just as eager to explore new territory and technologies.",
    ],
  },
  {
    title: "Outside of code",
    paragraphs: [
      "I was born in Kristiansand in 1996 falling right into the crack between millennial and Gen Z, and grew up in Arendal. I'm naturally curious, which usually means diving into something headfirst and figuring it out as I go rather than waiting until I feel ready. It's the same with technology: unfamiliar frameworks and tools are less intimidating to me than interesting, and once I've started on a problem I'd rather see it through than leave it half done.",
      "By heart I'm a serial hobby collector with a soft spot for anything visual: I knit, sew, draw, and do CrossFit purely for the plot twist of watching myself get slightly less uncoordinated each month. My hobby supplies pile up in alarming quantities before I inevitably abandon ship for the next shiny idea.",
      "I'm big into gaming and nerdy culture, always up for falling into a new universe, whether that's a game, a show, or a very deep Wikipedia rabbit hole. I'm extroverted, but every so often, going full computer rat for a weekend just hits right. I have a son who's essentially a smaller version of me, I drink far too much Pepsi Max, and I own an embarrassing number of Pokémon cards.",
    ],
  },
];
