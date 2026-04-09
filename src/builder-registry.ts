import dynamic from "next/dynamic";
import { Builder } from "@builder.io/react";

const Header = dynamic(() => import("@/components/Header/Header"), { ssr: true });
const DesignTokens = dynamic(
  () => import("@/components/DesignTokens/DesignTokens"),
  { ssr: true }
);
const MaintenanceBlurb = dynamic(
  () => import("@/components/MaintenanceBlurb/MaintenanceBlurb"),
  { ssr: true }
);
const BigHero = dynamic(() => import("@/components/BigHero/BigHero"), { ssr: true });
const ContactFooter = dynamic(
  () => import("@/components/ContactFooter/ContactFooter"),
  { ssr: true }
);

const ButtonCompareCard = dynamic(
  () => import("@/components/ButtonCompareCard/ButtonCompareCard"),
  { ssr: true }
);

const BigLinkCard = dynamic(
  () => import("@/components/BigLinkCard/BigLinkCard"),
  { ssr: true }
);

const BigProjectsCard = dynamic(
  () => import("@/components/BigProjectsCard/BigProjectsCard"),
  { ssr: true }
);

const ProfileIntroCard = dynamic(
  () => import("@/components/ProfileIntroCard/ProfileIntroCard"),
  { ssr: true }
);

const BigThumbnailCard = dynamic(
  () => import("@/components/BigThumbnailCard/BigThumbnailCard"),
  { ssr: true }
);

const ContactLinksGallery = dynamic(
  () => import("@/components/ContactLinksGallery/ContactLinksGallery"),
  { ssr: true }
);

const CardScrollContainer = dynamic(
  () =>
    import("@/components/CardScrollAnimation/CardScrollContainer/CardScrollContainer"),
  { ssr: true }
);

const ExperienceTimelineCard = dynamic(
  () => import("@/components/ExperienceTimelineCard/ExperienceTimelineCard"),
  { ssr: true }
);

Builder.registerComponent(Header, {
  name: "Header",
  inputs: [
    {
      name: "title",
      type: "string",
      defaultValue: "JZ",
    },
    {
      name: "links",
      type: "list",
      subFields: [
        { name: "label", type: "string", defaultValue: "Home" },
        { name: "href", type: "url", defaultValue: "/" },
      ],
      defaultValue: [
        { label: "Home", href: "/" },
        { label: "Writing", href: "/writing" },
        { label: "Projects", href: "/projects" },
      ],
    },
    {
      name: "ctaLabel",
      type: "string",
      defaultValue: "About",
    },
    {
      name: "ctaHref",
      type: "url",
      defaultValue: "/about",
    },
  ],
});

Builder.registerComponent(DesignTokens, {
  name: "DesignTokens",
});

Builder.registerComponent(MaintenanceBlurb, {
  name: "MaintenanceBlurb",
  inputs: [
    {
      name: "overline",
      type: "string",
      defaultValue: "Notice",
    },
    {
      name: "title",
      type: "string",
      defaultValue: "This page is under maintenance",
    },
    {
      name: "message",
      type: "string",
      defaultValue:
        "We’re actively working on this section. Content and features may change while we iterate. Please check back soon.",
    },
  ],
});



Builder.registerComponent(BigHero, {
  name: "BigHero",
  inputs: [
    { name: "title", type: "string", defaultValue: "Welcome" },
    { name: "subtitle1", type: "string", defaultValue: "To my website" },
    { name: "subtitle2", type: "string", defaultValue: "To my website" },
    { name: "className", type: "string", helperText: "Optional extra class name" },
  ],
});

Builder.registerComponent(ContactFooter, {
  name: "ContactFooter",
  inputs: [
    { name: "title", type: "string", defaultValue: "Contact" },
    {
      name: "subtitle",
      type: "string",
      defaultValue: "Here are my links.",
    },
    {
      name: "items",
      friendlyName: "Contact links",
      type: "list",
      subFields: [
        {
          name: "href",
          type: "url",
          defaultValue: "https://www.linkedin.com/",
        },
        {
          name: "label",
          type: "string",
          defaultValue: "LinkedIn profile",
        },
      ],
      defaultValue: [
        { href: "https://www.linkedin.com/", label: "LinkedIn profile" },
        { href: "https://github.com/", label: "GitHub profile" },
        { href: "mailto:hello@example.com", label: "Send an email" },
      ],
    },
    {
      name: "showContactButton",
      type: "boolean",
      defaultValue: false,
      helperText:
        "Show a small “Contact” button (e.g. on the home page). Turn off on the /contact page.",
    },
    {
      name: "buttonLabel",
      type: "string",
      defaultValue: "Contact me",
    },
    {
      name: "contactButtonHref",
      type: "url",
      defaultValue: "/contact",
    },
    {
      name: "className",
      type: "string",
      helperText: "Optional extra class name",
    },
    {
      name: "children",
      friendlyName: "Content",
      type: "uiBlocks",
      helperText: "Optional additional content below the link grid",
    },
  ],
});

