<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from '@/stores/axios'
import BASE_URL from '@/stores/myVar';




const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);







const total_earning = ref(0)
const total_books = ref(0)
const cmonth = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',][new Date().getMonth()])
const pdates = ref([[...Array(1).keys()].map((x: any) => (x))])
const edates = ref([[...Array(1).keys()].map((x: any) => (x))])




async function get_reports(filter: any = null) {
    const fd = new FormData()
    if (filter) {
        fd.append('ftype', filter)
        fd.append('selyear', bookvalue.value)              // for bookings

        fd.append('selectedItem', selectedItem.value)           // for revenue
        fd.append('selectedMonthfrom', selectedMonthfrom.value)      // for revenue
        fd.append('selectedMonthto', selectedMonthto.value)        // for revenue
        fd.append('selectednormalMonth', selectednormalMonth.value)    // for revenue
        fd.append('selectedYear', selectedYear.value)           // for revenue

        fd.append('iselectedItem', iselectedItem.value)          // for payments
        fd.append('iselectedMonthfrom', iselectedMonthfrom.value)     // for payments
        fd.append('iselectedMonthto', iselectedMonthto.value)       // for payments
        fd.append('iselectednormalMonth', iselectednormalMonth.value)   // for payments
        fd.append('iselectedYear', iselectedYear.value)          // for payments
        bookingfilter.value = false
        filterrevenue.value = false
        filterpayments.value = false
    }

    const response = await axios.post('home/get_reports', fd)
    console.log("response____________", response)
    if (response.data.status == 'SENT') {
        Chart.value         = { series: [{ name: 'Bookings',data:response.data.monthly_bookings.map((a: any) => (a)) }] }
        gredientChart.value = { series: [{ name: 'Payment', data: response.data.pay_lising.map((a: any) => (a)) }] }
        areaChart.value     = { series: [{ name: 'Earning', data: response.data.earn_listing.map((a: any) => (a)) }] }
        pdates.value        = response.data.pdates
        edates.value        = response.data.edates
        total_earning.value = response.data.earn_listing.reduce((sum: any, i: any) => (sum + i))
        total_books.value   = response.data.monthly_bookings.reduce((sum: any, i: any) => (sum + i))
        bselyear.value      = response.data.bselyear
    fullpageloader.value=false;

    }
    else{
        fullpageloader.value=false;
    }
}


onMounted(() => {
    get_reports();
});
/*Chart*/
const chartOptions = computed(() => {
    return {
        chart: { height: 275, type: 'bar', fontFamily: `inherit`, foreColor: '#000', toolbar: { show: true } },
        colors: ['#e8d4ab', '#e8d4ab', '#e8d4ab', '#e8d4ab', '#e8d4ab', '#b4801c', '#e8d4ab', '#e8d4ab', '#e8d4ab', '#b4801c', '#e8d4ab', '#b4801c'],
        plotOptions: { bar: { columnWidth: '30%', distributed: true, borderRadius: 3, } },
        dataLabels: { enabled: false },
        legend: { show: false },
        grid: { yaxis: { lines: { show: false } } },
        xaxis: { categories: [['Jan'], ['Feb'], ['Mar'], ['Apr'], ['May'], ['June'], ['July'], ['Aug'], ['Sept'], ['Oct'], ['Nov'], ['Dec']], axisBorder: { show: false } },
        yaxis: { labels: { show: false } },
        tooltip: { theme: 'dark', x: { format: 'dd/MM/yy HH:mm' } }
    };
});
//data for no. of bookings per month
// const Chart             = ref({series: [{name: 'Bookings',data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]});
const Chart = ref({ series: [{ name: 'Bookings', data: [20, 15, 30, 25, 10, 100, 30, 70, 40, 90, 20, 80] }] });

const chartOptionsnew = computed(() => { // for payments
    return {
        chart: { type: 'line', height: 350, fontFamily: `inherit`, foreColor: '#000', toolbar: { show: true }, zoom: { enabled: true }, dropShadow: { enabled: false, color: 'rgba(0,0,0,0.2)', top: 12, left: 4, blur: 3, opacity: 0.4 } },
        stroke: { width: 7, curve: 'smooth' },
        fill: { type: 'gradient', gradient: { shade: 'dark', gradientToColors: ['#26c6da'], shadeInisity: 1, type: 'horizontal', opacityFrom: 1, opacityTo: 0.9, stops: [0, 100, 100, 100] } },
        markers: { size: 4, opacity: 0.9, colors: ['#0b70fb'], strokeColor: '#fff', strokeWidth: 2, hover: { size: 7 } },


        // data for dates for payements under 10 days to be dynamic (ongoing dates)
        xaxis: { type: 'datetime', categories: pdates.value },
        yaxis: { min: 0, max: 40 }, grid: { show: false }, tooltip: { theme: 'light' }
    };
});

