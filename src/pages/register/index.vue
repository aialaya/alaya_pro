<template>
  <div class="login-page">
    <Header />
    <div class="login-container">
      <div class="login-form-container">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" class="login-form" size="large">
          <h2 class="login-title">{{ t('register.title') }}</h2>

          <el-form-item prop="email" label="">
            <el-input v-model="form.email" :placeholder="t('register.emailPlaceholder')" type="email"
              class="custom-input">
              <template #prefix>
                <img src="@/assets/img/email.png" alt="">
              </template>
            </el-input>
          </el-form-item>

          <el-form-item class="login_top" prop="password" label="">
            <el-input class="custom-input" v-model="form.password" type="password"
              :placeholder="t('register.passwordPlaceholder')" show-password>
              <template #prefix>
                <img src="@/assets/img/password.png" alt="">
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="login_top" prop="comfirmPassword" label="">
            <el-input class="custom-input" v-model="form.comfirmPassword" type="password"
              :placeholder="t('register.passwordConfirmPlaceholder')" show-password>
              <template #prefix>
                <img src="@/assets/img/password.png" alt="">
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="login_top" prop="code" label="">
            <el-input class="custom-input login_code_input" v-model="form.code"  type="captcha"
              :placeholder="t('register.captcha')">
              <template #prefix>
                <img src="@/assets/img/captcha.png" alt="">
              </template>
            </el-input>
            <button class="send_captcha" :disabled="isSendCode" @click="sendEmailCode">
              <span v-if="isSendCode">{{ codeCountDown }}S</span>
              <span v-else>{{ t('register.captchaGet') }}</span>
            </button>
          </el-form-item>


          <el-form-item class="login_top">
            <button class="submit-btn" :class="{ active: isActive, inactive: !isActive }" :disabled="loading"
              @click="onSubmit">{{
                t('register.register') }}</button>
          </el-form-item>

          <el-form-item>
            <div class="form-footer" @click="router.push('/login')"> {{ t('register.login') }} </div>
          </el-form-item>

        </el-form>
      </div>
      <img class="login_logo" src="@/assets/img/login_logo.png" alt="">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed,onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Header from '@/pages/layout/header.vue'
import { sendEmailCodeApi, registerApi } from '@/api/user'
import { emailPattern, passwordPattern, captchaPattern } from '@/utils'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const { t } = useI18n()
const codeCountDown = ref(60)
const isSendCode = ref(false)
const timer = ref<NodeJS.Timeout|undefined>(undefined)
const form = reactive({
  email: '',
  password: '',
  code: '',
  comfirmPassword: '',
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: t('validation.emailRequired'), trigger: 'blur' },
    { pattern: emailPattern, message: t('validation.emailFormat'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('validation.passwordRequired'), trigger: 'blur' },
    { pattern: passwordPattern, message: t('validation.passwordRule'), trigger: 'blur' }
  ],
  comfirmPassword: [
    { required: true, message: t('validation.passwordRequired'), trigger: 'blur' },
    { pattern: passwordPattern, message: t('validation.passwordRule'), trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value !== form.password) {
          callback(new Error(t('validation.passwordConfirmError')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: t('validation.codeRequired'), trigger: 'blur' },
    { pattern: captchaPattern, message: t('validation.codeRule'), trigger: 'blur' }
  ]
})
const isActive = computed(() => {
  let active = form.email.trim() !== '' && form.password.trim() !== '' && form.comfirmPassword.trim() !== '' && form.code.trim() !== ''
  return active
})


const sendEmailCode = async () => {
  try {
    if (!emailPattern.test(form.email)) {
      ElMessage.error(t('validation.emailFormat'))
      return
    }
    if (isSendCode.value) {
      return
    }
    const data = await sendEmailCodeApi({ email: form.email })
    if (data.code == 200) {
      codeCountDownHandle()
      ElMessage.success(t('common.sendEmailCodeSuccess'))
    } else {
      ElMessage.error(data.message)
    }
  } catch (error) {
    console.error('sendEmailCodeApi:', error)
    ElMessage.error(error as string)
  }
}

const codeCountDownHandle = () => {
  codeCountDown.value = 60
  isSendCode.value = true
  timer.value = setInterval(() => {
    codeCountDown.value--
    if (codeCountDown.value == 0) {
      clearInterval(timer.value)
      codeCountDown.value = 60
      isSendCode.value = false
    }
  }, 1000)
}

const onSubmit = () => {
  if (!formRef.value || loading.value) return
  formRef.value.validate(async (valid, _fields) => {
    if (!valid) {
      return
    }
    try {
      loading.value = true
      const ret =  await registerApi({
        email: form.email,
        password: form.password,
        code: form.code,
      })
      if (ret.code == 200) {
        ElMessage.success(t('common.success'))
        router.push('/login')
      } else {
        ElMessage.error(ret.message)
      }
    } catch (error) {
      console.error('register error', error)
      ElMessage.error(error as string)
    } finally {
      loading.value = false
    }
  })
}
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
.active {
  background-color: #1AE28E;
  color: #121212;
}

.inactive {
  background-color: #8DF1C7;
  color: rgba(18, 18, 18, 0.5);
}

.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
}

