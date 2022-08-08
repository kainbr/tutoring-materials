<template>
  <div class="bg-slate-50 rounded-b-lg">
    <div class="w-full">
      <div class="mx-auto w-full py-2 max-w flex flex-row flex-wrap gap-0.5">
        <Disclosure v-slot="{ open }">
          <DisclosureButton
            class="flex flex-row grow items-center justify-start px-4 py-1 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
          >
            <IconDropDown :class="open ? '' : '-rotate-90 transform'" />
            <span class="ml-3 text-base font-normal">{{
              $t("editor:footer:headline-feedback")
            }}</span>
          </DisclosureButton>

          <!-- Notification -->
          <EditorMenuButton :on-inactive-click="() => editor.commands.addFeedbackNotification({})">
            <IconNotification />
          </EditorMenuButton>

          <!-- Mark -->
          <EditorMenuButton
            class="mr-2"
            :active="editor.isActive('feedback-mark')"
            :on-active-click="() => editor.chain().focus().unsetFeedbackMark().run()"
            :on-inactive-click="() => editor.chain().focus().setFeedbackMark().run()"
          >
            <IconText />
          </EditorMenuButton>

          <DisclosurePanel class="basis-full text-sm text-gray-500">
            <div class="flex flex-col w-full max-h-44 overflow-auto">
              <FeedbackConfigurationListComponent
                :editor="editor"
                :feedbacks="[...document?.node.attrs.feedbacks.filter((s) => s.parent === null)]"
                class="p-2"
              />
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
    <div class="w-full border-t">
      <div class="mx-auto w-full py-2 max-w flex flex-row flex-wrap gap-0.5">
        <Disclosure v-slot="{ open }">
          <DisclosureButton
            class="flex flex-row grow items-center justify-start px-4 py-1 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
          >
            <IconDropDown :class="open ? '' : '-rotate-90 transform'" />
            <span class="ml-3 text-base font-normal">{{
              $t("editor:footer:headline-trigger")
            }}</span>
          </DisclosureButton>

          <EditorMenuButton
            class="mr-2"
            :on-inactive-click="
              () =>
                editor.commands.addEventTrigger({
                  event: null,
                  conditions: [],
                  feedbackIds: [],
                })
            "
          >
            <IconAdd />
          </EditorMenuButton>

          <DisclosurePanel class="basis-full w-full text-sm text-gray-500">
            <EventTriggerListComponent
              :editor="editor"
              :triggers="[...document?.node.attrs.triggers]"
              class="p-2"
            />
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { findChildren } from "@tiptap/core";
import IconDropDown from "@/helpers/icons/IconDropDown.vue";
import IconNotification from "@/helpers/icons/IconNotification.vue";
import IconText from "@/helpers/icons/IconText.vue";
import IconAdd from "@/helpers/icons/IconAdd.vue";
import FeedbackConfigurationListComponent from "@/feedbacks/ConfigurationListComponent.vue";
import EventTriggerListComponent from "@/events/EventTriggerListComponent.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";

export default defineComponent({
  name: "EditorFooter",

  components: {
    IconAdd,
    IconDropDown,
    IconNotification,
    IconText,
    FeedbackConfigurationListComponent,
    EventTriggerListComponent,
    EditorMenuButton,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
    };
  },

  computed: {
    document() {
      return findChildren(this.editor.state.doc, (node) => node.type.name === "document")[0];
    },
  },
});
</script>
