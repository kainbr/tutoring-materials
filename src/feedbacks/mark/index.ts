import { findChildren, Mark, mergeAttributes } from "@tiptap/core";
import { v4 as uuid } from "uuid";
import type { StateStore } from "@/helpers/store";
import type { MarkFeedbackConfig } from "@/types";
import type { Feedback } from "@/types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feedbackMark: {
      /**
       *
       */
      setFeedbackMark: (attributes: object) => ReturnType;
      /**
       *
       */
      unsetFeedbackMark: () => ReturnType;
      /**
       *
       */
      removeFeedbackMark: (ref: string) => ReturnType;
    };
  }
}

export const FeedbackMark = Mark.create({
  name: "feedback-mark",

  inclusive: false,

  addOptions() {
    return {
      showOutline: false,
    };
  },

  addStorage() {
    return {
      // activeStyleVariables: () => [],
    };
  },

  addAttributes() {
    return {
      ref: {
        default: undefined,
        renderHTML: (attrs) => {
          const classes = ["transition-all duration-400"];
          const styles = [];

          if (this.options.showOutline) {
            classes.push("py-0.5 border border-2 rounded-lg");
          }

          // Bold
          styles.push(`font-weight: var(--${attrs.ref}-font-weight,inherit)`);

          // Italic
          styles.push(`font-style: var(--${attrs.ref}-font-style,normal)`);

          // Underline
          styles.push(`text-decoration-line: var(--${attrs.ref}-text-decoration-line,none)`);
          styles.push(`text-decoration-color: var(--${attrs.ref}-text-decoration-color,inherit)`);
          styles.push(`text-decoration-style: var(--${attrs.ref}-text-decoration-style,solid)`);
          styles.push(
            `text-decoration-thickness: var(--${attrs.ref}-text-decoration-thickness,auto)`
          );

          // Background-Color
          styles.push(`background-color: var(--${attrs.ref}-bg-color,inherit)`);

          return { class: classes.join(" "), style: styles.join("; ") };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  parseHTML() {
    return [];
  },

  onBeforeCreate() {
    const stateStore: StateStore = this.editor.storage.document.stateStore();
    stateStore.$subscribe(() => {
      const styleVariables = stateStore.feedbacks
        .map((s) => {
          const styles: string[] = [];

          if (s.type !== this.name) {
            return styles;
          }

          const config = s.config as MarkFeedbackConfig;

          // Bold
          if (!!config.bold) {
            styles.push(
              `--${config.ref}-font-weight:${config.bold?.weight ? config.bold.weight : 700}`
            );
          }
          if (!!config.italic) {
            styles.push(`--${config.ref}-font-style:italic`);
          }
          if (!!config.underline) {
            styles.push(`--${config.ref}-text-decoration-line:underline`);
            styles.push(
              `--${config.ref}-text-decoration-color:${
                config.underline?.color ? config.underline.color : "inherit"
              }`
            );
            styles.push(
              `--${config.ref}-text-decoration-style:${
                config.underline?.style ? config.underline.style : "solid"
              }`
            );
            styles.push(
              `--${config.ref}-text-decoration-color:${
                config.underline?.thickness ? config.underline.thickness : "auto"
              }`
            );
          }
          if (!!config.highlight) {
            styles.push(
              `--${config.ref}-bg-color:${
                config.highlight?.color ? config.highlight.color : "#fde68a"
              }`
            );
          }

          return styles;
        })
        .flat()
        .join("; ");

      this.editor.setOptions({
        editorProps: {
          attributes: {
            style: styleVariables,
            class: "h-full",
          },
        },
      });
    });
  },

  onUpdate() {
    // Clean up empty feedback marks
    const documentNode = findChildren(
      this.editor.state.doc,
      (node) => node.type.name === "document"
    )[0];
    const feedbackMarks = documentNode.node.attrs.feedbacks.filter(
      (s: Feedback) => s.type === this.name
    );

    for (const feedbackMark of feedbackMarks) {
      const nodes = findChildren(
        this.editor.state.doc,
        (node) => !!node.marks.find((m) => m.attrs?.ref === feedbackMark.config.ref)
      );
      if (nodes.length === 0) {
        this.editor.commands.removeFeedback(feedbackMark);
      }
    }
  },

  addCommands() {
    return {
      setFeedbackMark:
        (attributes) =>
        ({ commands }) => {
          const feedback = {
            id: uuid(),
            type: this.name,
            parent: null,
            config: { ...attributes, ref: uuid() },
          };
          commands.addFeedback(feedback);
          commands.setMark(this.name, feedback.config);
          return true;
        },
      unsetFeedbackMark:
        () =>
        ({ commands }) => {
          commands.unsetMark(this.name);
          return true;
        },
      removeFeedbackMark:
        (ref) =>
        ({ chain }) => {
          const nodes = findChildren(
            this.editor.state.doc,
            (node) => !!node.marks.find((m) => m.attrs?.ref === ref)
          );

          nodes.forEach((node) => {
            chain()
              .setTextSelection({
                from: node.pos,
                to: node.pos + node.node.nodeSize,
              })
              .unsetMark(this.name);
          });
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {};
  },

  addInputRules() {
    return [];
  },

  addPasteRules() {
    return [];
  },
});
