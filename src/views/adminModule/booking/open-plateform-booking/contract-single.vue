<script setup lang="ts">
import { ref } from 'vue';
import vueSignature from "vue-signature";

const option = {
    penColor: 'rgb(0, 0, 0)',
    backgroundColor: 'rgb(237,243,248)',
};

const disabled = ref(false);
const dataUrl = '';

const vendorSignature = ref(null);
const customerSignature = ref(null);

const saveSignature = (type) => {
    const signatureRef = type === 'vendor' ? vendorSignature.value : customerSignature.value;
    if (signatureRef) {
        const png = signatureRef.save();
        const jpeg = signatureRef.save('image/jpeg');
        const svg = signatureRef.save('image/svg+xml');
        console.log(`${type} Signature:`);
        console.log(png);
        console.log(jpeg);
        console.log(svg);
    }
};

const clearSignature = (type) => {
    const signatureRef = type === 'vendor' ? vendorSignature.value : customerSignature.value;
    if (signatureRef) {
        signatureRef.clear();
    }
};

const sign_done = () => {
    // Implement your sign_done logic here
};

const active_status = ref('Completed');

</script>
<template>
    <v-row>
        <v-col cols="12" class="d-flex justify-end">
            <v-btn color="secondary" variant="outlined" class="rounded-sm" size="small">
                Download Contract
            </v-btn>
        </v-col>
        <v-col cols="12">
            <v-card elevation="10" rounded="md" class=" border h-100">
                <v-card-item class="py-10">
                    <div class="contract">
                        <h1 class="v-card-title text-h4  mb-2">Contract For Wedding Services</h1>


                        <p class="text-body-1 text-13 font-weight-regular mb-3">Status:
                            <strong v-if="active_status === 'active'" class="text-info">Active</strong>
                            <strong v-else-if="active_status === 'Completed'" class="text-success">Completed </strong>
                            <strong v-else class="text-warning">Pending</strong>
                        </p>



                        <p class="text-body-1 text-13 font-weight-regular mb-1">This agreement ("Agreement") is made and
                            entered into
                            as of [Date], by and between
                        </p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1"><strong>[Vendor Name]</strong> ("Vendor")
                            and
                            <strong>[Customer Name]</strong>
                            ("Customer")
                            for the provision of wedding services as detailed below:
                        </p>
                        <h2 class="text-h6  mb-1 mt-5">1. Services:</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">a. Vendor shall provide the following
                            services for the
                            wedding event:</p>
                        <ul>
                            <li class="text-body-1 text-13 font-weight-regular mb-1">[List of services such as photography,
                                catering, venue rental, etc.]</li>
                        </ul>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">b. The services will be provided on the
                            date of
                            <strong>[Wedding Date]</strong> at
                            <strong>[Wedding Venue]</strong>.
                        </p>
                        <h2 class="text-h6 mb-1 mt-5">2. Payment:</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">a. The total cost for the services
                            outlined in Section
                            1 is <strong>[Total
                                Cost]</strong>.
                        </p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">b. Payment Schedule:</p>
                        <ul>
                            <li class="text-body-1 text-13 font-weight-regular mb-1"><strong>[Deposit Amount]</strong> due upon
                                signing this Agreement.</li>
                            <li class="text-body-1 text-13 font-weight-regular mb-1"><strong>[Additional Payment(s) Schedule if
                                    applicable]</strong>.</li>
                            <li class="text-body-1 text-13 font-weight-regular mb-1">Final payment of <strong>[Final Payment
                                    Amount]</strong> due <strong>[Number of
                                    Days/Weeks]</strong> before the event date.</li>
                        </ul>
                        <h2 class="text-h6 mb-1 mt-5">3. Cancellation And Refund Policy:
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">a. If the event is canceled by the
                            Customer
                            <strong>[Number of
                                Days/Weeks/Months]</strong> or
                            more before the event date, the deposit will be refunded minus a cancellation fee of
                            <strong>[Cancellation Fee Amount]</strong>.
                        </p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">b. If the event is canceled less than
                            <strong>[Number
                                of Days/Weeks/Months]</strong>
                            before
                            the event date, the deposit is non-refundable.
                        </p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">c. Vendor reserves the right to cancel
                            this Agreement
                            at any time with a full refund
                            of any
                            payments made by Customer.</p>
                        <h2 class="text-h6  mb-1 mt-5">4. Responsibilities Of Customer:</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">a. Provide accurate event details
                            including date, time,
                            location, and any special
                            instructions.</p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">b. Timely payment of all fees according to
                            the Payment
                            Schedule.</p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">c. Any changes to the event details must
                            be
                            communicated to Vendor in writing
                            <strong>[Number
                                of Days/Weeks]</strong> prior to the event.
                        </p>
                        <h2 class="text-h6 mb-1 mt-5">5. Responsibilities Of Vendor:</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">a. Provide services outlined in Section 1
                            in a
                            professional manner.</p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">b. Adhere to all agreed-upon timelines and
                            specifications.</p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">c. Provide any necessary equipment,
                            materials, or
                            personnel to fulfill the services.
                        </p>
                        <h2 class="text-h6  mb-1 mt-5">6. Limitation Of Liability:</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">Vendor's liability under this Agreement
                            shall be
                            limited to the total amount paid by
                            Customer. In no event shall Vendor be liable for any incidental, consequential, or punitive
                            damages.</p>
                        <h2 class="text-h6 mb-1 mt-5">7. MISCELLANEOUS:</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">a. This Agreement constitutes the entire
                            understanding
                            between Vendor and Customer
                            and
                            supersedes any prior agreements or understandings, written or oral.</p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">b. Any amendments to this Agreement must
                            be made in
                            writing and signed by both
                            parties.</p>
                        <p class="text-body-1 text-13 font-weight-regular mb-1">c. This Agreement shall be governed by the
                            laws of
                            <strong>[State/Country]</strong>.
                        </p>

                    </div>
                    <v-row>
                        <v-col cols="6">
                            <div>
                                <div class="text-h6  mb-4 mt-5">Vendor sign down below:</div>
                                <vueSignature ref="vendorSignature" :sigOption="option" :w="'500px'" :h="'200px'"
                                    :disabled="disabled" :defaultUrl="dataUrl" class="border rounded overflow-hidden">
                                </vueSignature>
                                <!-- <div class="mt-3">
                                    <v-btn color="secondary" variant="flat" @click="saveSignature('vendor')"
                                        size="small" class="rounded-sm me-2">Save</v-btn>
                                    <v-btn color="primary" variant="flat" @click="clearSignature('vendor')" size="small"
                                        class="rounded-sm">Clear</v-btn>
                                </div> -->
                            </div>
                        </v-col>
                    </v-row>

                    <!-- <div class="mt-4">
                        <v-btn color="success" variant="flat" @click="sign_done()" class="rounded-sm">
                            Submit
                        </v-btn>
                    </div> -->
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.contract strong {
    font-weight: 600;
}
</style>