// data for payements under 10 days as per above
const gredientChart = ref({ series: [{ name: 'Payment', data: [...Array(1000).keys()].map((x: any) => (x)) }] });

const chartOptionssss = computed(() => { // for revenue
    return {
        chart: { type: 'area', height: 300, fontFamily: `inherit`, foreColor: '#000', zoom: { enabled: true }, toolbar: { show: true } },
        colors: ['#52bf11'],
        dataLabels: { enabled: false },
        stroke: { width: '3', curve: 'smooth' },
        yaxis: { opposite: false, labels: { show: true } },
        legend: { show: true, position: 'bottom', width: '50px' },
        grid: { show: false },
        tooltip: { theme: 'dark', y: { formatter(val: any) { return `$ ${val}`; }, }, },

        xaxis: { type: 'datetime', categories: edates.value },
    };
});
// data for earnings under 10 days as per above
const areaChart = ref({ series: [{ name: 'Earning', data: [...Array(1000).keys()].map((x: any) => (x)) }] });
const bookingfilter = ref(false);
const filterrevenue = ref(false);
const filterpayments = ref(false);
const bookvalue = ref('2024');
const bselyear = ref('2024');

const selectedItem = ref('Year');
const selectedYear = ref('2024');
const selectedMonthfrom = ref('Jan');
const selectedMonthto = ref('Mar');
const selectednormalMonth = ref('Jan');

const iselectedItem = ref('Year');
const iselectedYear = ref('2024');
const iselectedMonthfrom = ref('Jan');
const iselectedMonthto = ref('Mar');
const iselectednormalMonth = ref('Jan');

const selectedItemchart = ref('');

const selectedItemchartoption = ref(['Bookings', 'Revenue', 'Payments', 'All',])

