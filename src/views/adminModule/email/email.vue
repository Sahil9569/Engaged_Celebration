<script setup lang="ts">
import { ref } from 'vue';
import notif from '@/stores/notify';
import BASE_URL from '@/stores/myVar';
import axios from '@/stores/axios'
import notificationbell from '@/assets/images/website/notification-bell.png'

import { onMounted, computed } from 'vue';

const fullpageloader = ref(true);
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const isLoading = ref(false);

import { nextTick } from 'vue';



const updatepack = ref(false)
async function gettoupdate(pack: any = null) {
    updatepack.value = true


    window.setTimeout(() => { if (document.querySelector('.tiptap')) { window.setTimeout(() => { document.querySelector('.tiptap').innerHTML = pack.description }, 100) } }, 200)
}


// const notifications = ref([{}])
// async function not_init(){
//     const response = await axios.post('home/notifications')
//     console.log("response_not_init____________", response.data)
//     if (response.data.status == 'SENT'){
//         notifications.value = response.data.not_list.map((a:any)=>({
//         avatar      : (a.sender) ? BASE_URL + a.sender.pic : notificationbell,
//         title       : a.title,
//         subtitle    : a.content,
//         timed       : a.created_at,
//         // link        : (a.link) ? a.link : null,
//         // link: `https://mail.google.com/mail/u/0/#search/${a.title}` ,
//         link        : a.link,
//         unread      : !(a.is_read)
//         }))
//         notif["not_count"].value = 0
//     }
// }
// not_init()


const email_data = ref([])



