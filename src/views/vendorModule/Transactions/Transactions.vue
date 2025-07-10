<script setup lang="ts">
import { ref } from 'vue';

const bookingData = ref([]);
const recentTransaction = ref([]);


</script>
<template>


    <v-row>
        <v-col cols="12" md="7">
            <v-card elevation="10" class="h-100">
                <v-card-item>
                    <div class="d-sm-flex align-center justify-space-between">
                        <div>
                            <v-card-title class="text-h5 text-secondary">Transactions</v-card-title>
                        </div>
                        <div>
                            <v-btn flat size="small" color="secondary" to="/all-bookings">View All</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table mt-6 text-nowrap">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Sno</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Transaction ID</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Name</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Date</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Amount</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">View Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in bookingData" :key="item.transactionid" :class="item.activestate" class="month-item">
                                    <td><h4 class="text-subtitle-1 text-no-wrap font-weight-semibold">{{index+1}}</h4></td>
                                    <td><h4 class="text-subtitle-1 text-no-wrap font-weight-semibold"> {{item.transactionid }}</h4>
                                    </td>
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            {{ item.customername }}
                                        </h5>
                                    </td>
                                    <td>
                                        <div rounded="md" class="text-body-1" size="small" label>{{ item.eventdate
                                            }}</div>
                                    </td>
                                    <td>
                                        <div rounded="md" class="text-body-1" size="small" label>{{ item.money
                                            }}</div>
                                    </td>
                                    <!-- <td>
                                        <v-chip rounded="md" class=" font-weight-semibold" :color="item.statuscolor"
                                            size="small" label>{{ item.statustext }}</v-chip>
                                    </td> -->
                                    <td>
                                        <h5 class="text-no-wrap text-body-1">
                                            <v-tooltip text="View Booking">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn icon flat v-bind="props" to="/booking-single">
                                                        <EyeIcon stroke-width="2" size="20" class="text-secondary" />
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
        <v-col cols="12" md="5">
            <v-card elevation="10" class="h-100">
                <v-card-item class="">
                    <div class="d-sm-flex align-center justify-space-between">
                        <div>
                            <v-card-title class="text-h5 text-secondary">Recent Transaction</v-card-title>
                        </div>
                        <div>
                            <v-btn flat size="small" color="secondary" to="/transactions">View All</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table mt-6">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold">Customer</th>
                                    <th class="text-subtitle-1 textPrimary font-weight-semibold text-end">Payments</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in recentTransaction" :key="item.vendorname" :class="item.activestate"
                                    class="month-item">
                                    <td>
                                        <div class="d-flex align-top">
                                            <v-avatar size="40" color="primary" variant="flat" rounded="sm">
                                                <img :src="item.img" :alt="item.img" width="40" />
                                            </v-avatar>
                                            <div class="mx-3">
                                                <h4
                                                    class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary">
                                                    {{ item.vendorname }}</h4>

                                                <p class="text-subtitle-2 text-no-wrap textSecondary mt-1">
                                                    <span class="text-subtitle-2 text-no-wrap font-weight-semibold">Date
                                                        :</span> {{ item.time }}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h4 class="text-body-1 text-success font-weight-bold text-end">{{ item.money }}
                                        </h4>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style type="text/css">

</style>
