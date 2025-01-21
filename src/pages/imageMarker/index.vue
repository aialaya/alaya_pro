<template>
    <div class="image-marker-page">
        <HomeHeader />
        <div class="image-marker-content">
            <Pics />
            <div class="image-marker-right">
                <div class="image-marker-menu">
                    <div class="image-marker-menu-header" @click="back">
                        <div class="image-marker-menu-item">
                            <SvgIcon prefix="icon" name="back" style="color: #000;" />
                        </div>
                    </div>
                    <div class="image-marker-menu-content">
                        <div class="image-marker-menu-left">
                            <div class="image-marker-menu-item" @click="move">
                                <SvgIcon prefix="icon" name="move"
                                    :class="creating === 'move' || creating === 'select' ? 'active' : ''" />
                            </div>
                            <div class="image-marker-menu-item" @click="point">
                                <SvgIcon prefix="icon" name="point" :class="creating === 'spot' ? 'active' : ''" />
                            </div>
                            <div class="image-marker-menu-item" @click="rect">
                                <SvgIcon prefix="icon" name="rect" :class="creating === 'rect' ? 'active' : ''" />
                            </div>
                            <div class="image-marker-menu-item" @click="zoomIn">
                                <SvgIcon prefix="icon" name="zoomIn" />
                            </div>
                            <div class="image-marker-menu-item" @click="zoomOut">
                                <SvgIcon prefix="icon" name="zoomOut" />
                            </div>
                            <div class="image-marker-menu-item" @click="del">
                                <SvgIcon prefix="icon" name="delete"
                                    :class="creating === 'delete' || creating === 'select' ? 'active' : ''" />
                            </div>
                        </div>
                        <div class="image-marker-menu-right">
                            <div class="button" @click="prev" :class="{ disabled: sceneStore.currentIndex === 0 }">
                                <SvgIcon prefix="icon" name="left" style="width: 24px;height: 24px;" />
                                <div class="back-text">{{ $t('imageMarker.prev') }}</div>
                            </div>
                            <div class="button" @click="next"
                                v-if="sceneStore.currentIndex !== sceneStore.scenes.length - 1"
                                :class="{ disabled: sceneStore.currentIndex === sceneStore.scenes.length - 1 }">
                                <div class="next-text">{{ $t('imageMarker.next') }}</div>
                                <SvgIcon prefix="icon" name="right" style="width: 24px;height: 24px;" />
                            </div>
                            <div class="button" v-else @click="save">
                                <div class="next-text" style="color: #1AE28E;">{{ $t('imageMarker.done') }}</div>
                                <SvgIcon prefix="icon" name="right" style="width: 24px;height: 24px;color: #1AE28E;" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="image-marker-right-content">
                    <div class="mark-box">
                        <div id="canvas_box" ref="canvasBoxRef">
                            <canvas id="canvas" ref="canvasRef" @mousemove="handleMouseMove"
                                @mousedown="handleMouseDown" @mouseup="handleMouseUp" @click="handleClick"></canvas>
                        </div>
                        <Tag class="tag-box-model" :tagList="calloutInfo.tag" :position="tagPosition" :show="tagShow"
                            @handleClick="handleTagClick" />
                    </div>
                    <div class="tag_box">
                        <div class="tag_item_title">{{ $t('imageMarker.mark') }}:</div>
                        <div class="tag_item_list">
                            <div class="tag_item" v-for="(item, index) in calloutInfo.tag" :key="index">{{ item.name
                                }}<span v-if="item.num > 0">.{{ item.num }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <TaskCompleted :visible="taskCompletedVisible" :title="$t('imageMarker.taskCompleted')" :cancelText="$t('imageMarker.cancel')"
            :continueText="$t('imageMarker.continue')" :onCancel="onCancel" :onContinue="onContinue" />
        <TaskCompleted :visible="allTaskCompletedVisible" :title="$t('imageMarker.allTaskCompleted')" :cancelText="$t('imageMarker.cancel')"
            :continueText="$t('imageMarker.back')" :onCancel="onCancel" :onContinue="onHome" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { MarkCanvas } from '@/components/MarkCanvas/index'
import HomeHeader from '@/components/header/index.vue'
import Pics from './model/pics.vue'
import { useRouter } from 'vue-router'
import Tag from './model/tag.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useSceneStore, Scene } from '@/stores'
import { events, loadImages, base64ToFile } from '@/utils'
import { getTaskDetailApi, saveTaskApi, uploadFileApi } from '@/api'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import TaskCompleted from '@/components/TaskCompleted/index.vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '@/stores'
const { t } = useI18n()
const route = useRoute()
const taskStore = useTaskStore()
const id = route.params.id
const sceneStore = useSceneStore()
const calloutInfo = reactive<Api.TaskDetail.Resp>({
    id: 0,
    title: '',
    status: 0,
    tag: [],
    item: [],
})
const mark = ref<MarkCanvas>(new MarkCanvas({
    view: document.createElement('canvas'),
    viewBox: document.createElement('div'),
    imageUrl: '',
    imageWidth: 0,
    imageHeight: 0
}))
const canvasBoxRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const router = useRouter()
const currentUuid = ref('')
const tagPosition = ref({
    top: 0,
    left: 0
})
const tagShow = ref(false)
const creating = ref<"rect" | "spot" | "move" | "select" | ''>('')
const taskCompletedVisible = ref(false)
const allTaskCompletedVisible = ref(false)



const back = () => {
    router.back()
}
const onHome = () => {
    router.replace({
        path: '/',
    })
}
const move = () => {
    creating.value = 'move'
    mark.value.setIsCallout('move')
}
const point = () => {
    creating.value = 'spot'
    mark.value.setIsCallout('spot')
}
const rect = () => {
    creating.value = 'rect'
    mark.value.setIsCallout('rect')
}
const zoomIn = () => {
    mark.value.zoomIn()
}
const zoomOut = () => {
    mark.value.zoomOut()
}
const del = () => {
    mark.value.deleteMark()
    tagHandle()
}
const onCancel = () => {
    router.push('/')
}
const onContinue = () => {
    const uncompletedTask = taskStore.tasks.find((item) => item.status === 0)
    console.log('uncompletedTask', uncompletedTask)
    if (uncompletedTask) {
        window.location.hash = `/marker/${uncompletedTask.id}`
        window.location.reload()
    } else {
        taskCompletedVisible.value = false
        allTaskCompletedVisible.value = true
    }
}
const prev = () => {
    if (sceneStore.currentIndex > 0) {
        switchScene(sceneStore.currentIndex - 1)
    }

}
const next = () => {
    if (sceneStore.currentIndex < sceneStore.scenes.length - 1) {
        switchScene(sceneStore.currentIndex + 1)
    }
}

const init = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    const res = await getTaskDetailApi(Number(id))
    if (res.code !== 200) {
        return
    }
    if (res.data!.status !== 0) {
        loading.close()
        router.push('/')
        return
    }
    calloutInfo.id = res.data!.id
    calloutInfo.title = res.data!.title
    calloutInfo.tag = res.data!.tag.map((item) => ({
        name: item,
        num: 0
    }))
    calloutInfo.item = res.data!.item
    const scenes: Array<Scene> = []
    const images: string[] = []
    for (let i = 0; i < res.data!.item.length; i++) {
        images.push(res.data!.item[i].image)
    }
    const imagesObj = await loadImages(images)
    for (let i = 0; i < imagesObj.length; i++) {
        const img = imagesObj[i]
        const imgId = res.data!.item.find((item) => item.image === img.src)?.id || 0
        const scene: Scene = {
            id: imgId,
            imgUrl: img.src,
            imgWidth: img.width,
            imgHeight: img.height,
            rects: [],
            result: ''
        }
        scenes.push(scene)
    }
    sceneStore.scenes = scenes
    sceneStore.setActive(0)
    mark.value = new MarkCanvas({
        view: canvasRef.value || document.createElement('canvas'),
        viewBox: canvasBoxRef.value || document.createElement('div'),
        imageUrl: sceneStore.getCurrentScene.imgUrl,
        imageWidth: sceneStore.getCurrentScene.imgWidth,
        imageHeight: sceneStore.getCurrentScene.imgHeight
    })
    loading.close()
}
const tagHandle = () => {
    calloutInfo.tag.forEach((item: Api.MarkerInfo.Tag) => {
        if (mark.value.allRects.length === 0) {
            item.num = 0
        } else {
            const num = mark.value.allRects.filter((rect) => rect.tag === item.name).length
            item.num = num
        }
    })
}
const switchScene = (index: number) => {
    if (mark.value.allRects.length === 0) {
        ElMessage.error(t("imageMarker.noMark"))
        return
    }
    sceneStore.setRects(mark.value.allRects)
    sceneStore.saveImage(mark.value.file)
    sceneStore.setActive(index)
    events.emit('refresh')
}
const refresh = () => {
    mark.value = new MarkCanvas({
        view: canvasRef.value || document.createElement('canvas'),
        viewBox: canvasBoxRef.value || document.createElement('div'),
        imageUrl: sceneStore.getCurrentScene.imgUrl,
        imageWidth: sceneStore.getCurrentScene.imgWidth,
        imageHeight: sceneStore.getCurrentScene.imgHeight
    })
    mark.value.loadHistory(sceneStore.getCurrentScene.rects)
    tagHandle()
    creating.value = ''
}
const handleTagClick = (item: string) => {
    if (currentUuid.value && mark.value) {
        mark.value.setTtg(currentUuid.value, item)
        tagShow.value = false
        currentUuid.value = ''
    }
    tagHandle()
}
const save = async () => {
    if (mark.value.allRects.length === 0) {
        ElMessage.error(t("imageMarker.noMark"))
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        sceneStore.setRects(mark.value.allRects)
        sceneStore.saveImage(mark.value.file)
        const data: Api.SaveTask.Result[] = []
        for (let i = 0; i < sceneStore.scenes.length; i++) {
            const id = sceneStore.scenes[i].id
            const ret = await uploadFileApi({
                file: base64ToFile(sceneStore.scenes[i].result, `image-${id}.png`)
            })
            if (ret.code !== 200) {
                ElMessage.error(ret.message)
                return
            }
            data.push({
                itemId: id,
                image: ret.data!.url,
                tags: sceneStore.scenes[i].rects.map((item) => item.tag)
            })
        }
        const ret = await saveTaskApi({
            taskId: calloutInfo.id,
            data: data
        })
        loading.close()
        if (ret.code !== 200) {
            ElMessage.error(ret.message)
            return
        }
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 300))

        ElMessage.success(t("common.success"))
        await taskStore.getTaskList()
        const uncompletedTask = taskStore.tasks.find((item) => item.status === 0)
        if (uncompletedTask) {
            taskCompletedVisible.value = true
        } else {
            allTaskCompletedVisible.value = true
        }
    } catch (error) {
        loading.close()
        await nextTick()
        ElMessage.error(error as string)
    }
}

