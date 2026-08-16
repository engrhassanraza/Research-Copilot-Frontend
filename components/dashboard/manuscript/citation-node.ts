import { Node, mergeAttributes } from "@tiptap/core";

export interface CitationAttrs {
  referenceId: string;
  label: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    citation: {
      insertCitation: (attrs: CitationAttrs) => ReturnType;
    };
  }
}

// Inline atom node for an in-text citation. `label` is a display hint
// captured at insert time (e.g. "[Smith, 2023]") — the authoritative,
// per-style numbered marker is only ever computed at export time by the
// backend (`app.exports.manuscript_convert.tiptap_to_sections`), matching
// how every other export path in this app never persists a rendered
// "[n]" marker (instruction.md §27).
export const Citation = Node.create({
  name: "citation",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      referenceId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-reference-id"),
        renderHTML: (attrs) => ({ "data-reference-id": attrs.referenceId }),
      },
      label: {
        default: "[?]",
        parseHTML: (element) => element.textContent ?? "[?]",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-citation]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-citation": "", class: "citation-chip" }),
      node.attrs.label,
    ];
  },

  addCommands() {
    return {
      insertCitation:
        (attrs: CitationAttrs) =>
        ({ chain }) =>
          chain().insertContent({ type: this.name, attrs }).run(),
    };
  },
});