async function email_listing() {
    
    try {
        const response = await axios.post('/home/email_data');
        // fullpageloader.value = true;
        console.log("response_em_init____________", response.data);
        if (response.data.status === 'SENT') {
            fullpageloader.value = false;
            
            email_data.value = response.data.all_emails.map(item => {

                let contentLength = 132; 
                if (item.subject.length > 30 && item.subject.length <= 40) {
                    contentLength = 85;
                } else if (item.subject.length > 20 && item.subject.length <= 30) {
                    contentLength = 90;
                } else if (item.subject.length > 10 && item.subject.length <= 20) {
                    contentLength = 100;
                } else if (item.subject.length > 40 ) {
                    contentLength = 80;
                }
      
                const allReceivers = [
                    ...(item.couple_p ? item.couple_p.map(couple => couple.userprofile.user.first_name) : []),
                    ...(item.vendor_p ? item.vendor_p.map(vendor => vendor.userprofile.user.first_name) : [])
                ].join(', ');
                const truncatedReceivers = allReceivers.length > 13 ? allReceivers.substring(0, 13) + '.' : allReceivers;
          
                
                return {
                    id: item.id,
                    read_unread: item.admin_read_unread,
                    usertype_couple: item.couple_p ? item.couple_p : 'null',
                    vendor_p: item.vendor_p,
                    email_link: "/single-mail/" + item.id,
                    subject: item.subject.length > 36 ? item.subject.substring(0, 36) + '.. ' : item.subject,
                    content: item.content.length > contentLength ? item.content.substring(0, contentLength) + '...' : item.content,
                    unread: true,
                    receivers: truncatedReceivers,
                    created_at: new Date(item.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                };
                // fullpageloader.value = false;
            });
            
        }else {
            console.log("Unexpected response format.");
            fullpageloader.value = false;
           
        }
    } catch (error) {
        console.error("Error initializing email data:", error);
        
    }
}
email_listing();



async function deleteSelectedEmails() {
    const selectedEmailIds = email_data.value
        .filter(item => item.selected)
        .map(item => item.id);

    if (selectedEmailIds.length === 0) {
        fullpageloader.value = false
        // showSuccessMessage.value = true;
        showErrorMessage.value = true;
        myerrors.value = 'Please select the mail.';
        setTimeout(() => {
            // showSuccessMessage.value = false;
            showErrorMessage.value = false;
            fullpageloader.value = false;
            }, 1000);
        return;
    }

    try {
        // const formData = new FormData();
        // formData.append("admin_delete_email", 'admin_delete_email');
        const response = await axios.post('/home/delete_emails', {admin_delete_email: 'admin_delete_email', email_ids: selectedEmailIds });

        // if (response.data.success) {
        if (response.data.status === 'SUCCESS'){
            email_data.value = email_data.value.filter(item => !selectedEmailIds.includes(item.id));
            // alert("Selected emails have been deleted successfully.");
            fullpageloader.value = false
            showSuccessMessage.value = true;
            myerrors.value = 'Selected emails have been deleted successfully.';
            setTimeout(() => {
                showErrorMessage.value = false;
                fullpageloader.value = false;
            }, 2000);
        } else {
            showSuccessMessage.value = false;
            myerrors.value = "Something went wrong";
        }
    } catch (error) {
        console.error("Error deleting emails:", error);
        showSuccessMessage.value = false;
        myerrors.value = "An unexcepted error occured!"
    }finally {
        setTimeout(() => {
            showSuccessMessage.value = false;
        }, 2000)}
}






const roleMail = ref('1');
const subject = ref('');
const content = ref('');
const items2 = ref([

]);
const packages = ref([]);


const sendtoitems = ref([

]);
const sendto = ref([]);


async function initlist() {
    try {
        const response = await axios.get('home/all_v_c_data');
        console.log("response_initlist____________", response.data);

        if (response.data.status === 'SENT') {
            
            

            if (roleMail.value === '1') {
                // If Couple is selected
                items2.value = response.data.cpack.map(a => ({
                    // "package": a.packages,
                    'text': a.text,
                    'value': a.value,
                }));
                sendtoitems.value = response.data.cprofile.map(item => ({
                    'label': item.text,
                    'value': item.value,
                }));
            } else if (roleMail.value === '2') {

                items2.value = response.data.v_pack.map(a => ({
                    // package: a.packages,
                    'text': a.text,
                    'value': a.value,

                }));
                sendtoitems.value = response.data.vprofile.map(item => ({
                    'label': item.text,
                    'value': item.value,
                }));
            }
            // fullpageloader.value = false
        }else{
            fullpageloader.value = false
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

function refreshContent() {
  
    sendto.value = null;
    subject.value = '';
    content.value = '';
    packages.value = null;

    initlist();
}

initlist();

const user_id = ref([]);



async function send_Email() {
    try {
        fullpageloader.value = true
        console.log('Sending Email Request:');
        console.log('subject:', subject.value);
        console.log('content:', content.value);
        console.log('packages:', packages.value);
        console.log('sendto:', sendto.value);

        if((!subject.value || subject.value.length ===0 || !content.value || content.value.length === 0 || !packages.value || packages.value.length === 0 || !sendto.value || sendto.value.length === 0))
        // if(subject.value.length ===0 || content.value.length === 0 || packages.value.length === 0 || sendto.value.length ===0 )
        {
            fullpageloader.value = false;
            showErrorMessage.value = true;
            myerrors.value = 'All fields marked with * are required.';
            setTimeout(() => {
                showErrorMessage.value = false;
                fullpageloader.value = false;
            },3000);
            return;
        }
        const response = await axios.post("/home/send_email_to_couple", {
            roleMail: roleMail.value,
            sendto: sendto.value,
            subject: subject.value,
            content: content.value,
            packages: packages.value,
        });
        if (response.data.status === "SUCCESS") {
            email_listing()
            fullpageloader.value = false
            showSuccessMessage.value = true;
            updatepack.value = false;
            myerrors.value = 'Email sent to user sucessfully.';
            setTimeout(() => {
                showErrorMessage.value = false;
                fullpageloader.value = false;
            }, 3000);
        } else {
            showSuccessMessage.value = false;
            myerrors.value = "Something went wrong";
        }
    } catch (error) {
        console.error('Error while sending email:', error);
        showSuccessMessage.value = false;
        myerrors.value = "An unexcepted error occured!"
    } finally {
        setTimeout(() => {
            showSuccessMessage.value = false;
        }, 3000)
    }
}





</script>

<template>
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span>
        <div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div>
    </div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
    </div>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="">
                    <v-row class="justify-content-between align-center pt-3">
                        <v-col cols="12" md="7"> <v-card-title class="text-h4 ">All Sent Emails</v-card-title></v-col>
                        <v-col cols="12" md="5" class="d-flex gap-2 justify-end">
                            <!-- <v-btn color="primary" variant="flat" class="d-block py-1 rounded-sm textPrimary"
                                size="small" @click="deleteSelectedEmails">
                                Mark as Read
                            </v-btn>
                            <v-btn color="primary" variant="flat" class="d-block py-1 rounded-sm textPrimary"
                                size="small" @click="deleteSelectedEmails">
                                Mark as Unread
                            </v-btn> -->
                            <v-btn v-if="email_data.length != 0" color="error" variant="flat" class="d-block py-1 rounded-sm textPrimary"
                                size="small" @click="deleteSelectedEmails">
                                Delete
                            </v-btn>
                            <v-btn color="success" variant="flat" class="d-block py-1 rounded-sm textPrimary"
                                size="small" :to="'/inbox-emails'" >
                                Inbox
                            </v-btn> 
                            <v-btn color="primary" variant="flat" class="d-block py-1 rounded-sm textPrimary"
                                size="small" @click="gettoupdate(pack)">
                                Send Email
                            </v-btn>
                           

                            <!-- <div>
                                <v-btn color="primary" variant="flat" class="d-block py-1 rounded-sm textPrimary"
                                size="small" @click="gettoupdate(pack)">
                                Delete
                            </v-btn><br>
                            </div> -->

                            <v-dialog v-model="updatepack" scrollable class="dialog-mw" :max-width="600">
                                <v-card class="pa-6">
                                    
                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                        <h4
                                            class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize">
                                          New Email</h4>
                                        <v-btn icon color="" @click="updatepack = !updatepack" flat variant="outlined"
                                            size="x-small" class="bg-error">
                                            <XIcon width="13" />
                                        </v-btn>
                                    </div>
                                    <div class="pa-0  pt-10 ">
                                        <v-row>
                                            <v-col cols="12" sm="12">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Role
                                                    </v-label>
                                                    <div
                                                        class="d-flex justify-center align-center flex-column flex-sm-row">
                                                        <v-radio-group hide-details v-model="roleMail" inline
                                                            class="d-flex gap-3" @change="refreshContent">
                                                            <v-radio label="Couple" color="primary" value="1"></v-radio>
                                                            <v-radio label="Vendor" color="primary" value="2"></v-radio>

                                                        </v-radio-group>

                                                    </div>

                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="12">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Send
                                                    To<span style="color: red;">*</span></v-label>
                                                <v-autocomplete v-model="sendto" :items="sendtoitems" variant="outlined"
                                                    color="primary" multiple hide-details closable-chips
                                                    item-title="label" item-value="value">
                                                </v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12">
                                                <v-label
                                                    class="text-subtitle-1 font-weight-medium pb-2">Packages
                                                    <span style="color: red;">*</span></v-label>                                 
                                                <v-autocomplete v-model="packages" :items="items2" variant="outlined"
                                                    color="primary" multiple hide-details closable-chips
                                                    item-title="text" item-value="value">
                                                </v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12">
                                                <div class="mb-3">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Subject
                                                        <span style="color: red;">*</span></v-label>
                                                    <VTextField hide-details="auto" v-model="subject" class="mb-3"
                                                        required placeholder="Enter Your Subject" color="secondary">
                                                    </VTextField>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="12">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Content
                                                        <span style="color: red;">*</span></v-label>
                                                    <VTextField v-model="content" hide-details="auto" required
                                                        placeholder="Enter Content" color="secondary"></VTextField>

                                                </div>
                                            </v-col>


                                        </v-row>
                                    </div>
                                    <v-card-actions class="px-0 d-flex justify-end w-100 mt-8">
                                        <v-btn class="bg-error rounded-sm" text @click="updatepack = !updatepack" flat>
                                            Close
                                        </v-btn>
                                        <v-btn class="bg-success rounded-sm" text flat @click="send_Email()">
                                            Send
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    
                    
                    <v-row justify="left" >
                      
                        <v-col cols="12" md="12" sm="12" class="mb-md-0 mb-10">
                        <div v-for="item in email_data" :key="item.id" :value="item"> 
                        <!-- <div v-for="item in email_data" :key="item.subject" :value="item"> -->
                            <v-card elevation="10" class="w-100 mb-2">
                            <v-card-title class="py-3 px-5">
                                <div class="d-flex justify-space-between align-center">
                                <div class="d-flex align-center">
                                 
                                    <div class=" d-flex align-center" style="width: 200px;">
                                         <input type="checkbox" class="mr-2" v-model="item.selected" />
                                        <h6 v-if="item.read_unread == false"  class="text-subtitle-1 font-weight-bold text-dark">To: {{ item.receivers }}
                                        </h6>
                                        <h6 v-else  class="text-subtitle-1 font-weight-normal text-dark" >To: {{ item.receivers }}
                                        </h6>
                                    </div>

                                    <template v-if="item.usertype_couple && item.usertype_couple.length">
                                    <router-link class="text-decoration-none" v-if="item.id" :to="{ name: 'Single Mail', params: { id: item.id } }">
                                        <div class="position-relative vendorsc-section d-flex overflow-hidden">
                                            <div>
                                    <h6 v-if="item.read_unread == false" class="text-subtitle-1 font-weight-bold text-dark">
                                        {{ item.subject }} - 
                                        <span class="text-subtitle-1 font-weight-regular text-Darklight">{{ item.content }}</span>                                    
                                    </h6>
                                    <h6 v-else class="text-subtitle-1 font-weight-normal text-dark">
                                        {{ item.subject }} - 
                                            <span class="text-subtitle-1 font-weight-regular text-Darklight">{{ item.content }}</span>                                    
                                    </h6>
                                </div>
                                <div></div> 
                                
                                    </div>
                                </router-link>  
                                    </template>

                                    <template v-else>
                                        <router-link class="text-decoration-none" v-if="item.id" :to="{ name: 'Vendor Single Mail', params: { id: item.id } }">
                                            <div class="position-relative vendorsc-section d-flex overflow-hidden">
                                                <div>
                                                    <h6 v-if="item.read_unread == false" class="text-subtitle-1 font-weight-bold text-dark">
                                                        {{ item.subject }} - 
                                                        <span class="text-subtitle-1 font-weight-regular text-Darklight">{{ item.content }}</span>                                    
                                                    </h6>
                                                    <h6 v-else class="text-subtitle-1 font-weight-normal text-dark">
                                                        {{ item.subject }} - 
                                                        <span class="text-subtitle-1 font-weight-regular text-Darklight">{{ item.content }}</span>                                    
                                                    </h6>
                                                </div>
                                                <div></div> 
                                            </div>
                                        </router-link>  
                                    </template>
                                </div>
                                    <p class=" text-subtitle-2 text-Darklight font-weight-semibold" :class="{ 'font-weight-bold':item.unread }">{{ item.created_at }}</p>
                                </div>
                            </v-card-title>
                           
                            </v-card>                     
                        </div>
                        </v-col>
                    </v-row>


                    <!-- <v-row justify="left">
                        <v-col cols="12" md="12" sm="12" class="mb-md-0 mb-10">
                            <div v-for="item in notifications" :key="item.title" :value="item">
                                <v-card elevation="10" class="w-100 mb-4" :class="{ 'bg-lightprimary':item.unread }">
                               
                                    <v-card-title class="py-6 px-5">
                                        <div class="d-flex justify-space-between align-center">
                                            <div class="d-flex align-center">
                                                <v-avatar class="mr-3"><img :src="item.avatar" class="noti_ctm inner-noti" width="50" height="50"></v-avatar>
                                                <a :href="item.link" class="text-decoration-none">
                                                <h6 class="text-subtitle-1  mb-1 font-weight-semibold text-dark" :class="{ 'font-weight-bold':item.unread }">{{item.title}}
                                                    </h6>
                                                    <p class="text-subtitle-2 font-weight-regular text-Darklight mb-1">{{item.subtitle}}</p>
                                                </a>
                                            </div>
                                        <div>
                                            <p class=" text-subtitle-2 text-Darklight font-weight-semibold" :class="{ 'font-weight-bold':item.unread }">{{item.timed}}</p>
                                        </div>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </div>
                        </v-col>
                    </v-row> -->


                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>

.font-weight-bold {
    font-weight: bold;
}
.font-weight-normal {
    font-weight: normal;
}

</style>