const handleMouseMove = (e: MouseEvent) => {
    if (!mark.value) return
    mark.value.handleMouseMove(e)
}

const handleMouseDown = (e: MouseEvent) => {
    if (!mark.value) return
    mark.value.handleMouseDown(e)
}

const handleMouseUp = (e: MouseEvent) => {
    if (!mark.value) return
    mark.value.handleMouseUp(e)
}

const handleClick = (e: MouseEvent) => {
    if (!mark.value) return
    mark.value.handleClick(e)
}

const getCanvasPadding = (canvasBox: HTMLElement | null, canvas: HTMLCanvasElement | null) => {
    if (!canvasBox || !canvas) return { x: 0, y: 0 }
    const boxRect = canvasBox.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    return {
        x: canvasRect.x - boxRect.x,
        y: boxRect.y - canvasRect.y,
    };
}

const listenEvent = () => {
    events.on('refresh', refresh)
    events.on('addMark', (data: any) => {
        const { x, y, uuid } = data
        const padding = getCanvasPadding(canvasBoxRef.value, canvasRef.value)
        const offsetX = padding.x
        const offsetY = padding.y
        tagShow.value = true
        tagPosition.value = {
            top: y + offsetY + 36 + 10,
            left: x + offsetX + 36 + 10
        }
        currentUuid.value = uuid
    })
    events.on('selectMark', (_data: any) => {
        creating.value = 'select'
    })
    events.on('switchScene', (index: any) => {
        switchScene(index)
    })
}
onMounted(() => {
    init()
    listenEvent()
    window.addEventListener("resize", refresh);
})
onUnmounted(() => {
    window.removeEventListener("resize", refresh);
    sceneStore.clearScene();
})
</script>

