<template>
  <feedback-configuration-component :editor="editor" :feedback="feedback">
    <template #default>
      <IconArrowRight class="w-5 h-5 fill-slate-500" />
      <span class="w-32 flex-auto truncate"> {{ extractText(feedback.config.content) }} </span>
      <button
        type="button"
        class="mx-3 flex-shrink-0 text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="open = true"
      >
        {{ $t("editor.feedback.hint-modal-edit-button") }}
      </button>
      <TransitionRoot appear :show="open" as="template">
        <Dialog as="div" class="relative z-10" @close="open = false">
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
                      show-top-menu
                      :show-bubble-menu="false"
                      @update:content="contentCandidate = $event"
                    />
                  </div>

                  <div class="flex mt-4 w-full justify-between">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      @click="removeHintFeedback"
                    >
                      {{ $t("editor.feedback.hint-modal-remove-button") }}
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click="updateHintFeedback"
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
  </feedback-configuration-component>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { getText } from "@tiptap/vue-3";
import { Node } from "prosemirror-model";
import FeedbackConfigurationComponent from "@/extensions/feedback/FeedbackConfigurationComponent.vue";
import IconArrowRight from "@/helpers/icons/IconArrowRight.vue";
import InlineEditor from "@/helpers/InlineEditor.vue";

import type { Editor } from "@tiptap/vue-3";
import type { HintFeedback } from "@/extensions/feedback/hint/types";
import type { JSONContent } from "@tiptap/vue-3";
import type { InjectedFeedbacks } from "@/helpers/useFeedbacks";
import type { PropType } from "vue";

export default defineComponent({
  name: "FeedbackHintConfigurationComponent",

  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Dialog,
    DialogPanel,
    DialogTitle,
    FeedbackConfigurationComponent,
    IconArrowRight,
    InlineEditor,
    TransitionChild,
    TransitionRoot,
  },

  props: {
    feedback: {
      type: Object as PropType<HintFeedback>,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  setup(props) {
    const { removeActiveFeedback } = inject("feedbacks") as InjectedFeedbacks;

    const open = ref(false);
    const contentCandidate = ref(props.feedback.config.content);

    const updateHintFeedback = () => {
      removeActiveFeedback(props.feedback);

      props.editor.commands.updateFeedback(props.feedback, {
        config: {
          ...props.feedback.config,
          content: contentCandidate.value,
        },
      });

      open.value = false;
    };

    const removeHintFeedback = () => {
      props.editor.commands.removeFeedback(props.feedback);
      open.value = false;
    };

    const extractText = (content: JSONContent) => {
      return getText(Node.fromJSON(props.editor.schema, content));
    };

    return {
      open,
      contentCandidate,
      updateHintFeedback,
      removeHintFeedback,
      extractText,
    };
  },
});
</script>
