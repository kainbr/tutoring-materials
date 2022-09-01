// noinspection JSUnusedGlobalSymbols

import { Extension, findChildren } from "@tiptap/core";
import { isEqual } from "lodash-es";
import { Plugin, PluginKey } from "prosemirror-state";

import type { EventOption, EventTrigger, Feedback } from "@/extensions/feedback/types";
import type { MarkFeedback } from "@/extensions/feedback/mark/types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feedback: {
      /**
       * Adds a feedback to the permanent feedback store.
       */
      addFeedback: (feedback: Feedback) => ReturnType;
      /**
       * Updates a feedback in the permanent feedback store.
       */
      updateFeedback: (feedback: Feedback, attributes: Partial<Feedback>) => ReturnType;
      /**
       * Removes a feedback from the permanent feedback store.
       */
      removeFeedback: (feedback: Feedback, removeEmptyTrigger?: boolean) => ReturnType;

      /**
       * Adds a new event option to the global storage.
       */
      addEventOption: (eventOption: EventOption) => ReturnType;
      /**
       * Remove an event option from the global storage.
       */
      removeEventOption: (eventOption: EventOption) => ReturnType;
      /**
       * Todo: Add method description
       */
      addEventTrigger: (trigger: EventTrigger) => ReturnType;
      /**
       * Todo: Add method description
       */
      updateEventTrigger: (trigger: EventTrigger, attributes: Partial<EventTrigger>) => ReturnType;
      /**
       * Todo: Add method description
       */
      removeEventTrigger: (trigger: EventTrigger) => ReturnType;
    };
  }
}

export const FeedbackExtension = Extension.create({
  name: "feedbacks",

  addGlobalAttributes() {
    return [
      {
        types: ["document"],
        attributes: {
          feedbacks: {
            default: [],
          },
          triggers: {
            default: [],
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("feedback"),
        appendTransaction: (transaction, oldState, state) => {
          // Nothing has changed. Ignore it.
          if (state.doc === oldState.doc) {
            return;
          }

          const tr = state.tr;

          state.doc.descendants((node, pos) => {
            if (node.type.name === "document" && !!node.attrs.feedbacks) {
              // Fetch ids of available tasks
              const taskIds = findChildren(state.doc, (node) => node.type.name === "task").map(
                (node) => node.node.attrs.id
              );

              // Feedbacks
              const feedbacks = node.attrs.feedbacks.filter(
                (f: Feedback) => taskIds.includes(f.parent) || f.parent === null
              );

              // Triggers
              const feedbacksIds: string[] = feedbacks.map((f: Feedback) => f.id);
              let triggers = node.attrs.triggers.map((t: EventTrigger) => {
                return {
                  ...t,
                  ...(!taskIds.includes(t.parent) && t.parent !== null
                    ? { event: null, parent: null }
                    : {}),
                  feedbacks: t.feedbacks.filter((feedback) => feedbacksIds.includes(feedback)),
                };
              });

              // Remove unnecessary empty triggers, if there are more than one.
              let hasEmptyTrigger = false;
              triggers = triggers.filter((t: EventTrigger) => {
                if (!t.event && !t.parent && !t.rules.length && !t.feedbacks.length) {
                  if (!hasEmptyTrigger) {
                    hasEmptyTrigger = true;
                    return true;
                  } else {
                    return false;
                  }
                }
                return true;
              });

              // Update
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                feedbacks,
                triggers,
              });
            }
          });

          return tr;
        },
      }),
    ];
  },

  addCommands() {
    return {
      addFeedback:
        (feedback) =>
        ({ commands }) => {
          commands.updateAttributes("document", {
            feedbacks: [...this.editor.getAttributes("document").feedbacks, feedback],
          });

          return true;
        },

      updateFeedback:
        (feedback, attributes) =>
        ({ commands }) => {
          const feedbacks = this.editor.getAttributes("document").feedbacks.map((s: Feedback) => {
            if (s.id === feedback.id) {
              return {
                ...s,
                ...attributes,
              };
            } else {
              return s;
            }
          });

          commands.updateAttributes("document", { feedbacks });

          return true;
        },

      removeFeedback:
        (feedback, removeEmptyTrigger = false) =>
        ({ commands }) => {
          if (!feedback.id) {
            return false;
          }

          const feedbacks = this.editor.getAttributes("document").feedbacks;

          // For feedback-mark: check if this is the last feedback with this ref
          if (feedback.type === "feedback-mark") {
            const feedbacksWithRef = feedbacks.filter((s: MarkFeedback) => {
              return "ref" in s.config && s.config.ref === (feedback as MarkFeedback).config.ref;
            });

            if (feedbacksWithRef.length <= 1) {
              commands.removeFeedbackMark((feedback as MarkFeedback).config.ref);
            }
          }

          // Remove feedback from stored feedbacks list and also from triggers using it
          commands.updateAttributes("document", {
            feedbacks: feedbacks.filter((s: Feedback) => s.id !== feedback.id),
            triggers: (() => {
              let triggers = this.editor.getAttributes("document").triggers;

              if (removeEmptyTrigger) {
                triggers = triggers.filter(
                  (trigger: EventTrigger) => !isEqual(trigger.feedbacks, [feedback.id])
                );
              }

              return triggers.map((trigger: EventTrigger) => {
                trigger.feedbacks = trigger.feedbacks.filter((id) => id !== feedback.id);
                return trigger;
              });
            })(),
          });

          return true;
        },

      addEventTrigger:
        (trigger) =>
        ({ commands }) => {
          commands.updateAttributes("document", {
            triggers: [...this.editor.getAttributes("document").triggers, trigger],
          });

          return true;
        },

      updateEventTrigger:
        (trigger, attributes) =>
        ({ commands }) => {
          if (!trigger.id) {
            return false;
          }

          const triggers = this.editor.getAttributes("document").triggers;
          const index = triggers.findIndex((t: EventTrigger) => {
            return t.id === trigger.id && t.id;
          });

          if (!index && index !== 0) {
            return false;
          }

          triggers[index] = { ...triggers[index], ...attributes };

          commands.updateAttributes("document", {
            triggers: triggers,
          });

          return true;
        },

      removeEventTrigger:
        (trigger) =>
        ({ commands }) => {
          if (!trigger.id) {
            return false;
          }

          commands.updateAttributes("document", {
            triggers: this.editor
              .getAttributes("document")
              .triggers.filter((t: EventTrigger) => t.id !== trigger.id),
          });

          return true;
        },
    };
  },
});