<style scoped>
.image-marker-page {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #E8E8E8;
}

.image-marker-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    overflow: hidden;
}

.image-marker-right {
    height: 100vh;
    width: calc(100vw - 267px);
}

.image-marker-right-content {
    width: 100%;
    height: calc(100vh - 50px);
    background-color: #EEEEEE;
    display: flex;
    flex-direction: row;
    min-height: 500px;
}

.mark-box {
    background-color: #FAFAFA;
    height: calc(100vh - 122px);
    flex: 1;
    overflow: hidden;
    padding: 36px;
    position: relative;
}

#canvas_box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    z-index: 1;
}

.tag-box-model {
    position: absolute;
    top: 0;
    left: 0;
}

.tag_box {
    width: 204px;
    padding-top: 41px;
    padding-left: 33px;
    user-select: none;
}

.tag_item_title {
    font-family: Inter;
    font-size: 24px;
    font-weight: 500;
    line-height: 29.05px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #333333;
    margin-bottom: 20px;

}

.tag_item_list {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.tag_item {
    padding: 8px 16px;
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.94px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    border: 1px solid #999999;
    border-radius: 10px;
    display: inline-block;
    color: #666666;
}

.image-marker-menu {
    width: 100%;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 10px 15px 0px #aaaaaa;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.image-marker-menu-header {
    width: 86px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-right: 1px solid rgba(221, 221, 221, 1);
    padding: 14px 0px;
}

.image-marker-menu-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0px;
}

.image-marker-menu-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 48px;
    margin-left: 29px;
}

.image-marker-menu-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 38px;
    margin-right: 237px;
}

.image-marker-menu-item {
    width: 16px;
    height: 16px;
    color: #000;
    padding: 3px;
}

.active {
    color: #1AE28E;
}

.button {
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #333333;
    gap: 6px;
    font-family: Inter;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    user-select: none;
}

.disabled {
    color: #999999;
}
</style>
