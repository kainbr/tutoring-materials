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
              $t("editor.footer.headline-feedback")
            }}</span>
          </DisclosureButton>

          <!-- Test -->
          <EditorMenuButton
            v-tippy="$t('editor.menu.feedback-notification-add-tooltip')"
            :on-inactive-click="() => editor.commands.addFeedbackHint({})"
          >
            <IconNotification />
          </EditorMenuButton>

          <!-- Notification -->
          <EditorMenuButton
            v-tippy="$t('editor.menu.feedback-notification-add-tooltip')"
            :on-inactive-click="() => editor.commands.addFeedbackNotification({})"
          >
            <IconNotification />
          </EditorMenuButton>

          <!-- Mark -->
          <EditorMenuButton
            v-tippy="$t('editor.menu.feedback-typography-toggle-tooltip')"
            class="mr-2"
            :active="editor.isActive('feedback-mark')"
            :on-active-click="() => editor.chain().focus().unsetFeedbackMark().run()"
            :on-inactive-click="() => editor.chain().focus().setFeedbackMark().run()"
          >
            <IconText />
          </EditorMenuButton>

          <DisclosurePanel class="basis-full text-sm text-gray-500">
            <div class="flex flex-col w-full max-h-44 overflow-auto">
              <FeedbackListComponent
                :editor="editor"
                :feedbacks="[
                  ...editor.getAttributes('document').feedbacks.filter((s) => s.parent === null),
                ]"
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
              $t("editor.footer.headline-trigger")
            }}</span>
          </DisclosureButton>

          <EditorMenuButton class="mr-2" :on-inactive-click="addEventTrigger">
            <IconAdd />
          </EditorMenuButton>

          <DisclosurePanel class="basis-full w-full text-sm text-gray-500">
            <EventTriggerListComponent
              :editor="editor"
              :triggers="[...editor.getAttributes('document').triggers]"
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
import IconDropDown from "@/helpers/icons/IconDropDown.vue";
import IconNotification from "@/helpers/icons/IconNotification.vue";
import IconText from "@/helpers/icons/IconText.vue";
import IconAdd from "@/helpers/icons/IconAdd.vue";
import FeedbackListComponent from "@/extensions/feedback/FeedbackListComponent.vue";
import EventTriggerListComponent from "@/extensions/feedback/EventTriggerListComponent.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { v4 as uuid } from "uuid";
import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";

export default defineComponent({
  name: "EditorFooter",

  components: {
    IconAdd,
    IconDropDown,
    IconNotification,
    IconText,
    FeedbackListComponent,
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

  setup(props) {
    const addEventTrigger = () => {
      props.editor.commands.addEventTrigger({
        id: uuid(),
        event: null,
        conditions: [],
        feedbacks: [],
      });
    };

    return { addEventTrigger };
  },
});
</script>
