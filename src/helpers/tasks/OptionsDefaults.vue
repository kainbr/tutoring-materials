<template>
  <!-- Allow empty answer submissions -->
  <OptionsFormBoolean
    v-if="allowEmptyAnswerSubmission"
    name="allowEmptyAnswerSubmission"
    :value="options.allowEmptyAnswerSubmission"
    :label="$t('editor.task.config-label-allow-empty-answer-submission')"
    :description="$t('editor.task.config-description-allow-empty-answer-submission')"
    @update:value="$emit('update:options', { ...options, allowEmptyAnswerSubmission: $event })"
  ></OptionsFormBoolean>

  <!-- Maximum number of attempts -->
  <OptionsFormBoolean
    v-if="hasMaxAttempts"
    name="hasMaxAttempts"
    :value="options.hasMaxAttempts"
    :label="$t('editor.task.config-label-has-max-attempts')"
    @update:value="$emit('update:options', { ...options, hasMaxAttempts: $event })"
  ></OptionsFormBoolean>
  <!--
    :description="$t('editor.task.config-description-has-max-attempts')"
  -->
  <OptionsFormNumber
    v-if="hasMaxAttempts"
    name="maxAttempts"
    :value="options.maxAttempts"
    :disabled="!options.hasMaxAttempts"
    :min="1"
    :label="$t('editor.task.config-label-max-attempts')"
    @update:value="$emit('update:options', { ...options, maxAttempts: $event })"
  ></OptionsFormNumber>
  <!--
    :description="$t('editor.task.config-description-max-attempts')"
  -->

  <!-- Submit Button -->
  <OptionsFormString
    v-if="hasSubmitButton"
    name="submitButtonText"
    :value="options.textSubmitButton"
    :label="$t('editor.task.config-label-text-submit-button')"
    @update:value="$emit('update:options', { ...options, textSubmitButton: $event })"
  ></OptionsFormString>
  <!--
    :description="$t('editor.task.config-description-text-submit-button')"
  -->

  <!-- Correct State -->
  <OptionsFormString
    v-if="hasCorrectState"
    name="titleCorrectAnswer"
    :value="options.titleCorrectAnswer"
    :label="$t('editor.task.config-label-title-correct-answer')"
    @update:value="$emit('update:options', { ...options, titleCorrectAnswer: $event })"
  ></OptionsFormString>
  <!--
    :description="$t('editor.task.config-description-title-correct-answer')"
  -->
  <OptionsFormString
    v-if="hasCorrectState"
    name="textCorrectAnswer"
    :value="options.textCorrectAnswer"
    :label="$t('editor.task.config-label-text-correct-answer')"
    @update:value="$emit('update:options', { ...options, textCorrectAnswer: $event })"
  ></OptionsFormString>
  <!--
    :description="$t('editor.task.config-description-text-correct-answer')"
  -->

  <!-- Incorrect State -->
  <OptionsFormString
    v-if="hasIncorrectState"
    name="titleIncorrectAnswer"
    :value="options.titleIncorrectAnswer"
    :label="$t('editor.task.config-label-title-incorrect-answer')"
    @update:value="$emit('update:options', { ...options, titleIncorrectAnswer: $event })"
  ></OptionsFormString>
  <!--
    :description="$t('editor.task.config-description-title-incorrect-answer')"
  -->
  <OptionsFormString
    v-if="hasIncorrectState"
    name="textIncorrectAnswer"
    :value="options.textIncorrectAnswer"
    :label="$t('editor.task.config-label-text-incorrect-answer')"
    @update:value="$emit('update:options', { ...options, textIncorrectAnswer: $event })"
  ></OptionsFormString>
  <!--
    :description="$t('editor.task.config-description-text-incorrect-answer')"
  -->

  <!-- Final Incorrect State -->
  <OptionsFormString
    v-if="hasFinalIncorrectState"
    name="titleFinalIncorrectAnswer"
    :value="options.titleFinalIncorrectAnswer"
    :label="$t('editor.task.config-label-title-final-incorrect-answer')"
    @update:value="$emit('update:options', { ...options, titleFinalIncorrectAnswer: $event })"
  ></OptionsFormString>
  <!--
    :description="$t('editor.task.config-description-title-final-incorrect-answer')"
  -->
  <OptionsFormString
    v-if="hasFinalIncorrectState"
    name="textFinalIncorrectAnswer"
    :value="options.textFinalIncorrectAnswer"
    :label="$t('editor.task.config-label-text-final-incorrect-answer')"
    @update:value="$emit('update:options', { ...options, textFinalIncorrectAnswer: $event })"
  ></OptionsFormString>
  <!--
    :description="$t('editor.task.config-description-text-final-incorrect-answer')"
  -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionsFormBoolean from "@/helpers/tasks/OptionsFormBoolean.vue";
import OptionsFormNumber from "@/helpers/tasks/OptionsFormNumber.vue";
import OptionsFormString from "@/helpers/tasks/OptionsFormString.vue";

export default defineComponent({
  name: "OptionsDefaults",

  components: {
    OptionsFormBoolean,
    OptionsFormNumber,
    OptionsFormString,
  },

  props: {
    options: {
      type: Object,
      required: true,
    },
    allowEmptyAnswerSubmission: Boolean,
    hasMaxAttempts: Boolean,
    hasSubmitButton: Boolean,
    hasCorrectState: Boolean,
    hasIncorrectState: Boolean,
    hasFinalIncorrectState: Boolean,
  },

  emits: ["update:options"],
});
</script>
