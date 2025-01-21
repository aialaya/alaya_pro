import CryptoJS from 'crypto-js'


const SECRET_KEY = '9nDMC7r3WdsadadasdadadPwlUfodzpFhx56' 


export const passwordEncrypt = (password: string): string => {
  const encrypted = CryptoJS.AES.encrypt(
    password,
    SECRET_KEY
  )
  return encrypted.toString()
}


export const passwordDecrypt = (encryptedBase64: string): string => {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedBase64,
    SECRET_KEY
  )

  return decrypted.toString(CryptoJS.enc.Utf8)
}