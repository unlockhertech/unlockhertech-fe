import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BlogCallout } from "../app/components/blog/BlogCallout";
import { postSchema } from "../../sanity/schemas/post";
import type { PortableTextBlock } from "@portabletext/types";

describe("BlogCallout Rich Text, Formatting & Copy-Paste Support", () => {
  it("renders PortableText with bold, italics, strikethrough, underline, code, links, and newlines", () => {
    const blocks: PortableTextBlock[] = [
      {
        _key: "block-1",
        _type: "block",
        style: "normal",
        children: [
          { _key: "span-1", _type: "span", text: "Start of text with " },
          { _key: "span-2", _type: "span", text: "bold phrase", marks: ["strong"] },
          { _key: "span-3", _type: "span", text: ", " },
          { _key: "span-4", _type: "span", text: "italic emphasis", marks: ["em"] },
          { _key: "span-5", _type: "span", text: ", " },
          { _key: "span-6", _type: "span", text: "deleted strikethrough text", marks: ["strike-through"] },
          { _key: "span-7", _type: "span", text: ", and " },
          { _key: "span-8", _type: "span", text: "underlined item", marks: ["underline"] },
          { _key: "span-9", _type: "span", text: " alongside " },
          { _key: "span-10", _type: "span", text: "const x = 42;", marks: ["code"] },
        ],
      },
      {
        _key: "block-2",
        _type: "block",
        style: "normal",
        children: [
          { _key: "span-11", _type: "span", text: "New line paragraph after enter with a " },
          { _key: "span-12", _type: "span", text: "resource link", marks: ["link-mark-1"] },
          { _key: "span-13", _type: "span", text: "." },
        ],
        markDefs: [
          {
            _key: "link-mark-1",
            _type: "link",
            href: "https://unlockhertech.com/community",
          },
        ],
      },
    ];

    render(
      <BlogCallout
        variant="tip"
        title="Pro Tip with Rich Formatting"
        content={blocks}
      />
    );

    expect(screen.getByText("Pro Tip with Rich Formatting")).toBeInTheDocument();

    const bold = screen.getByText("bold phrase");
    expect(bold.tagName).toBe("STRONG");
    expect(bold).toHaveClass("font-bold");

    const italic = screen.getByText("italic emphasis");
    expect(italic.tagName).toBe("EM");
    expect(italic).toHaveClass("italic");

    const strike = screen.getByText("deleted strikethrough text");
    expect(strike.tagName).toBe("DEL");
    expect(strike).toHaveClass("line-through");

    const underline = screen.getByText("underlined item");
    expect(underline.tagName).toBe("U");
    expect(underline).toHaveClass("underline");

    const code = screen.getByText("const x = 42;");
    expect(code.tagName).toBe("CODE");

    const link = screen.getByRole("link", { name: "resource link" });
    expect(link).toHaveAttribute("href", "https://unlockhertech.com/community");

    expect(screen.getByText(/New line paragraph after enter/i)).toBeInTheDocument();
  });

  it("renders markdown string with bold, italics, strikethrough, and breaks", () => {
    const markdownContent = `First line of note
Second line with **bold statement**, *italic thought*, and ~~strikethrough note~~.

New paragraph after double line break.`;

    render(
      <BlogCallout
        variant="keyTakeaway"
        content={markdownContent}
      />
    );

    expect(screen.getByText("bold statement").tagName).toBe("STRONG");
    expect(screen.getByText("italic thought").tagName).toBe("EM");
    expect(screen.getByText("strikethrough note").tagName).toBe("DEL");
    expect(screen.getByText(/First line of note/i)).toBeInTheDocument();
    expect(screen.getByText(/New paragraph after double line break/i)).toBeInTheDocument();
  });

  it("normalizes copied/pasted HTML tags (b, i, del, s, strike, br) in callout text", () => {
    const pastedHtml = "Copied text with <b>bold text</b>, <i>italic text</i>, <del>deleted text</del>, <s>struck text</s>, and <strike>legacy strike</strike><br>Second pasted line";

    render(
      <BlogCallout
        variant="didYouKnow"
        content={pastedHtml}
      />
    );

    expect(screen.getByText("bold text").tagName).toBe("STRONG");
    expect(screen.getByText("italic text").tagName).toBe("EM");
    expect(screen.getByText("deleted text").tagName).toBe("DEL");
    expect(screen.getByText("struck text").tagName).toBe("DEL");
    expect(screen.getByText("legacy strike").tagName).toBe("DEL");
    expect(screen.getByText(/Second pasted line/i)).toBeInTheDocument();
  });

  it("validates that Sanity post schema defines callout content as a rich PortableText array with decorators", () => {
    interface SchemaPreview {
      prepare: (val: Record<string, unknown>) => { title: string; subtitle: string };
    }
    interface SchemaField {
      name: string;
      type?: string;
      of?: Array<{ type?: string; marks?: { decorators?: Array<{ value: string }> } }>;
    }
    interface SchemaMember {
      name?: string;
      fields?: SchemaField[];
      preview?: SchemaPreview;
    }
    interface PostSchemaDef {
      fields?: Array<{ name: string; of?: SchemaMember[] }>;
    }
    const fields = (postSchema as unknown as PostSchemaDef).fields;
    const bodyField = fields?.find((f) => f.name === "body");
    expect(bodyField).toBeDefined();

    const calloutMember = bodyField?.of?.find((m) => m.name === "callout");
    expect(calloutMember).toBeDefined();

    const contentField = calloutMember?.fields?.find((f) => f.name === "content");
    expect(contentField).toBeDefined();
    expect(contentField?.type).toBe("array");

    const blockType = contentField?.of?.[0];
    expect(blockType?.type).toBe("block");

    const decoratorValues = blockType?.marks?.decorators?.map((d) => d.value) ?? [];
    expect(decoratorValues).toContain("strong");
    expect(decoratorValues).toContain("em");
    expect(decoratorValues).toContain("strike-through");
    expect(decoratorValues).toContain("underline");
    expect(decoratorValues).toContain("code");

    // Test preview prepare function with PortableText array
    const preview = calloutMember?.preview;
    expect(preview).toBeDefined();
    if (preview) {
      const result = preview.prepare({
        variant: "didYouKnow",
        content: [
          {
            _type: "block",
            children: [
              { _type: "span", text: "Rich preview content with bold." },
            ],
          },
        ],
      });
      expect(result.title).toBe("💡 Did You Know?");
      expect(result.subtitle).toContain("Rich preview content with bold");
    }
  });
});
