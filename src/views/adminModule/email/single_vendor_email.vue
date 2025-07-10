<script setup lang="ts">
    import { ref } from 'vue';
    import notif from '@/stores/notify';
    import BASE_URL from '@/stores/myVar';
    import axios from '@/stores/axios'
    import notificationbell from '@/assets/images/website/notification-bell.png'
    import PostItem from '@/components/apps/user-profile/posts/PostItem.vue';

    const fullpageloader = ref(true)
    const myerrors = ref('');
    const showSuccessMessage = ref(false);
    const showErrorMessage = ref(false);
    const modalReply = ref(false);
    const replyText = ref('');
    const reply_sub = ref('');



    const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

    const path = window.location.pathname;
    const serviceId: any = path.split('/').pop();


    // State variable to control the toggle
    const showFirstColumn = ref(true);

    // Function to toggle the state
    const toggleColumns = () => {
        showFirstColumn.value = !showFirstColumn.value;
    };


    const emid = ref("");
    const single_email = ref("");
    const show_subject = ref("");
    const sender_user = ref("");


    const package_img = ref("");
    const all_packages = ref([]);
    const all_coupls = ref([]);
    const all_replies = ref([]);

    const user_role = ref("");



    import serviceimg1 from "@/assets/images/website/decoration1.jpg";
    import packageIcon from '@/assets/images/website/packageIcon.png' 

    async function singlemail() {
        try {
            const formData = new FormData();
            formData.append("vendor_single_email", 'vendor_single_email');
            formData.append("serviceId", serviceId);

            fullpageloader.value = true;

            const response = await axios.post(`/home/email_data`, formData, config);
            console.log(response.data, "hi response all booking customer");
            console.log(response.data.replies_allemails, "hi response all booking customer");

            if (response.data.status == 'SAVED') {
                emid.value = response.data.single_cust_emails['id']
                user_role.value=response.data.role

                show_subject.value = response.data.single_cust_emails['subject']

                sender_user.value = response.data.single_cust_emails['sender']


                all_packages.value = response.data.single_cust_emails['v_package']
                all_coupls.value = response.data.single_cust_emails['vendor_p']

                if (response.data.replies_allemails) {
                    all_replies.value = response.data.replies_allemails
                }



                package_img.value = response.data.single_cust_emails['package_logo'] === '/media/default.jpg' ? serviceimg1 : BASE_URL + response.data.single_cust_emails['package_logo']



            }

            fullpageloader.value = false;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    singlemail();


    async function replysend_Email() {
        try {

            const formData = new FormData();
            formData.append("replycustomeradmin", 'replycustomeradmin');
            formData.append("serviceId", serviceId);
            formData.append("replyText", replyText.value);
            formData.append("reply_sub", reply_sub.value);
            fullpageloader.value = true;

            const response = await axios.post(`/home/email_data`, formData, config);
            console.log(response.data, "hi response all booking customer");
            console.log(response.data.all_emails_replies, "all_emails_replies response all booking customer");

            if (response.data.status == 'SAVED') {
                singlemail()
            }
            fullpageloader.value = false;
        } catch (error) {
            console.error("Error fetching data:", error);
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
                    <v-row class="justify-content-between align-center">
                        <v-col cols="12" md="7"> <v-card-title class="text-h4 ">Email Inbox </v-card-title></v-col>
                        <v-col cols="12" md="5" class="d-flex gap-2 justify-end">
                            <v-btn color="error" variant="flat" class="d-block py-1 rounded-sm textPrimary"
                                size="small">
                                Delete
                            </v-btn>
                        </v-col>
                    </v-row>
                    </v-card-item>
            </v-card>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" class="cursor-pointer">
            <v-row justify="center">
                <v-col cols="12" class=" d-none d-flex cursor-pointer">
                    <v-row>
                        <v-col cols="auto">
                            <img v-if="sender_user.profile_pic" :src="BASE_URL + sender_user.profile_pic" width="40"
                                height="40">
                            <img v-else src="../../../assets/images/landingpage/profile-icon.png" width="40"
                                height="40">
                        </v-col>
                        <v-col>
                            <div class="">
                                <h3 v-if="sender_user.user" style="font-size: 16px;font-weight: 600;"> {{
                                    sender_user.user.first_name }} {{ sender_user.user.last_name }} <span style="    font-size: 12px;
    color: #5F6262;
    font-weight: 400;">({{sender_user.user.email}}) </span></h3>
                                <p v-if="user_role == 'Admin'" class="addressStyle">
                                    <span v-for="ee in all_coupls" :key="ee.id">to : {{ ee.userprofile.user.email }} 
                                    </span>
                                </p>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
    </v-row>





    <v-row class="justify-center">
        <v-col cols="6">
            <div style="text-align: center;">
                <h4 class="invoiceInnerTitle">Packages</h4>
                <h2 class="nameStyleInvoice">Our Exclusive Packages</h2>
            </div>
            <table class="table table-nowrap table-bordered">
                <thead>
                    <tr></tr>
                </thead>
                <tbody>



                    <tr v-for="pack in all_packages" :key="pack.id" >
                        <td colspan="2"
                            style="color:#1a2e3b;font-size:14px;line-height:24px;background: #fef8eb;    border: 2px solid rgb(180 128 28);border-radius: 10px;display: block;width: 75%; margin:0 auto 20px; padding: 20px;">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img :src="packageIcon"
                                                style="width: 60px;height: 60px;padding: 4px;    position: relative;background: #131314;box-shadow: 0 0 30px #0000001f;overflow: hidden;border-radius: 50%;" />
                                            <h2 style="margin-top: 0;margin-bottom: 5px;">{{ pack.name }}</h2>
                                            <div class="position-relative">
                                            <div class="my-3">
                                                <div class="carousel">

                                                
                                                    <VSlickCarousel v-bind="settingsss">
                                                            <h2 v-if="pack.onetime_toggle == true" class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.one_time_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">One Time Payment</span>
                                                            </h2>
                                                            <h2 v-if="pack.subscrption_toggle == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Automatically charged ${{ pack.price }} /month </span>
                                                            </h2>
                                                            <h2 v-if="pack.yearly_toggle == true" class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.yearly_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Annual Subscription price</span>
                                                            </h2>
                                                            <h2 v-if="pack.lifetime_membership == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.lifetime_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Lifetime Membership : ${{ pack.lifetime_price }} </span>
                                                            </h2>
                                                    </VSlickCarousel>
                                                </div>
                                            </div>
                                        </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <router-link v-if="user_role == 'Admin'"
                                                    :to="`/subscription`"
                                                    style="text-decoration: none;">
                                                    <v-btn color="primary" variant="flat"
                                                        class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                                                        Edit Package
                                                    </v-btn>
                                            </router-link>
                                            <router-link v-else
                                                    :to="`/profile-settings/mypackage`"
                                                    style="text-decoration: none;">
                                                    <v-btn color="primary" variant="flat"
                                                        class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                                                        View Package
                                                    </v-btn>
                                            </router-link>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td> <div class="border-bottom px-5 py-3 pack-des font-weight-medium ">
                                            <div v-html="pack.description" class="styleforEditorcode forCenter"></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>



                     <!-- <tr>
                            <td colspan="2" height="10">
                                <hr>
                            </td>
                        </tr> -->

                </tbody>
                <tfoot>
                    <tr>
                        <td height="10"></td>
                    </tr>
                </tfoot>
            </table>

        </v-col>

    </v-row>




<template v-for="er in all_replies" :key="er.id">

<v-col cols="12" v-if="showFirstColumn" @click="toggleColumns" class="d-flex cursor-pointer">
    <v-row>
        <v-col cols="auto">
            <img v-if="er.reply_by.profile_pic" :src="BASE_URL + er.reply_by.profile_pic" width="40"
                height="40">
            <img v-else src="../../../assets/images/landingpage/profile-icon.png" width="40" height="40">
        </v-col>
        <v-col>
            <div class="">
                <h3 class="text-h5">{{ er.reply_by.user.first_name }} {{ er.reply_by.user.last_name }}</h3>
                <p class="</h3>">{{ er.subject }}</p>
            </div>
        </v-col>
    </v-row>
</v-col>
<v-col cols="12" v-else @click="toggleColumns" class="cursor-pointer">
    <v-row justify="center">
        <v-col cols="12" class=" d-none d-flex cursor-pointer">
            <v-row>
                <v-col cols="auto">

                    <img v-if="er.reply_by.profile_pic" :src="BASE_URL + er.reply_by.profile_pic" width="40"
                        height="40">
                    <img v-else src="../../../assets/images/landingpage/profile-icon.png" width="40"
                        height="40">
                </v-col>
                <v-col>
                    <div class="">
                        <h3 class="text-h5">{{ er.reply_by.user.first_name }} {{ er.reply_by.user.last_name
                            }} <span class="addressStyle" style="    font-size: 12px;
                                color: #5F6262;
                                font-weight: 400;">({{ er.reply_by.user.email }})</span></h3>
                        <p v-if="user_role == 'Admin'" class="addressStyle">
                            <span v-for="ee in all_coupls" :key="ee.id"> to :{{ ee.userprofile.user.email }}
                            </span>
                        </p>
                    </div>
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="8" md="8" sm="8" class="mb-md-0 mb-10">
            <div>
                <v-card elevation="10" class="w-100 mb-2">
                    <div class="">
                        <div class="">
                            <div class="topHeader pt-5">
                                <div class="logoStyle">
                                    <img src="../../../assets/images/logos/Logo-a12.png">
                                </div>
                            </div>
                            <div class="table-size-main">

                                <div style="padding: 20px 20px 60px 20px;">
                                    <div class="">
                                        <!-- <p class="addressStyle"><b>Hi, Anchan</b></p> -->
                                        <p class="addressStyle">{{ er.content }}</p>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </v-card>
            </div>
        </v-col>
    </v-row>
</v-col>
</template>







    <v-col cols="12">
        <v-row>
            <v-col cols="6" class="d-flex">
                <v-btn @click="modalReply = true" color="primary" variant="flat"
                    class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                    Reply by Email
                </v-btn>
                <v-dialog v-model="modalReply" max-width="600">
                    <v-card>
                        <v-card-text>
                            <div class="d-flex justify-space-between">
                                <h3 class="text-h3">Reply</h3>
                                <v-btn icon @click="modalReply = false" size="small" flat>
                                    <XIcon size="16" />
                                </v-btn>
                            </div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text>
                            <Form class="py-3">
                                <v-row>
                                    <v-col v-if="user_role == 'Admin'" cols="12">
                                        <v-row class="mx-n1">
                                            <v-col v-for="ee in all_coupls" :key="ee.id" cols="auto" class="pa-1">
                                                <v-chip class="bg-surface text-body-2 font-weight-medium"
                                                    size="small">{{ ee.userprofile.user.email }}</v-chip>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="mb-3">
                                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Subject
                                            </v-label>
                                            <VTextField hide-details="auto" v-model="reply_sub" class="mb-3" required
                                                placeholder="Enter Your Subject" color="secondary">
                                            </VTextField>
                                        </div>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined name="Note" v-model="replyText"></v-textarea>
                                    </v-col>

                                    <v-col cols="12" lg="12" class="text-right">
                                        <v-btn color="error" type="submit" @click="modalReply = false"
                                            variant="text">Cancel</v-btn>
                                        <v-btn color="primary" @click="replysend_Email()" type="submit">Submit</v-btn>
                                    </v-col>

                                </v-row>
                            </Form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </v-col> 


</template>


<style>
    .table-size-main {
        width: 94%;
        margin: 0 auto;
        display: block;
        padding-top: 10px;
        background-color: #d9d9d9;
    }

    .table {
        width: 100%;
        margin-bottom: 1rem;
        color: #495057;
        vertical-align: top;
        border: 1px solid #eef3f7;
        font-family: 'Nunito', sans-serif !important;
        border-collapse: collapse;
        margin-top: 20px;
    }

    table.table thead th,
    table.table tbody td,
    table.table tfoot td,
    div,
    h1,
    h2,
    h4,
    h3,
    h5,
    h6,
    span,
    input,
    button,
    a {
        font-family: 'Poppins', sans-serif !important;
    }

    table.table thead th,
    table.table tbody td {
        padding: 10px;
    }

    table.table tfoot {
        padding-top: 20px;
    }

    table.table tfoot td {
        padding: 5px 10px;
    }

    /*.table-bordered td,
        .table-bordered th {
            border: 2px solid #fff;
        }
*/
    .table th {
        font-weight: 700;
        font-size: 15px;
        text-align: left;
    }

    .table td {
        font-size: 14px;
    }

    .logoStyle {
        float: left;
        width: 100%;
    }

    .sideHeader {
        float: right;
        width: auto;
        padding-right: 10%;
    }

    .logoStyle img {
        max-width: 300px;
    }

    .topHeader:before,
    .topHeader:after {
        display: table;
        content: '';
        clear: both;
    }

    .logoStyle h1 {
        font-size: 40px;
        font-weight: bold;
        padding-bottom: 30px;
    }

    .list-top-header ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
    }

    .list-top-header li {
        color: #495057;
        padding-bottom: 5px;
        font-size: 14px;
        font-weight: 500;
    }

    .list-top-header li span {
        display: inline-block;
        width: 140px;
        color: #002442;
    }

    .footerLogoStyle {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%
    }

    img {
        max-width: 100%;
    }

    .mainTitleInvoice {
        color: #09d1a3;
        font-size: 36px;
        margin: 0;
        font-weight: 600;
        padding-bottom: 8px;
        letter-spacing: 1px;
        padding-top: 15px;
    }

    .mainListSize:before,
    .mainListSize:after {
        content: '';
        display: table;
        clear: both;
    }

    .mainListSize {
        display: table;
        padding: 50px 0;
        background: #e1e1e1;
        padding-left: 30px;
        margin-bottom: 40px;
    }

    .leftSideInvoice {
        width: 50%;
        /* display: table-cell; */
        padding-right: 10px;
        float: left;
        vertical-align: middle;
        margin-top: 60px;
    }

    .bannerImg {
        float: right;
        width: 45%;
    }

    .rightSideInvoice {
        width: auto;
        display: table-cell;
    }

    .mainListSize ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    table.table thead th {
        font-weight: 600;
        color: #fff;
        background-color: #d2a957;
    }

    .invoiceInnerTitle {
        color: rgb(180, 128, 28);
        font-weight: 600;
        font-size: 16px;
        letter-spacing: 0.5px;
        margin: 0;
    }

    .invoiceInnerTitle {
        color: rgb(180, 128, 28);
        font-weight: 600;
        font-size: 16px;
        letter-spacing: 0.5px;
        margin: 0;
    }

    .nameStyleInvoice {
        margin: 0 0 10px;
        font-size: 30px;
        font-weight: 600;
        color: #333;
    }

    .addressStyle {
        font-size: 14px;
        color: #5F6262;
        margin: 0;
    }

    .mainListSize ul>li {
        font-size: 14px;
        color: #5F6262;
        display: flex;
        margin: 5px 0;
    }

    .mainListSize ul>li>span {
        padding-right: 5px;
    }

    /* table tbody tr:nth-child(odd) td {
            background-color: #f7f8fa;
        } */

    .topHeader {
        background: #333;
        padding: 10px;
        text-align: center;
    }

    .footer {
        background: #333;
        color: white;
        text-align: center;
        padding: 5px;
    }

    .footer a {
        color: #333;
    }

    p {
        margin: 0 0 5px;
        line-height: 1.4285em;
        font-size: 14px;
    }

    p:last-child {
        margin-bottom: 0;
    }

    .social-icon {
        list-style: none;
        padding: 0;
        margin: 7px;
    }

    .social-icon a {
        display: flex;
        padding: 5px;
        justify-self: center;
        background-color: #fff;
        border-radius: 50%;
    }

    .social-icon li {
        display: inline-block;
        margin: 2px;
    }
</style>