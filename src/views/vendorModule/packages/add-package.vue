<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }


import imagePath from '@/assets/images/vendor/servicedummy.png'
import folderName from '@/assets/images/wedding/No_Image_Available.jpg'
import dummyLogo from '@/assets/images/wedding/no-image-available.png'

import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import 'v-calendar/dist/style.css';

const editor = useEditor({
    editorProps: {
        attributes: {
            class: 'custom-tiptap-style',
        }
    },
    extensions: [StarterKit],
    content: ``
});

const editor2 = useEditor({
    editorProps: {
    attributes: {
      class: 'custom-tiptap-style1',
    }
    },
    extensions: [StarterKit],
    content: ``
});







interface ImageFile { url: string; file: File; }
const showSuccessMessage    = ref(false)
const fullpageloader        = ref(false)
const showErrorMessage      = ref(false)
const myerrors              = ref('')
const category              = ref();
const categoryitem          = ref([])

import albumone from '@/assets/images/website/decoration6.jpeg'
import albumtwo from '@/assets/images/website/decoration7.jpg'
import { isTypedArray } from 'lodash';
const prealbums = ref([
    {
        albumname: "Mohali Images",
        albumimages: "20",
        albumImage: albumone,
    },
    {
        albumname: "Delhi Images",
        albumimages: "10",
        albumImage: albumtwo,
    },
]);
const items2 = ref([
    'Customized music',
    'Lighting packages',
    'Backup equipment',
]);
const multi_value = ref(['Customized music', 'Lighting packages']);
const productImages = ref<ImageFile[]>([]);
const productVideos = ref<ImageFile[]>([]);
const uploadImage = (e: Event, type: string) => {
    const selectedFiles = (e.target as HTMLInputElement).files;
    if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
            const reader = new FileReader();
            reader.onload = () => {
                if (type == 'image') {
                    productImages.value.push({ url: reader.result as string, file: selectedFiles[i] });
                }
                else {
                    productVideos.value.push({ url: reader.result as string, file: selectedFiles[i] });
                }
            };
            reader.readAsDataURL(selectedFiles[i]);
        }
    }
};

const removeImage = (index: number, type: string) => {type == 'image' ? productImages.value.splice(index, 1) : productVideos.value.splice(index, 1);};

watch(productImages, () => {
    for (let i = 0; i < productImages.value.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
            const imgRef = `image${i}`;
            const imgElement = document.querySelector(`[ref="${imgRef}"]`) as HTMLImageElement;
            if (imgElement) imgElement.src = reader.result as string;
        };
        reader.readAsDataURL(productImages.value[i].file);
    }
});

const bg_img = ref([]);

const handleImageUploadd = (event: InputEvent) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        bg_img.value = input.files[0]
        profile.value.logo = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            profile.value.logo = reader.result as string;
        };
        reader.readAsDataURL(input.files[0]);
    }
};

async function singleAlbumFuc(event = null, action = null, album = null) {
    try {

        const formData = new FormData();
        formData.append("album", event);
        formData.append("action", action);

        const response = await axios.post(`/home/edit_album`, formData, config);
        console.log(response.data, "show_album data response :::::::")

        if (action == "delete_album_data") {
            imageUpload.value = false
        }

        if (response.data.status === "SAVED") {
            imageUpload.value = true
            const albumData = response.data.show_album[0];
            albumTitle.value = albumData.name;
            albumId.value = albumData.id;
            profile.value.logo = BASE_URL + albumData.album_bckpic;
            bg_img.value = albumData.album_bckpic;
            productImages.value.splice(0, productImages.value.length);

            if (albumData.image_urls.length > 0) {
                albumData.image_urls.forEach(image => {
                    productImages.value.push({ id: image.id, album: image.album, url: BASE_URL + image.url, file: BASE_URL + image.file });
                });
            }
        }

        if (response.data.status === "Delete") {
            imageUpload.value = false
            basic_detailfirst();
            myerrors.value = "Album deleted successfully"
            showErrorMessage.value = true;
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
        }
        if (response.data.status === "DeleteImage") {

            singleAlbumFuc(event = album, action = 'get_album_data');
            basic_detailfirst();
        }
        else {
            console.error("Failed to add images to album.");
        }
    } catch (error) {
        console.error("Error creating album:", error);
    }
}
async function create_album() {
    try {
        const formData = new FormData();
        formData.append("album_name", albumTitle.value);
        formData.append("background_photo", bg_img.value);
        formData.append("albumId", albumId.value);

        for (let i = 0; i < productImages.value.length; i++) {
            formData.append("album_images", productImages.value[i].file);
        }

        const response = await axios.post(`/home/create_album`, formData, config);
        if (response.data.status === "SAVED") {
            console.log("Images added to album successfully");


            basic_detailfirst();

        }
        else if (response.data.status === "Already") {
            myerrors.value = "Album name already exists."
            showErrorMessage.value = true;
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
        }
        else {
            console.error("Failed to add images to album");
        }
    } catch (error) {
        console.error("Error creating album:", error);
    }
}

// album code

const profile = ref({
    profileImage: imagePath,
    logo: dummyLogo
})

const package_logo = ref();
const albumlist = ref([])
const albumTitle = ref()
const albumId = ref(null)
const imageUpload = ref(false)

const packagePrice = ref('Percentage');
const paymentModes =  ref(['Amount', 'Percentage']);


const photoAddedFuc = () => {
    if (albumTitle.value.trim() !== '') {
        create_album()
        imageUpload.value = true
        albumTitle.value = ""
        profile.value.logo = folderName
        productImages.value.splice(0, productImages.value.length);
    }
    imageUpload.value = false
}
const handleImageUpload = (event: InputEvent, type: string) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            if (type == 'package_logo') {
                package_logo.value = input.files[0]; // Assuming profile_img is a ref
                profile.value.profileImage = reader.result as string;
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};
const createalbum_btn = (action = null) => {
    if (action == 'create_album') {
        imageUpload.value = true
        albumTitle.value = ""
        profile.value.logo = folderName
        productImages.value.splice(0, productImages.value.length);
    }
    else {
        imageUpload.value = false
    }
}

const citiesValues = ref([]);
const stateValues  = ref([]);
const countryValue = ref();
const selectedAlbumIds = ref([]);

