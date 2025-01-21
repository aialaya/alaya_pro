<template>
    <div class="forget_password">
      <div>
         <h1 style="text-align: center; font-size: 40px;">{{ t('forgetPassword.title') }}</h1>
         <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="login-form"
          size="large"
      >
    
          <el-form-item  prop="email" label="">
            <el-input class="custom-input login_top"  v-model="form.email" type="email" 
              :placeholder="t('forgetPassword.emailPlaceholder')"
          >
            <template #prefix>
              <img src="@/assets/img/email.png" alt="">
            </template>
          </el-input>
          </el-form-item>
            <el-form-item prop="code" label="">
              <el-input class="custom-input login_code_input" v-model="form.code"  type="captcha"
                :placeholder="t('register.captcha')">
                <template #prefix>
                  <img src="@/assets/img/captcha.png" alt="">
                </template>
              </el-input>
              <button class="send_btn" :disabled="isSendCode" :class="{ btn_active: isActive, inactive: !isActive }" @click="sendEmailCode">
                <span v-if="isSendCode">{{ codeCountDown }}S</span>
                <span v-else>{{ t('register.captchaGet') }}</span>
              </button>
          </el-form-item>
          
          <div class="next_btn" :class="{ btn_active: isActive, inactive: !isActive }" @click="next">{{ t('forgetPassword.next') }}</div>
          <div class="form_footer" @click="router.push('/login')">{{ t('forgetPassword.back') }}</div>
    </el-form>
         
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed,onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { emailPattern,captchaPattern } from '@/utils'
  import { sendEmailCodeApi,emailCaptchaLoginApi } from '@/api/user'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const { t } = useI18n()
  const userStore = useUserStore()
  const formRef = ref<FormInstance>()
  const isSendCode = ref(false)
  const timer = ref<NodeJS.Timeout|undefined>(undefined)
  const codeCountDown = ref(60)
  const loading = ref(false)
  const form = reactive({
  email: '',
  code: '',
})
const isActive = computed(() => {
  let active = form.email.trim() !== ''
  return active
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: t('validation.emailRequired'), trigger: 'blur' },
    { pattern: emailPattern, message: t('validation.emailFormat'), trigger: 'blur' }
  ],
  code: [
    { required: true, message: t('validation.codeRequired'), trigger: 'blur' },
    { pattern: captchaPattern, message: t('validation.codeRule'), trigger: 'blur' }
  ],
})

const sendEmailCode = async () => {
  try {
    if (!emailPattern.test(form.email) ) {
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

const next = () => {
  if (!formRef.value || loading.value) return
  formRef.value.validate(async (valid, _fields) => {
    if (!valid) {
      return
    }
    try {
      loading.value = true
      const ret =  await emailCaptchaLoginApi({
        email: form.email,
        code: form.code,
      })
      if (ret.code == 200) {
        localStorage.setItem('KEY_IS_RESET_PASSWORD', 'true')
        userStore.setToken(ret.data!.accessToken, ret.data!.refreshToken)
        router.push('/resetPassword')
      } else {
        ElMessage.error(ret.message)
      }
    } catch (error) {
      console.error('forgetPassword error', error)
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
  .forget_password {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-image: url('@/assets/img/bg.png');
    background-size: cover;
    background-position: center;
  }
  .custom-input {
    height: 60px;
    box-sizing: border-box;
  }
  .custom-input :deep(.el-input__wrapper) {
  background-color: white;
  box-shadow: none;
  border: 1px solid #dcdfe6;
  border-radius: 50px;
}
  .captcha-input {
    width: 251px;
    height: 60px;
  }
  .send_btn {
    border-radius: 50px;
    cursor: pointer;
    padding: 0 40px;
    height: 60px;
    line-height: 60px;
  }
  .next_btn {
    text-align: center;
    font-size: 24px;
    border-radius: 50px;
    padding: 10px 0;
    margin-top: 20px;
    cursor: pointer;
  }
  .form_footer {
    text-align: center;
    font-size: 24px;
    padding: 10px 0;
    margin-top: 20px;
    color: #1AE28E;
    cursor: pointer;
  }
  .login_code_input {
    flex: 1;
  }
  .login-form :deep(.el-form-item__content) {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
  }
  </style>