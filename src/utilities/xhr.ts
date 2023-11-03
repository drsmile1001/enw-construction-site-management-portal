export function uploadFile(
  file: File,
  action: string,
  onProgress?: (progress: number) => any
): Promise<XMLHttpRequest> {
  return new Promise<XMLHttpRequest>(async (resolve, reject) => {
    const formData = new FormData()
    formData.append("file", file)
    const xhr = new XMLHttpRequest()
    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        onProgress((event.loaded / event.total) * 100)
      })
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr)
        } else {
          reject(xhr)
        }
      }
    }
    xhr.upload.addEventListener("error", () => {
      reject(xhr)
    })
    xhr.upload.addEventListener("abort", () => {
      reject(xhr)
    })
    xhr.open("POST", action, true)
    const token = "TOKEN" //TODO: implement token
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.send(formData)
  })
}
