<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useChatStore } from '@/stores/apps/chat';
import { formatDistanceToNowStrict } from 'date-fns';
import ChatInfo from './ChatInfo.vue';
import extravar from '@/stores/extravars';
import { useDisplay } from 'vuetify';
import user1 from '@/assets/images/profile/user-1.jpg'
import msgsicon from '@/assets/images/chat/mssgs.png'
import {ArrowDownCircleIcon} from 'vue-tabler-icons';
// import notif from '@/stores/notify';
// notif["msg_count"].value = 0 // to make all chats as read
const { lgAndUp }           = useDisplay();
const Rpart                 = ref(lgAndUp ? false : true);
function toggleRpart()      {Rpart.value = !Rpart.value;}


import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

import websocket_domain from '@/stores/myVar2';
import chatSocket from '@/stores/chat_socket';
const makeitload = ref(false);

const store                 =   useChatStore();
// var chatDetail: any         =   ref(computed(() => {  return store.chats[store.chatContent - 1]; }))
var chatDetail: any         =   ref(computed(() => {  return store.chats.find((chat:any)=>(chat.room == store.crum)) }))
const showErrorMessage      =   ref()
const myerrors              =   ref()
const msg                   =   ref('');
var iurl                    =   new URL(window.location.href)
var urlSearchParams         =   iurl.searchParams;
const img_upload            =   ref()
const scrollbarRef          =   ref(null);

async function initiate(){
    makeitload.value = true;
    try { var response = await axios.post("inbox/inbox_initiate", {'at':localStorage.getItem('at')}, {withCredentials:true})}
    finally { makeitload.value = false; }
    let domain = `${websocket_domain}/room_initiate/key?march=${urlSearchParams.get("march")}&tme=${response.data.curlid}`
    if (response.data.status == "SENT") chatSocket.value = new WebSocket(domain);

    chatSocket.value.onopen = function (e:any) {      store.fetchChats();     console.error("{{   MESSAGE CONNECTED______________");     };
    chatSocket.value.onclose = function (e:any) {     console.error("MESSAGE DISCONNECTED___________   }}");     };
    onBeforeUnmount(() => {     chatSocket.value.close()      });
    
    chatSocket.value.onmessage = async function (e:any) {
        // if(!window.location.href.includes('message')) {chatSocket.value.close()}
        const data = await JSON.parse(e.data).message
        // console.log("__Receiving_msg >> _________________________", data)
        store.sendMsg(data[0], data[1], data[2], data[3]);
        scrolldown()
        console.log("END>> _________________________", data)
    }
}
initiate()
function scrolldown(){
    setTimeout(function () {if (scrollbarRef.value) {scrollbarRef.value.$el.scrollTop = scrollbarRef.value.$el.scrollHeight;}}, 10);//10 milliseconds to counter chat load
}
onBeforeUnmount(() => {     chatSocket.value.close()      });



async function addItemAndClear(item: string, itype="text") {
    if (item.length === 0) {return}
    msg.value = '';
    // console.log("__Sending_msg >> chatDetail.value['id']______________", chatDetail.value["id"], JSON.parse(String(localStorage.getItem('user'))).id, store.crum)
    await chatSocket.value.send(JSON.stringify({ msg: item, varta: chatDetail.value["id"], sam: JSON.parse(String(localStorage.getItem('user'))).id, crum: store.crum, type: itype}));
}