const citiesItems = ref([]);
const stateItems = ref([]);
const countryItems = ref([]);
const pagetype = (window.location.href.toLowerCase().includes('add')) ? 'Add New Package' : ''
const package_name = ref('')
const advancepayment = ref('')
const advance_full_payment = ref('')
const pacakgeprice = ref('')
const bookingavailable = ref('')
const start_time = ref('')
const end_time = ref('')
const package_desc = ref('')
const termconditions = ref('')
const path = window.location.pathname;
const packageId = path.split('/').pop();
const deadline_time = ref('')
function getEditorText(html=true) {
    try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}
function getEditorTextT(html=true) {
    try {return (html) ? document.querySelector('.custom-tiptap-style1').innerHTML : document.querySelector('.custom-tiptap-style1').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}
// async function getstate(sel_sid=null) { // overided function
//     fullpageloader.value = true
//     const response = await axios.post('home/getstate', { cid: countryValue.value })
//     if (response.data.status == 'SAVED') {
//         console.log("response.data.states_____________", response.data.states)
//         stateItems.value    = response.data.states
//         stateValues.value   = []
//         citiesItems.value   = []
//         citiesValues.value  = []
//         // state.value = (sel_sid) ? stateitem.value.find((a:any)=>(a.value===sel_sid)) : null
//         fullpageloader.value = false
//     }
// }
async function getstate(sel_sid = null) {
    fullpageloader.value = true;

    const response = await axios.post('home/getstate', {
        cid: countryValue.value,
        create_admin_pack: true, //  send this to backend
    });

    if (response.data.status === 'SAVED') {
        let states = response.data.states;

        //  Move "All States" to top
        const allStatesIndex = states.findIndex(s => s.text === "All States");
        if (allStatesIndex !== -1) {
            const [allStateItem] = states.splice(allStatesIndex, 1);
            states.unshift(allStateItem);
        }

        stateItems.value = states;
        stateValues.value = [];
        citiesItems.value = [];
        citiesValues.value = [];
    }

    fullpageloader.value = false;
}


// async function getcity(sel_cid=null) { // overided function
//     fullpageloader.value = true
//     console.log("stateValues.value______", stateValues.value)
//     const response = await axios.post('home/getcity', { sid: stateValues.value , multiple:true})
//     if (response.data.status == 'SAVED') {
//         citiesItems.value   = response.data.cities
//         citiesValues.value  = []
//         // city.value = (sel_cid) ? cityitem.value.find((a:any)=>(a.value===sel_cid)) : null
//         fullpageloader.value = false
//     }
// }


async function getcity(mode = null) {
    fullpageloader.value = true;
    console.log("stateValues.value______", stateValues.value);

    const payload = {
        sid: stateValues.value,
        multiple: true
    };

    if (mode === "ALL_CITIES_ONLY") {
        payload.mode = "ALL_CITIES_ONLY"; // backend will return only All Cities
    }

    const response = await axios.post('home/getcity', payload);

    if (response.data.status === 'SAVED') {
        citiesItems.value = response.data.cities;

        if (mode === "ALL_CITIES_ONLY") {
            const allCity = response.data.cities.find(c => c.text === "All Cities");
            if (allCity) {
                citiesValues.value = [allCity.value]; //  only All Cities selected
            } else {
                citiesValues.value = [];
            }
        } else {
            citiesValues.value = []; //  Don't auto-select anything
        }
    } else {
        citiesItems.value = [];
        citiesValues.value = [];
    }

    fullpageloader.value = false;
}



// Store previous selection globally
let previousStateSelection = [];



function handleStateSelection() {
    const allStateId = stateItems.value.find(state => state.text === "All States")?.value;
    const allStateIds = stateItems.value.map(state => state.value).filter(v => v !== allStateId);

    const removedValues = previousStateSelection.filter(val => !stateValues.value.includes(val));
    const addedValues = stateValues.value.filter(val => !previousStateSelection.includes(val));

    if (addedValues.includes(allStateId)) {
        console.log(" 'All States' selected → Selecting all states");
        stateValues.value = [allStateId, ...allStateIds];
        previousStateSelection = [...stateValues.value];
        getcity("ALL_CITIES_ONLY"); //  only All Cities returned/selected
        return;
    }

    if (removedValues.includes(allStateId)) {
        console.log(" 'All States' unselected → Clearing all state selections and cities");
        stateValues.value = [];
        previousStateSelection = [];
        citiesItems.value = [];
        citiesValues.value = [];
        return;
    }

    if (stateValues.value.includes(allStateId)) {
        const deselected = allStateIds.filter(id => !stateValues.value.includes(id));
        if (deselected.length > 0) {
            console.log(" Some states unselected while 'All States' is selected → Removing 'All States'");
            stateValues.value = stateValues.value.filter(val => val !== allStateId);
        }
    }

    previousStateSelection = [...stateValues.value];
    getcity(); // Normal city fetch for selected states
}


const hours = ref(['All']);
async function create_pacakge() {
    if (!(ivalidate())){return null}
    try {
        fullpageloader.value=true
        const formData = new FormData();
        formData.append("package_id", packageId);
        formData.append("package_owner","vendor");
        formData.append("category", category.value['value'])
        formData.append("additionallink", JSON.stringify(additionallink.value.map((a: any) => (a.value))))
        formData.append("avldate", avldate.value)
        // add_durs.value.forEach((a: any) => { formData.append("add_durs[]", [a.time.split(" ")[0], a.cost]); });
        formData.append("timedurationnew", timedurationnew.value);
        formData.append("deadline_time", deadline_time.value);
        formData.append("Country", countryValue.value['value']);
        // formData.append("States", stateValues.value.map((a:any)=>( (a.value) ? a.value : a )) );
        // formData.append("Cities", citiesValues.value.map((a:any)=>( (a.value)  ? a.value : a )) );
        formData.append("States", JSON.stringify(stateValues.value.map((a: any) => (a.value ? a.value : a))));
    formData.append("Cities", JSON.stringify(citiesValues.value.map((a: any) => (a.value ? a.value : a))));
    

        formData.append("package_name", package_name.value);
        formData.append("pacakgeprice", pacakgeprice.value)
        formData.append("advancepayment", advancepayment.value)
        formData.append("advance_full_payment", advance_full_payment.value)
        formData.append("package_logo", package_logo.value)
        formData.append("package_desc", getEditorText())
        formData.append("termconditions", getEditorTextT())
        formData.append("bookingavailable", bookingavailable.value)
        formData.append("hours", hours.value);
        formData.append("selected_album_ids", selectedAlbumIds.value);
            
        const response = await axios.post(`/home/create_pacakage`, formData, config);
        if (response.data.status === "SAVED") { 
            myerrors.value              = 'Package saved successfully!';
            showSuccessMessage.value    = true;
            setTimeout(() => { window.location.href = '/packages'; }, 3000); 
        }else if (response.data.status === "SUB_EXPIRED") { 
            myerrors.value              = response.data.msg;
            showErrorMessage.value      = true
            fullpageloader.value        = false
            setTimeout(() => { showErrorMessage.value = false; }, 3000); 
        }else { console.error("Failed to add images to album"); }
    } catch (error) { console.error("Error creating album:", error); } finally { fullpageloader.value = false }
}


async function edit_package() {
    // try {
        const formData = new FormData();
        formData.append("package_id", packageId);
        const response = await axios.post(`/home/edit_package`, formData, config);
        console.log(response.data, "show package data :::::::")

        if (response.data.status === "SAVED") {
            console.log(response.data.package, "show package data");
            // add_durs.value = response.data.package.timedcost
            timedurationnew.value = response.data.package.timedcost
            deadline_time.value = response.data.package.deadline_time
          
            if(response.data.package.vendor.weblinks){
                additionallinkItem.value = response.data.package.vendor.weblinks.map((a: any) => ({ 'text': a.url, 'value': a.id }))
                additionallink.value = additionallinkItem.value.filter((a: any) => (response.data.package.weblinks.map((a:any)=>(a.id)).includes(a.value))) 

            }
            
            bookingavailable.value = response.data.package.no_of_booking
            avldate.value = [response.data.package.from_date, response.data.package.to_date]

            const pack = response.data.package
            // document.querySelector('.tiptap').innerHTML = pack.description;
            if (pack.description) {
            try {
                const scrollTop = window.scrollY; // Save the current vertical scroll position
                const scrollLeft = window.scrollX; // Save the current horizontal scroll position

                document.querySelector('.tiptap').innerHTML = pack.description;

                // Restore the scroll position
                setTimeout(() => {  
                    window.scrollTo(scrollLeft, scrollTop);
                }, 200);
                
            } catch (error) {
                console.error("Error updating content:", error);
            }}
            package_name.value = pack.name
            pacakgeprice.value = pack.price
            // editor.value = pack.description
            termconditions.value = pack.terms_and_conditions
            advancepayment.value = pack.advance_payment
            advance_full_payment.value = pack.advance_full_payment
            category.value = pack.category.name
            profile.value.profileImage = pack.package_logo === '/media/default.jpg' ? BASE_URL + albumone : BASE_URL + pack.package_logo

            countryValue.value = response.data.mycountry
            stateItems.value = response.data.states
            stateValues.value = response.data.mystates
            citiesItems.value = response.data.cities
            citiesValues.value = response.data.mycity
            
            const selectedalbum = pack.albumbs.map(alb => alb.id);
            selectedAlbumIds.value = selectedalbum;

        } else { console.error("_______Failed to add images to album."); }
    // } catch (error) { console.error("Error creating album:", error); }
}
edit_package()
const smallerror = ref('')
function checkMaxValue() {
    console.log('hit me______')
    const valuep = pacakgeprice.value; // Remove leading/trailing spaces
    
    if (!valuep || /^[^\d]/.test(valuep)) { pacakgeprice.value = ''; } 
    else { pacakgeprice.value = (parseFloat(valuep) < 0) ? 1 : ( (parseFloat(valuep) > 10000000000.0) ? 10000000000 : pacakgeprice.value ) }

    if (packagePrice.value == 'Percentage'){
        console.log('yes m here ________________')
        const value = advancepayment.value; // Remove leading/trailing spaces
        if (!value || /^[^\d]/.test(value)) { advancepayment.value = ''; } 
        else { advancepayment.value = (parseFloat(value) > 100) ? 100 : ( (parseFloat(value) < 0) ? 0 : advancepayment.value ) }
    } else {
        console.log('yes m here in else condition________________')


        // if (advance_full_payment.value === valuep) {
        //     // advance_full_payment.value = advance_full_payment;
        //     smallerror.value = '';
        //     console.log('Values are equal. Required attribute removed.');
        // } else {
        //     // advance_full_payment.value = 0;
        //     smallerror.value = 'payment value must equal the Base price.'
        //     console.error('Error: Advance payment value must equal the package price.');
        // }
        
    }
    if (packagePrice.value === 'Percentage') {
        advance_full_payment.value = null; // Clear the full payment field
    } else if (packagePrice.value === 'Amount') {
        advancepayment.value = null; // Clear the percentage field
    }

    console.log('check the value valuep',valuep)
    console.log('check the value advance_full_payment.value',advance_full_payment.value)
    if (advance_full_payment.value > parseFloat(valuep) || advance_full_payment.value < 0 ) {
        smallerror.value = 'Invalid Amount.';
    } else {
        smallerror.value = null;
    }
}

async function basic_detailfirst() {
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
    const response = await axios.post(`/home/vendor_onboard_data`, {}, config);
    console.log("response.data________________________", response.data)

    
    if (response.data.category) { 
        categoryitem.value = response.data.category
    }
    if (response.data.serialized_albums) {
        albumlist.value = response.data.serialized_albums
        console.log(albumlist.value, "albumlist.valuealbumlist.valuealbumlist.value..basic")
    }
    if (packageId == 'add-package') {
        let icat = response.data.v_profile_data.category
        if (icat) category.value = { text: icat[0].name, value: icat[0].id }
    }
    countryItems.value= response.data.countries
    additionallinkItem.value = response.data.v_profile_data.weblinks.map((a: any) => ({ 'text': a.url, 'value': a.id }))
}
basic_detailfirst();


const avldate = ref()
onMounted(() => {
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
    avldate.value = [startDate, endDate];
})


const additionallink = ref([]);
const additionallinkItem = ref([]);
const addlinkpopup = ref(false);
const Linkfield = ref();
async function handlewlinks() {
    const response = await axios.post('/home/handlewlinks', { 'action': 'add', 'content': Linkfield.value })
    if (response.data.status == 'DONE') {
        additionallinkItem.value = response.data.weblinks.map((a: any) => ({ 'text': a.url, 'value': a.id }))
        addlinkpopup.value = false
        Linkfield.value = ''
    }
}

const package_cost = ref();
const timeduration = ref();
const timedurationnew = ref();
const timedurationitem = ref(['1 Hour', '2 Hours', '3 Hours', '4 Hours', '5 Hours', '6 Hours', '7 Hours', '8 Hours', '9 Hours', '10 Hours', '11 Hours', '12 Hours', '13 Hours', '14 Hours', '15 Hours', '16 Hours', '17 Hours', '18 Hours', '19 Hours', '20 Hours', '21 Hours', '22 Hours', '23 Hours', '24 Hours']);
// const add_durs: any = ref([])
// function handle_durs(add: any = true, iset: any = null) {
//     if (add && (timeduration.value && package_cost.value)) {
//         if (!(add_durs.value.filter((a: any) => (a.time == timeduration.value)).length)) {
//             add_durs.value.push({ 'time': timeduration.value, 'cost': package_cost.value })
//         }
//         timeduration.value = null; package_cost.value = '';
//     } else { if (iset) add_durs.value = add_durs.value.filter((a: any) => (!(a.time == iset.time && a.cost == iset.cost))) }
// }


const reqrules   = ref([(v: string) => !!v || 'This field is required']);

function ivalidate(){
    // const isValidEmail = emailRules.value.every((rule) => rule(u_email.value) === true);
    // return fill_req_error( (isValidfname && isValidlname && isValidEmail && u_phone.value) ? true : false )
    console.log(package_name.value && category.value && countryValue.value && stateValues.value.length && citiesValues.value.length && avldate.value && deadline_time.value && pacakgeprice.value && advancepayment.value && advance_full_payment.value && getEditorText(false) ,"-----" , packageId, package_logo.value)
    
    const rslt = (package_name.value && category.value && countryValue.value && stateValues.value.length && avldate.value && deadline_time.value && pacakgeprice.value  && getEditorText(false) && ((packageId == 'add-package') ? package_logo.value : true))
    if (packagePrice.value === 'Percentage') {
        if (!advancepayment.value) {
            console.error("Advance payment is required when 'Percentage' is selected.");
        }
    } else {
        if (!advance_full_payment.value) {
            console.error("Full payment is required when 'Percentage' is not selected.");
        }
    }



    if (!(rslt)){
        showErrorMessage.value = true;
        myerrors.value = 'Please fill all required fields!';
        setTimeout(() => {  showErrorMessage.value = false; }, 3000);
    }
    return rslt
}
const goBack = () => {
  window.history.back();
};
</script>
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
    <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
    <v-row>
        
        <v-col cols="12">
            <div class="d-flex justify-start">
                <v-btn size="small" class="rounded-sm mb-2 text-white" color="grey200" @click="goBack" flat >
                    <ChevronLeftIcon size="13" class="me-1" />Back 
                </v-btn>
            </div>
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100 removeHidden">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row>
                        <v-col cols="12">
                            <v-row class="justify-content-between">
                                <v-col cols="12" md="6"> <v-card-title class="text-h4">{{pagetype}}</v-card-title>
                                </v-col>
                                <v-col cols="12" md="6" class="d-flex justify-sm-end justify-start">
                                    <v-btn class="bg-secondary rounded-sm me-1" @click="create_pacakge()" text flat>
                                        Save Package
                                    </v-btn>
                                   
                                    <router-link v-if="packageId != 'add-package'" class="bg-secondary rounded-sm" text flat to="/add-package">
                                        Add Package
                                   </router-link>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <div class="mb-3">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Package Name
                                            <span class="text-error ma-1">*</span></v-label>
                                        <VTextField hide-details="auto" v-model="package_name" class="mb-3" required placeholder="Enter Your Package Name" color="secondary" :rules="reqrules"></VTextField>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <div class="mb-3">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Category  <span class="text-error ma-1">*</span></v-label>
                                        <v-select v-model="category" :items="categoryitem" item-title="text" item-value="value" label="Select Category" single-line variant="outlined" hide-details return-object required color="secondary" :rules="reqrules">
                                        </v-select>
                                    </div>
                                </v-col>

                                

                                <v-col cols="12" md="6">
                                    <div class="mb-3">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                                        <v-select v-model="countryValue" :items="countryItems" item-title="text" item-value="value" label="Select Country" single-line variant="outlined" hide-details @update:modelValue="getstate()" return-object required :rules="reqrules">
                                        </v-select>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <!-- <div class="mb-3">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Location (States) <span class="text-error ma-1">*</span></v-label>
                                        <v-autocomplete v-model="stateValues" :items="stateItems" @update:modelValue="getcity()" item-value="value" item-title="text" variant="outlined" color="secondary" placeholder="Select states" density="comfortable" flat multiple hide-details :rules="reqrules">
                                            <template v-slot:chip>
                                                <v-chip label color="secondary" size="x-small"
                                                    class="mb-1 text-subtitle-2 font-weight-semibold"></v-chip>
                                            </template>
                                        </v-autocomplete>
                                    </div> -->
                                    <div class="mb-3">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Location (States) <span class="text-error ma-1">*</span></v-label>
                                        <v-autocomplete v-model="stateValues" :items="stateItems" @update:modelValue="handleStateSelection" item-value="value" item-title="text" variant="outlined" color="secondary" placeholder="Select states" density="comfortable" flat multiple hide-details :rules="reqrules">
                                            <template v-slot:chip>
                                                <v-chip label color="secondary" size="x-small"
                                                    class="mb-1 text-subtitle-2 font-weight-semibold"></v-chip>
                                            </template>
                                        </v-autocomplete>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="mb-3">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">cities</v-label>
                                        <v-autocomplete v-model="citiesValues" :items="citiesItems"
                                            item-value="value" item-title="text" variant="outlined" color="secondary"
                                            placeholder="Select Location For This Package" density="comfortable" flat multiple hide-details :rules="reqrules">

                                            <template v-slot:chip>
                                                <v-chip label color="secondary" size="x-small" class="mb-1 text-subtitle-2 font-weight-semibold"></v-chip>
                                            </template>
                                        </v-autocomplete>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">No of Booking Available
                                        </v-label>
                                        <VTextField min="1" v-model="bookingavailable"  hide-details="auto" required
                                            placeholder="No of Booking Available" color="secondary" type="postive" >
                                        </VTextField>
                                    </div>
                                </v-col>

                                <!-- <v-col cols="12" md="6">
                                    <div class="mb-3">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2 bookingModalStyle">Availability <span class="text-error ma-1">*</span></v-label>
                                         <VueDatePicker v-model="avldate" range multi-calendars  :enable-time-picker="false" dark :rules="reqrules"/>
                                    </div>
                                </v-col> -->

                                <v-col cols="12" md="6">
                                    <div class="">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Cut-off Days <span class="text-error ma-1">*</span>
                                        <v-avatar size="18" class="ms-1">
                                            <v-btn class="rounded-circle bg-dark text-white" color="" size="x-small">
                                                <QuestionMarkIcon size="12"/>
                                                <v-tooltip activator="parent" location="end">
                                                        Cut-off days refer to the number of <br> days in  advance that you need to book <br>before the event date.
                                                </v-tooltip>
                                            </v-btn>
                                        </v-avatar>
                                        </v-label>
                                        <VTextField type="number" min="1" v-model="deadline_time" hide-details="auto"
                                            class="mb-3" required placeholder="Enter Cutoff Days"  :rules="reqrules">
                                        </VTextField>
                                    </div>
                                </v-col>


                                <v-col cols="12" md="6">
                                    <div class="mb-3">
                                        <!-- <v-autocomplete v-model="additionallink" :items="additionallinkItem" item-value="value" item-text="text" variant="outlined" flat color="secondary" placeholder="Select Links" multiple hide-details  density="comfortable">
                                    <template v-slot:chip>
                                        <v-chip label color="secondary" size="x-small"
                                        class="mb-1 text-subtitle-2 font-weight-semibold"></v-chip>
                                    </template>
                                </v-autocomplete> -->
                                        <div>
                                            <div class="d-flex pb-2">
                                                <v-label class="text-subtitle-1 font-weight-medium ">Add Links</v-label>
                                                <v-btn color="success" variant="flat"
                                                    class="rounded-sm customSizeadd px-2 ms-2"
                                                    @click="addlinkpopup = true;">
                                                    <PlusIcon size="14" />
                                                </v-btn>
                                            </div>
                                            <v-dialog v-model="addlinkpopup" class="dialog-mw on-top" max-width="500">
                                                <v-card class="postion-relative overflow-hidden" elevation="10">
                                                    <v-card-item class="">
                                                        <div class="d-flex justify-space-between">
                                                            <h4
                                                                class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">
                                                                Add
                                                                Additional Links</h4>
                                                            <v-btn icon color="" @click="addlinkpopup = false;" flat
                                                                variant="outlined" size="x-small" class="bg-error">
                                                                <XIcon width="20" />
                                                            </v-btn>
                                                        </div>
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Add
                                                            Links</v-label>
                                                        <v-row class="mb-4">
                                                            <v-col cols="10" class="pb-0">
                                                                <VTextField v-model="Linkfield" hide-details="auto"
                                                                    class="mb-3" required placeholder="Enter website Link" ></VTextField>
                                                            </v-col>
                                                            <v-col cols="2" class="d-flex align-center">
                                                                <v-btn color="error" variant="flat" size="small"
                                                                    class="me-2 rounded-sm h-100" @click="Linkfield = ''">
                                                                    <TrashIcon size="14" />
                                                                </v-btn>
                                                            </v-col>
                                                        </v-row>
                                                        <div class="d-flex justify-start pb-5">
                                                            <v-btn color="success" class="rounded-sm"
                                                                @click="handlewlinks()">Add</v-btn>
                                                        </div>
                                                    </v-card-item>
                                                </v-card>
                                            </v-dialog>
                                        </div>
                                        <v-select v-model="additionallink" :items="additionallinkItem" item-title="text"
                                            item-value="value" label="Select" return-object single-line
                                            variant="outlined" multiple hide-details></v-select>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Base Price
                                         <span class="text-error ma-1">*</span></v-label>
                                        <VTextField v-model="pacakgeprice" hide-details="auto" @keyup="checkMaxValue()" required
                                            placeholder="Enter Package Price" color="secondary" type="number"  :rules="reqrules">
                                        </VTextField>

                                    </div>
                                </v-col>
                                <v-col cols="2" sm="2">
                                    <div>
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">
                                            Deposit Mode:
                                            <span class="text-error ma-1">*</span>
                                        </v-label>
                                        <v-select 
                                            v-model="packagePrice" 
                                            :items="paymentModes" 
                                            required
                                            color="secondary"
                                            :rules="reqrules"
                                        >
                                        </v-select>
                                    </div>
                                </v-col>
                                <v-col cols="6" sm="4" v-if="packagePrice === 'Percentage'">
                                    <div>
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Deposit
                                            Percentage <span class="text-error ma-1">*</span></v-label>
                                        <v-text-field v-model="advancepayment" variant="outlined" color="secondary"
                                            type="number" placeholder="Enter Deposit Percentage" hide-details
                                            @keyup="checkMaxValue()" :rules="reqrules">
                                        </v-text-field>
                                    </div>
                                </v-col>

                                <v-col cols="8" sm="4" v-if="packagePrice === 'Amount'">
                                    <div>
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Deposit Amount<span class="text-error ma-1">*</span></v-label>
                                        <VTextField v-model="advance_full_payment" hide-details="auto" @keyup="checkMaxValue()"     required
                                            placeholder="Enter Deposit Amount" color="secondary" type="number"  :rules="reqrules">
                                        </VTextField>
                                    </div>
                                    
                                    <p class="error-message" v-if="smallerror">
                                        {{ smallerror }}
                                    </p>
                                </v-col>


                                <v-col cols="12" sm="6">
                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Time Duration
                                    </v-label>
                                    <v-select v-model="timedurationnew" :items="timedurationitem"
                                        item-title="text" item-value="value" label="Duration" single-line
                                        variant="outlined" hide-details return-object required
                                        color="secondary" class="mb-0">
                                    </v-select>
                                </v-col>
                                <!-- <v-col cols="12" :sm="(add_durs.length) ? 6 : 12">
                                    <div class="">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Time Duration
                                        </v-label>
                                        <v-row>
                                            <v-col cols="5">
                                                <v-select v-model="timeduration" :items="timedurationitem"
                                                    item-title="text" item-value="value" label="Duration" single-line
                                                    variant="outlined" hide-details return-object required
                                                    color="secondary" class="mb-0">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="5">
                                                <VTextField hide-details="auto" v-model="package_cost" class="mb-0"
                                                    required placeholder="Enter Cost" color="secondary" label="Cost"
                                                    type="number"></VTextField>
                                            </v-col>
                                            <v-col cols="2" class="ps-0 ps-md-2">
                                                <v-btn color="success" variant="flat" size="small"
                                                    class="me-2 rounded-sm h-100" @click="handle_durs()">
                                                    <PlusIcon size="14" />
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6" v-if="add_durs.length">
                                    <div class="">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Added durations</v-label>
                                        <div>
                                            <v-card elevation="0" class="border mb-2"
                                                :class="{ 'scrollon scroll-style': add_durs.length > 2 }">
                                                <v-card-item>
                                                    <v-row class="border-bottom">
                                                        <v-col cols="4">
                                                            <p class="text-13 text-body-1 font-weight-semibold">
                                                                Duration 
                                                            </p>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <p class="text-13 text-body-1 font-weight-semibold">
                                                                Cost
                                                            </p>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <p class="text-13 text-body-1 font-weight-semibold text-center">
                                                                Action
                                                            </p>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-for="(dur, index) in add_durs" :key="index"
                                                        class="border-bottom">
                                                        <v-col cols="4">
                                                            <p class="text-13 text-body-1 font-weight-medium">
                                                                {{ dur.time }}
                                                            </p>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <p class="text-13 text-body-1 font-weight-medium ">
                                                                ${{ dur.cost }}
                                                            </p>
                                                        </v-col>
                                                        <v-col cols="4" class="text-center">
                                                            <v-btn color="error" variant="flat" size="small"
                                                                class=" rounded-sm" @click="handle_durs(false, dur)">
                                                                <TrashIcon size="14" />
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-item>
                                            </v-card>
                                        </div>
                                    </div>
                                </v-col> -->







                                <!-- <v-col cols="12" sm="12">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Package
                                    Description
                                </v-label>
                                <v-textarea v-model="package_desc" outlined name="Note" placeholder="Enter Your Package Description"
                                    hide-details color="secondary"></v-textarea>
                            </div>
                        </v-col> -->

                                <v-col cols="12" md="12">
                                    <v-label class="font-weight-medium mb-2 d-block">
                                        Package description <span class="text-error ma-1">*</span></v-label>
                                    <div class="rounded custom-border">
                                        <div v-if="editor">
                                            <EditorMenubar :editor="editor" class="flex-wrap"  :rules="reqrules"/>
                                        </div>
                                        <editor-content :editor="editor" ref="editorContentRef"  :rules="reqrules"/>
                                    </div>
                                </v-col>

                                <!-- <v-col cols="12" sm="12">
                                    <div class="">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Terms &
                                            Conditions
                                         <span class="text-error ma-1">*</span></v-label>
                                        <v-textarea v-model="termconditions" outlined name="Note"
                                            placeholder="Enter terms & Conditions" hide-details
                                            color="secondary"  :rules="reqrules"></v-textarea>
                                    </div>
                                </v-col> -->
                                <v-col cols="12" sm="12">
                                    <div class="">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Terms &
                                            Conditions
                                        <!-- <span class="text-error ma-1">*</span> -->
                                    
                                    </v-label>
                                        <div class="rounded custom-border">
                                            <div v-if="editor2">
                                                <EditorMenubar :editor="editor2"  :rules="reqrules"/>
                                                </div>
                                            <editor-content :editor="editor2"  ref="editorContentRef"  :rules="reqrules"/>
                                            <!-- <v-textarea v-model="termconditions" outlined name="Note" placeholder="Enter terms & Conditions" hide-details
                                                color="secondary" :rules="reqrules"></v-textarea> -->
                                        </div>
                                    </div>
                                </v-col>



                                <!-- <v-col cols="12">
                            <v-row>
                                <v-col cols="12" class="pb-0">
                                    <v-label class="text-subtitle-1 font-weight-medium pb-0">
                                        Select Previous Albums
                                    </v-label>
                                </v-col>
                                <v-col cols="12" sm="6" md="3" v-for="(item, index) in prealbums" :key="index">
                                    <div class="position-relative">
                                        <div class="pa-0 checkAlbum ">
                                            <v-checkbox-btn :model-value="false" color='secondary'
                                                :id="'checkbox-btn-' + index" class=""></v-checkbox-btn>
                                        </div>
                                        <label :for="'checkbox-btn-' + index">
                                            <v-card elevation="10"
                                                class="vendor-card-background albums d-flex align-end overflow-hidden"
                                                :style="{ backgroundImage: 'url(' + item.albumImage + ')' }">
                                                <div class="pa-6 text-left text-white position-relative">
                                                    <h3
                                                        class="text-h6 text-no-wrap font-weight-semibold text-white mb-1">
                                                        {{ item.albumname }}
                                                    </h3>
                                                    <p class="mb-0 text-subtitle-1">{{ albumimages }} Photos</p>
                                                </div>
                                            </v-card>
                                        </label>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col> -->
                                <v-col cols="12" md="6">
                                    <div class="text-start">
                                        <h3 class="text-subtitle-1 font-weight-medium pb-2">Package Logo<span class="text-error ma-1">*</span></h3>
                                        <div class="imageGroupMain profileGroup w-100">
                                            <label for="profilePicInput" class="labelStImgPro">
                                                <input type="file" id="profilePicInput" class="d-none" @change="handleImageUpload($event, 'package_logo')" accept="image/*"  :rules="reqrules">
                                            </label>
                                            <div class="imageSizeMain new d-flex justify-center align-center">

                                                <img :src="profile.profileImage" alt="Uploaded Image"
                                                    style="max-width: 300px;">
                                            </div>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-dialog v-model="imageUpload" max-width="900">
                                        <v-card>
                                            <v-card-text>
                                                <div class="mb-5">
                                                    <v-label class="text-h5 pb-2">Album Name</v-label>
                                                    <VTextField v-model="albumTitle" :value="albumTitle" hide-details="auto" class="mb-3" required placeholder="Enter Album Name" ></VTextField>
                                                </div>


                                                <div class="mb-5">
                                                    <h3 class="text-h5 pb-4">Upload Your Album Logo</h3>
                                                    <div class="imageGroupMain businessGroup withoutRadius">
                                                        <label for="logoImageLbl2" class="labelStImgPro ">
                                                            <input type="file" id="logoImageLbl2" class="d-none"
                                                                @change="handleImageUploadd"  accept="image/*,video/mp4,video/*" />
                                                        </label>
                                                        <div class="imageSizeMain">
                                                            <img :src="profile.logo" alt="Uploaded Image"
                                                                style="max-width: 300px;">
                                                        </div>
                                                    </div>
                                                </div>

                                                <h3 class="text-h5 mt-5 mb-3">Upload Your Photos</h3>
                                                <div class="">
                                                    <label for="file-upload" class="labelStyleImage">
                                                        <input id="file-upload" type="file" multiple
                                                            @change="uploadImage($event, 'image')" accept="image/*" />
                                                        <div class="innrContentTitle">
                                                            <span class="iconTitleUpld d-block text-center">
                                                                <PlusIcon size="24" />
                                                            </span>
                                                            Add New Photos
                                                        </div>
                                                    </label>

                                                    <div class="mainImageRow mt-4" v-if="productImages.length > 0">
                                                        <div class="image-holder"
                                                            v-for="(image, index) in productImages" :key="image.id">
                                                            <!-- <img :ref="'delete_album_image' + image.id" alt=""
                                                                :src="image.url" /> -->


                                        <template v-if="image?.url">
                                            <template v-if="image.url.startsWith('data:image')">
                                                <img :ref="'delete_album_image' + image.id" :src="image.url" alt="Base64 Image" />
                                            </template>
                                            <template v-else-if="image.url.startsWith('data:video')">
                                                <video :ref="'delete_album_video' + image.id" :src="image.url" controls></video>
                                            </template>
                                            <template v-else-if="/\.(jpeg|jpg|png|gif|webp)$/i.test(image.url.split('?')[0])">
                                                <img :ref="'delete_album_image' + image.id" :src="image.url" alt="Image Preview" />
                                            </template>
                                            <template v-else-if="/\.(mp4|mov|avi|mkv|webm)$/i.test(image.url.split('?')[0])">
                                                <video :ref="'delete_album_video' + image.id" :src="image.url" controls></video>
                                            </template>
                                            <template v-else>
                                                <p>Unsupported File Type</p>
                                            </template>
                                        </template>











                                                            <button type="button" class="btnTrash"
                                                                @click="singleAlbumFuc(image.id, action = 'delete_album_image', image.album)">
                                                                <TrashIcon size="18" color="white" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </v-card-text>
                                            <v-card-actions class="pa-4">
                                                <v-spacer></v-spacer>
                                                <v-btn color="error" @click="imageUpload = false">Cancel</v-btn>
                                                <v-btn color="secondary" variant="flat" @click="photoAddedFuc()">Save Album</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <v-label class="text-subtitle-1 font-weight-medium pb-2 ">Select
                                        Albums
                                    </v-label>
                                    <div class="heightSameToo">
                                        <label class="labelStyleImage h-100 text-secondary"
                                            @click="createalbum_btn('create_album')">
                                            <div class="innrContentTitle font-size">
                                                <span class="iconTitleUpld d-block text-center">
                                                    <PlusIcon size="24" />
                                                </span>
                                                Add New Album
                                            </div>
                                        </label>
                                    </div>
                                </v-col>
                                <v-col cols="12">
                                    <v-row>
                                        <template v-if="albumlist.length > 0">
                                            <v-col cols="12" sm="6" md="3" v-for="(album, index) in albumlist"
                                                :key="album.id">
                                                <div class="position-relative">
                                                    <div class="pa-0 checkAlbum ">
                                                        <!-- <v-checkbox-btn :model-value="false" color='secondary'
                                                    :id="'checkbox-btn-' + album.id" class=""></v-checkbox-btn> -->

                                                        <v-checkbox-btn v-model="selectedAlbumIds" :value="album.id"
                                                            color="secondary" :id="'checkbox-btn-' + album.id"
                                                            class=""></v-checkbox-btn>




                                                    </div>
                                                    <label :for="'checkbox-btn-' + album.id">
                                                        <v-card elevation="10"
                                                            class="vendor-card-background d-flex align-end overflow-hidden "
                                                            :style="{
                                                                backgroundImage: album.album_bckpic ? `url(${BASE_URL + album.album_bckpic})` : `url(${folderName})`
                                                            }">

                                                            <!-- Content goes here -->
                                                            <div class="buttonGroupMain">
                                                                <div class="btnMainCol">
                                                                    <v-btn color="success" size="small"
                                                                        @click="singleAlbumFuc(album.id, 'get_album_data')">
                                                                        <PencilIcon size="18" color="white"
                                                                            class="me-1" /> Edit
                                                                    </v-btn>
                                                                </div>
                                                                <div class="btnMainCol">
                                                                    <v-btn color="error" size="small"
                                                                        @click="singleAlbumFuc(album.id, 'delete_album_data')">
                                                                        <TrashIcon size="18" color="white"
                                                                            class="me-1" />
                                                                        Delete
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                            <div class="pa-6 text-left text-white position-relative">
                                                                <h3
                                                                    class="text-h6 text-no-wrap font-weight-semibold text-white mb-1">
                                                                    {{ album.name }}</h3>
                                                                <p class="mb-0 text-subtitle-1">{{
                                                                    album.image_urls.length }}
                                                                    Photos</p>
                                                            </div>
                                                        </v-card>
                                                    </label>
                                                </div>

                                            </v-col>
                                        </template>
                                    </v-row>
                                </v-col>
                                <!-- <v-col cols="12" md="12">
                            <div class="">

                                <v-dialog v-model="imageUpload" max-width="900">
                                    <v-card>
                                        <v-card-text>
                                            <v-label class="text-h5 pb-2">Album Name</v-label>
                                            <VTextField v-model="albumTitle" :value="albumTitle" hide-details="auto"
                                                class="mb-3" required placeholder="Enter Album Name"></VTextField>

                                            <div class="">
                                                <h3 class="text-h5 pb-4">Upload Your Cover Photo</h3>
                                                <div class="imageGroupMain businessGroup withoutRadius">
                                                    <label for="logoImageLbl2" class="labelStImgPro ">
                                                        <input type="file" id="logoImageLbl2" class="d-none"
                                                            @change="handleImageUploadd" accept="image/*">
                                                    </label>
                                                    <div class="imageSizeMain">
                                                        <img :src="profile.logo" alt="Uploaded Image"
                                                            style="max-width: 300px;">
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 class="text-h5 mt-5 mb-3">Upload Your Photos</h3>
                                            <div class="">
                                                <label for="file-upload" class="labelStyleImage">
                                                    <input id="file-upload" type="file" multiple
                                                        @change="uploadImage($event, 'image')" accept="image/*" />
                                                    <div class="innrContentTitle">
                                                        <span class="iconTitleUpld d-block text-center">
                                                            <PlusIcon size="24" />
                                                        </span>
                                                        Add New Photos
                                                    </div>
                                                </label>

                                                <div class="mainImageRow mt-4" v-if="productImages.length > 0">
                                                    <div class="image-holder" v-for="(image, index) in productImages"
                                                        :key="image.id">
                                                        <img :ref="'delete_album_image' + image.id" alt=""
                                                            :src="image.url" />


                                                        <button type="button" class="btnTrash"
                                                            @click="singleAlbumFuc(image.id, action = 'delete_album_image', image.album)">
                                                            <TrashIcon size="18" color="white" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </v-card-text>
                                        <v-card-actions class="pa-4">
                                            <v-spacer></v-spacer>
                                            <v-btn color="error" @click="imageUpload = false">Cancel</v-btn>
                                            <v-btn color="secondary" variant="flat" @click="photoAddedFuc()">Save
                                                Album</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <div class="">
                                    <div class="">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Select
                                             Albums
                                        </v-label>
                                    </div>
                                    <v-row>

                                        <v-col cols="12" :sm="albumlist.length > 0 ? '6' : '12'"
                                            :md="albumlist.length > 0 ? '3' : '12'">

                                            <label class="labelStyleImage h-100"
                                                @click="createalbum_btn('create_album')">
                                                <div class="innrContentTitle">
                                                    <span class="iconTitleUpld d-block text-center">
                                                        <PlusIcon size="24" />
                                                    </span>
                                                    Add New Album
                                                </div>
                                            </label>

                                        </v-col>



                                        <template v-if="albumlist.length > 0">
                                            <v-col cols="12" sm="6" md="3" v-for="(album, index) in albumlist"
                                                :key="album.id">
                                                <div class="position-relative">
                                                    <div class="pa-0 checkAlbum ">

                                                            <v-checkbox-btn v-model="selectedAlbumIds" :value="album.id" color="secondary" :id="'checkbox-btn-' + album.id" class=""></v-checkbox-btn>




                                                    </div>
                                                    <label :for="'checkbox-btn-' + album.id">
                                                        <v-card elevation="10"
                                                            class="vendor-card-background d-flex align-end overflow-hidden " 
                                                            :style="{
                                                        backgroundImage: album.album_bckpic ? `url(${BASE_URL + album.album_bckpic})` : `url(${folderName})`
                                                    }">

                                                            <div class="buttonGroupMain">
                                                                <div class="btnMainCol">
                                                                    <v-btn color="success" size="small"
                                                                        @click="singleAlbumFuc(album.id, 'get_album_data')">
                                                                        <PencilIcon size="18" color="white" class="me-1" /> Edit
                                                                    </v-btn>
                                                                </div>
                                                                <div class="btnMainCol">
                                                                    <v-btn color="error" size="small"
                                                                        @click="singleAlbumFuc(album.id, 'delete_album_data')">
                                                                        <TrashIcon size="18" color="white" class="me-1" />
                                                                        Delete
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                            <div class="pa-6 text-left text-white position-relative">
                                                                <h3
                                                                    class="text-h6 text-no-wrap font-weight-semibold text-white mb-1">
                                                                    {{ album.name }}</h3>
                                                                <p class="mb-0 text-subtitle-1">{{ album.image_urls.length }}
                                                                    Photos</p>
                                                            </div>
                                                        </v-card>
                                                    </label>
                                                </div>
                                                
                                            </v-col>
                                        </template>




                                    </v-row>
                                </div>

                            </div>
                        </v-col> -->
                                <v-col cols="12" class="d-flex justify-end">
                                    <v-btn class="bg-secondary rounded-sm" @click="create_pacakge()" text flat >
                                        Save Package
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
    
