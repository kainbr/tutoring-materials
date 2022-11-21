// Inspired by https://github.com/joevallender/tiptap2-image-example
import Image from "@tiptap/extension-image";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import ImageComponent from "./ImageComponent.vue";
import Compressor from "compressorjs";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      /**
       * Uploads an image, compresses it and adds it to the document.
       */
      uploadImage: (file: File | Blob) => ReturnType;
    };
  }
}

export const CustomImage = Image.extend({
  name: "image",

  selectable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: "320",
        rendered: false,
      },
      float: {
        default: "none",
        rendered: false,
      },
    };
  },

  addCommands() {
    return {
      uploadImage: (file: File | Blob) => () => {
        if (!file) {
          return false;
        }

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
              this.editor.commands.insertContent({
                type: this.name,
                attrs: {
                  src: a.result,
                },
              });
            };
            a.readAsDataURL(result);
          },
          error: function (err: Error) {
            window.alert(err.message);
          },
        });

        return true;
      },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageComponent);
  },
});