async function handleFileChange(event:any){
    let e = event.target.files[0]
    if (e && e.type && e.type.startsWith('image/')){
        img_upload.value = e;
        const reader = new FileReader();
        reader.onload = () => {
            const imageData = reader.result.split(',')[1]; // Extract base64-encoded image data
            if (img_upload.value.size/1000 <= 1000) {  addItemAndClear(imageData, "img")  }
            else { 
                showErrorMessage.value  = true
                myerrors.value = "File size should not be greater than 1 MB";
                setTimeout(() => {  showErrorMessage.value = false  }, 2500);
                console.error('File size should not be greater than 1 MB');        }
            };
            reader.readAsDataURL(img_upload.value);
    }else{
        showErrorMessage.value  = true
        myerrors.value = "Invalid file";
        setTimeout(() => {  showErrorMessage.value = false  }, 2500);
        console.error('Invalid file');
        img_upload.value = null; 
    }
}
const user:any = JSON.parse(localStorage.getItem('user'))
</script>
<template>
    <div v-if="chatDetail" class="customHeight">
        <div>
            <div class="d-flex align-center gap-3 pa-4 bg-grey200 border border-grey200">
                <!---Topbar Row-->
                <div class="d-flex gap-2 align-center">
                    <!---User Avatar-->
                    <v-avatar class="">
                        <img :src="(chatDetail.thumb.includes('profile'))?chatDetail.thumb:user1" alt="pro" width="50" />
                    </v-avatar>

                    <!-- <v-badge class="badg-dotDetail"  dot :color=" chatDetail.status === 'away'? 'warning': chatDetail.status === 'busy'? 'error': chatDetail.status === 'online'? 'success': 'containerBg'" >
                    </v-badge> -->
                    <!---Name & Last seen-->
                    <div>
                        <h5 class="text-h5">{{ chatDetail.name }}</h5>
                        <p class="text-body-2 font-weight-medium text-Darklight">{{chatDetail.email}}</p>
                        <!-- <small class="textPrimary"> {{ chatDetail.status }} </small> -->
                    </div>
                </div>
                <!---Topbar Icons-->
                <div class="ml-auto d-flex">
                    <!-- <v-btn icon variant="text" class="text-medium-emphasis">
                        <PhoneIcon size="24" />
                    </v-btn>
                    <v-btn icon variant="text" class="text-medium-emphasis">
                        <VideoPlusIcon size="24" />
                    </v-btn> -->
                    <v-btn icon variant="text" class="text-medium-emphasis" @click="toggleRpart">
                        <DotsVerticalIcon size="24" />
                    </v-btn>
                </div>
                <!---Topbar Icons-->
            </div>
            <v-divider />
            <!---Chat History-->
            <!-- <div class="d-flex position-relative h-100"> -->
                <div class="d-flex">
                <perfect-scrollbar class="rightpartHeight w-100" ref="scrollbarRef">
                    <div class="w-100">
                        <div v-for="chat in chatDetail.chatHistory" :key="chat.id" class="pa-5">
                            <div v-if="chatDetail.id === chat.senderId" class="justify-end d-flex text-end ma-1 mx-5">
                                <div >
                                    <small class="text-medium-emphasis text-subtitle-2" v-if="chat.createdAt"> You {{formatDistanceToNowStrict(new Date(chat.createdAt), {addSuffix: false})}} ago</small>
                                    <div class="d-flex justify-end">
                                        
                                        <v-sheet v-if="chat.type == 'text'" class="bg-grey100 rounded-md px-3 py-2 mb-1 w-custom-chatlist">
                                            <p class="text-body-2 font-weight-medium">{{ chat.msg }}</p>
                                        </v-sheet>
                                        <v-sheet v-if="chat.type == 'img'" class="mb-1">
                                            <a :href="extravar.mdomain + chat.attachments[0]" target="blank"><img :src="extravar.mdomain + chat.attachments[0]" class="rounded-md" alt="pro" width="250" /></a>
                                        </v-sheet>
                                        <v-avatar class="ms-2 profileBorder">
                                            <img :src="(user.profile_pic) ? BASE_URL + user.profile_pic : user1" alt="pro" width="40" />
                                        </v-avatar>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="d-flex align-items-start gap-3 mb-1 mx-5 ">
                                <!---User Avatar-->
                                <v-avatar class="profileBorder">
                                    <img :src="(chatDetail.thumb.includes('profile'))?chatDetail.thumb:user1" alt="pro" width="40" />
                                </v-avatar>
                                <div>
                                    <small class="text-medium-emphasis text-subtitle-2" v-if="chat.createdAt">
                                        {{ chatDetail.name }}, {{formatDistanceToNowStrict(new Date(chat.createdAt), {addSuffix: false})}} ago
                                    </small>

                                    <v-sheet class="bg-lightsecondary rounded-md px-3 py-2 mb-1 w-custom-chatlist colordiff" v-if="chat.type == 'text'">
                                        <p class="text-body-2 font-weight-medium">{{ chat.msg }}</p>
                                    </v-sheet>
                                    <v-sheet v-if="chat.type == 'img'" class="mb-1">
                                        <a :href="extravar.mdomain + chat.attachments[0]" target="blank"><img :src="extravar.mdomain + chat.attachments[0]" class="rounded-md" alt="pro" width="250" /></a>
                                    </v-sheet>
                                </div>
                            </div>
                        </div>
                    </div>
                </perfect-scrollbar>
                <div class="chat-arrow"><ArrowDownCircleIcon size="30" @click="scrolldown()"/></div>
              
                <perfect-scrollbar class="rightpartHeight bg-grey200">
                    <div class="right-sidebar" v-if="Rpart">
                        <v-sheet> <ChatInfo :chatDetail="chatDetail" /> </v-sheet>
                    </div>
                </perfect-scrollbar>
                </div>
        </div>
        <v-divider />
        <!---Chat send-->
        <!-- <div v-show="showSuccessMessage" class="mt-2">
            <v-alert color="success">Property added successfully!</v-alert>
        </div> -->
        <div v-show="showErrorMessage" class="mt-2">
            <v-alert color="error">{{myerrors}}</v-alert>
        </div>
        <div class="mx-4">
            <v-card elevation="10" class="bg-grey200">
                <v-card-item class="pa-0">
                    <form class="d-flex align-center pa-4" @submit.prevent="addItemAndClear(msg)">
                        <!-- <v-btn icon variant="text" class="text-medium-emphasis"><MoodSmileIcon size="24" /></v-btn> -->
                        <v-text-field variant="solo" hide-details v-model="msg" color="primary" class="shadow-none border" density="compact" placeholder="Type a Message"
                        ></v-text-field>
                        <v-btn icon variant="text" type="submit" class="text-medium-emphasis" :disabled="!msg"> <SendIcon size="25" /> </v-btn>
            
                        <label for="imgsent" class="d-inline-block pa-2"><PaperclipIcon size="25" /></label>
                        <!-- <v-text-field id="imgsent" class="d-none" color="primary" variant="outlined" type="file" placeholder="Enter Value" hide-details /> -->
                        <input type="file" class="d-none" accept="image/*" id="imgsent" @change="handleFileChange" />
                            
                        
                        <!-- <v-btn icon variant="text" class="text-medium-emphasis"><PaperclipIcon size="20" /></v-btn> -->
                    </form>
                </v-card-item>
            </v-card>
        </div>
    </div>
    <div v-else class="customHeight h-100 text-center ms-auto me-auto d-flex justify-center align-center">
        <div>
            <img :src="msgsicon" alt="pro" width="150"/>
            <h5 class="text-h5">No conversation selected.</h5>
        </div>
    </div>
    <div class="loader-main" id="make_it_load" v-if="makeitload"><div class="loader"></div></div>
