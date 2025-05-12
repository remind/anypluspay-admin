<script lang="ts" setup>
import { Input, Select } from 'ant-design-vue';

const emit = defineEmits(['blur', 'change']);

const modelValue = defineModel<[string, string]>({
  default: () => [undefined, 'NORMAL'],
});

function onChange() {
  emit('change', modelValue.value);
}
</script>
<template>
  <div class="flex w-full gap-1">
    <Input
      placeholder="请输入"
      class="flex-1"
      allow-clear
      v-model:value="modelValue[0]"
      :maxlength="27"
      @blur="emit('blur')"
      @change="onChange"
    />
    <Select
      v-model:value="modelValue[1]"
      class="w-[80px]"
      placeholder="资金类型"
      allow-clear
      :class="{ 'valid-success': !!modelValue[0] }"
      :options="[{ label: '常规', value: 'NORMAL' }]"
      @blur="emit('blur')"
      @change="onChange"
    />
  </div>
</template>
