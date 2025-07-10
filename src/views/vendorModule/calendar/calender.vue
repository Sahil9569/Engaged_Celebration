<template>
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
  <!-- <h4 class="ma-2">Please select your un-available dates and hours down below:</h4> -->
  <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>


  <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">

    <v-card-item class="pa-sm-6 pa-3">
      <v-card-title class="text-sm-h4 text-h6 text- ps-0 mb-5">Please Select Unavailability</v-card-title>
      <v-row>
        <v-col cols="12" md="9" lg="6">
          <v-card elevation="10">
            <v-card-item class="position-relative pa-sm-6 pa-3">
              <div class="d-flex justify-end mb-2 position-relative">
                <div class="floatbtncalender">
                    <v-btn color="primary" variant="outlined" class=" rounded-sm  me-1" size="small"  @click="pushthat()">
                      <ArrowLeftIcon size="15" />
                    </v-btn>
                  <v-btn color="primary" variant="outlined" class=" rounded-sm " size="small"  @click="pushthat(false)">
                    <ArrowRightIcon size="15" />
                  </v-btn>
                </div>
              </div>
              <FullCalendar ref="fullCalendar" class="calendarMainEvent" :events="events" :options="calendarOptions">
                <!-- <template v-slot:eventContent='arg'>
                  {{ arg.event.title }} 
                </template> -->
              </FullCalendar>
            </v-card-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" lg="6">
          <v-row class="mx-n2 mb-2">
            <v-col cols="6" class="px-2" v-if="selectedTimeSlotsByDate.size">
              <v-btn color="primary" variant="flat" class="d-block  rounded-sm w-100" size="small"  @click="update_schedule(true)" >Update</v-btn>
            </v-col>
            <v-col :cols="!selectedTimeSlotsByDate.size ? '12' : '6'" class="px-2" v-if="selectedDate">
              <v-btn color="primary" variant="flat" class="d-block  rounded-sm w-100" size="small"  @click="selectallhours()">Full day</v-btn>
              
            </v-col>
          </v-row>
          <v-card elevation="10">
            <v-card-item class="pa-3">
              <v-row class="my-3 mx-n1">
                <v-col cols="6" sm="4" lg="3" class="py-0 px-1" v-for="(timeItem, index) in currentDateTimeSlots" :key="index">
                  <span class="d-block w-100">
                    <input
                      :id="'checkLabel' + index"
                      type="checkbox"
                      :name="'timeSlot' + index"
                      :value="timeItem"
                      v-model="selectedTimeSlots"
                      @change="updateEvent(timeItem)"
                      style="display: none;opacity:0;"
                    />
                    <label
                      :for="'checkLabel' + index"
                      class="text-center d-block cursor-pointer mb-2 pa-2 font-weight-semibold text-subtitle-2 rounded-sm w-100"
                      :class="selectedTimeSlots.includes(timeItem) ? 'bg-dark text-white' : 'border text-dark'"
                      style="border: 1px solid #171718 !important"
                    >
                      {{ timeItem.timeSlot }}
                    </label>
                  </span>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>



