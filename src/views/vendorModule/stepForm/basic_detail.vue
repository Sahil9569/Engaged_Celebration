<script setup lang="ts">
import { ref, defineProps, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }


const aboutValue = ref('')
const props = defineProps<{
  data: { type: Object }
}>();

const currentStepIndex = computed(() => props.data.currentStepIndex);
const multipleItems = ref([]);
const multipleValues = ref([]);

const sinceModal = ref('Select Year')
const numberModal = ref('')
const destiModel = ref()
const URLModel = ref('')
const sinceItems = ref([]);


onMounted(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1950; // Adjust this as needed
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);
  sinceItems.value = years;
  console.log(sinceItems, "sinceItems")
});


const stepnumver = ref('FirstNextStep')
async function vendor_first_step(emitNext: () => void) {
  var formdata = new FormData();
  formdata.append("FirstNextStep", stepnumver.value,)
  formdata.append("business_introduction", aboutValue.value)
  formdata.append("working_since", sinceModal.value)
  formdata.append("wedding_covered_no", numberModal.value)
  formdata.append("weddings_Cities", multipleValues.value);
  formdata.append("destination_wedding", destiModel.value)
  formdata.append("online_presence", URLModel.value)

  if (!aboutValue.value) {
    alert('About My Business(Introduction) is required');
  }
  else {
    var response = await axios.post(`/home/create_vendor`, formdata, config);
    console.log("Responce data >>>>", response.data)
    if (response.data.status == "SAVED") {
      localStorage.setItem('BasicProfileSteps', stepnumver.value);
      emitNext();
    }
  }

}

async function basic_detailfirst() {
  try {
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
    const response = await axios.post(`/home/vendor_onboard_data`, {}, config);
    
    if (response.data.v_profile_data) {
      aboutValue.value = response.data.v_profile_data.business_introduction
      sinceModal.value = response.data.v_profile_data.working_since
      numberModal.value = response.data.v_profile_data.wedding_covered_no
      destiModel.value = response.data.v_profile_data.destination_wedding
      URLModel.value = response.data.v_profile_data.online_presence
    }

    // if (response.data.v_serialized_all_cities) {
    //   const cityNames = response.data.v_serialized_all_cities.map(city => city.name);
    //   multipleItems.value = cityNames;
    // }

    if (response.data.v_serialized_wed_cities) {
      const cityNames = response.data.v_serialized_wed_cities.map(city => city.name);
      multipleValues.value = cityNames;
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

basic_detailfirst();
</script>


<template>
  <div>
    <h2 class="text-center text-secondary py-3 text-h2">Basic Detail</h2>
    <div class="mb-3">
      <v-label class="text-subtitle-1 font-weight-medium pb-2">About My Business(Introduction)</v-label>
      <v-textarea outlined name="Note" placeholder="Enter Your Bio" v-model="aboutValue" hide-details></v-textarea>
    </div>
    <div class="mb-3">
      <v-label class="text-subtitle-1 font-weight-medium pb-2">Working Since (Year)</v-label>
      <v-autocomplete v-model="sinceModal" :items="sinceItems" density="comfortable" color="primary" variant="outlined"
        hide-details></v-autocomplete>
    </div>
    <div class="mb-3">
      <v-label class="text-subtitle-1 font-weight-medium pb-2">No. of wedding covered</v-label>
      <VTextField v-model="numberModal" type="number" hide-details="auto" class="mb-3" required
        placeholder="Enter No. of wedding covered"></VTextField>
    </div>
    <div class="mb-3">
      <v-label class="text-subtitle-1 font-weight-medium pb-2">Cities you've planned weddings in</v-label>
      <v-autocomplete v-model="multipleValues" :items="multipleItems" item-value="value" item-text="name"
        variant="outlined" color="primary" multiple hide-details >

        <template v-slot:chip>
          <v-chip label color="secondary" size="large" class="mb-1 text-subtitle-1 font-weight-regular"></v-chip>
        </template>
      </v-autocomplete>

    </div>

    <div class="mb-3">
      <v-label class="text-subtitle-1 font-weight-medium pb-2">Destination Wedding</v-label>
      <VTextField v-model="destiModel" hide-details="auto" class="mb-3" required
        placeholder="Enter Destination Wedding">
      </VTextField>
    </div>
    <div class="py-4">
      <hr />
    </div>
    <div class="">
      <h4 class="text-h4 pb-2">My Online Presence</h4>
      <p class="text-subtitle-1 line-height-1-5 mb-3">The more online profiles you link, the stronger and more
        trustworthy
        your WeddingPlanner profile becomes</p>
      <VTextField v-model="URLModel" hide-details="auto" class="mb-3" required placeholder="My Website URL">
      </VTextField>
    </div>
    <!-- Your step content here -->
    <div class="text-right mt-3">
      <!-- <v-btn color="secondary" class="px-6" size="large" @click="$emit('next')">Next</v-btn>  -->
      <v-btn color="secondary" class="px-6" size="large" @click="vendor_first_step(() => $emit('next'))">Next</v-btn>
      
    </div>
  </div>
</template>