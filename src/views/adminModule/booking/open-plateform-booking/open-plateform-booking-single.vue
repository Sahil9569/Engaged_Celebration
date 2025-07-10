<script setup lang="ts">
import { ref } from 'vue';
import user1 from "@/assets/images/profile/user-1.jpg";
import user2 from "@/assets/images/profile/user-2.jpg";
import userimg from "@/assets/images/admin/userimg.jpg";
import serviceimg from "@/assets/images/customer/djs.jpg";
import contractImg from "@/assets/images/vendor/contract.png";
const dialog1 = ref(false);
const dialog = ref(false);
const dialog3 = ref(false);

const bookmarked = ref(true)
const fucToggles = () => {
    bookmarked.value = !bookmarked.value

}
const customamount = ref();

const bookingCard = ref([
    {
        img: serviceimg,
        servicename: "DJs",
        bookingdate: "10.02.2024 ",
        bookingtime: "20:20",
        location: "Apt. 535 2655 Jast River, Karlton, SD 59244",
        servicedelivereddate: "20.03.2024",
        servicedeliveredtime: "20:40",
        username: "Contract",
    },

]);

/*-- Cards start --*/
const CardsData = ref([
    {
        img: user1,
        vendorname: "Akash Alhuwalia",
        vendorprofession: "DJ Master",
        profile: "View Profile",
    },
    {
        img: userimg,
        vendorname: "Arihaan Malik",
        vendorprofession: "Decorators",
        profile: "View Profile",
    },
]);

/*-- Cards end--*/

const bookingData = ref([
    {
        service: "Deposit",
        bookingdate: "10.2.2024",
        bookingtime: "10.20PM",
        bookingpayment: "$600",
        statuscolor: "success",
        duecolor: "success",
        statustext: "Done",
        duetext: "View",
    },

]);
const bookingDetails = ref([
    {
        price: "$1200",
        introduction: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua et dolore magna aliqua et dolore magna al Lorem ipsum dolor sit amet et dolore magna aliqua et dolore magna al Lore m ipsum dolor sit amet et dolore magna al Lorem ips",
        paymentpolicybefore: "50% - At the Time of booking",
        paymentpolicyafter: "50% - On Event date",
        seviceprovided: '[da]'
    },

]);