</template>
<style>
   .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
      display: none;
  }
  .calendarMainEvent.fc .fc-daygrid-day-top {
    justify-content: center;
  }
  .fc .fc-daygrid-day.fc-day-today {
    background-color: rgb(255 222 159);
}
  th.fc-col-header-cell {
    padding: 10px;
    font-size: 13px;
  }
  .fc-daygrid-day-frame.fc-scrollgrid-sync-inner {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 12px;
  }
  .fc-view-harness {
    height: 390px !important;
  }
  .calendarMainEvent.fc .fc-daygrid-day-top a {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 500; 
}
  .calendarMainEvent.fc .fc-button-group > .fc-button-primary {
    background-color: transparent;
    border-color: #fff;
    color: #000;
  }
  .calendarMainEvent.fc .fc-toolbar.fc-header-toolbar {
    margin-bottom: 0.3em;
  }
  .calendarMainEvent.fc button.fc-today-button.fc-button-primary {
    font-size: 11px;
    text-transform: capitalize;
  }
  .calendarMainEvent.fc .fc-toolbar-title {
    font-size: 15px;
  }
  .fc .fc-button-primary:focus{
    box-shadow: none !important;
  }
  td.fc-day.finishSelected a {
    background: #b4801c;
    color: #fff;
    font-size: 12px !important;
  }
  .calendarMainEvent .fc-scrollgrid-sync-table td.fc-day.active {
    background-color: transparent;
  }
  .calendarMainEvent .fc-scrollgrid-sync-table td.fc-day.active a{
    background:rgb(var(--v-theme-success)) !important;
    color: #fff;
    font-size: 12px !important;
  }
  .floatbtncalender {
    position: absolute;
    right: 55px;
    top: 8px;
}
@media screen and (max-width:575px){
  th.fc-col-header-cell{
    font-size: 9px !important; 
  }
  .calendarMainEvent.fc .fc-daygrid-day-top a {
    width: 15px;
    height: 15px;
    font-size: 10px;
  }
  td.fc-day.finishSelected a {
    font-size: 10px !important;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from '@/stores/axios'
const fullpageloader                = ref(false)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);

const events = ref<{ title: string, start: string, id: string }[]>([]);
const timeSlotsByDate = ref<Record<string, { id: string, timeSlot: string }[]>>({});

// Use a Map to store selected time slots for each date
const selectedTimeSlotsByDate = ref<Map<string, { id: string, timeSlot: string }[]>>(new Map());
const selectedTimeSlots = ref<{ id: string, timeSlot: string }[]>([]);
const selectedDate = ref<string | null>(null);

const generateTimeSlots = (date: string) => {
  const slots = [];
  const hours = 24;
  for (let i = 0; i < hours; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';
    const timeSlot = `${hour.toString().padStart(2, '0')}:00 ${period}`;
    slots.push({ id: `#${date}-${timeSlot}`, timeSlot });
  }
  return slots;
};

const addTimeSlotsForDate = (date: string) => {
  if (!timeSlotsByDate.value[date]) {
    timeSlotsByDate.value[date] = generateTimeSlots(date);
  }
};

function pushthat(bac:any=true){
  if (bac){ document.getElementsByClassName("fc-prev-button")[0].click(); setTimeout(()=>{update_schedule()}, 150); }
  else    { document.getElementsByClassName("fc-next-button")[0].click(); setTimeout(()=>{update_schedule()}, 150); }
}

onMounted(() => {
  // Set the current date as selected date when the component mounts
  const currentDate = new Date().toISOString().split('T')[0];
  selectedDate.value = currentDate;

  // Add dynamic time slots for the current date
  addTimeSlotsForDate(currentDate);
  loadSelectedTimeSlots(currentDate);


  update_schedule();
  const nextButton = document.querySelector('.fc-button-group');
  if (nextButton) {     nextButton.style.display = 'none';    }
  // setTimeout(()=>{    const tiles = document.querySelectorAll(".fc-prev-button");
  // tiles.forEach(tile => tile.addEventListener('click', update_schedule()))}, 5000)
  
});
// onBeforeUnmount(() => {   handleplusminus(false)   });

// function handleplusminus(add:any=true) {
//   console.log('ooooooooooookkkk')
//   const leftChevron = document.querySelector('.fc-icon.fc-icon-chevron-left');
//   const rightChevron = document.querySelector('.fc-icon.fc-icon-chevron-right');
//   if (add){
//     console.log('ooooooooooookkkk')

//     const tiles = document.querySelectorAll(".fc-icon.fc-icon-chevron-left");
//     tiles.forEach(tile => tile.addEventListener('click', update_schedule()))

//     if (leftChevron) { leftChevron.addEventListener('click', update_schedule()); }
//     if (rightChevron) { rightChevron.addEventListener('click', update_schedule()); }
//   console.log('ooooooooooookkkk')

//   } else {
//     if (leftChevron) { leftChevron.removeEventListener('click', update_schedule()); }
//     if (rightChevron) { rightChevron.removeEventListener('click', update_schedule()); }
//   }
// }

const openModal = (arg: any) => {
  selectedDate.value = arg.dateStr;
  // Add dynamic time slots for the selected date
  addTimeSlotsForDate(arg.dateStr);
  loadSelectedTimeSlots(arg.dateStr);
};

const updateEvent = (timeItem: { id: string, timeSlot: string }) => {
  if (!selectedDate.value) return;
  
  let selectedSlots = selectedTimeSlotsByDate.value.get(selectedDate.value) || [];

  const eventIndex = events.value.findIndex(event => event.id === timeItem.id && event.start === selectedDate.value);
  
  if (selectedTimeSlots.value.includes(timeItem)) {
    if (eventIndex === -1) {
      events.value.push({
        id: timeItem.id,
        title: timeItem.timeSlot,
        start: selectedDate.value
      });
    }
  } else {
    if (eventIndex !== -1) {
      events.value.splice(eventIndex, 1);
    }
  }
  
  selectedSlots = events.value
  .filter(event => event.start === selectedDate.value)
  .map(event => timeSlotsByDate.value[selectedDate.value].find(slot => slot.id === event.id))
  .filter(Boolean) as { id: string, timeSlot: string }[];
  
  selectedTimeSlotsByDate.value.set(selectedDate.value, selectedSlots);
  selectedTimeSlots.value = selectedSlots;

  // Toggle the 'finishSelected' class based on condition
  const dateElement = document.querySelector(`[data-date="${selectedDate.value}"]`);
  if (dateElement) {
    if (conditionToAddFinishSelected()) {
      dateElement.classList.add('finishSelected');
    } else {
      dateElement.classList.remove('finishSelected');
    }
  }

};

const loadSelectedTimeSlots = (date: string) => {
  selectedTimeSlots.value = selectedTimeSlotsByDate.value.get(date) || [];
};

// Computed property to get the time slots for the selected date
const currentDateTimeSlots = computed(() => {
  if (selectedDate.value) {
    return timeSlotsByDate.value[selectedDate.value] || [];
  }
  return [];
});

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  weekends: true,
  // headerToolbar: false,
  // dateIncrement:alert('sdfsf'),
  // dayMaxEventRows: 3, 
  dateClick: (arg:any) => {
    console.log("arg_____", arg)
    // Remove the 'active' class from all dates
    document.querySelectorAll('.fc-day').forEach(date => date.classList.remove('active'));

    // Add the 'active' class to the clicked date
    arg.dayEl.classList.add('active');
    const clickedDate = arg.dateStr;
    const dateElement = document.querySelector(`[data-date="${clickedDate}"]`);
    // if (dateElement) {
    //   dateElement.classList.toggle('active');
    // }

    // Open the modal
    openModal(arg);
    // Check condition and toggle 'finishSelected' class
    if (conditionToAddFinishSelected()) {
      dateElement.classList.add('finishSelected');
    } else {
      dateElement.classList.remove('finishSelected');
    }
  },
  // events: events.value
};
function conditionToAddFinishSelected() {
  // Example condition: Check if some specific value is set or condition is met
  // Replace this with your actual condition logic
  return selectedTimeSlots.value.length > 0; // Add 'finishSelected' if there are selected time slots
}
async function update_schedule(update:any=false){
  try{
    console.log("ia ma ruunring")
    fullpageloader.value = true
    const response = await axios.post('home/update_schedule', (update) ? {'data':Object.fromEntries(selectedTimeSlotsByDate.value) } : {})
    if (response.data.status == 'DONE'){
      response.data.data.forEach(function(i:any){
        i.timings.forEach(function(a:any){
          let searchquery = `td[data-date="${i.ondate}"]`
          const dateElement:any = document.querySelector(searchquery);
          if (dateElement){
            dateElement.classList.add('finishSelected');
          }
          openModal({'dateStr':i.ondate})
          var a:any = ref({'id' : `#${i.ondate}-${a}`, 'timeSlot' : a}).value
          selectedTimeSlots.value.push( a )
          updateEvent( a )
          // const dateElement:any = document.querySelector(`[data-date="${i.ondate}"]`);
          // dateElement.classList.add('finishSelected');
        })
      })
      
      openModal({'dateStr':new Date().toISOString().split('T')[0]})
      if (response.data.action == 'UPDATED'){
        showSuccessMessage.value = true
        myerrors.value = 'Updated successfully.';
        setTimeout(() => {  showSuccessMessage.value = false;  }, 3000);
      }
    }
  } catch (error) { console.error('Error__________________________', error); }
  finally{ fullpageloader.value = false;}
}

