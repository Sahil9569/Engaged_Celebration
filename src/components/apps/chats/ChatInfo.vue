<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useChatStore } from '@/stores/apps/chat';
import { uniq, flatten } from 'lodash';
// import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

const props = defineProps({ chatDetail: Object });

// const totalAttachment = computed(() => {
//     return uniq(flatten(props.chatDetail?.chatHistory.map((item: any) => item.attachment))).length;
// });

const totalMedia = computed(() => {return props.chatDetail?.chatHistory.filter((item: any) => (item.type === 'img')).length});
// console.log("chatDetail.chatHistory___________", chatDetail.chatHistory)
</script>
<template>
    <div v-if="chatDetail && totalMedia" class="pa-6 bg-grey200">
        <h6 class="text-h6 mb-3">Media ({{ totalMedia }})</h6>
        <div v-for="chat in chatDetail.chatHistory" :key="chat.id">
            <div v-if="chat.type == 'img'">
                <img :src="BASE_URL + chat.attachments[0]" alt="img" width="100" />
            </div>
        </div>
        

        <!-- <v-sheet v-if="totalAttachment != 0">
            <h6 class="text-h6 mb-3 mt-7">Attachments ({{ totalAttachment }})</h6>
            <div v-for="chat in chatDetail.chatHistory" :key="chat.id">
                <div class="d-flex align-center mt-7" v-for="atch in chat.attachment" :key="atch.file">
                    $${{atch}}$$
                    <v-avatar class="rounded-md bg-grey100" size="48">
                        <img width="24" alt="file" :src="atch.icon" />
                    </v-avatar>
                    <div class="pl-4">
                        <h6 class="text-subtitle-1 font-weight-semibold">{{ atch.file }}</h6>
                        <h5 class="text-subtitle-2 mt-1">{{ atch.fileSize }}</h5>
                    </div>
                </div>
            </div>
        </v-sheet>
        <v-sheet v-else>
            <v-alert color="error" type="warning" density="compact" variant="tonal" class="text-subtitle-1">
                No Attachments Found!
            </v-alert>
        </v-sheet> -->
    </div>
    <div v-else class="pa-4 bg-transparent">
        <v-card elevation="10" class="bg-lighterror">
            <v-card-item class="text-error">
                No Media Found
            </v-card-item>
        </v-card>
    </div>
</template>