// import html2pdf from 'html2pdf.js'; // Import html2pdf
// const transaction_download = ref<HTMLElement | null>(null);
// const downloadContract = () => {
//   if (transaction_download.value) {
//     const element = transaction_download.value as HTMLElement; // Ensure the correct type
//     const options = {
//       margin: 1,
//       filename: 'invoice.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 4 },
//       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };
//     html2pdf().from(element).set(options).save();
//   }
// };

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePDF = () => {
    const element = document.getElementById('transaction_download'); // Replace with the ID of your content element
    if (!element) { console.error("Element with the specified ID not found"); return; }
    const doc = new jsPDF();
    html2canvas(element).then(canvas => {
        const dataURL = canvas.toDataURL('image/png');
        doc.addImage(dataURL, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        doc.save('report.pdf');
    });
};







</script>
<template>
    <v-btn color="secondary" @click="generatePDF"  variant="flat" size="small" class="">Download</v-btn>
    <div id="transaction_download">
        <v-card elevation="10" class="bg-grey100" >
            <v-card-item class="pa-sm-6 pa-3">
                <v-row>
                    <v-col cols="12" md="4">
                        <v-card elevation="10" class="vendor-card-hover ">
                            <v-card-item class="pa-4">
    
                                <div class="position-relative d-flex overflow-hidden">
                                    <img :src="serviceimg" class="rounded vendormainimg">
                                    <v-chip rounded="sm" class="ma-2 font-weight-semibold bg-secondary badge-service"
                                        size="small" label>
                                        Dj's
                                    </v-chip>
                                    <div class="viewServiceBtn d-md-flex d-block">
    
                                        <v-btn color="primary" variant="flat" class=" " size="small">
                                            <EyeIcon stroke-width="1.5" size="18" class="mr-2" />
                                            View Package
                                        </v-btn>
                                    </div>
                                </div>
    
                                <div class="d-flex justify-space-between align-center mt-2">
                                    <div>
                                        <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary mb-0">
                                            Dj Master
                                        </h4>
                                    </div>
                                    <div>
                                        <h4
                                            class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                            $1500
                                        </h4>
                                    </div>
                                </div>
    
                                <div>
                                    <h6 class="text-body-2 text-13"><span class="font-weight-semibold">Cities
                                            :</span>
                                        <span>
                                            Birmingham ,Montgomery
    
                                        </span>
                                    </h6>
                                    <h6 class="text-body-2 text-13"><span class="font-weight-semibold">Total Bookings
                                            :</span> 10</h6>
                                    <h6 class="text-body-2 text-13"><span class="font-weight-semibold">Remaining Bookings
                                            :</span> 4</h6>
                                    <h6 class="text-body-2 text-13"><span class="font-weight-semibold">Deposit Amount
                                            :</span>$ 200</h6>
                                </div>
    
                            </v-card-item>
                        </v-card>
                        <v-card elevation="10" class="border mt-4" v-for="card in bookingCard" :key="card.servicename">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between gap-3">
                                    <div class="d-flex align-center gap-3">
                                        <div class="">
                                            <h6 class="text-h6 text-secondary">{{ card.username }}</h6>
                                        </div>
                                    </div>
                                    <div>
    
                                        <v-btn flat size="small" color="secondary" class="rounded-sm mr-1"
                                        to="/contract-single">View</v-btn>
    
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col col="12" md="8">
                        <v-row class="mb-3">
                            <v-col cols="12" md="6">
                                <v-card elevation="10" class=" border d-flex pb-1">
                                    <v-card-text class="pa-4"> 
                                        <div class="d-flex align-center justify-space-between gap-3">
                                            <div class="d-flex align-center gap-3">
                                                <v-avatar size="60" class="rounded-sm">
                                                    <img :src="user1" width="60" />
                                                </v-avatar>
                                                <div class="">
                                                    <h6 class="text-h6 ">Mickel Robbie</h6>
                                                    <span class="text-truncate d-flex align-center gap-2">
                                                        <span class="text-truncate ">mickelrobbie@gmail.com</span>
                                                    </span>
                                                    <span class="d-flex align-center font-weight-bold">
                                                        Customer
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card elevation="10" class=" border  d-flex">
                                    <v-card-text class="pa-4"> 
                                        <div class="d-flex align-center justify-space-between gap-3">
                                            <div class="d-flex align-center gap-3">
                                                <v-avatar size="60" class="rounded-sm">
                                                    <img :src="user2" width="60" />
                                                </v-avatar>
                                                <div class="">
                                                    <h6 class="text-h6 ">John Doe</h6>
                                                    <span class="text-truncate d-flex align-center gap-2">
                                                        <span class="text-truncate ">johndoe2@gmail.com</span>
                                                    </span>
                                                    <span class="d-flex align-center font-weight-bold">
                                                        Vendor
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <div class="" v-for="card in bookingDetails" :key="card.price">
                            <v-card-text class="pa-0">
                                <v-row>
                                    <v-col cols="12">
    
                                        <v-card elevation="10" class="mb-0">
                                            <v-card-item>
                                                <v-row>
                                                    <v-col cols="6">
                                                        <div class="d-flex mb-3">
                                                            <div>
                                                                <p
                                                                    class="v-list-item-title text-h5 mb-1 d-flex align-center font-weight-medium ">
                                                                    Event Date
                                                                </p>
                                                                <p
                                                                    class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium maxwidthSet">
                                                                    10.02.2024
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div class="d-flex mb-3">
                                                            <div>
                                                                <p
                                                                    class="v-list-item-title text-h5 mb-1 d-flex align-center font-weight-medium ">
                                                                    Location
                                                                </p>
                                                                <p
                                                                    class=" v-list-item-title text-body-2 d-flex align-center font-weight-medium">
                                                                    Apt. 535 2655 Jast River, Karlton, SD 59244
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </v-col>
                                                    <v-col cols="6" class=" d-flex text-end flex-column">
                                                        <h2
                                                            class=" mb-0 text-h2 text-secondary font-weight-bold text-capitalize">
                                                            $1200
                                                        </h2>
                                                        <span
                                                            class="v-list-item-title text-body-1 mb-1 font-weight-medium text-capitalize text-secondary">
                                                            Budget Price
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                                <div>
                                                    <div class="mb-3">
                                                        <h2
                                                            class="v-list-item-title text-h5 mb-1 font-weight-medium text-capitalize">
                                                            Description
                                                        </h2>
                                                        <div class="contentHeightnew scroll-style border rounded pa-3">
                                                             <p class="body-text-5">
                                                                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod
                                                                tempor
                                                                incididunt ut labore et dolore magna aliqua et dolore magna
                                                                aliqua et
                                                                dolore
                                                                magna al Lorem ipsum dolor sit amet et dolore magna aliqua et
                                                                dolore
                                                                magna al
                                                                Lore m ipsum dolor sit amet et dolore magna al Lorem ips
                                                            </p>
                                                        </div>
                                                       
                                                    </div>
    
                                                </div>
                                            </v-card-item>
                                        </v-card>
                                       
    
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <div class="">
                            <h3 class="text-h5 mb-3">Contract Payments</h3>
                        </div>
                         <v-card elevation="10">
                            <v-card-item class="pa-2">
                                <v-table class="month-table ">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th
                                                    class="text-subtitle-1 textPrimary font-weight-semibold th_space">Sno</th>
                                                <th
                                                    class="text-subtitle-1 textPrimary font-weight-semibold th_space">
                                                    Payment
                                                    Details</th>
                                                <th
                                                    class="text-subtitle-1 textPrimary font-weight-semibold th_space">
                                                    Amount
                                                </th>
                                                <th
                                                    class="text-subtitle-1 textPrimary font-weight-semibold v">
                                                    Payment
                                                    Date</th>
    
                                                <th
                                                    class="text-subtitle-1 textPrimary font-weight-semibold th_space">
                                                    Payment
                                                    Status
    
    
                                                </th>
    
                                                <th
                                                    class="text-subtitle-1 textPrimary font-weight-semibold th_space">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in bookingData" :key="item.customername"
                                                class="month-item">
                                                <td><h5 class="text-no-wrap text-body-1">{{ index +1 }}</h5></td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        {{ item.service }}
                                                    </h5>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        {{ item.bookingpayment }}
                                                    </h5>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">
                                                        {{ item.bookingdate }}
                                                    </h5>
                                                    <p class="text-body-2">{{ item.bookingtime }}</p>
                                                </td>
                                                <td>
                                                    <v-chip rounded="md" class="ma-2 font-weight-semibold"
                                                        :color="item.statuscolor" size="small" label>{{
                                                        item.statustext }}</v-chip>
                                                </td>
                                                <td>
                                                    <h5 class="text-no-wrap text-body-1">
                                                        <v-tooltip text="Download Invoice">
                                                            <template v-slot:activator="{ props }">
                                                                <v-btn icon flat v-bind="props"
                                                                    to="/invoice">
                                                                    <DownloadIcon stroke-width="2" size="20"
                                                                        class="text-secondary" />
                                                                </v-btn>
                                                            </template>
                                                        </v-tooltip>
                                                    </h5>
    
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                            </v-card-item>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>
    </div>

</template>
<style>
.contentHeightnew {
    overflow-y: auto;
    height: 115px;
}
.vendormainimg {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.booking-card:hover .float-btn-book {
    bottom: 10px;
}

.float-btn-book {
    position: absolute !important;
    left: 50%;
    transform: translatex(-50%);
    bottom: -30px;
    transition: 0.38s ease-in-out 0s all;
}

.service-img-booking {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

label.v-label.v-field-label {
    color: #002642;
    font-weight: 600;
}

.height-set {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.height-sets {
    height: 210px;
    overflow-y: auto;
    overflow-x: hidden;
}

.contract-style {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 200px;
    border: 4px solid #ccc;
    position: relative;
}

.contract-style:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(201deg, transparent 41%, #fff 65%);
    left: 0;
    top: 0;
    opacity: 0.8;
}

.radio-tick {
    position: absolute;
    top: 10px;
    right: 10px;
}

.edit-contract-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

span.book_mark {
    padding-left: 20px;
    margin-top: -4px;
}

i.mdi-bookmark-outline.mdi.text-white,
i.mdi-bookmark.mdi.text-white {
    margin-left: 1px;
    margin-top: -2px;
}

.submit_pay {
    margin-top: -20px;
}

.accept_reject {
    justify-content: flex-end;
    display: flex;
    padding-top: 13px;
}

.radio_btn {
    top: 0px;
    right: 0px;
}

.vendor-list {
    padding: 35px 13px;
}

.profile_btn1 {
    margin-left: 6px;
}

th.text-subtitle-1.textPrimary.font-weight-semibold.th_space {
    padding: 0 10px;
}

.due_pay {
    background-color: rgb(234 247 226);
}

.vendor_m {
    margin-left: 7px;
}

.profile_btn {
    text-decoration: none;
}

.or {
    text-align: center;
}

.radio_bt {
    top: 75px;
    left: 11px;
}

.remaining_pay h5 {
    letter-spacing: 0.1px !important;
    font-size: 15px !important;
    color: #02133b;
}
.radio_bts {
    top: 167px;
    left: 11px;
    z-index: -999;
}
</style>