function selectallhours(){
  let ondate:any = selectedDate.value 
  const alltimes = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '05:00 PM', '11:00 AM', '01:00 PM', '03:00 PM', '06:00 AM', '09:00 AM', '07:00 AM', '10:00 AM', '08:00 AM', '04:00 PM', '02:00 PM', '12:00 PM']
  openModal({'dateStr':ondate})
  let mylen = selectedTimeSlots.value.length < 24
  alltimes.forEach(function(a:any){
    var a:any = ref({'id' : `#${ondate}-${a}`, 'timeSlot' : a}).value
    if (mylen)  { selectedTimeSlots.value.push( a ) }
    else        { selectedTimeSlots.value = selectedTimeSlots.value.filter((i:any)=> !((a==i))) }
    updateEvent( a )
  })
    // const timebtn:any= document.querySelector(`a[aria-label="${new Date(selectedDate.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}"]`)
    // timebtn.click();
    // setTimeout(() => {document.querySelectorAll('.timeme').forEach(element => {element.click()})}, 100)
}

function selectfullmonth(){
  let ondate:any = selectedDate.value 
  const alltimes = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '05:00 PM', '11:00 AM', '01:00 PM', '03:00 PM', '06:00 AM', '09:00 AM', '07:00 AM', '10:00 AM', '08:00 AM', '04:00 PM', '02:00 PM', '12:00 PM']
  openModal({'dateStr':ondate})
  let mylen = selectedTimeSlots.value.length < 24
  alltimes.forEach(function(a:any){
    var a:any = ref({'id' : `#${ondate}-${a}`, 'timeSlot' : a}).value
    if (mylen)  { selectedTimeSlots.value.push( a ) }
    else        { selectedTimeSlots.value = selectedTimeSlots.value.filter((i:any)=> !((a==i))) }
    updateEvent( a )
  })
}
</script>
