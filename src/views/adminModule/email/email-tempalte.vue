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
    const user_role = ref("");


    const package_img = ref("");
    const all_packages = ref([]);
    const all_coupls = ref([]);
    const all_replies = ref([]);





    import serviceimg1 from "@/assets/images/website/decoration1.jpg";


    async function singlemail() {
        try {
            const formData = new FormData();
            formData.append("customer_single_email", 'customer_single_email');
            formData.append("serviceId", serviceId);

            fullpageloader.value = true;

            const response = await axios.post(`/home/email_data`, formData, config);
            console.log(response.data, "hi response all booking customer");
            console.log(response.data.replies_allemails, "hi response all booking customer");

            if (response.data.status == 'SAVED') {

                user_role.value = response.data.role
                emid.value = response.data.single_cust_emails['id']

                show_subject.value = response.data.single_cust_emails['subject']

                sender_user.value = response.data.single_cust_emails['sender']


                all_packages.value = response.data.single_cust_emails['c_package']
                all_coupls.value = response.data.single_cust_emails['couple_p']

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
                    <v-row class="justify-content-between align-center pt-3">
                        <v-col cols="12" md="7"> <v-card-title class="text-h4 ">Email </v-card-title></v-col>
                        <v-col cols="12" md="5" class="d-flex gap-2 justify-end">
                            <!-- <v-btn color="primary" variant="flat" class="d-block py-1 rounded-sm textPrimary"
                                size="small" @click="gettoupdate(pack)">
                                Send Email 
                            </v-btn> -->

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
                                    <div class="pa-0  pt-5 ">
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
                                                    To</v-label>
                                                <v-autocomplete v-model="sendto" :items="sendtoitems" variant="outlined"
                                                    color="primary" multiple hide-details closable-chips
                                                    item-title="label" item-value="value">
                                                </v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12">
                                                <v-label
                                                    class="text-subtitle-1 font-weight-medium pb-2">Packages</v-label>
                                                <v-autocomplete v-model="packages" :items="items2" variant="outlined"
                                                    color="primary" multiple hide-details closable-chips
                                                    item-title="text" item-value="value">
                                                </v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12">
                                                <div class="mb-3">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Subject
                                                    </v-label>
                                                    <VTextField hide-details="auto" v-model="subject" class="mb-3"
                                                        required placeholder="Enter Your Subject" color="secondary">
                                                    </VTextField>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" sm="12">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Content
                                                    </v-label>
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
                                    sender_user.user.first_name }} {{ sender_user.user.last_name }} 
                                    <span style="    font-size: 12px; color: #5F6262; font-weight: 400;">({{sender_user.user.email}}) </span></h3>

                                <p v-if="user_role == 'Admin'" class="addressStyle">
                                    <span v-for="ee in all_coupls" :key="ee.id">to : {{ ee.userprofile.user.email }}
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

                                        <!-- <div style="padding: 20px 20px 60px 20px;">
                                            <div class="">

                                                <p class="addressStyle">{{ show_subject }} </p>
                                            </div>
                                        </div> -->

                                        <div class="table-responsive">
                                            <div style="text-align: center;">
                                                <h4 class="invoiceInnerTitle">Packages</h4>
                                                <h2 class="nameStyleInvoice">Our Exclusive Packages</h2>
                                            </div>
                                            <table class="table table-nowrap table-bordered">
                                                <thead>
                                                    <tr></tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="pack in all_packages" :key="pack.id">

                                                        <td>
                                                            <a v-if="pack.package_logo === '/media/default.jpg'"
                                                                style=" text-decoration:none">
                                                                <img src="../../../assets/images/customer/djs.jpg"
                                                                    width="320" height="200"
                                                                    style="display:block; object-fit: cover; border-radius: 10px; width: 100%;">
                                                            </a>
                                                            <a v-else style=" text-decoration:none">
                                                                <img :src="BASE_URL + pack.package_logo" width="320"
                                                                    height="200"
                                                                    style="display:block; object-fit: cover; border-radius: 10px; width: 100%;">
                                                            </a>
                                                        </td>


                                                        <td style="color:#1a2e3b;font-size:14px;line-height:24px;">
                                                            <h2 style="margin-top: 0;margin-bottom: 5px;"><span
                                                                    style="color: #d2a957;">$ {{ pack.price
                                                                    }}</span><br>
                                                                {{ pack.name }}</h2>
                                                            <table>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="padding: 0;"><b>Deposit :</b>
                                                                        </td>
                                                                        <td style="padding: 0;">${{ pack.advance_payment
                                                                            }}</td>
                                                                    </tr>
                                                                    <!-- <tr>
                                                                        <td style="padding: 0;"><b>Location:</b></td>

                                                                        <td style="padding: 0;">
                                                                            <p v-for="c in pack.cities" :key="c.id">
                                                                                {{ c.city }} , {{ c.state.state }}
                                                                            </p>
                                                                            <p v-if="!pack.cities.length || pack.cities.every(c => !c.city)" v-for="c in pack.states" :key="c.id">
                                                                            {{ c.state }}
                                                                            </p>
                                                                        </td>

                                                                    </tr> -->
                                                                    <tr>
                                                                    <td style="padding: 0;"><b>Location:</b></td>
                                                                    <td style="padding: 0;">
                                                                        <!-- Show up to 3 states -->
                                                                        <p v-for="(s, index) in pack.states.slice(0, 2)" :key="s.id">
                                                                        {{ s.state }}
                                                                        </p>

                                                                        <!-- View More link if there are more than 3 states -->
                                                                        <a v-if="pack.states.length > 2" 
                                                                        :href="'/cpackage_pub/' + pack.id" 
                                                                        class="text-decoration-none" 
                                                                        style="color: blue; cursor: pointer;">
                                                                        View More
                                                                        </a>
                                                                    </td>
                                                                    </tr>


                                                                    <tr>
                                                                        <td style="padding: 0; text-wrap-mode: nowrap;">
                                                                            <b>Offered by:</b>
                                                                        </td>
                                                                        <td style="padding: 0;">Engaged
                                                                            celebration</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td v-if="user_role == 'Customer'"
                                                                            style="padding: 0;">
                                                                            <router-link
                                                                                :to="`/vendor-single/${pack.id}`"
                                                                                style="text-decoration: none;">
                                                                                <v-btn color="primary" variant="flat"
                                                                                    class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                                                                                    Book Now
                                                                                </v-btn>
                                                                            </router-link>
                                                                        </td>
                                                                        <td v-else style="padding: 0;">
                                                                            <router-link :to="`/internal-booking`"
                                                                                style="text-decoration: none;">
                                                                                <v-btn color="primary" variant="flat"
                                                                                    class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                                                                                    View Bookings
                                                                                </v-btn>
                                                                            </router-link>
                                                                        </td>

                                                                        <td v-if="user_role == 'Customer'"
                                                                            style="padding: 0;">
                                                                            <router-link
                                                                                :to="`/vendor-single/${pack.id}`"
                                                                                style="text-decoration: none;">
                                                                                <v-btn color="primary" variant="flat"
                                                                                    class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                                                                                    View Package
                                                                                </v-btn>
                                                                            </router-link>
                                                                        </td>
                                                                        <td v-else style="padding: 0;">
                                                                            <router-link
                                                                                :to="`/admin-edit-package/${pack.id}?booknow`"
                                                                                style="text-decoration: none;">
                                                                                <v-btn color="primary" variant="flat"
                                                                                    class="d-block py-1 mr-3 rounded-sm textPrimary rounded">
                                                                                    Edit Package
                                                                                </v-btn>
                                                                            </router-link>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2" height="10">
                                                            <hr>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td height="10"></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </div>
                </v-col>

            </v-row>
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

                <!-- <v-btn color="primary" variant="flat" class="d-block py-1 rounded-sm textPrimary rounded">
                        Forward
                    </v-btn> -->
            </v-col>
        </v-row>
    </v-col> 





</template>


<style>
    .table-size-main {
        /* width: 94%; */
        margin: 0 auto;
        display: block;
        padding-top: 10px;
    }

    .table-responsive {
        padding: 0 10px;
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

    .table-bordered td,
    .table-bordered th {
        border: 2px solid #fff;
    }

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

    h4.invoiceInnerTitle {
        color: rgb(180, 128, 28);
        font-weight: 600;
        font-size: 16px;
        letter-spacing: 0.5px;
        margin: 0;
    }

    h2.nameStyleInvoice {
        margin: 0 0 10px;
        font-size: 30px;
        font-weight: 600;
        color: #333;
    }

    p.addressStyle {
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
        padding: 15px;
        text-align: center;
    }

    .footer {
        background: #333;
        color: white;
        text-align: center;
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
    }

    .social-icon a {
        display: flex;
        padding: 5px;
        justify-self: center;
        background-color: #fff;
        border-radius: 50%;
    }

    ul.social-icon li {
        display: inline-block;
    }
</style>