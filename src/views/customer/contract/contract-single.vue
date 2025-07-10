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
            <!-- <v-btn color="secondary" variant="outlined" class="rounded-sm mr-2" size="small">
                Edit Contract
            </v-btn> -->
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



                        <h2 class="text-h6 mb-2">Retainer</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            An initial retainer and a signed contract must be secured prior to any services being performed by Vendor.
                        </p>
                        <h2 class="text-h6 mb-2">Contracted services </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            Includes all services described in selected package details reviewed and distributed to clients. Any additional services/products requested by the client incurred by the vendor will be billed directly to the client at cost. All services contracted cannot be deducted, but additional services can be added. For your convenience, payments to Vendor can be made through HoneyBook.
                        </p>
                        <h2 class="text-h6 mb-2">Expiration</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            Current event date is valid 1-week post origination date to secure services.
                        </p>
                        <h2 class="text-h6 mb-2">Provided Documentation</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            All documentation created and provided to clients is owned and copyrighted by Vendor and cannot be used or given to any other 3rd party.
                        </p>
                        
                        <h2 class="text-h6 mb-2">Hotel Accommodations</h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            If hotel accommodations are needed for rehearsal and Day of Wedding hotel accommodations (1 room with 2 double beds for 2 days or 2 rooms with 1 double bed for 2 days) are required within 10 – 15 miles of site in a safe location for all employees of Vendor working the events for any events located further than 40 miles from the studio unless otherwise agreed upon.
                        </p>

                        <h2 class="text-h6 mb-2">
                            Destination
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            For all weddings deemed as destinations (taking place beyond 125 miles from studio), additional fees are applicable, such as round trip airfare, hotel stay for 4-5 days & 3-4 nights pending complexity, and car rentals from airport and back during the stay. All travel can be arranged by clients per specifications of Vendor or arranged by Vendor with agreement of payment invoiced.

                        </p>


                        <h2 class="text-h6 mb-2">
                            Attire
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            All associates of Vendor will wear proper attire, blue, black, or brown dresses or suits, on the day of the event. Day of Management/Vendor – Will be a Lead Associate and team member of Vendor who will be present and manage the day of activities.
                        </p>

                        <h2 class="text-h6 mb-2">
                            Liability
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            It is understood that Vendor is only liable for services completed and provided by Vendor and cannot be held liable for the services of other contracted vendors. It is understood that in no event shall Vendor be liable for consequential damages of any kind.

                        </p>

                        <h2 class="text-h6 mb-2">
                            Cancellation Policy
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            If the event is canceled, no portion of the fees paid to Vendor will be returned. If event is canceled less than 6 months before date, 2nd payment will be required to compensate for hours of service already rendered and loss of event date. If the event is postponed, services contracted can be applied to a new date if available (refer to Postponement Policy).
                        </p>

                        <h2 class="text-h6 mb-2">
                            Postponement Policy
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            If an event is postponed, all services will cease at time of notification of postponement if no determined new date is provided. Payment schedule will be determined and readjusted post new event date notification. If a client requires services to resume, post a new event date being established, a second payment will be required at time of service restart.

                        </p>

                        <h2 class="text-h6 mb-2">
                            Responsibility
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            Vendor is not responsible for Acts Of God, Natural Disasters, an Act Of Government such as A Declaration of National or Local Emergency, or Other Incidents Not within the control of the Vendor, i.e. accident, death in the family, illness, pregnancy, or sudden tragic circumstance. In such a situation, Vendor. will obtain, upon approval of the client, a qualified professional replacement to fulfill Vendor’s obligations under the contract, at no additional charge to the client.

                        </p>

                        <h2 class="text-h6 mb-2">
                            Overtime
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            Additional unplanned and/or un-contracted services (such as, but not limited to, full redo of design, day of wedding extension of time, services outside of scope of agreement, management of non-wedding day activities, etc.) are considered overtime and will be billed with prior notification and consent at the rate of $130 per hour.

                        </p>

                        <h2 class="text-h6 mb-2">
                            Contracted Vendor and Payments
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            Any rentals and/or subcontracted vendors contracted on behalf of client will be paid in full to Vendor directly at requested deadline. Proper notice will be provided per cost.

                        </p>

                        <h2 class="text-h6 mb-2">
                            Damage or Loss of Accessories

                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            Client agrees to exercise all due care in caring for and preserving the property of Vendor. Clients shall remain responsible for all loss or damage to rentals, up to and including actual replacement value for each missing or damaged item per cost.

                        </p>

                        <h2 class="text-h6 mb-2">
                            Payment Schedule and Method
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            For your convenience, payments can be made online via HoneyBook.com using a valid credit card. Otherwise, payment is to be made by cash or check. 
                            50% initial retainer due upon completion of the signed agreement for services. Remaining balance is due one week before the event date,   .
                        </p>

                        <h2 class="text-h6 mb-2">
                            Attorney
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            If legal action is necessary to enforce the terms of this contract the prevailing party shall be entitled to reasonable attorney fees in addition to any other remedies to which that party might be legally entitled.

                        </p>

                        <h2 class="text-h6 mb-2">
                            Appropriate Conduct/ Safe Working Environment: 
                        </h2>
                        <p class="text-body-1 text-13 font-weight-regular mb-5">
                            The Client(s) expressly agree(s) to take best efforts to provide Vendor and Vendor staff with safe and appropriate working conditions. In the event of circumstances deemed by either Vendor or a bystander to present a threat or implied threat of injury or harm to Vendor staff or equipment, the Vendor reserves the right to cancel all services remaining under this Agreement and leave the event. At the Vendor’s discretion, the Vendor may enact a three-strike policy. After the first offense, the Vendor will make reasonable efforts to notify the Client(s) or a responsible party. If the Client(s) is/are able to respond to the threatening situation in a reasonable amount of time (maximum of 15 minutes), Vendor shall resume work in accordance with the original terms of this Agreement. If the threatening behavior occurs for a second time, the Client(s) will agree to remove the offending person for the remainder of the event. If the behavior occurs a third time, the Vendor will immediately leave the event. If the Vendor leaves the event early due to any offending behavior, the Client(s) expressly agree to relieve and hold Vendor harmless as a result of incomplete event coverage, or for a lapse in the quality of the Vendor’s work, and the Client(s) shall be responsible for payment in full.

                        </p>
                        <p  class="text-body-1 text-13 font-weight-regular mb-5">
                            The undersigned have read this contract, understand its terms, and agree to be bound thereby. Any additions, deletions, or revisions must be made in writing and approved by all responsible parties. The parties agree that this contract is the complete and exclusive statement of the mutual understanding of the parties.
                        </p>

                    </div>
                    <v-row>
                        <v-col cols="6">
                            <div>
                                <div class="text-h6  mb-4 mt-5">Vendor sign down below:</div>
                                <vueSignature ref="vendorSignature" :sigOption="option" :w="'500px'" :h="'200px'"
                                    :disabled="disabled" :defaultUrl="dataUrl" class="border rounded overflow-hidden">
                                </vueSignature>
                                <div class="mt-3">
                                    <v-btn color="secondary" variant="flat" @click="saveSignature('vendor')"
                                        size="small" class="rounded-sm me-2">Save</v-btn>
                                    <v-btn color="primary" variant="flat" @click="clearSignature('vendor')" size="small"
                                        class="rounded-sm">Clear</v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>

                    <div class="mt-4">
                        <v-btn color="success" variant="flat" @click="sign_done()" class="rounded-sm">
                            Submit
                        </v-btn>
                    </div>
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