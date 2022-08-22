// noinspection JSUnusedGlobalSymbols

import { Extension, findChildren } from "@tiptap/core";
import type {
  Feedback,
  EventTrigger,
  EventOption,
  StoredFeedback,
} from "@/extensions/feedback/types";
import type { MarkFeedback } from "@/extensions/feedback/mark/types";
import type { Event } from "@/extensions/document/types";
import { isEqual } from "lodash-es";
import type { NodeWithPos } from "@tiptap/vue-3";
import { Plugin, PluginKey } from "prosemirror-state";
import { v4 as uuid } from "uuid";
import { getAttributes } from "@tiptap/vue-3";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feedback: {
      /**
       * Adds a feedback to the permanent feedback store.
       */
      addFeedback: (feedback: StoredFeedback) => ReturnType;
      /**
       * Updates a feedback in the permanent feedback store.
       */
      updateFeedback: (feedback: StoredFeedback, attributes: Partial<StoredFeedback>) => ReturnType;
      /**
       * Removes a feedback from the permanent feedback store.
       */
      removeFeedback: (feedback: StoredFeedback, removeEmptyTrigger?: boolean) => ReturnType;
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
       * Todo: Add method description
       */
      addEventOption: (event: EventOption) => ReturnType;
      /**
       * Todo: Add method description
       */
      updateEventOption: (event: EventOption, attributes: Partial<EventOption>) => ReturnType;
      /**
       * Todo: Add method description
       */
      removeEventOption: (trigger: EventOption) => ReturnType;
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
  activeFeedbacks: Feedback[];
  eventOptions: EventOption[];
}