const selectedItemoption = ref(['Month', 'Quartly', 'Year',])
const bookitems = ref(['2020', '2021', '2022', '2023', '2024']);
const selectedYearItem = ref(['2020', '2021', '2022', '2023', '2024']);
const selectedMonthItem = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',]);
const selectedMonthtoItem = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',]);
const selectednormalMonthItem = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',]);
</script>
<template>
     <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage" style="top: 30px">
        <v-alert type="success" v-show="showSuccessMessage" density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
            </template>
        </v-alert>
        <v-alert type="error" v-show="showErrorMessage"
         density="" class="mb-4">
            <div>{{ myerrors }}</div>
            <template v-slot:prepend>
                <v-icon class="text-24">mdi-alert-circle-outline</v-icon>
            </template>
        </v-alert>
    </div>
    <v-card elevation="10" class="bg-grey100">
        <v-card-item class="pa-sm-6 pa-3">
            <v-row class="justify-content-between pt-3">
                <v-col cols="12" md="12"> <v-card-title class="text-h4 ">All Reports</v-card-title></v-col>
            </v-row>
            <!-- <v-card elevation="0" class="border bg-lightCustom my-4">
                <v-card-item class="py-6 py-md-4">
                    <v-row>

                        <v-col cols="12" md="3">
                            <div class="my-md-4 pt-md-3 mb-md-8">
                                <v-select v-model="selectedItemchart" :items="selectedItemchartoption"
                                    label="Select Chart" hide-details></v-select>
                            </div>
                        </v-col>
                        <v-col cols="12" md="3">
                            <div class="my-md-4 pt-md-3 mb-md-8">
                                <v-select v-model="selectedItem" :items="selectedItemoption"
                                    label="Select Filter Option" hide-details></v-select>
                            </div>
                        </v-col>
                        <v-col cols="12" md="4" class="my-auto">
                            <div v-if="selectedItem === 'Quartly'">
                                <v-row>
                                    <v-col cols="6">
                                        <v-select v-model="selectedMonthfrom" :items="selectedMonthItem" label="From"
                                            hide-details></v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select v-model="selectedMonthto" :items="selectedMonthtoItem" label="To"
                                            hide-details></v-select>
                                    </v-col>
                                </v-row>
                            </div>

                            <div v-else-if="selectedItem === 'Month'">
                                <v-select v-model="selectednormalMonth" :items="selectednormalMonthItem"
                                    label="Select month" hide-details></v-select>
                            </div>

                            <div v-else>
                                <v-select v-model="selectedYear" :items="selectedYearItem" label="Select Year"
                                    hide-details></v-select>
                            </div>

                        </v-col>
                        <v-col cols="12 my-auto" md="2">
                            <v-btn color="secondary" flat class="rounded-sm bg-secondary w-100 py-3 d-flex align-center"
                                size="medium"> Filter </v-btn>
                        </v-col>


                    </v-row>
                </v-card-item>
            </v-card> -->
            <v-row>
                <v-col cols="12" lg="6">
                    <v-card elevation="10">
                        <v-card-item class="pt-4 ">
                            <v-row class="pt-3">
                                <v-col cols="8">
                                    <v-card-title class="text-h6">Bookings</v-card-title>
                                    <v-card-subtitle class="text-subtitle-2 textSecondary">Booking Monthly
                                        Reports</v-card-subtitle>
                                </v-col>
                                <v-col cols="4" class="text-end">
                                    <v-menu v-model="bookingfilter" :close-on-content-click="false" anchor="top">
                                        <template v-slot:activator="{ props }">
                                            <v-btn color="secondary" v-bind="props" flat size="small"
                                                class="rounded-sm"> Filter </v-btn>
                                        </template>

                                        <v-card min-width="300">

                                            <v-list>
                                                <v-list-item>
                                                    <div class="my-4 pt-3">
                                                        <v-autocomplete v-model="bookvalue" :items="bookitems"
                                                            density="compact" label="Select Year" color="primary"
                                                            variant="outlined" hide-details></v-autocomplete>
                                                    </div>
                                                </v-list-item>
                                            </v-list>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>

                                                <v-btn text @click="bookingfilter = false" flat
                                                    class="rounded-sm bg-error" size="small"> Close </v-btn>
                                                <v-btn color="success" text @click="get_reports('bfilter')" flat
                                                    class="rounded-sm bg-success" size="small">
                                                    Filter </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-menu>
                                </v-col>
                            </v-row>
                            <div class="border-bottom">
                                <apexchart type="bar" height="270" :options="chartOptions" :series="Chart.series">
                                </apexchart>
                            </div>
                            <v-row>
                                <v-col cols="6" sm="6" class="d-flex">
                                    <div class="d-flex align-center mt-md-6 mt-3">
                                        <v-avatar class="rounded-md bg-grey200 ">
                                            <CalendarStatsIcon size="22" stroke-width="1.4" />
                                        </v-avatar>
                                        <div class="pl-4">
                                            <h6 class="text-subtitle-1 textSecondary mb-1">Year</h6>
                                            <h3 class="text-h6">{{ bselyear }}</h3>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="6" sm="6" class="d-flex justify-lg-start justify-end">
                                    <div class="d-flex align-center mt-md-6 mt-3">
                                        <v-avatar class="rounded-md bg-grey200 ">
                                            <CalendarIcon size="22" stroke-width="1.4" />
                                        </v-avatar>
                                        <div class="pl-4">
                                            <h6 class="text-subtitle-1 textSecondary mb-1">Totol Booking</h6>
                                            <h3 class="text-h6">{{ total_books }}</h3>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-item>
                    </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-card elevation="10">
                        <v-card-item class="pt-4">
                            <v-row class="pt-3">
                                <v-col cols="8">
                                    <v-card-title class="text-h6">Revenue </v-card-title>
                                    <v-card-subtitle class="text-subtitle-2 textSecondary">Revenue Monthly
                                        Reports</v-card-subtitle>
                                </v-col>
                                <v-col cols="4" class="text-end">
                                    <v-menu v-model="filterrevenue" :close-on-content-click="false" anchor="top">
                                        <template v-slot:activator="{ props }">
                                            <v-btn color="secondary" v-bind="props" flat size="small"
                                                class="rounded-sm"> Filter </v-btn>
                                        </template>

                                        <v-card min-width="300">

                                            <v-list>
                                                <v-list-item>
                                                    <div class="my-4 pt-3 mb-8">
                                                        <v-select v-model="selectedItem" :items="selectedItemoption"
                                                            label="Select Filter Option" hide-details></v-select>
                                                    </div>
                                                    <div v-if="selectedItem === 'Quartly'">
                                                        <v-row>
                                                            <v-col cols="6">
                                                                <v-select v-model="selectedMonthfrom"
                                                                    :items="selectedMonthItem" label="From"
                                                                    hide-details></v-select>
                                                            </v-col>
                                                            <v-col cols="6">
                                                                <v-select v-model="selectedMonthto"
                                                                    :items="selectedMonthtoItem" label="To"
                                                                    hide-details></v-select>
                                                            </v-col>
                                                        </v-row>
                                                    </div>

                                                    <div v-else-if="selectedItem === 'Month'">
                                                        <v-select v-model="selectednormalMonth"
                                                            :items="selectednormalMonthItem" label="Select month"
                                                            hide-details></v-select>
                                                    </div>

                                                    <div v-else>
                                                        <v-select v-model="selectedYear" :items="selectedYearItem"
                                                            label="Select Year" hide-details></v-select>
                                                    </div>
                                                </v-list-item>
                                            </v-list>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>

                                                <v-btn text @click="filterrevenue = false" flat
                                                    class="rounded-sm bg-error" size="small"> Close </v-btn>
                                                <v-btn color="success" text @click="get_reports('rfilter')" flat
                                                    class="rounded-sm bg-success" size="small"> Filter </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-menu>
                                </v-col>
                            </v-row>
                            <div class="border-bottom   ">
                                <apexchart type="area" height="257" :options="chartOptionssss"
                                    :series="areaChart.series"> </apexchart>
                            </div>
                            <v-row>
                                <v-col cols="6" sm="6" class="d-flex">
                                    <div class="mt-3">
                                        <h3 class="text-h3">${{ total_earning }}</h3>
                                        <div class="mt-2 d-flex gap-2 align-center">
                                            <v-avatar class="bg-lightsuccess text-success" size="25">
                                                <ArrowUpLeftIcon size="20" />
                                            </v-avatar>
                                            <!-- <span class="text-subtitle-1  font-weight-bold">+9%</span> -->
                                            <!-- <span class="text-subtitle-1 textSecondary ">{{cmonth}} Month</span> -->
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>

                        </v-card-item>
                    </v-card>
                </v-col>
                <v-col cols="12" lg="12">
                    <v-card elevation="10">
                        <v-card-item class="pt-4">
                            <v-row class="pt-3">
                                <v-col cols="8">
                                    <v-card-title class="text-h6">Payments</v-card-title>
                                    <v-card-subtitle class="text-subtitle-2 textSecondary">Payments Monthly
                                        Reports</v-card-subtitle>
                                </v-col>
                                <v-col cols="4" class="text-end">
                                    <v-menu v-model="filterpayments" :close-on-content-click="false" anchor="top">
                                        <template v-slot:activator="{ props }">
                                            <v-btn color="secondary" v-bind="props" flat size="small"
                                                class="rounded-sm"> Filter </v-btn>
                                        </template>
                                        <v-card min-width="300">
                                            <v-list>
                                                <v-list-item>
                                                    <div class="my-4 pt-3 mb-8">
                                                        <v-select v-model="iselectedItem" :items="selectedItemoption"
                                                            label="Select Filter Option" hide-details></v-select>
                                                    </div>
                                                    <div v-if="iselectedItem === 'Quartly'">
                                                        <v-row>
                                                            <v-col cols="6">
                                                                <v-select v-model="iselectedMonthfrom"
                                                                    :items="selectedMonthItem" label="From"
                                                                    hide-details></v-select>
                                                            </v-col>
                                                            <v-col cols="6">
                                                                <v-select v-model="iselectedMonthto"
                                                                    :items="selectedMonthtoItem" label="To"
                                                                    hide-details></v-select>
                                                            </v-col>
                                                        </v-row>
                                                    </div>

                                                    <div v-else-if="iselectedItem === 'Month'">
                                                        <v-select v-model="iselectednormalMonth"
                                                            :items="selectednormalMonthItem" label="Select month"
                                                            hide-details></v-select>
                                                    </div>

                                                    <div v-else>
                                                        <v-select v-model="iselectedYear" :items="selectedYearItem"
                                                            label="Select Year" hide-details></v-select>
                                                    </div>
                                                </v-list-item>
                                            </v-list>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>

                                                <v-btn text @click="filterpayments = false" flat
                                                    class="rounded-sm bg-error" size="small"> Close </v-btn>
                                                <v-btn color="success" text @click="get_reports('pfilter')" flat
                                                    class="rounded-sm bg-success" size="small"> Filter </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-menu>
                                </v-col>
                            </v-row>
                            <apexchart type="line" height="350" :options="chartOptionsnew"
                                :series="gredientChart.series"></apexchart>
                        </v-card-item>
                    </v-card>
                </v-col>

            </v-row>
        </v-card-item>
    </v-card>

</template>
<style>
.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #002642;
    font-size: 12px;
    font-weight: 500;
}

.v-slide-group-item--active {
    background: #fff !important;
    box-shadow: 0px 0px 10px rgb(0 0 0 / 1%);
    border-radius: 5px;
}

.bg-lightCustom {
    background: #f2e8d2;
}
</style>