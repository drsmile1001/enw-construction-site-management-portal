<template>
  <NUpload
    v-model:fileList="fileList"
    :="uploadProps"
    :custom-request="customRequest"
    @change="onChange"
  >
  </NUpload>
</template>

<script setup lang="ts">
import type {
  CustomRequest,
  FileInfo,
  OnChange,
} from "naive-ui/es/upload/src/interface"
import { useFileRepo } from "@/stores/FileRepo"
import type { UploadProps } from "naive-ui"

export type AllowedUploadProps = Pick<
  UploadProps,
  "max" | "multiple" | "listType"
>

export type AppUploaderProps = {
  collection: string
  value: string | string[] | null
  uploadProps?: AllowedUploadProps
}

const props = defineProps<AppUploaderProps>()
const emits = defineEmits<{
  "update:value": [string | string[] | null]
}>()

const fileRepo = useFileRepo()
const fileList = ref<FileInfo[]>([])

const onChange: OnChange = ({ fileList }) => {
  const uploadedFiles = fileList
    .filter((f) => f.status === "finished")
    .map((f) => f.name)
  //check multiple
  if (props.uploadProps?.multiple) {
    emits("update:value", uploadedFiles)
    return
  } else if (uploadedFiles.length > 0) {
    emits("update:value", uploadedFiles[0])
    return
  } else {
    emits("update:value", null)
  }
}

watchEffect(() => {
  if (typeof props.value === "string") {
    if (fileList.value.find((f) => f.name === props.value)) return
    fileList.value.push({
      id: props.value,
      name: props.value,
      url: fileRepo.buildFileUrl(props.collection, props.value),
      status: "finished",
    })
    return
  }
  if (props.value === null) {
    fileList.value = []
    return
  }

  for (const file of props.value) {
    if (fileList.value.find((f) => f.name === file)) continue
    fileList.value.push({
      id: file,
      name: file,
      url: fileRepo.buildFileUrl(props.collection, file),
      status: "finished",
    })
  }
})

const customRequest: CustomRequest = ({
  file,
  onFinish,
  onError,
  onProgress,
}) => {
  fileRepo
    .put(props.collection, file.file!, (progress) => {
      onProgress({ percent: progress })
    })
    .then((res) => {
      file.url = res.url
      onFinish()
    })
    .catch(() => {
      onError()
    })
}
</script>