export const FeedbackExtension = Extension.create<unknown, FeedbackExtensionStorage>({
  name: "feedback",

  addStorage() {
    return {
      activeFeedbacks: [],
      eventOptions: [],
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

  onBeforeCreate() {
    // Listen to all events that are emitted
    this.editor.storage.document.eventBus().on("*", (type: string, event: Event) => {
      const triggers: EventTrigger[] = this.editor.getAttributes("document").triggers;
      const feedbacks: StoredFeedback[] = this.editor.getAttributes("document").feedbacks;

      // Filter the stored triggers for events that match type and parent
      const eventTriggerWithType = triggers.filter(
        (trigger: EventTrigger) => trigger.event === type && trigger.parent === event.parent
      );

      // console.log("eventTriggerWithType", eventTriggerWithType);

      // For each event trigger in the filtered list, check if the conditions are fulfilled and if true
      // add them to the state store of active feedbacks.
      eventTriggerWithType.forEach((trigger: EventTrigger) => {
        // Todo: Check conditions
        console.log("Set conditions: ", trigger.conditions);
        console.log("Available conditions: ", event.conditions);

        trigger.feedbacks.forEach((id: string) => {
          const feedback = feedbacks.find((f: StoredFeedback) => f.id === id);
          if (feedback) {
            this.editor.commands.addActiveFeedback(feedback);
          }
        });
      });
    });
  },

  /*
  onCreate() {
    this.editor.on("update", ({ editor }) => {
      const tasksInContent = findChildren(editor.state.doc, (node) =>
        node.type.name.startsWith("task-")
      ).map((n: NodeWithPos) => n.node.attrs.id);
      const feedbacks = editor.getAttributes("document").feedbacks;
      const triggers = editor.getAttributes("document").triggers;

      const tasksInFeedbacksAndNotInContent = feedbacks
        .map((f: StoredFeedback) => f.parent)
        .filter((x: StoredFeedback) => !tasksInContent.includes(x));
      const tasksInTriggersAndNotInContent = triggers
        .map((t: EventTrigger) => t.parent)
        .filter((x: EventTrigger) => !tasksInContent.includes(x));

      if (tasksInFeedbacksAndNotInContent.length > 0 || tasksInTriggersAndNotInContent.length > 0) {
        editor.commands.updateAttributes("document", {
          feedbacks: feedbacks.filter(
            (f: StoredFeedback) => !tasksInFeedbacksAndNotInContent.includes(f.parent)
          ),
          triggers: triggers.filter(
            (t: EventTrigger) => !tasksInTriggersAndNotInContent.includes(t.parent)
          ),
        });
      }
    });
  },
   */

  /*
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("feedback"),
        appendTransaction: (transaction, oldState, newState) => {
          // Nothing has changed. Ignore it.
          if (newState.doc === oldState.doc) {
            return;
          }

          const tr = newState.tr;

          console.log("newState", newState);
          const tasksInContent = findChildren(newState.doc, (node) =>
            node.type.name.startsWith("task-")
          ).map((n: NodeWithPos) => n.node.attrs.id);
          const feedbacks = getAttributes(newState, "document").feedbacks;
          const triggers = getAttributes(newState, "document").triggers;

          const tasksInFeedbacksAndNotInContent = feedbacks
            .map((f: StoredFeedback) => f.parent)
            .filter((x: StoredFeedback) => !tasksInContent.includes(x));
          const tasksInTriggersAndNotInContent = triggers
            .map((t: EventTrigger) => t.parent)
            .filter((x: EventTrigger) => !tasksInContent.includes(x));

          console.log("final", tasksInFeedbacksAndNotInContent, tasksInTriggersAndNotInContent);

           */
  /*
          newState.doc.descendants((node, pos) => {
            if (node.isBlock && node.type.name.startsWith("task-") && !node.attrs.id) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id: uuid(),
              });
            }
          });

          return tr;
        },
      }),
    ];
  },
           */

  addCommands() {
    return {
      addFeedback:
        (feedback) =>
        ({ commands }) => {
          console.log("addFeedback", this.editor.getAttributes("document").feedbacks, feedback);

          commands.updateAttributes("document", {
            feedbacks: [...this.editor.getAttributes("document").feedbacks, feedback],
          });

          return true;
        },

      updateFeedback:
        (feedback, attributes) =>
        ({ commands }) => {
          const feedbacks = this.editor
            .getAttributes("document")
            .feedbacks.map((s: StoredFeedback) => {
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
            feedbacks: feedbacks.filter((s: StoredFeedback) => s.id !== feedback.id),
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

          this.storage.activeFeedbacks = this.storage.activeFeedbacks.filter(
            (f: Feedback) => f.type !== feedback.type || f.parent !== feedback.type
          );

          return true;
        },

      addActiveFeedback: (feedback) => () => {
        if (!feedback.type || !feedback.config) {
          return false;
        }

        const activeFeedback = this.storage.activeFeedbacks.find(
          (f: Feedback) =>
            f.type === feedback.type &&
            f.parent === feedback.parent &&
            isEqual(f.config, feedback.config)
        );

        // Do not add the feedback if there already exists this feedback
        if (!!activeFeedback) {
          return false;
        }

        this.storage.activeFeedbacks = [...this.storage.activeFeedbacks, feedback];

        return true;
      },

      updateActiveFeedback: (feedback, attributes) => () => {
        this.storage.activeFeedbacks = this.storage.activeFeedbacks.map((f: Feedback) => {
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
        this.storage.activeFeedbacks = this.storage.activeFeedbacks.filter((f: Feedback) => {
          return !(
            f.type === feedback.type &&
            f.parent === feedback.parent &&
            isEqual(f.config, feedback.config)
          );
        });

        return true;
      },

      addEventOption: (option) => () => {
        const eventOption = this.storage.eventOptions.find(
          (o: EventOption) => o.name === option.name && o.parent === option.parent
        );
        if (!eventOption) {
          this.storage.eventOptions = [...this.storage.eventOptions, option];
        }

        return true;
      },

      updateEventOption: (option, attributes) => () => {
        this.storage.eventOptions = this.storage.eventOptions.map((o: EventOption) => {
          if (o.name === option.name && o.parent === option.parent) {
            return { ...o, ...attributes };
          } else {
            return { ...o };
          }
        });

        return true;
      },

      removeEventOption: (option) => () => {
        this.storage.eventOptions = this.storage.eventOptions.filter(
          (o: EventOption) => o.name !== option.name && o.parent !== option.parent
        );

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