</template>
<style lang="scss">
.profileBorder {
    outline : 3px solid #fac24d;
}
.colordiff {
    background-color:rgb(249 232 197) !important ;
}
.shadow-none .v-field--no-label {
    --v-field-padding-top: -7px;
}
.rightpartHeight {
    height: 530px;
    position:relative;
}
.chat-arrow{
    position:absolute;
    right:3px;
    bottom:100px;
    opacity:0.5;
    z-index: 999;
}
.chat-arrow:hover{
    opacity:1;
    transition: all 0.38s ease-in-out 0s;
}
.badg-dotDetail {
    left: -9px;
    position: relative;
    bottom: -10px;
}
.customHeight{
    position:relative;
}

.toggleLeft {
    position: absolute;
    right: 15px;
    top: 15px;
}
.right-sidebar {
    width: 320px;
    border-left: 1px solid rgb(var(--v-theme-borderColor));
    transition: 0.1s ease-in;
    flex-shrink: 0;
}

.HideLeftPart {
    display: none;
}
.w-custom-chatlist {
    max-width: 500px;
    border: 1px solid #e1e1e1;
    padding: 15px !important;
}
@media (max-width: 960px) {
    .right-sidebar {
        position: absolute;
        right: -320px;
        &.showLeftPart {
            right: 0;
            z-index: 2;
            box-shadow: 2px 1px 20px rgba(0, 0, 0, 0.1);
        }
    }
    .boxoverlay {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 1;
        background: rgba(0, 0, 0, 0.2);
    }
}
</style>