.login-container {
  display: flex;
  width: calc(100vw - 150px);
  height: calc(100vh - 187px);
  min-height: 600px;
}

.login-form-container {
  width: 570px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
}

.login-form {
  width: 390px;
  min-height: 442px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
  width: 390px;
  display: flex;
  justify-content: center;
}

.login-title {
  text-align: center;
  margin: 0 0 30px 0;
  font-size: 40px;
}

.language-switch {
  position: absolute;
  top: 20px;
  right: 20px;
}

.custom-input {
  width: 390px;
  height: 60px;
  box-sizing: border-box;
}

.custom-input :deep(.el-input__wrapper) {
  background-color: white;
  box-shadow: none;
  border: 1px solid #dcdfe6;
  border-radius: 50px;
}

.submit-btn {
  width: 390px;
  font-size: 24px;
  border-radius: 50px;
  text-align: center;
  cursor: pointer;
}

.remember-forgot {
  width: 390px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin: 10px 0;
}

.login-form :deep(.el-form-item__content) {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.login_code_input {
  flex: 1;
}

.custom-checkbox {
  height: 40px;
  display: flex;
  align-items: center;
}

.custom-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #1AE28E;
  border-color: #1AE28E;
  border: 1px solid #1AE28E;
}

.custom-checkbox :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #dcdfe6;
}

.forgot-link {
  color: #1AE28E !important;
  font-size: 14px;
}

.forgot-link:hover {
  color: #15b574 !important;
  /* text-decoration: underline; */
}

.form-footer {
  font-size: 24px;
  color: #1AE28E;
  margin-top: 10px;
}

.custom-input :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.custom-input :deep(.el-input__prefix img) {
  width: 20px;
  height: 20px;
}

.login_logo {
  flex: 1;
  /* object-fit: contain; */
  height: 100%;
  max-width: calc(100% - 590px);
}

.spline-container {
  /* flex: 2; */
  position: relative;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.login-form {
  width: 390px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-form :deep(.el-form-item__content) {
  justify-content: center;
  margin-left: 0 !important;
}

.language-switch {
  position: absolute;
  top: 20px;
  right: 20px;
}

.custom-input {
  width: 390px;
  height: 60px;
}

.custom-input :deep(.el-input__wrapper) {
  background-color: white;
  box-shadow: none;
  border: 1px solid #dcdfe6;
  border-radius: 50px;
}

.submit-btn {
  text-align: center;
  width: 390px;
  font-size: 24px;
  border-radius: 50px;
  padding: 10px 0;
  margin-top: 20px;
  cursor: pointer;
}

.remember-forgot {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.custom-checkbox {
  height: 40px;
  display: flex;
  align-items: center;
}

.custom-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #1AE28E;
  border-color: #1AE28E;
  border: 1px solid #1AE28E;
}

.custom-checkbox :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #dcdfe6;
}

.forgot-link {
  color: #1AE28E !important;
  font-size: 14px;
}

.forgot-link:hover {
  color: #15b574 !important;
  /* text-decoration: underline; */
}

.form-footer {
  font-size: 24px;
  color: #1AE28E;
}

.custom-input :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.custom-input :deep(.el-input__prefix img) {
  width: 20px;
  height: 20px;
}

.captcha_input {
  width: 250px;
}

.send_captcha {
  color: #121212;
  background-color: #1AE28E;
  border: 1px solid #1AE28E;
  border-radius: 50px;
  cursor: pointer;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
}
</style>
