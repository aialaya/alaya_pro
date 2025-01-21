<template>
  <div class="home-header">
    <div class="flex_center" style="width: 232px;" @click="router.push('/')">
      <img class="logo" src="@/assets/img/aia_logo.png" alt="logo" />
      <span class="line"></span>
    </div>
    <div class="flex_center" style="flex: 1; min-width: 500px; margin-left: 32px;">
      <img src="@/assets/img/avatar.png" alt="avatar" />
      <div style="margin-left: 12px;">{{ userStore.userInfo?.email }}</div>
      <div class="user_level" @click="toggleImage">
        <span>Lv.{{ userStore.userInfo?.level }}</span>&nbsp;&nbsp;
        <div class="level_box" v-if="isOpen">
          <span>{{ userStore.userInfo?.experience }}/{{ userStore.userInfo?.nextExperience }}</span>
          <div class="level_progress"></div>
          <div class="level_text">Lv.{{ userStore.userInfo?.level || 0 + 1 }}</div>
        </div>
        <img :src="isOpen ? fullArrow : nullArrow" alt="arrow" />
      </div>


      <el-popover :visible="isAIAOpen" trigger="click" placement="top" width="227px" :show-arrow="false"
        popper-style="--el-bg-color-overlay: rgba(0, 0, 0, .8);margin-top:30px;border-radius:10px;min-height:100px;">
        <div style="height: 30px; border-bottom: 1px solid #1AE28E; color: #1AE28E; font-size: 14px;">History</div>
        <div class="history_item" v-for="item in historyList.list">
          <div>{{ item.createTime }}</div>
          <div class="history_item_text">{{ item.num }} {{ item.type == 1 || item.type == 6 || item.type == 8 ? 'USDT' :
            'AIA' }}</div>
        </div>
        <div class="history_pagination">
          <el-pagination class="custom_pagination" layout="prev, pager, next" size="small" :total="historyList.total"
            :pager-count="5" v-model:current-page="page" />
        </div>
        <template #reference>
          <div style="cursor: pointer; position: relative; top: 1px;" @click="toggleAIA">
            <span style="position: relative; top: 1px;" class="green_text">AIA :</span> {{ userStore.userInfo?.score ||
              0 }}
            &nbsp;
            <img :src="isAIAOpen ? fullArrow : nullArrow" alt="arrow" />
          </div>
        </template>

      </el-popover>
    </div>


    <div class="flex_center" style="width: 265px; justify-content: flex-end;gap:30px">
      <LangSwitch />
      <div class="exit_btn" @click="handleExit">
        <div class="exit_btn_icon">
          <SvgIcon prefix="icon" name="exit" />
        </div>
        <span style="margin-left: 6px;">{{ $t('header.exit') }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import LangSwitch from '@/components/LangSwitch/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import nullArrow from '@/assets/img/null_arrow.png'
import fullArrow from '@/assets/img/full_arrow.png'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { getHistoryListApi } from '@/api/user'


const userStore = useUserStore()
const router = useRouter()
const isOpen = ref(false)
const isAIAOpen = ref(false)

const page = ref(1)

const historyList = ref<Api.HistoryList.Resp>({
  total: 0,
  pageSize: 0,
  list: []
})
const toggleImage = () => {
  isAIAOpen.value = false
  isOpen.value = !isOpen.value
}
const toggleAIA = () => {
  isAIAOpen.value = !isAIAOpen.value
  isOpen.value = false
  if (isAIAOpen) {
    getHistoryList()
  }

}
const handleExit = () => {
  userStore.logout()
  router.push('/login')
}
const getHistoryList = async () => {
  const data = await getHistoryListApi({
    page: page.value,
  })
  if (data.code == 200) {
    historyList.value = data.data!
  }
}
watch(page, () => {
  getHistoryList()
})
</script>

<style>
.el-popper.is-customized {
  --el-bg-color-overlay: rgba(0, 0, 0, .8);
  margin-top: 30px;
}
</style>

<style scoped>
.flex_center {
  display: flex;
  align-items: center;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0A091C;
  padding: 20px 33px;
  font-size: 14px;
  color: #FAFAFA;
}

.green_text {
  color: #1AE28E;
}

.logo {
  width: 160px;
  height: 30px;
}

.line {
  margin-left: 50px;
  border-left: 1px solid #666666;
  height: 40px;
  display: inline-block;
}

.select-arrow {
  font-size: 12px;
  transition: transform 0.3s;

}

.select-arrow.is-reverse {
  transform-origin: 50% 100%;
  transform: rotate(90deg);
}

.user_level {
  margin-left: 12px;
  cursor: pointer;
  color: #1AE28E;
  width: 80px;
}

.level_box {
  position: absolute;
  top: 94px;
  background-color: rgba(0, 0, 0, .8);
  height: 20px;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level_progress {
  width: 100px;
  height: 14px;
  background-color: white;
  border: 1px solid #1AE28E;
  position: relative;
  border-radius: 10px;
  margin: 0 10px;
  overflow: hidden;
}

.level_progress::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 47.5%;
  background-color: #1AE28E;
  border-radius: 10px;
}

.history_box {
  position: absolute;
  top: 60px;
  left: 0;
  min-height: 100px;
  width: 227px;
  background-color: rgba(0, 0, 0, .8);
  padding: 16px;
  border-radius: 10px;
  transition: all 0.3s;
}

.history_item_text {
  color: #8DF1C7;
}

.history_item {
  padding: 10px 0;
  border-bottom: 1px dashed #666666;
  color: #BBBBBB;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}

.history_item:hover :first-child {
  color: #FAFAFA;
}

.history_item:hover :nth-child(2) {
  color: #1AE28E;
}

.exit_btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #BBBBBB;
  font-family: Inter;
  font-size: 20px;
  font-weight: 400;
  line-height: 24.2px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

}

.exit_btn_icon {
  width: 21px;
  height: 21px;
}

.exit_btn:hover {
  color: #1AE28E;
}


.exit_btn:hover img:first-child {
  display: block;
}

.exit_btn img:last-child {
  display: none;
}

.exit_btn:hover img:last-child {
  display: block;
}


.history_pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}


:deep(.custom_pagination) {
  --el-fill-color-blank: rgba(0, 0, 0, 0.1);
  --el-text-color-primary: #999999;
  --el-color-primary: #1AE28E;
}
</style>