Builder.registerComponent(ButtonCompareCard, {
  name: "ButtonCompareCard",
  inputs: [
    { name: "title", type: "string", defaultValue: "Compare" },
    {
      name: "items",
      type: "list",
      subFields: [
        { name: "title", type: "string", defaultValue: "Tenant 1" },
        {
          name: "description",
          type: "string",
          defaultValue:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          name: "html",
          type: "richText",
          defaultValue: "<div><p>Panel content</p></div>",
        },
      ],
      defaultValue: [
        {
          title: "Tenant 1",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          html: "<div><p>Left panel content</p></div>",
        },
        {
          title: "Tenant 2",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          html: "<div><p>Right panel content</p></div>",
        },
      ],
    },
  ],
});

Builder.registerComponent(BigLinkCard, {
  name: "BigLinkCard",
  inputs: [
    { name: "title", type: "string", defaultValue: "Card Title" },
    {
      name: "description",
      type: "richText",
      defaultValue: "<p>Insert richtext here</p>",
    },
    { name: "link", type: "url", defaultValue: "/" },
  ],
});

Builder.registerComponent(ProfileIntroCard, {
  name: "ProfileIntroCard",
  inputs: [
    { name: "title", type: "string", defaultValue: "About me" },
    {
      name: "intro",
      type: "richText",
      defaultValue: "<p>A short introduction—who you are and what you care about.</p>",
    },
    {
      name: "skillItems",
      type: "list",
      subFields: [
        { name: "label", type: "string", defaultValue: "TypeScript" },
        {
          name: "description",
          type: "richText",
          defaultValue: "<p>Apps and developer tooling</p>",
        },
        {
          name: "icon",
          type: "string",
          defaultValue: "code",
          helperText:
            "Icon key: bike, book, brain, camera, code, coffee, cpu, database, dumbbell, film, gamepad, git-branch, globe, headphones, heart, laptop, layers, mic, mountain, music, package, paintbrush, palette, pen, plane, puzzle, sparkles, terminal, tree, utensils, video, wrench",
        },
      ],
      defaultValue: [
        {
          label: "TypeScript",
          description: "<p>Apps and developer tooling</p>",
          icon: "code",
        },
        {
          label: "React",
          description: "<p>UI and design systems</p>",
          icon: "layers",
        },
        {
          label: "Design",
          description: "<p>Figma and prototyping</p>",
          icon: "palette",
        },
      ],
    },
    {
      name: "hobbyItems",
      type: "list",
      subFields: [
        { name: "label", type: "string", defaultValue: "Photography" },
        {
          name: "description",
          type: "richText",
          defaultValue: "<p>Street and travel</p>",
        },
        {
          name: "icon",
          type: "string",
          defaultValue: "camera",
          helperText:
            "Icon key: bike, book, brain, camera, code, coffee, cpu, database, dumbbell, film, gamepad, git-branch, globe, headphones, heart, laptop, layers, mic, mountain, music, package, paintbrush, palette, pen, plane, puzzle, sparkles, terminal, tree, utensils, video, wrench",
        },
      ],
      defaultValue: [
        {
          label: "Photography",
          description: "<p>Street and travel</p>",
          icon: "camera",
        },
        {
          label: "Climbing",
          description: "<p>Bouldering and routes</p>",
          icon: "mountain",
        },
        {
          label: "Coffee",
          description: "<p>Espresso and beans</p>",
          icon: "coffee",
        },
      ],
    },
    { name: "link", type: "url", defaultValue: "/about" },
    {
      name: "image",
      type: "string",
      helperText: "Optional avatar or image path/URL",
      defaultValue: "",
    },
  ],
});

