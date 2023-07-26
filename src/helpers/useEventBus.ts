import { checkRules } from "@/extensions/feedback/helpers/checkRules";
import { provide } from "vue";
import mitt from "mitt";

import type { EmittedEvent, Label } from "@/extensions/document/types";
import type { Emitter } from "mitt";
import type { Event } from "@/extensions/document/types";
import type { EventFacts } from "@/extensions/feedback/types";
import type { SetupContext } from "vue";
import type { EventRule, EventTrigger, Feedback } from "@/extensions/feedback/types";
import type { Editor } from "@tiptap/vue-3";

export type Events = {
  interaction: {
    type: string;
    parent: string | null;
    facts: EventFacts;
    data: object;
    label: Label;
  };
};

export type InjectedEventBus = {
  eventBus: Emitter<Events>;
};

export default function(
  editor: Editor,
  context: SetupContext<("update:content" | "update:state" | "event" | "check" | "next" | "feedback")[]>,
  addActiveFeedback: (feedback: Feedback) => void
): InjectedEventBus {
  const eventBus = mitt<Events>();

  eventBus.on("interaction", (e: Event) => {
    const triggers: EventTrigger[] = editor.getAttributes("document").triggers;
    const feedbacks: Feedback[] = editor.getAttributes("document").feedbacks;

    // Filter the stored triggers for events that match type and parent
    const eventTriggerWithType = triggers.filter(
      (trigger: EventTrigger) => trigger.event === e.type && trigger.parent === e.parent
    );

    // For each event trigger in the filtered list, check if the rules are fulfilled.
    // If this holds add them to the state store of active feedbacks.
    eventTriggerWithType.forEach((trigger: EventTrigger) => {
      if (
        trigger.rules.every((rule: EventRule) => {
          return checkRules(rule, e.facts);
        })
      ) {
        trigger.feedbacks.forEach((id: string) => {
          const feedback = feedbacks.find((f: Feedback) => f.id === id);
          if (feedback) {
            addActiveFeedback(feedback);
          }
        });
      }
    });

    context.emit("event", {
      type: e.type,
      ts: Date.now(),
      facts: e.facts,
      data: e.data,
      label: e.label
    } as EmittedEvent);

    /* Emit special events */
    if (e.type === "answer-submitted") {
      context.emit("check");
    }
    if (e.type === "next-clicked") {
      context.emit("next");
    }
    if (e.type === "feedback-clicked") {
      context.emit("feedback");
    }
  });


  provide("eventBus", { eventBus });

  return { eventBus };
}
