<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-10" @close="$emit('update:open', false)">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ $t("editor.feedback.hint-modal-edit-title") }}
              </DialogTitle>

              <div class="mt-5">
                <InlineEditor
                  :content="feedback?.config.content"
                  :is-editor="true"
                  @update:content="updateContentCandidate"
                />
              </div>

              <div class="flex mt-4 w-full justify-between">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  @click="removeFeedback"
                >
                  {{ $t("editor.feedback.hint-modal-remove-button") }}
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="updateFeedback"
                >
                  {{ $t("editor.feedback.hint-modal-save-button") }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import InlineEditor from "@/helpers/InlineEditor.vue";
import type { Editor, JSONContent } from "@tiptap/vue-3";
import type { Feedback } from "@/extensions/feedback/types";
import { v4 as uuid } from "uuid";
import type { HintFeedback } from "@/extensions/feedback/hint/types";

export default defineComponent({
  name: "ConfigurationModal",

  components: {
    InlineEditor,
    TransitionRoot,
    TransitionChild,
    // eslint-disable-next-line vue/no-reserved-component-names
    Dialog,
    DialogPanel,
    DialogTitle,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
  },

  emits: ["update:open"],

  data() {
    return {
      contentCandidate: null as JSONContent | null,
    };
  },

  computed: {
    feedback() {
      return this.editor
        .getAttributes("document")
        .feedbacks.find(
          (f: Feedback) =>
            f.type === "feedback-hint" &&
            f.parent === this.parent &&
            (f as HintFeedback).config.reference === this.reference
        );
    },
  },

  created() {
    this.contentCandidate = this.feedback?.config.content;
  },

  methods: {
    updateContentCandidate($event: JSONContent) {
      this.contentCandidate = $event;
    },
    updateFeedback() {
      if (!this.feedback) {
        this.$emit("update:open", false);
        const id = uuid();
        this.editor.commands.addFeedbackHint({
          id,
          parent: this.parent,
          config: {
            reference: this.reference,
            content: this.contentCandidate as JSONContent,
          },
        });
        /*
        this.editor
          .chain()
          .addFeedbackHint({
            id,
            parent: this.parent,
            config: {
              reference: this.reference,
              content: this.contentCandidate as JSONContent,
            },
          })
          .addEventTrigger({
            id: uuid(),
            event: "answer-submitted",
            conditions: [{ name: "", variable: this.reference + "-incorrect", value: false }],
            feedbacks: [id],
            parent: this.parent,
          })
          .run();
         */
      } else {
        this.editor.commands.updateFeedback(this.feedback, {
          config: { ...this.feedback.config, content: this.contentCandidate },
        });
        this.$emit("update:open", false);
      }
    },
    removeFeedback() {
      if (!this.feedback) {
        this.$emit("update:open", false);
      } else {
        this.editor.commands.removeFeedback(this.feedback, true);
        this.$emit("update:open", false);
      }
    },
  },
});
</script>
