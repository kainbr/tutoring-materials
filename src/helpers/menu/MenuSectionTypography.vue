<template>
  <div class="gap-0.5">
    <EditorMenuButton
      :active="editor.isActive('bold')"
      :on-active-click="() => editor.chain().focus().toggleBold().run()"
      :on-inactive-click="() => editor.chain().focus().toggleBold().run()"
    >
      <IconBold />
    </EditorMenuButton>
    <EditorMenuButton
      :active="editor.isActive('italic')"
      :on-active-click="() => editor.chain().focus().toggleItalic().run()"
      :on-inactive-click="() => editor.chain().focus().toggleItalic().run()"
    >
      <IconItalic />
    </EditorMenuButton>
    <EditorMenuButton
      :active="editor.isActive('underline')"
      :on-active-click="() => editor.chain().focus().toggleUnderline().run()"
      :on-inactive-click="() => editor.chain().focus().toggleUnderline().run()"
    >
      <IconUnderline />
    </EditorMenuButton>
    <span class="ml-0.5 relative z-10 inline-flex">
      <Menu as="span" class="-ml-px relative block">
        <MenuButton
          class="relative inline-flex items-center text-center hover:bg-black hover:fill-white focus:outline-none font-medium rounded-lg text-sm p-1 h-full"
        >
          <span class="sr-only">Open options</span>
          <IconFontColor
            :fill="
              editor.getAttributes('textStyle').color ? editor.getAttributes('textStyle').color : ''
            "
          />
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="origin-top-right absolute z-0 right-0 -mr-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none translate-x-1/2"
          >
            <div class="flex flex-row p-2">
              <MenuItem>
                <div
                  class="bg-white border border-red-500 relative p-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().unsetColor().run()"
                >
                  <span aria-hidden="true" class="bg-white h-2 w-2 rounded-full" />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-black relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#000000').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-black h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-red-500 relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#EF4444').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-red-500 h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-green-500 relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#22C55E').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-green-500 h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-yellow-500 relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#EAB308').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-yellow-500 h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-blue-500 relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#3B82F6').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-blue-500 h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </span>
    <span class="ml-0.5 relative z-10 inline-flex">
      <Menu as="span" class="-ml-px relative block">
        <MenuButton
          :class="{
            'bg-black fill-white':
              editor.isActive('strike') ||
              editor.isActive('subscript') ||
              editor.isActive('superscript'),
          }"
          class="relative hover:bg-black hover:fill-white focus:outline-none font-medium rounded-lg text-sm p-1 text-center inline-flex items-center"
        >
          <IconText />
          <IconDropDown />
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="origin-top-right absolute right-0 -mr-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="flex flex-row">
              <MenuItem>
                <button
                  :class="{
                    'bg-black fill-white': editor.isActive('strike'),
                  }"
                  class="hover:bg-black hover:fill-white rounded-l-lg focus:outline-none font-medium text-sm p-1 text-center inline-flex items-center"
                  @click="editor.chain().focus().toggleStrike().run()"
                >
                  <IconStrikeThrough />
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  :class="{
                    'bg-black fill-white': editor.isActive('subscript'),
                  }"
                  class="hover:bg-black hover:fill-white focus:outline-none font-medium text-sm p-1 text-center inline-flex items-center"
                  @click="editor.chain().focus().toggleSubscript().run()"
                >
                  <IconSubscript />
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  :class="{
                    'bg-black fill-white': editor.isActive('superscript'),
                  }"
                  class="hover:bg-black hover:fill-white focus:outline-none font-medium text-sm p-1 text-center inline-flex items-center"
                  @click="editor.chain().focus().toggleSuperscript().run()"
                >
                  <IconSuperscript />
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  class="hover:bg-black hover:fill-white focus:outline-none font-medium rounded-r-lg text-sm p-1 text-center inline-flex items-center"
                  @click="editor.chain().focus().unsetAllMarks().run()"
                >
                  <IconFormatClear />
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconBold from "@/helpers/icons/IconBold.vue";
import IconDropDown from "@/helpers/icons/IconDropDown.vue";
import IconFontColor from "@/helpers/icons/IconFontColor.vue";
import IconFormatClear from "@/helpers/icons/IconFormatClear.vue";
import IconItalic from "@/helpers/icons/IconItalic.vue";
import IconStrikeThrough from "@/helpers/icons/IconStrikeThrough.vue";
import IconSubscript from "@/helpers/icons/IconSubscript.vue";
import IconSuperscript from "@/helpers/icons/IconSuperscript.vue";
import IconText from "@/helpers/icons/IconText.vue";
import IconUnderline from "@/helpers/icons/IconUnderline.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

export default defineComponent({
  name: "MenuSectionTypography",

  components: {
    IconBold,
    IconDropDown,
    IconFontColor,
    IconFormatClear,
    IconItalic,
    IconStrikeThrough,
    IconSubscript,
    IconSuperscript,
    IconText,
    IconUnderline,
    EditorMenuButton,
    // eslint-disable-next-line vue/no-reserved-component-names
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },
});
</script>
