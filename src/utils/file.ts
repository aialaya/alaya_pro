export const base64ToFile = (base64String: string, filename: string): File => {
  const base64 = base64String.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
  
  try {
    const byteString = window.atob(base64)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: 'image/png' })
    return new File([blob], filename, { type: 'image/png' })
  } catch (error) {
    console.error('Base64 to File conversion error:', error)
    return new File([""], filename, { type: 'image/png' })
  }
}
  