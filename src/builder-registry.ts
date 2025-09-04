import dynamic from "next/dynamic";
import { Builder } from "@builder.io/react";

const Header = dynamic(() => import("@/components/Header/Header"), { ssr: true });
const DesignTokens = dynamic(
  () => import("@/components/DesignTokens/DesignTokens"),
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


