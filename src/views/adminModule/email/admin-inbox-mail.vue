<script setup lang="ts">
import { ref } from 'vue';
import notif from '@/stores/notify';
import BASE_URL from '@/stores/myVar';
import axios from '@/stores/axios'
import notificationbell from '@/assets/images/website/notification-bell.png'


const fullpageloader = ref(true)
const myerrors = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);




// const gmail_login_link =  ref("");
// const emails = ref([]);


// async function fetch_emails(){
//     console.log('Get the data');

//     fullpageloader.value = true; 
//     try{
//         const response = await axios.post("home/admin_fetch_emails");
//         console.log('fetch_emails__',response.data);

//         if(response.data.status === 'SUCCESS'){

//             gmail_login_link.value=response.data.gmail_search_link_inbox

//             emails.value = response.data.email_data.map(item =>{
//                 let contentLength = 132; // Default
//                 if (item.subject.length > 30 && item.subject.length <= 40) {
//                     contentLength = 85;
//                 } else if (item.subject.length > 20 && item.subject.length <= 30) {
//                     contentLength = 90;
//                 } else if (item.subject.length > 10 && item.subject.length <= 20) {
//                     contentLength = 100;
//                 } else if (item.subject.length > 40 ) {
//                     contentLength = 80;
//                 } 
                
//                 const truncatedSender  = item.sender.length > 18 ? item.sender.substring(0,18) + '' : item.sender  ;

//                 return {
//                     id: item.id,
//                     subject : item.subject.length>36 ? item.subject.substring(0,36) + '...' : item.subject,
//                     body : item.body.length > contentLength ? item.body.substring(0, contentLength) + '...' : item.body,
//                     sender : truncatedSender,
//                     gmail_search_link : item.gmail_search_link,
//                     created_at :new Date(item.created_at).toLocaleString('en-Us', {month : 'short', day : 'numeric'}),
//                 };
//             });
//         }else {
//             console.warn('No emails found or incorrect response format.');
//         }
//     }
//     catch(error){
//         console.error("Error initializing email data:", error);
//     }finally {
//         fullpageloader.value = false; 
//     }
// }

// fetch_emails()

// --2nd mails
const gmail_login_link = ref("");
const emails = ref([]);
const start = ref(0); // Initialize start index
const limit = 10; // Number of emails to fetch per request
const isLoading = ref(false); // To prevent multiple concurrent fetches
const hasMoreEmails = ref(true); // Track if more emails are available


async function fetch_emails() {
    if (isLoading.value || !hasMoreEmails.value) return; // Prevent redundant calls
    console.log("Fetching emails...");

    isLoading.value = true; 
    fullpageloader.value = true;

    try {
        const response = await axios.get("home/admin_fetch_emails", {
            params: {
                start: start.value,
                limit: limit,
            },
        });
        console.log("fetch_emails__", response.data);

        if (response.data.status === "SUCCESS") {
            gmail_login_link.value = response.data.gmail_search_link_inbox;

            const newEmails = response.data.email_data.map(item => {
                let contentLength = 132; // Default
                if (item.subject.length > 30 && item.subject.length <= 40) {
                    contentLength = 85;
                } else if (item.subject.length > 20 && item.subject.length <= 30) {
                    contentLength = 90;
                } else if (item.subject.length > 10 && item.subject.length <= 20) {
                    contentLength = 100;
                } else if (item.subject.length > 40) {
                    contentLength = 80;
                }
                const truncatedSender =
                    item.sender.length > 18 ? item.sender.substring(0, 18) + "..." : item.sender;

                return {
                    id: item.id,
                    subject: item.subject.length > 36 ? item.subject.substring(0, 36) + "..." : item.subject,
                    body: item.body.length > contentLength ? item.body.substring(0, contentLength) + "..." : item.body,
                    sender: truncatedSender,
                    gmail_search_link: item.gmail_search_link,
                    created_at: new Date(item.created_at).toLocaleString("en-Us", { month: "short", day: "numeric" }),
                };
            });

            // Append new emails to the existing list
            emails.value = [...emails.value, ...newEmails];

            // Check if there are more emails to fetch
            hasMoreEmails.value = response.data.start + response.data.limit < response.data.total_emails;

            // Increment start for the next fetch
            start.value += limit;
        } else {
            console.warn("No emails found or incorrect response format.");
            hasMoreEmails.value = false; // No more emails to fetch
        }
    } catch (error) {
        console.error("Error fetching emails:", error);
    } finally {
        isLoading.value = false; 
        fullpageloader.value = false; 
    }
}

