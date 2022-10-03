<template>
  <TransitionRoot :show="modelValue" appear as="template">
    <Dialog
      :open="modelValue"
      as="div"
      class="relative z-10"
      :initial-focus="uploadInput"
      @close="$emit('update:modelValue', false)"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-300"
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
              <div class="flex flex-row w-full justify-between">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  <span>Upload new image</span>
                </DialogTitle>
                <IconClose class="cursor-pointer" @click="$emit('update:modelValue', false)" />
              </div>
              <div
                class="mt-2 flex justify-center items-center w-full"
                @change="changeFile"
                @dragover="dragoverFile"
                @drop="dropFile"
              >
                <label
                  class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  for="dropzone-file-upload"
                >
                  <IconUploadCloud />
                  <span class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Click to upload or drag file here.
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    Supported file formats: PNG, JPG and JPEG
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    Images are compressed while uploading
                  </span>
                  <input
                    id="dropzone-file-upload"
                    ref="uploadInput"
                    accept="image/png, image/jpeg"
                    class="hidden"
                    name="file-upload"
                    type="file"
                  />
                </label>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import IconClose from "@/helpers/icons/IconClose.vue";
import IconUploadCloud from "@/helpers/icons/IconUploadCloud.vue";
import Compressor from "compressorjs";

export default defineComponent({
  name: "UploadModal",

  components: {
    TransitionRoot,
    TransitionChild,
    IconClose,
    IconUploadCloud,
    // eslint-disable-next-line vue/no-reserved-component-names
    Dialog,
    DialogPanel,
    DialogTitle,
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue", "update:image"],

  setup(props, context) {
    const uploadInput = ref(null);

    function uploadImage(e: Event) {
      const fileList: FileList | null =
        !!e.target && !!(e.target as HTMLInputElement).files
          ? (e.target as HTMLInputElement).files
          : null;

      if (!!fileList && fileList.length > 0) {
        const file: Blob = fileList[0];

        if (!file) return;

        new Compressor(file, {
          strict: true,
          checkOrientation: true,
          maxWidth: 1024,
          maxHeight: 1024,
          minWidth: 0,
          minHeight: 0,
          width: undefined,
          height: undefined,
          resize: "none",
          quality: 0.8,
          mimeType: "",
          convertTypes: "image/png",
          convertSize: 5000000,
          success: (result: Blob) => {
            // Convert result to dataUrl
            const a = new FileReader();
            a.onload = () => {
              context.emit("update:image", a.result);
              context.emit("update:modelValue", false);
            };
            a.readAsDataURL(result);
          },
          error: function (err: Error) {
            window.alert(err.message);
          },
        });
      }
    }

    function changeFile(e: Event) {
      uploadImage(e);
    }

    function dragoverFile(e: Event) {
      e.preventDefault();
    }

    function dropFile(e: Event) {
      e.preventDefault();
      uploadImage(e);
    }

    return { uploadInput, changeFile, dragoverFile, dropFile };
  },
});
</script>