</template>
<style>











.v-field__outline {
    color: #bcc3c9;
}

.imageSizeMain.new {
    width: 100%;
    height: 200px;
    border-radius: 10px !important;
    overflow: hidden !important;

}

.heightSameToo {
    height: 195px;
    border: 4px solid #fff;
    border-radius: 10px !important;
}

.imageSizeMain.new img {
    width: 100%;
    object-fit: cover;
    max-width: 100% !important;
    border-radius: 6px;
}

.image-holder.new {
    width: calc(25% - 8px);
    border-radius: 6px;
}

.image-holder.new img {
    height: 100px;
    border-radius: 6px;
}

.vendor-card-background.albums {
    min-height: 130px;
}

.checkAlbum {
    position: absolute;
    right: 6px;
    top: 5px;
    z-index: 99;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    width: 24px;
    border-radius: 3px;
}

.buttonGroupMain {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-flow: wrap column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 10px;
    z-index: 999;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease-in-out 0s;
}

.buttonGroupMain:before {
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
}

.vendor-card-background {
    overflow: hidden;
}

.vendor-card-background:hover .buttonGroupMain {
    transform: translateY(0%);
    opacity: 1;
    visibility: visible;
}

.font-size {
    font-size: 14px;
}

.custom-border {
    border: 1px solid #bcc3c9;
}

