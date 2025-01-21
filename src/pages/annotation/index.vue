<template>
  <HomeHeader />
  <div class="home-page">
    <div class="common-layout">
      <el-container>
        <el-aside style="background-color: #F5F5F5; width: 265px; min-height: calc(100vh - 80px);">
          <div class="aside_body">
            <img src="@/assets/img/hanbao.png" alt="">
            <div class="task_title" style="font-size: 24px; font-weight: 600;">{{ $t('taskRecord.title') }}</div>
          </div>
          <div class="task_list" @click="setActiveButton('/')">
            {{ $t('home.dayTask') }}</div>
          <div class="task_list active_green">
            {{ $t('home.taskHistory') }}</div>
        </el-aside>
        <el-container>
          <el-header style="padding: 0; height: 90px;">
            <div class="tabs-container">
              <div style="position: relative; height: 90px; line-height: 90px;">
                <div>{{ $t('taskRecord.historicalTask') }}</div>
                <div
                  style="border-bottom: 4px solid #1AE28E; border-radius: 4px 4px 0 0; position: absolute; bottom: 0; left: 0; right: 0;">
                </div>
              </div>
            </div>
          </el-header>
          <el-main style="padding: 0; color: black;">
            <div class="tab-content">
              <div class="biaoqian_list" v-for="item in taskList.list" :key="item.key">
                <div class="biaoqian_title">{{ item.key }}</div>
                <!-- 已完成 -->
                <div class="tabs_item" v-if="item.item.length > 0">
                  <div class="tabs_item_content" v-for="i in item.item" :key="i.id">
                    <div style="font-weight: 700; font-size: 16px; padding-bottom: 5px;color: #333333;">{{ i.title }}</div>
                    <div class="tabs_item_txt">{{ i.createdAt }}</div>
                    <div class="tabs_item_status">
                      <div class="tabs_item_status_bottom">
                        <div class="tabs_item_txt">{{ $t('home.quantity') }}: {{ i.quantity }}P</div>
                      </div>
                      <div class="tabs_btn_completed">{{ $t('home.completed') }}</div>
                    </div>
                  </div>
                </div>
                <div class="tabs_item" v-else>
                  <div class="tabs_item_content">
                    <div style="font-weight: 700; font-size: 16px; padding-bottom: 5px;color: #333333;">{{ $t('home.noMoreTasks') }}</div>
                    <SvgIcon class="empty" prefix="icon" name="empty" />
                  </div>
                </div>
                <div style="height: 42px; border-bottom: 1px solid #ddd;"></div>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/header/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getHistoryTaskListApi } from '@/api'
import { ElMessage } from 'element-plus'
import { getCurrentTime } from '@/utils/time'

const router = useRouter()
const page = ref(1)
const taskList = ref<Api.TaskHistoryList.Resp>({
  list: []
})
const setActiveButton = (button: string) => {
  router.push(button)
}

const getTaskList = async () => {
  try {
    const res = await getHistoryTaskListApi({ page: page.value })
    if (res.code === 200) {
      taskList.value = res.data!
      if (taskList.value.list.length === 0) {
        taskList.value.list = [{ key: getCurrentTime(), item: [] }]
      }
    }
  } catch (error) {
    console.log(error)
    ElMessage.error(error as string)
  }
}

onMounted(() => {
  getTaskList()
})
</script>

<style scoped>
.home-page {
  color: #333333;
  background-color: #FAFAFA;
  min-height: calc(100vh - 80px);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.function-list {
  margin-top: 20px;
}

.aside_body {
  height: 90px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.tabs-container {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-bottom: 1px solid #1AE28E;
  padding: 0 20px;
  height: 90px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  user-select: none;
}

.task_title::first-letter {
  color: #1AE28E;
}

.task_list {
  font-size: 14px;
  height: 59px;
  text-align: center;
  line-height: 59px;
  cursor: pointer;
  color: #666666;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  user-select: none;
}

.tab-content {
  flex: 1;
  padding: 0 33px;
}

.biaoqian_title {
  font-family: Inter;
  font-size: 24px;
  font-weight: 500;
  line-height: 29.05px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  margin: 33px 38px 38px 0;
  color:#999999;

}

.biaoqian {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  font-size: 12px;
  margin: 38px 0;
  gap: 46px;
  border-radius: 10px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
}

.tabs_item {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.tabs_item_content {
  width: 238px;
  height: 126px;
  padding: 16px;
  background-color: #fff;
  border-radius: 10px;
  font-size: 12px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  box-sizing: border-box;
  position: relative;
}

.tabs_item_content:hover {
  border-color: #1AE28E;
  transform: scale(1.02);
}

.tabs_item_content:hover .tabs_btn {
  background-color: #1AE28E;
  color: #333333;
}

.tabs_item_status {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tabs_item_txt {
  padding: 5px 0;
  color: #999;
}

.tabs_btn {
  padding: 4px 10px;
  background-color: #8DF1C7;
  color: #666;
  border-radius: 50px;
  cursor: pointer;
  position: absolute;
  right: 16px;
  bottom: 16px;
}

.tabs_btn_completed {
  color: #1AE28E;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 14.52px;
  text-align: right;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  cursor: pointer;
  position: absolute;
  right: 16px;
  bottom: 16px;
}

.active_green {
  background-color: #E9FDF4;
  border: 1px solid #1AE28E;
  color: #333333;
  font-size: 16px;
}

.empty {
  color: #E8EAED;
  stroke: #E8EAED;
  width: 56px;
  height: 63px;
  position: absolute;
  right: 16px;
  bottom: 16px;
}
</style>