// Load more emails when the user clicks the "Load More" button
function loadMoreEmails() {
    fetch_emails();
}

// Initial fetch
fetch_emails();




async function deleteSelectedEmails() {
    const selectedEmailIds = email_data.value
        .filter(item => item.selected)
        .map(item => item.id);

    if (selectedEmailIds.length === 0) {
        alert("Please select at least one email to delete.");
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
            fullpageloader.value = false;
        }, 2000)}
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
                        <v-col cols="12" md="7"> <v-card-title class="text-h4 ">All Inbox Emails</v-card-title></v-col>
                        <v-col cols="12" md="5" class="d-flex gap-2 justify-end">
                           

                            <a :href="gmail_login_link"  target="_blank" rel="noopener noreferrer"
                                class="d-block py-1 rounded-sm textPrimary">
                                <v-btn color="error" variant="flat" size="small">
                                    Google Email Inbox
                                </v-btn>
                            </a>  
                            
                        </v-col>
                    </v-row>
        
                    <v-row justify="left">
                        <v-col cols="12" md="12" sm="12" class="mb-md-0 mb-10">
                            <div v-for="item in emails" :key="item.id" :value="item">
                               
                                <v-card elevation="10" class="w-100 mb-2">
                                    <v-card-title class="py-3 px-5">
                                        <div class="d-flex justify-space-between align-center">
                                            <div class="d-flex align-center w-100">
                                                <div class="d-flex align-center" style="max-width: 200px;width: 100%;">
                                                    <!-- Checkbox for selecting email -->
                                                    <input
                                                        type="checkbox"
                                                        class="mr-2"
                                                        v-model="item.id"
                                                        :aria-label="`Select email from ${item.sender}`"
                                                    />
                                                    <!-- Sender with dynamic style -->
                                                    <h6
                                                        :class="{                                                       
                                                            'text-subtitle-1 font-weight-normal text-dark': item.read_unread,
                                                        }"
                                                    >
                                                        {{ item.sender }}
                                                    </h6>
                                                </div>
                                                

                                            <div class="position-relative vendorsc-section d-flex overflow-hidden w-100 justify-space-between">
                                                <div>
                                                    <h6
                                                        :class="{                                                   
                                                            'text-subtitle-1 font-weight-normal text-dark': item.read_unread,
                                                        }"
                                                    >  
                                                        <a :href="item.gmail_search_link" target="_blank" class="text-decoration-none text-dark">
                                                            {{ item.subject }}
                                                        </a> - 
                                                      
                                                        <span class="text-subtitle-1 font-weight-regular text-Darklight">
                                                            <a :href="item.gmail_search_link" target="_blank" class="text-decoration-none text-dark    ">
                                                                {{ item.body }}
                                                            </a>
                                                        </span>
                                                    </h6>
                                                </div>
                                                <div>
                                                    <p class=" text-subtitle-2 text-Darklight font-weight-semibold"
                                                    :class="{ 'font-weight-bold':item.unread }">{{ item.created_at }}</p>
                                                </div>
        
                                                </div>
                                            </div>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </div>
                            <div class="d-flex justify-center mt-4">
    <v-btn 
        v-if="hasMoreEmails" 
        @click="loadMoreEmails" 
        :disabled="isLoading"
        color="primary"
    >
        {{ isLoading ? "Loading..." : "Load More" }}
    </v-btn>
</div>
                        </v-col>
                    </v-row>

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