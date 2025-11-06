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
const Hero = dynamic(() => import("@/components/Hero/Hero"), { ssr: true });
const BigHero = dynamic(() => import("@/components/BigHero/BigHero"), { ssr: true });
const WindowHeroSection = dynamic(
  () => import("@/components/WindowHeroSection/WindowHeroSection"),
  { ssr: true }
);
const WindowLeftContentSection = dynamic(
  () => import("@/components/WindowLeftContentSection/WindowLeftContentSection"),
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

Builder.registerComponent(Hero, {
  name: "Hero",
  inputs: [
    { name: "title", type: "string", defaultValue: "Welcome" },
    { name: "subtitle", type: "string", defaultValue: "To my website" },
    { name: "className", type: "string", helperText: "Optional extra class name" },
  ],
});

Builder.registerComponent(BigHero, {
  name: "BigHero",
  inputs: [
    { name: "title", type: "string", defaultValue: "Welcome" },
    { name: "subtitle", type: "string", defaultValue: "To my website" },
    { name: "className", type: "string", helperText: "Optional extra class name" },
  ],
});

Builder.registerComponent(WindowHeroSection, {
  name: "WindowHeroSection",
  inputs: [
    { name: "title", type: "string", defaultValue: "Hello there" },
    {
      name: "description",
      type: "string",
      defaultValue: "Welcome to my site — here's what's new.",
    },
    { name: "className", type: "string", helperText: "Optional extra class name" },
  ],
});

Builder.registerComponent(WindowLeftContentSection, {
  name: "WindowLeftContentSection",
  inputs: [
    { name: "title", type: "string", defaultValue: "Section Title" },
    {
      name: "description",
      type: "string",
      defaultValue: "A short description goes here to explain the content in this window.",
    },
    { name: "className", type: "string", helperText: "Optional extra class name" },
  ],
});


