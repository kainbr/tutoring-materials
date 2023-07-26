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
  <OptionsFormNumber
    v-if="hasMaxAttempts"
    name="maxAttempts"
    :value="options.maxAttempts"
    :disabled="!options.hasMaxAttempts"
    :min="0"
    :label="$t('editor.task.config-label-max-attempts')"
    @update:value="$emit('update:options', { ...options, maxAttempts: $event })"
  ></OptionsFormNumber>

  <!-- Show buttons -->
  <OptionsFormBoolean
    v-if="hasNextButton"
    :label="$t('editor.task.config-label-has-next-button')"
    :value="options.hasNextButton"
    name="hasNextButton"
    @update:value="$emit('update:options', { ...options, hasNextButton: $event })"
  ></OptionsFormBoolean>
  <OptionsFormBoolean
    v-if="hasFeedbackButton"
    :label="$t('editor.task.config-label-has-feedback-button')"
    :value="options.hasFeedbackButton"
    name="hasNextButton"
    @update:value="$emit('update:options', { ...options, hasFeedbackButton: $event })"
  ></OptionsFormBoolean>

  <!-- Disabled check button timer -->
  <OptionsFormBoolean
    v-if="hasDisabledCheckTimer"
    :label="$t('editor.task.config-label-has-disabled-check-timer')"
    :value="options.hasDisabledCheckTimer"
    name="hasDisabledCheckTimer"
    @update:value="$emit('update:options', { ...options, hasDisabledCheckTimer: $event })"
  ></OptionsFormBoolean>
  <OptionsFormNumber
    v-if="hasDisabledCheckTimer"
    :disabled="!options.hasDisabledCheckTimer"
    :label="$t('editor.task.config-label-disabled-check-timer')"
    :min="0"
    :value="options.disabledCheckTimer"
    name="disabledCheckTimer"
    @update:value="$emit('update:options', { ...options, disabledCheckTimer: $event })"
  ></OptionsFormNumber>


  <!-- Disabled next button timer -->
  <OptionsFormBoolean
    v-if="hasDisabledNextTimer"
    :label="$t('editor.task.config-label-has-disabled-next-timer')"
    :value="options.hasDisabledNextTimer"
    name="hasDisabledNextTimer"
    @update:value="$emit('update:options', { ...options, hasDisabledNextTimer: $event })"
  ></OptionsFormBoolean>
  <OptionsFormNumber
    v-if="hasDisabledNextTimer"
    :disabled="!options.hasDisabledNextTimer"
    :label="$t('editor.task.config-label-disabled-next-timer')"
    :min="0"
    :value="options.disabledNextTimer"
    name="disabledNextTimer"
    @update:value="$emit('update:options', { ...options, disabledNextTimer: $event })"
  ></OptionsFormNumber>

  <!-- Submit Button -->
  <OptionsFormString
    v-if="hasSubmitButton"
    name="submitButtonText"
    :value="options.textSubmitButton"
    :label="$t('editor.task.config-label-text-submit-button')"
    @update:value="$emit('update:options', { ...options, textSubmitButton: $event })"
  ></OptionsFormString>

  <!-- Correct State -->
  <OptionsFormString
    v-if="hasCorrectState"
    name="titleCorrectAnswer"
    :value="options.titleCorrectAnswer"
    :label="$t('editor.task.config-label-title-correct-answer')"
    @update:value="$emit('update:options', { ...options, titleCorrectAnswer: $event })"
  ></OptionsFormString>
  <OptionsFormString
    v-if="hasCorrectState"
    name="textCorrectAnswer"
    :value="options.textCorrectAnswer"
    :label="$t('editor.task.config-label-text-correct-answer')"
    @update:value="$emit('update:options', { ...options, textCorrectAnswer: $event })"
  ></OptionsFormString>

  <!-- Incorrect State -->
  <OptionsFormString
    v-if="hasIncorrectState"
    name="titleIncorrectAnswer"
    :value="options.titleIncorrectAnswer"
    :label="$t('editor.task.config-label-title-incorrect-answer')"
    @update:value="$emit('update:options', { ...options, titleIncorrectAnswer: $event })"
  ></OptionsFormString>
  <OptionsFormString
    v-if="hasIncorrectState"
    name="textIncorrectAnswer"
    :value="options.textIncorrectAnswer"
    :label="$t('editor.task.config-label-text-incorrect-answer')"
    @update:value="$emit('update:options', { ...options, textIncorrectAnswer: $event })"
  ></OptionsFormString>

  <!-- Final Incorrect State -->
  <OptionsFormString
    v-if="hasFinalIncorrectState"
    name="titleFinalIncorrectAnswer"
    :value="options.titleFinalIncorrectAnswer"
    :label="$t('editor.task.config-label-title-final-incorrect-answer')"
    @update:value="$emit('update:options', { ...options, titleFinalIncorrectAnswer: $event })"
  ></OptionsFormString>
  <OptionsFormString
    v-if="hasFinalIncorrectState"
    name="textFinalIncorrectAnswer"
    :value="options.textFinalIncorrectAnswer"
    :label="$t('editor.task.config-label-text-final-incorrect-answer')"
    @update:value="$emit('update:options', { ...options, textFinalIncorrectAnswer: $event })"
  ></OptionsFormString>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionsFormBoolean from "@/extensions/task/helpers/OptionsFormBoolean.vue";
import OptionsFormNumber from "@/extensions/task/helpers/OptionsFormNumber.vue";
import OptionsFormString from "@/extensions/task/helpers/OptionsFormString.vue";

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
      required: true
    },
    allowEmptyAnswerSubmission: Boolean,
    hasMaxAttempts: Boolean,
    hasDisabledCheckTimer: Boolean,
    hasDisabledNextTimer: Boolean,
    hasSubmitButton: Boolean,
    hasNextButton: Boolean,
    hasFeedbackButton: Boolean,
    hasCorrectState: Boolean,
    hasIncorrectState: Boolean,
    hasFinalIncorrectState: Boolean
  },

  emits: ["update:options"],
});
</script>
