<template>
  <div class="login-page">
    <Header />
    <div class="login-container">
      <div class="login-form-container">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="login-form"
      >
        <h2 class="login-title pointer_txt">{{ t('login.title') }}</h2>
        
        <el-form-item  prop="email" label="" >
          <el-input 
            v-model="form.email"
            :placeholder="t('login.emailPlaceholder')"
            type="email"
            class="custom-input"
          >
            <template #prefix>
              <img src="@/assets/img/email.png" alt="">
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item class="login_top" prop="password" label="">
          <el-input
            class="custom-input"
            v-model="form.password"
            type="password"
            :placeholder="t('login.passwordPlaceholder')"
            show-password
          >
            <template #prefix>
              <img src="@/assets/img/password.png" alt="">
            </template>
          </el-input>
        </el-form-item>
        
        <div class="remember-forgot">
            <div class="remember">
              <el-checkbox v-model="form.rememberUsername" class="custom-checkbox">
                {{ t('login.rememberUsername') }}
              </el-checkbox>
            </div>
            <div class="forgot">
              <el-link type="primary" class="forgot-link" @click="router.push('/forgetPassword')"> {{ t('login.forgotPassword') }} </el-link>
            </div>
          </div>
        
        <el-form-item class="login_top">
          <button class="submit-btn pointer_txt" :class="{ btn_active: isActive, inactive: !isActive }" :disabled="loading" @click="onSubmit">{{ t('login.login') }}</button>
        </el-form-item>

        <el-form-item >
        <div class="form-footer" @click="router.push('/register')"> {{ t('login.register') }} </div>
        </el-form-item>

      </el-form>
    </div>
      <img class="login_logo" src="@/assets/img/login_logo.png" alt="">

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Header from '@/pages/layout/header.vue'
import { emailPattern, passwordPattern,passwordEncrypt,passwordDecrypt } from '@/utils'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const { t } = useI18n()

const form = reactive({
  email: '',
  password: '',
  rememberUsername: false,
})
const password = localStorage.getItem('KEY_PASSWORD')
if (password) {
  form.password = passwordDecrypt(password)
}
const username = localStorage.getItem('KEY_USERNAME')
if (username) {
  form.email = username
}
const rememberUsername = localStorage.getItem('KEY_REMEMBER_USERNAME')
if (rememberUsername) {
  form.rememberUsername = rememberUsername === 'true'
}

const rules = reactive<FormRules>({
  email: [
    { required: true, message: t('validation.emailRequired'), trigger: 'blur' },
    { pattern: emailPattern, message: t('validation.emailFormat'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('validation.passwordRequired'), trigger: 'blur' },
    { pattern: passwordPattern, message: t('validation.passwordRule'), trigger: 'blur' }
  ]
})

const isActive = computed(() => {
  let active = form.email.trim() !== '' && form.password.trim() !== ''
  return active
})

const onSubmit = async () => {
  if (!formRef.value || loading.value) return
  formRef.value.validate(async (valid, _fields) => {
    if (!valid) {
      return
    }
    try {
    loading.value = true
    await userStore.login({
      email: form.email,
      password: form.password,
    })
    if (form.rememberUsername) {
      const password = passwordEncrypt(form.password)
      localStorage.setItem('KEY_USERNAME', form.email)
      localStorage.setItem('KEY_PASSWORD', password)
      localStorage.setItem('KEY_REMEMBER_USERNAME', 'true')
    }
    ElMessage.success(t('login.success'))
    await userStore.getUserInfo()
    router.push('/')
  } catch (error) {
    console.error('login error', error)
    ElMessage.error(error as string)

  } finally {
    loading.value = false
  }
  })

}


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

.login-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
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
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  border-radius: 50px;
  text-align: center;
  cursor: pointer;
  margin: 20px 0;
}

.remember-forgot {
  width: 390px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin: 10px 0;
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
}
.form-footer {
  width: 100%;
  text-align: center;
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
.login_logo {
  flex: 1;
  height: 100%;
  max-width: calc(100% - 590px);
}
</style>