.menuBar {
    border-bottom: 1px solid #bcc3c9;
}

.customSizeadd {
    height: 20px !important;
    min-width: 10px !important;
}

.scrollon {
    height: 200px;
    overflow-y: auto;
}


/* datepicker code start here */
.bookingModalStyle .v-card-item__content {
    overflow: visible;
}

.dp__input {
    background-color: transparent;
    padding: 10px 40px;
    border: 1px solid #bcc3c9;
}

.dp__action_row {
    padding: 18px 10px;
}

.dp__action_buttons .dp__action_cancel,
.dp__action_buttons .dp__action_select
 {
    padding: 12px !important;
}

.dp__action_buttons .dp__action_select {
    padding: 14px !important;
}

.dp__action_buttons .dp__action_select {
    background: rgb(var(--v-theme-success)) !important;
}

.dp__range_end,
.dp__range_start,
.dp__active_date {
    background: rgb(var(--v-theme-secondary)) !important;
}

.dp__today {
    border: 1px solid rgb(var(--v-theme-secondary)) !important;
}
.dp__input {
    color: #000000b8;
}
.dp__selection_preview {
    display: none;
}
.removeHidden  .v-card-item__content {
    overflow: visible !important;
}

.error-message {
    color: red;
    font-size: 14px; /* Optional: Adjust font size */
    margin-top: 5px; /* Optional: Add spacing */
}
.image-holder video{
    max-width: 100%;
    width: 100%;
    height: 150px;
    object-fit: cover;
    display: block;
}
</style>