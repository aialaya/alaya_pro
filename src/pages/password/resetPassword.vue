<template>
  <div class="forget_password">
    <div>
      <h1 style="text-align: center; font-size: 40px;">{{ t('forgetPassword.title') }}</h1>
      <el-form ref="formRef" :model="form" :rules="rules" class="login-form" size="large">
        <el-form-item prop="password" label="">
          <el-input class="custom-input login_top" v-model="form.password" type="password"
            :placeholder="t('resetPassword.passwordPlaceholder')" show-password>
            <template #prefix>
              <img src="@/assets/img/password.png" alt="">
            </template>
          </el-input>
        </el-form-item>


        <el-form-item prop="comfirmPassword" label="">
          <el-input class="custom-input login_top" v-model="form.comfirmPassword" type="password"
            :placeholder="t('resetPassword.passwordConfirmPlaceholder')" show-password>
            <template #prefix>
              <img src="@/assets/img/password.png" alt="">
            </template>
          </el-input>
        </el-form-item>

        <div class="next_btn" :class="{ btn_active: isActive, inactive: !isActive }"
          @click="onSubmit">{{
            t('resetPassword.confirm') }}</div>
        <div class="form_footer" @click="router.push('/forgetPassword')">{{ t('forgetPassword.back') }}</div>
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
import { passwordPattern } from '@/utils'
import { resetPasswordApi } from '@/api/user'

const router = useRouter()
const { t } = useI18n()
const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({
  password: '',
  comfirmPassword: '',
})
const isActive = computed(() => {
  const isResetPassword = localStorage.getItem('KEY_IS_RESET_PASSWORD')
  if (isResetPassword !== 'true') {
    router.push('/forgetPassword')
  }
  let active = form.password.trim() !== '' && form.comfirmPassword.trim() !== ''
  return active
})

const rules = reactive<FormRules>({
  password: [
    { required: true, message: t('validation.passwordRequired'), trigger: 'blur' },
    { pattern: passwordPattern, message: t('validation.passwordRule'), trigger: 'blur' }
  ],
  comfirmPassword: [
    { required: true, message: t('validation.passwordConfirmRequired'), trigger: 'blur' },
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
})

const onSubmit = () => {
  if (!formRef.value || loading.value) return
  formRef.value.validate(async (valid, _fields) => {
    if (!valid) {
      return
    }
    try {
      loading.value = true
      const ret =  await resetPasswordApi({
        newPassword: form.password,
      })
      if (ret.code == 200) {
        ElMessage.success(t('common.success'))
        router.push('/login')
      } else {
        ElMessage.error(ret.message)
      }
    } catch (error) {
      console.error('resetPassword error', error)
      ElMessage.error(error as string)
    } finally {
      loading.value = false
    }
  })
}
onUnmounted(() => {
  localStorage.removeItem('KEY_IS_RESET_PASSWORD')
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
  width: 390px;
  height: 60px;
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
</style>