Builder.registerComponent(ExperienceTimelineCard, {
  name: "ExperienceTimelineCard",
  inputs: [
    { name: "title", type: "string", defaultValue: "Experience" },
    {
      name: "link",
      type: "url",
      defaultValue: "",
      helperText: "Optional URL for the arrow button; leave empty to hide it",
    },
    {
      name: "experiences",
      type: "list",
      subFields: [
        { name: "period", type: "string", defaultValue: "2022 – Present" },
        { name: "role", type: "string", defaultValue: "Senior Software Engineer" },
        { name: "company", type: "string", defaultValue: "Example Corp" },
        {
          name: "location",
          type: "string",
          defaultValue: "Remote",
          helperText: "Optional (city, remote, etc.)",
        },
        {
          name: "description",
          type: "richText",
          defaultValue: "<p>Highlights and impact in this role.</p>",
        },
      ],
      defaultValue: [
        {
          period: "2022 – Present",
          role: "Senior Software Engineer",
          company: "Example Corp",
          location: "Remote",
          description:
            "<p>Shipped products across the stack. Mentored engineers and improved reliability.</p>",
        },
        {
          period: "2019 – 2021",
          role: "Software Engineer",
          company: "Previous Inc",
          location: "Toronto, ON",
          description: "<p>Full-stack development on customer-facing applications.</p>",
        },
        {
          period: "2017 – 2019",
          role: "Developer",
          company: "Earlier Co",
          location: "",
          description: "<p>Built internal tools and integrations.</p>",
        },
      ],
    },
  ],
});

Builder.registerComponent(BigProjectsCard, {
  name: "BigProjectsCard",
  inputs: [
    { name: "title", type: "string", defaultValue: "Projects" },
    {
      name: "description",
      type: "richText",
      defaultValue: "<p>Selected projects I’ve built and shipped.</p>",
    },
    { name: "link", type: "url", defaultValue: "/projects" },
    {
      name: "projects",
      type: "list",
      subFields: [
        { name: "title", type: "string", defaultValue: "Project Title" },
        {
          name: "description",
          type: "richText",
          defaultValue: "<p>Project overview goes here.</p>",
        },
        {
          name: "thumbnail",
          type: "string",
          helperText: "Image path or URL",
          defaultValue: "/window.svg",
        },
        { name: "href", type: "url", defaultValue: "/" },
      ],
      defaultValue: [
        {
          title: "Project One",
          description: "<p>What this project does.</p>",
          thumbnail: "/window.svg",
          href: "/projects/one",
        },
        {
          title: "Project Two",
          description: "<p>What this project does.</p>",
          thumbnail: "/window.svg",
          href: "/projects/two",
        },
      ],
    },
  ],
});

Builder.registerComponent(BigThumbnailCard, {
  name: "BigThumbnailCard",
  inputs: [
    { name: "title", type: "string", defaultValue: "Card Title" },
    {
      name: "description",
      type: "richText",
      defaultValue: "<p>Insert richtext here</p>",
    },
    { name: "link", type: "url", defaultValue: "/" },
    {
      name: "image",
      type: "string",
      helperText: "Image path or URL",
      defaultValue: "/window.svg",
    },
  ],
});

Builder.registerComponent(ContactLinksGallery, {
  name: "ContactLinksGallery",
  inputs: [
    {
      name: "items",
      type: "list",
      subFields: [
        {
          name: "href",
          type: "url",
          defaultValue: "https://www.linkedin.com/",
        },
        {
          name: "label",
          type: "string",
          defaultValue: "LinkedIn profile",
        },
      ],
      defaultValue: [
        { href: "https://www.linkedin.com/", label: "LinkedIn profile" },
        { href: "https://github.com/", label: "GitHub profile" },
        { href: "mailto:hello@example.com", label: "Send an email" },
        { href: "/resume.pdf", label: "Resume" },
      ],
    },
    {
      name: "className",
      type: "string",
      helperText: "Optional extra class name",
    },
  ],
});

Builder.registerComponent(CardScrollContainer, {
  name: "CardScrollContainer",
  friendlyName: "Card scroll stack",
  canHaveChildren: true,
  inputs: [
    {
      name: "numFirstElements",
      type: "number",
      defaultValue: 0,
      min: 0,
      helperText:
        "Number of leading children that skip the staged scroll + intro animation (e.g. a hero block).",
    },
    {
      name: "numLastElements",
      type: "number",
      defaultValue: 1,
      min: 0,
      helperText:
        "Number of trailing children that skip the sticky scroll effect (e.g. a footer card).",
    },
    {
      name: "bottomSeenOffsetPx",
      type: "number",
      defaultValue: 0,
      helperText:
        "Adjust when a sticky card is treated as having reached its bottom. Positive = earlier, negative = later.",
    },
  ],
});

