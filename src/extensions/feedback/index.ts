// noinspection JSUnusedGlobalSymbols

import { Extension, findChildren } from "@tiptap/core";
import { isEqual } from "lodash-es";

import type {
  EventCondition,
  EventOption,
  EventTrigger,
  Feedback,
} from "@/extensions/feedback/types";
import type { MarkFeedback } from "@/extensions/feedback/mark/types";
import type { NodeWithPos } from "@tiptap/vue-3";
import { Plugin, PluginKey } from "prosemirror-state";

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
       * Adds a feedback to the active state feedback store.
       */
      addActiveFeedback: (feedback: Feedback) => ReturnType;
      /**
       * Updates a feedback in the active state feedback store.
       */
      updateActiveFeedback: (feedback: Feedback, attributes: Partial<Feedback>) => ReturnType;
      /**
       * Removes a feedback from the active state feedback store.
       */
      removeActiveFeedback: (feedback: Feedback) => ReturnType;
      /**
       * Adds a new event option to the global storage.
       */
      addEventOption: (eventOption: EventOption) => ReturnType;
      /**
       * Remove an event option from the global storage.
       */
      removeEventOption: (eventOption: EventOption) => ReturnType;
      /**
       * Adds an EventCondition to an event option which matches the event name and parent.
       * If the event option does not exist, no condition is added.
       */
      addEventCondition: (
        event: string,
        parent: string | null,
        condition: EventCondition
      ) => ReturnType;
      /**
       * Updates the condition that matches the event, parent and condition with the provided attributes.
       */
      updateEventCondition: (
        event: string,
        parent: string,
        condition: EventCondition,
        attributes: Partial<EventCondition>
      ) => ReturnType;
      /**
       * Removes the condition that also matches the event and parent.
       */
      removeEventCondition: (
        event: string,
        parent: string,
        condition: EventCondition
      ) => ReturnType;
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

export interface FeedbackExtensionStorage {
  active: Feedback[];
  events: EventOption[];
}

export const FeedbackExtension = Extension.create<unknown, FeedbackExtensionStorage>({
  onUpdate() {
    // Cleanup events that do not have a valid parent anymore
    const taskIds = findChildren(this.editor.state.doc, (node) => node.type.name === "task").map(
      (node: NodeWithPos) => node.node.attrs.id
    );
    this.storage.events = this.storage.events.filter(
      (e: EventOption) => e.parent === null || taskIds.includes(e.parent)
    );
  },

  name: "feedbacks",

  addStorage() {
    return {
      active: [],
      events: [],
    };
  },

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

          this.storage.active = this.storage.active.filter(
            (f: Feedback) => f.type !== feedback.type || f.parent !== feedback.type
          );

          return true;
        },

      addActiveFeedback: (feedback) => () => {
        if (!feedback.type || !feedback.config) {
          return false;
        }

        const activeFeedback = this.storage.active.find((f: Feedback) => f.id === feedback.id);

        // Do not add the feedback if there already exists this feedback
        if (!activeFeedback) {
          this.storage.active = [...this.storage.active, feedback];

          /*
          this.editor.storage.document.eventBus().emit("feedback-presented", {
            type: "feedback-presented",
            parent: feedback.parent,
            facts: {},
            data: feedback,
            label: {
              message: "global.event.type-feedback-presented",
              hexIcon: !!feedback.parent ? calculateHexIcon(feedback.parent) : undefined,
            },
          });
           */
        }

        return true;
      },

      updateActiveFeedback: (feedback, attributes) => () => {
        this.storage.active = this.storage.active.map((f: Feedback) => {
          if (
            f.type === feedback.type &&
            f.parent === feedback.parent &&
            isEqual(f.config, feedback.config)
          ) {
            return {
              ...f,
              ...attributes,
            };
          } else {
            return f;
          }
        });

        return true;
      },

      removeActiveFeedback: (feedback) => () => {
        this.storage.active = this.storage.active.filter((f: Feedback) => {
          return !(
            f.type === feedback.type &&
            f.parent === feedback.parent &&
            isEqual(f.config, feedback.config)
          );
        });

        return true;
      },

      addEventOption: (eventOption) => () => {
        const option = this.storage.events.find(
          (o: EventOption) => o.name === eventOption.name && o.parent === eventOption.parent
        );
        if (!option) {
          this.storage.events = [...this.storage.events, eventOption];
        }

        return true;
      },

      removeEventOption: (eventOption) => () => {
        this.storage.events = this.storage.events.filter(
          (o: EventOption) => o.name !== eventOption.name && o.parent !== eventOption.parent
        );

        return true;
      },

      addEventCondition: (event, parent, condition) => () => {
        this.storage.events = this.storage.events.map((o: EventOption) => {
          if (
            o.name === event &&
            o.parent === parent &&
            !o.conditions.find((c: EventCondition) => isEqual(c, condition))
          ) {
            return { ...o, conditions: [...o.conditions, condition] };
          } else {
            return o;
          }
        });

        return true;
      },

      updateEventCondition: (event, parent, condition, attributes) => () => {
        this.storage.events = this.storage.events.map((o: EventOption) => {
          if (o.name === event && o.parent === parent) {
            return {
              ...o,
              conditions: o.conditions.map((c: EventCondition) => {
                if (isEqual(c, condition)) {
                  return { ...c, ...attributes };
                } else {
                  return c;
                }
              }),
            };
          } else {
            return o;
          }
        });

        return true;
      },

      removeEventCondition: (event, parent, condition) => () => {
        this.storage.events = this.storage.events.map((o: EventOption) => {
          if (o.name === event && o.parent === parent) {
            return {
              ...o,
              conditions: o.conditions.filter((c: EventCondition) => !isEqual(c, condition)),
            };
          } else {
            return o;
          }
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
