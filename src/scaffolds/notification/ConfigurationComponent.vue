<template>
  <scaffold-configuration-component :editor="editor" :scaffold="scaffold">
    <template #title> {{ $t("global:feedback:type-scaffold-notification") }}</template>
    <template #default>
      <button
        type="button"
        class="mx-3 flex-shrink-0 text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="isOpen = true"
      >
        {{ $t("editor:feedback:notification-modal-edit-button") }}
      </button>
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" class="relative z-10" @close="isOpen = false">
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
                    {{ $t("editor:feedback:notification-modal-edit-title") }}
                  </DialogTitle>

                  <div class="mt-5">
                    <InlineEditor v-model:content="contentCandidate" :is-editor="true" />
                  </div>

                  <div class="flex mt-4 w-full justify-end">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click="save"
                    >
                      {{ $t("editor:feedback:notification-modal-edit-save-button") }}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </template>
  </scaffold-configuration-component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ScaffoldConfigurationComponent from "../ConfigurationComponent.vue";
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import InlineEditor from "@/helpers/InlineEditor.vue";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { NotificationScaffold } from "@/types";

export default defineComponent({
  name: "ScaffoldNotificationConfigurationComponent",

  components: {
    InlineEditor,
    ScaffoldConfigurationComponent,
    TransitionRoot,
    TransitionChild,
    // eslint-disable-next-line vue/no-reserved-component-names
    Dialog,
    DialogPanel,
    DialogTitle,
  },

  props: {
    scaffold: {
      type: Object as PropType<NotificationScaffold>,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
      isOpen: false,
      contentCandidate: this.scaffold.config?.content,
    };
  },

  methods: {
    save() {
      this.editor.commands.updateScaffold(this.scaffold, {
        content: this.contentCandidate,
      });

      this.isOpen = false;
    },
  },
});
</script>
