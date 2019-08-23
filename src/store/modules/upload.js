const baseUrl = process.env.BASE_API
const upload = {
  state: {
    // 图片上传
    uploadImageApi: baseUrl + '/files/upload',
    updateAvatarApi: baseUrl + '/files/user/upload'
  }
}

export default upload
