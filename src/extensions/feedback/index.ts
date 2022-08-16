import { Extension, findChildren } from "@tiptap/core";
import { v4 as uuid } from "uuid";
import type { Feedback, EventTrigger, EventOption } from "@/extensions/feedback/types";
import type { MarkFeedback } from "@/extensions/feedback/mark/types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feedback: {
      /**
       * Todo: Add method description
       */
      addFeedback: (feedback: Feedback) => ReturnType;
      /**
       * Todo: Add method description
       */
      updateFeedback: (feedback: Feedback, attributes: object) => ReturnType;
      /**
       * Todo: Add method description
       */
      removeFeedback: (feedback: Feedback) => ReturnType;
      /**
       * Todo: Add method description
       */
      addActiveFeedback: (feedback: Feedback) => ReturnType;
      /**
       * Todo: Add method description
       */
      updateActiveFeedback: (feedback: Feedback, attributes: object) => ReturnType;
      /**
       * Todo: Add method description
       */
      removeActiveFeedback: (feedback: Feedback) => ReturnType;
      /**
       * Todo: Add method description
       */
      addEventOption: (event: EventOption) => ReturnType;
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
      updateEventTrigger: (trigger: EventTrigger, attributes: object) => ReturnType;
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
    if (!this.editor.isEditable) {
      this.editor.storage.document.eventBus.on("*", (type: string) => {
        const triggers: EventTrigger[] = this.editor.getAttributes("document").triggers;
        const feedbacks: Feedback[] = this.editor.getAttributes("document").feedbacks;
        const eventTriggerWithType = triggers.filter(
          (trigger: EventTrigger) => trigger.event === type
        );

        eventTriggerWithType.forEach((eventTrigger: EventTrigger) => {
          // Todo: Check conditions

          // If conditions are fulfilled, the feedback is added to the list of active feedbacks
          eventTrigger.feedbackIds.forEach((feedbackId: string) => {
            const feedback = feedbacks.find((f: Feedback) => f.id === feedbackId);
            if (feedback) {
              this.editor.commands.addActiveFeedback(feedback);
            }
          });
        });
      });
    }
  },

  addCommands() {
    return {
      addFeedback:
        (feedback) =>
        ({ commands }) => {
          commands.updateAttributes("document", {
            feedbacks: [
              ...this.editor.getAttributes("document").feedbacks,
              { ...feedback, id: uuid() },
            ],
          });
          return true;
        },

      updateFeedback:
        (feedback, attributes) =>
        ({ commands }) => {
          if (!feedback.id) {
            return false;
          }

          const feedbacks = this.editor.getAttributes("document").feedbacks;
          const index = feedbacks.findIndex((s: Feedback) => {
            return s.id === feedback.id && s.id;
          });

          if (!index && index !== 0) {
            return false;
          }

          feedbacks[index].config = { ...feedbacks[index].config, ...attributes };

          commands.updateAttributes("document", {
            feedbacks,
          });

          return true;
        },

      removeFeedback:
        (feedback) =>
        ({ commands }) => {
          if (!feedback.id) {
            return false;
          }

          const feedbacks = this.editor.getAttributes("document").feedbacks;

          if (feedback.type === "feedback-mark") {
            // Check if this is the last feedback with this ref
            const feedbacksWithRef = feedbacks.filter((s: MarkFeedback) => {
              return "ref" in s.config && s.config.ref === (feedback as MarkFeedback).config.ref;
            });

            if (feedbacksWithRef.length <= 1) {
              commands.removeFeedbackMark((feedback as MarkFeedback).config.ref);
            }
          }

          const documentNode = findChildren(
            this.editor.state.doc,
            (node) => node.type.name === "document"
          )[0];
          commands.updateAttributes("document", {
            feedbacks: feedbacks.filter((s: Feedback) => s.id !== feedback.id),
            // Remove feedback from triggers using it
            triggers: documentNode.node.attrs.triggers.map((trigger: EventTrigger) => {
              trigger.feedbackIds = trigger.feedbackIds.filter((id) => id !== feedback.id);
              return trigger;
            }),
          });

          this.storage.activeFeedbacks = this.storage.activeFeedbacks.filter(
            (f: Feedback) =>
              JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(f)) !==
              JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(feedback))
          );

          return true;
        },

      addActiveFeedback: (feedback) => () => {
        if (!feedback.type) {
          return false;
        }

        if (!feedback.id) {
          feedback.id = uuid();
        }

        const index = this.storage.activeFeedbacks.findIndex(
          (s: Feedback) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(s)) ===
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(feedback))
        );

        if (!index) {
          return false;
        }

        this.storage.activeFeedbacks = [...this.storage.activeFeedbacks, feedback];

        return true;
      },

      updateActiveFeedback: (feedback, attributes) => () => {
        const index = this.storage.activeFeedbacks.findIndex(
          (s: Feedback) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(s)) ===
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(feedback))
        );

        if (!index) {
          return false;
        }

        this.storage.activeFeedbacks[index] = {
          ...this.storage.activeFeedbacks[index],
          ...attributes,
        };

        return true;
      },

      removeActiveFeedback: (feedback) => () => {
        this.storage.activeFeedbacks = this.storage.activeFeedbacks.filter(
          (f: Feedback) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(f)) !==
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(feedback))
        );

        return true;
      },

      addEventOption: (option) => () => {
        const eventOption = this.storage.eventOptions.find(
          (o: EventOption) => o.name === option.name
        );
        if (!eventOption) {
          this.storage.eventOptions = [...this.storage.eventOptions, option];
        }

        return true;
      },

      removeEventOption: (option) => () => {
        this.storage.eventOptions = this.storage.eventOptions.filter(
          (o: EventOption) => JSON.stringify(o) !== JSON.stringify(option)
        );

        return true;
      },

      addEventTrigger:
        (trigger) =>
        ({ commands }) => {
          commands.updateAttributes("document", {
            triggers: [
              ...this.editor.getAttributes("document").triggers,
              { ...trigger, id: uuid() },
            ],
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
