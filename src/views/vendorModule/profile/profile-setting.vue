<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { AlbumIcon, IdIcon, UserIcon, PackageIcon } from "vue-tabler-icons";
import packageIcon from '@/assets/images/website/packageIcon.png'
import imagePath from '@/assets/images/website/packageIcon.png'
import dummyLogo from '@/assets/images/website/packageIcon.png'
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import folderName from '@/assets/images/wedding/No_Image_Available.jpg'
import { SearchIcon, CircleXIcon } from 'vue-tabler-icons';
// import dummyLogo from '@/assets/images/wedding/no-image-available.png'
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

// import { useRouter } from 'vue-router'
// const route = useRouter()
import { useRoute } from 'vue-router'
const route: any = useRoute()
import { router } from '@/router';
const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }




const addbalance = ref(false);
const balanceRadio = ref('80');
const balanceAmount = ref(balanceRadio.value);
watch(balanceRadio, (newVal) => {balanceAmount.value = newVal;});

// New add for packages slider
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
import type { Settings } from 'v-slick-carousel'

const settingsss: Settings = {
    arrows: false,
    dots: false,
    infinite: true, 
    groupsToShow: 1, 
    groupsToScroll: 1,
    slidesPerGroup: 1,
    swipe: true, 
    swipeToSlide: true,
    ignorePrefersReducedMotion: true,
    autoplay: true,
    autoplaySpeed: 2500, 
    speed: 2500,
    vertical: true,
    verticalSwiping: true
}



const profilsetting = ref();
const packages = ref([]);
const profile_img = ref();
const business_logo = ref();
const f_name = ref(['']);
const l_name = ref(['']);
const u_email = ref(['']);
const u_phone = ref(['']);
const ccode = ref(['']);
const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);
const passwordCurrent = ref('');
const passwordNew = ref('');
const passwordConfirm = ref('');
const ppic = ref();
const bpic = ref();
const zipcode = ref();
const city = ref();
const state = ref();
const country = ref();
const extraPackage = ref();
const zipcodeitem = ref([])
const cityitem = ref([])
const stateitem = ref([])
const countryitem = ref([])
const cats = ref([]);
const catItems = ref([]);
const brandValue = ref('Dj Provider');
const venmypack = ref(localStorage.getItem('vpackactive') == 'true');
const statesvalues = ref([]);
const allstateItems = ref([]);
const businesslocation = ref('34Gts Delhi');
const EventCovered = ref('34');
const bdescription = ref('');
const weblinks = ref([]);
const izipcode = ref();
const showsearch = ref(false);
const phonenoRules = ref([(v: string) => {
    if (!v) { return 'Please enter phone number.'; }
    else { return (v.length === 10) ? true : 'Must be 10 digits'; }
}]);
const reqrules   = ref([(v: string) => !!v || 'This field is required']);

const reqrulese = ref([
      (v) => !!v || 'This field is required',
      (v) => /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum|co|in|us|uk|ca|de|jp|fr|au|ru|ch|it|nl|se|no|es|me|tv|io|ly|ai|xyz|tech|site|online|top|club|vip|shop|store|website|space|app|dev|world|today|live|life|news|agency|social|solutions|systems|company|network|digital|media|center|services|consulting|management|support|academy|education|institute|training|finance|bank|insurance|capital|partners|ventures|group|holdings|enterprises|corporation|foundation|association|organization|international|global|community|city|town|village|region|zone|district|state|country|continent|planet|universe|web|earth)$/i.test(v) || 'Please enter a valid email'
    ]);
function checklength(){
    if(u_phone.value) u_phone.value = (u_phone.value.length > 10) ? u_phone.value.slice(0,10).replace(/\D/g, "") : u_phone.value.replace(/\D/g, "");
    if(u_email.value) u_email.value = (u_email.value.length > 100) ? u_email.value.slice(0,100) : u_email.value
}




async function getstate(sel_sid=null) {
  fullpageloader.value = true
  const response = await axios.post('home/getstate', { cid: country.value })
  if (response.data.status == 'SAVED') {
    stateitem.value = response.data.states
    cityitem.value = [] 
    state.value = (sel_sid) ? stateitem.value.find((a:any)=>(a.value===sel_sid)) : null
    city.value = null
    if (!(sel_sid)) zipcode.value = null
    fullpageloader.value = false
    showsearch.value = false
  }
}
async function getcity(sel_cid=null) {
  fullpageloader.value = true
  const response = await axios.post('home/getcity', { sid: state.value })
  if (response.data.status == 'SAVED') {
      cityitem.value = response.data.cities
      city.value = (sel_cid) ? cityitem.value.find((a:any)=>(a.value===sel_cid)) : null
      if (!(sel_cid)) zipcode.value = null
      fullpageloader.value = false
      showsearch.value = false
  }
}

function setzipcode() { zipcodeitem.value = city.value['zipcode'], zipcode.value= city.value['zipcode'][0]}

async function fetch_add(){
    if ((izipcode.value.length == 5) && (/^\d+$/.test(izipcode.value))){
        fullpageloader.value = true
        const response = await axios.post('home/get_location', { zip: izipcode.value })
        if (response.data.status == 'SENT') {
            if (response.data.selcity){
                country.value = response.data.selcountry
                stateitem.value = response.data.states
                cityitem.value = response.data.cities
                state.value = response.data.selstate
                city.value = response.data.selcity
                zipcodeitem.value = city.value['zipcode'], zipcode.value= izipcode.value
                showsearch.value = false
                izipcode.value = null
            } fullpageloader.value = false
        }else{
            showErrorMessage.value = true;
            myerrors.value = 'No cities found!';
            setTimeout(() => { showErrorMessage.value = false; }, 1500);
            fullpageloader.value = false
            izipcode.value = null
        }
    }else {city.value = null; state.value = null; country.value = null; cityitem.value = []; stateitem.value = []; zipcodeitem.value = [], zipcode.value=null}
}

const countrynameIssuanceOpt = ['+1-USA',
  // '+93-AFG', '+355-ALB', '+213-DZA', '+376-AND', '+244-AGO', '+1-ATG', '+54-ARG', '+374-ARM', '+297-AABW', '+61-AUS', '+43-AUT', '+994-AZE', '+1-BHS', '+973-BHR', '+880-BGD', '+1-BRB', '+375-BLR', '+32-BEL', '+501-BLZ', '+229-BEN', '+975-BTN', '+591-BOL', '+387-BIH', '+267-BWA', '+55-BRA', '+673-BRN', '+359-BGR', '+226-BFA', '+257-BDI', '+855-KHM', '+237-CMR', '+1-CAN', '+238-CPV', '+236-CAF', '+235-TCD', '+56-CHL', '+86-CHN', '+57-COL', '+269-COM', '+242-COG', '+682-COK', '+506-CRI', '+225-CIV', '+385-HRV', '+53-CUB', '+357-CYP', '+420-CZE', '+45-DNK', '+253-DJI', '+1-DMA', '+1-DOM', '+593-ECU', '+20-EGY', '+503-SLV', '+240-GNQ', '+291-ERI', '+372-EST', '+251-ETH', '+500-FLK', '+298-FRO', '+679-FJI', '+358-FIN', '+33-FRA', '+689-PYF', '+241-GAB', '+220-GMB', '+995-GEO', '+49-DEU', '+233-GHA', '+350-GIB', '+30-GRC', '+299-GRL', '+1-GRD', '+502-GTM', '+224-GIN', '+245-GNB', '+592-GUY', '+509-HTI', '+504-HND', '+852-HKG', '+36-HUN', '+354-ISL', '+91-IND', '+62-IDN', '+98-IRN', '+964-IRQ', '+353-IRL', '+44-IMN', '+972-ISR', '+39-ITA', '+1-JAM', '+81-JPN', '+962-JOR', '+7-KAZ', '+254-KEN', '+686-KIR', '+383-XKX', '+850-PRK', '+82-KOR', '+965-KWT', '+996-KGZ', '+856-LAO', '+371-LVA', '+961-LBN', '+266-LSO', '+231-LBR', '+218-LBY', '+423-LIE', '+370-LTU', '+352-LUX', '+853-MAC', '+389-MKD', '+261-MDG', '+265-MWI', '+60-MYS', '+960-MDV', '+223-MLI', '+356-MLT', '+692-MHL', '+222-MRT', '+230-MUS', '+262-REU', '+52-MEX', '+691-FSM', '+373-MDA', '+377-MCO', '+976-MNG', '+382-MNE', '+1-MSR', '+212-MAR', '+258-MOZ', '+95-MMR', '+264-NAM', '+674-NRU', '+977-NPL', '+31-NLD', '+599-NLD', '+687-NCL', '+64-NZL', '+505-NIC', '+227-NER', '+234-NGA', '+683-NIU', '+672-NFK', '+47-NOR', '+968-OMN', '+92-PAK', '+680-PLW', '+970-PSE', '+507-PAN', '+675-PNG', '+595-PRY', '+51-PER', '+63-PHL', '+48-POL', '+351-PRT', '+1-PRK', '+974-QAT', '+40-ROU', '+7-RUS', '+250-RWA', '+590-BLM', '+290-SHN', '+1-KNA', '+1-LCA', '+590-MFA', '+508-SPM', '+1-VCT', '+685-WSM', '+378-SMR', '+239-STP', '+966-SAU', '+221-SEN', '+381-SRB', '+248-SYC', '+232-SLE', '+65-SGP', '+599-SXM', '+421-SVK', '+386-SVN', '+677-SLB', '+252-SOM', '+27-ZAF', '+211-SSD', '+34-ESP', '+94-LKA', '+249-SDN', '+597-SUR', '+268-SWZ', '+46-SWE', '+41-CHE', '+963-SYR', '+886-TWN', '+992-TJK', '+255-TZA', '+66-THA', '+670-TLS', '+228-TGO', '+690-TKL', '+676-TON', '+868-TTO', '+216-TUN', '+90-TUR', '+993-TKM', '+688-TUV', '+256-UGA', '+380-UKR', '+971-ARE', '+44-GBR', '+1-USA', '+598-URY', '+998-UZB', '+678-VUT', '+39-VA', '+58-VEN', '+84-VNM', '+681-WLF', '+212-ESH', '+967-YEM', '+260-ZMB', '+263-ZWE'
];

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'custom-tiptap-style',
    }
  },
  extensions: [StarterKit],
  content: ``
});

interface ImageFile {
  url: string;
  file: File;
}

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

const removeImage = (index: number, type: string) => {
  type == 'image' ? productImages.value.splice(index, 1) : productVideos.value.splice(index, 1);
};

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

const items = ref<string[]>([]);
const appendItem = () => {
  if (items.value.length < 4) {
    const newItem = items.value.length + 1;
    console.log(newItem)
    items.value.push(newItem);
  }
};
// const albumCreate = ref(false)
const albumTitle = ref()
const albumId = ref(null)
const imageUpload = ref(false)
const albumlist = ref([])
const fullpageloader = ref(false)
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const myerrors = ref('')


const stepnumver = ref('FourthNextStep')
const bg_img = ref([]);
const user = JSON.parse(localStorage.getItem('user'))
const profile = ref({
  logo: dummyLogo,
  profileImage: (user.profile_pic) ? BASE_URL + user.profile_pic : '/src/assets/images/profile/user-1.jpg',
  blogo: null
})
const videourls1 = ref([]);
const videourls2 = ref([]);
const videourls3 = ref([]);


const createalbum_btn = (action = null) => {

  if (action == 'create_album') {

    imageUpload.value = true
    albumTitle.value = ""
    albumId.value = null
    profile.value.logo = folderName
    category.value = []
    productImages.value.splice(0, productImages.value.length);

  }
  else {
    imageUpload.value = false
  }
}

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

const handleImageUploadd = (event: InputEvent, itype: any) => {
  console.log("itype___________", itype)
  if (itype == 'profile_pic') {
    ppic.value = null
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      profile.value.profileImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        profile.value.profileImage = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
      ppic.value = input.files[0]
    }
  } if (itype == 'business_logo') {
    bpic.value = null
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      profile.value.blogo = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        profile.value.blogo = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
      bpic.value = input.files[0]
    }
  } else {
    //for buissness pics and logos
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      bg_img.value = input.files[0]
      profile.value.logo = input.files[0];
      ppic.value = input.files[0]
      const reader = new FileReader();
      reader.onload = () => {         profile.value.logo = reader.result as string;       };
      reader.readAsDataURL(input.files[0]);
      ppic.value = input.files[0]
    }
  }
};
async function singleAlbumFuc(event = null, action = null, album = null, iurl = null) {
  try {
    const formData = new FormData();
    console.log("event______________", event)
    formData.append("album", event);
    formData.append("action", action);

    if (event){
      const response = await axios.post(`/home/edit_album`, formData, config);
      console.log(response.data, "show_album data response :::::::")
      if (response.data.status === "SAVED") {
        imageUpload.value = true
        const albumData = response.data.show_album[0];
        albumTitle.value = albumData.name;
        albumId.value = albumData.id;
        profile.value.logo = BASE_URL + albumData.album_bckpic;
        bg_img.value = albumData.album_bckpic;
        productImages.value.splice(0, productImages.value.length);
  
        if (albumData.sel_categories) {
          const cityNames = albumData.sel_categories.map(cat => cat.name);
          category.value = cityNames;
        }
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
    }else{ 
      productImages.value = productImages.value.filter((a:any) => (a.url != iurl))
      console.log("productImages.value_____________", productImages.value)
    }

    if (action == "delete_album_data") {
      imageUpload.value = false
    }


  } catch (error) {
    console.error("Error creating album:", error);
  }
}
async function create_album() {
  try {
    console.log(category.value, "category.valuecategory.value")
    console.log(category.value.value, "category.value['value']category.value['value']")
    const formData = new FormData();
    formData.append("album_name", albumTitle.value);
    formData.append("background_photo", bg_img.value);
    formData.append("albumId", albumId.value);

    category.value.forEach(categoryItem => {
      formData.append("category", categoryItem.value);
    });

    for (let i = 0; i < productImages.value.length; i++) {
      formData.append("album_images", productImages.value[i].file);
    }

    const response = await axios.post(`/home/create_album`, formData, config);
    if (response.data.status === "SAVED") {
      console.log("Images added to album successfully");
      productImages.value = [];
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
// async function vendor_fourth_step(emitNext: () => void) {
//   var formdata = new FormData();
//   formdata.append("FourthNextStep", stepnumver.value,)
//   formdata.append("videourls1", videourls1.value,)
//   formdata.append("videourls2", videourls2.value,)
//   formdata.append("videourls3", videourls3.value,)

//   var response = await axios.post(`/home/create_vendor`, formdata, config);
//   console.log("Responce data >>>>", response.data)
//   if (response.data.status == "SAVED") {
//     emitNext();
//     window.location.href = '/vendor-dashboard';

//   }
// }
const category = ref();
const categoryitem = ref([])
const ven_pkg_type = ref('');
const wallet_amt = ref('');


async function basic_detailfirst() {
  fullpageloader.value = true
  const tab:any = window.location.pathname.split('/').pop()
  console.log("route.params.tab_______________", tab)
  if (["basicdetails", "changepassword", "business", "portfolios", "mypackage", "payments"].includes(tab)) profilsetting.value = tab
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
  const response = await axios.post(`/home/vendor_onboard_data`, {}, config);
  console.log("basic_detailfirst_______________________", response.data)
  if (response.data.status == 'SAVED') {
  let ven = response.data.v_profile_data
  let uen = response.data.u_profile_data
    ven_pkg_type.value = response.data.package_buy_status.length > 0 ? response.data.package_buy_status[0].package_type : "";
    packages.value = response.data.packages.map((a:any) => ({
      id: a.id, 
      name: a.name, 
      price: parseFloat(a.price),
      yearly_price: parseFloat(a.yearly_price),
      package_logo: '', description: a.description, 
      status: (ven.mypackage.ptype == a.ptype) ? 'active' : 'unactive',
      isSpecificActive: ven.mypackage.lifetime_pack_status === a.lifetime_pack_status && ven.mypackage.ptype === a.ptype,
      subscrption_toggle: a.subscrption_toggle,
      onetime_toggle: a.onetime_toggle,
      yearly_toggle:a.yearly_toggle,
      lifetime_pack_status:a.lifetime_pack_status,
      show_hide:a.show_hide,
      one_time_price: String(parseFloat(a.one_time_price)),
      lifetime_price:String(parseFloat(a.lifetime_price)),
    }))

    const relevantPack = response.data.packages.find(pack => pack.show_hide === true && pack.lifetime_pack_status === true);
    extraPackage.value = !!relevantPack;

    console.log('check the value of package ---- ',packages.value)
    countryitem.value = response.data.countries
    stateitem.value = response.data.states
    cityitem.value = response.data.cities
    zipcodeitem.value = uen.city.zipcode.map((a:any)=>(a.code))

    f_name.value = uen.user.first_name
    l_name.value = uen.user.last_name
    u_email.value = uen.user.email
    ccode.value = uen.ccode
    zipcode.value = uen.zipcode.code
    u_phone.value = uen.phone
    city.value = { text: uen.city.city, value: uen.city.id }
    state.value = { text: uen.state.state, value: uen.state.id }
    country.value = { text: uen.country.country, value: uen.country.id }
    cats.value = ven.category.map((a:any) => ({ text: a.name, value: a.id }))

    brandValue.value = ven.business_name
    businesslocation.value = ven.location_link
    EventCovered.value = ven.wedding_covered_no
    bdescription.value = ven.business_introduction

    allstateItems.value = response.data.allstates
    statesvalues.value = ven.weddings_states.map((a:any) => ({ text: a.state, value: a.id }))

    profile.value.blogo = ((ven.business_logo) ? BASE_URL + ven.business_logo : '/src/assets/images/profile/user-1.jpg')
    weblinks.value = response.data.v_profile_data.weblinks

    wallet_amt.value= response.data.wallet_amt




    fullpageloader.value = false
  }
  if (response.data.serialized_albums) {
    albumlist.value = response.data.serialized_albums
    console.log(albumlist.value, "albumlist..........")
  }
  if (response.data.category) {
    catItems.value = response.data.category.map(cat => ({
      'text': cat.text,
      'value': cat.value
    }));
    categoryitem.value = response.data.category.map(cat => ({
      'text': cat.text,
      'value': cat.value
    }));
  }
  if (response.data.serialized_videos) {
    const serializedVideos = response.data.serialized_videos;
    serializedVideos.forEach((video, index) => {
      videourls1.value.push(video.vidos_urls[0]);
      videourls2.value.push(video.vidos_urls[1]);
      videourls3.value.push(video.vidos_urls[2]);

    });
  }
}
basic_detailfirst();
function getEditorText(html=true) {
    try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}
async function changep() { //change password
  if (!(ivalidate('C'))){return null}
  fullpageloader.value = true
  const response = await axios.post('home/change_password', { password0: passwordCurrent.value, password1: passwordNew.value, password2: passwordConfirm.value }, config)
  console.log("response_________________", response.data)
  if (response.data.status == 'DONE') {
    showSuccessMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { showSuccessMessage.value = false; }, 3000);
    passwordCurrent.value = null; passwordNew.value = null; passwordConfirm.value = null;
  } else {
    showErrorMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { showErrorMessage.value = false; }, 3000);
  }
  fullpageloader.value = false;
}
async function updprofile() {
  if (!(ivalidate('A'))){return null}
  fullpageloader.value = true
  var fd = new FormData()
  fd.append('f_name', f_name.value)
  fd.append('l_name', l_name.value)
  fd.append('u_email', u_email.value)
  // fd.append('ccode', ccode.value)
  fd.append('u_phone', u_phone.value)
  fd.append('country', country.value['value'])
  fd.append('state', state.value['value'])
  fd.append('city', city.value['value'])
  fd.append('zipcode', zipcode.value)
  fd.append('ppic', ppic.value)

  const response = await axios.post('home/profileupdate', fd, config)
  console.log("response_________________", response.data)
  if (response.data.status == 'DONE') {
    localStorage.setItem('user', JSON.stringify(response.data.cuser));
    showSuccessMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { window.location.reload() }, 2000);
  } else {
    fullpageloader.value= false
    showErrorMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { showErrorMessage.value = false; }, 3000);
  }
}
async function updbuissprofile() {
  if (!(ivalidate('B'))){return null}
  fullpageloader.value = true
  var fd = new FormData()
  fd.append('brandValue', brandValue.value)
  fd.append('businesslocation', businesslocation.value)
  fd.append('EventCovered', EventCovered.value)
  fd.append('editor', getEditorText())
  fd.append('cats', cats.value.map((a:any) => (a.value)))
  fd.append('statesvalues', statesvalues.value.map((a:any) => (a.value)))
  fd.append('bpic', bpic.value)

  const response = await axios.post('home/updbuissprofile', fd, config)
  console.log("response_________________", response.data)
  if (response.data.status == 'DONE') {
    showSuccessMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { window.location.reload() }, 2000);
  } else {
    fullpageloader.value = false
    showErrorMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { showErrorMessage.value = false; }, 3000);
  }
}
const showcancel = ref(false)
async function updatepackage(pid:any,pkg_type:None) {
  fullpageloader.value = true
  const response = await axios.post('home/updatepackage', { 'pid': pid ,'pkg_type':pkg_type}, config)
  console.log("response_________________", response.data)
  if (response.data.status == 'TOPAY') {
    window.location.href = response.data.s_url
    // NOT NEED TO UDPATE LOCALSTORAGE 
    // localStorage.setItem('vpack', response.data.vpack);
    // showSuccessMessage.value = true;
    // myerrors.value = response.data.msg;
    // setTimeout(() => { showSuccessMessage.value = false; window.location.reload() }, 1500);
  }
  else if (response.data.status == 'CANCELLED') {
    // NOT NEED TO UDPATE LOCALSTORAGE 
    // localStorage.setItem('vpack', response.data.vpack);
    showSuccessMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { showSuccessMessage.value = false; window.location.reload() }, 3000);
    fullpageloader.value = false
    showcancel.value = false
  } else {
    fullpageloader.value = false
    showErrorMessage.value = true;
    myerrors.value = response.data.msg;
    setTimeout(() => { showErrorMessage.value = false; }, 3000);
  }
}
function checkeditr() {
  window.setTimeout(() => { if (document.querySelector('.tiptap')) { window.setTimeout(() => { document.querySelector('.tiptap').innerHTML = bdescription.value }, 200) } }
    , 800)
}

const strp_status = ref("");
async function connect_stripe() {
  const formData = new FormData();
  formData.append("user_role", 'vendor');
  var response = await axios.post("/home/create_stripe", formData, config);
  console.log("connect_stripe_response---------", response)
  if (response.data.status == "SENT") { window.location.href = response.data.stripe_url }

}
async function stripe_updatee() {
  try {
    const formData = new FormData();
    const response = await axios.post(`/home/stripe_update`, formData, config);
    const res = response.data.ven_profile
    strp_status.value = res.stripe_status

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
stripe_updatee()


const additionallinks = ref(false);
const editlinks = ref(false);
const Linkfield = ref();
const eLinkId = ref();

// const editLinkfield = ref('www.google.com');
async function handlewlinks(action = 'add', wid: any = null) {
  // const content = (action == 'add') ? Linkfield.value : eLinkfield.value.url;
  if (action == "openedit") {
    Linkfield.value = weblinks.value.filter((a: any) => (a.id == wid))[0].url;
    editlinks.value = true;
    eLinkId.value = wid;
  }
  else {
    const response = await axios.post('/home/handlewlinks', { 'action': action, 'wid': wid, 'content': Linkfield.value })
    if (response.data.status == 'DONE') {
      weblinks.value = response.data.weblinks
      additionallinks.value = false
      editlinks.value = false
      Linkfield.value = ''
    }
  }
}


// async function add_wallet_amount(amount=null) {
//   fullpageloader.value = true;
//   var formdata = new FormData();
//   formdata.append('amount', amount);
//   try {
//       const response = await axios.post(`/home/add_balance`, formdata, config);
//       if (response.data.status === 'SAVED') {window.location.href = response.data.s_url} 
//   } catch (error) { console.error('Error:', error); }
//   finally {console.log("fgt") }
//   }


async function add_wallet_amount(amount = null) {
  if (!amount || amount < 1) {
    return;
  }
  fullpageloader.value = true;
  var formdata = new FormData();
  formdata.append('amount', amount);
  try {
    const response = await axios.post(`/home/add_balance`, formdata, config);
    if (response.data.status === 'SAVED') {
      window.location.href = response.data.s_url;
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log("fgt");
  }
}









function ivalidate(section=null){
  myerrors.value = 'Please fill all required fields!';
  var rslt = false
  if (section == 'A'){
    const isValidphone = phonenoRules.value.every((rule:any) => rule(u_phone.value) === true);
    const checkemail = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum|co|in|us|uk|ca|de|jp|fr|au|ru|ch|it|nl|se|no|es|me|tv|io|ly|ai|xyz|tech|site|online|top|club|vip|shop|store|website|space|app|dev|world|today|live|life|news|agency|social|solutions|systems|company|network|digital|media|center|services|consulting|management|support|academy|education|institute|training|finance|bank|insurance|capital|partners|ventures|group|holdings|enterprises|corporation|foundation|association|organization|international|global|community|city|town|village|region|zone|district|state|country|continent|planet|universe|web|earth)$/i.test(u_email.value)

    rslt = (f_name.value && l_name.value && u_email.value && checkemail && isValidphone && country.value && state.value && city.value && zipcode.value)
  }else if(section == 'B'){
    rslt = (brandValue.value && businesslocation.value && EventCovered.value && getEditorText() && Object.keys(cats.value).length && statesvalues.value)
  }else if(section == 'C'){
    if ((passwordCurrent.value && passwordNew.value && passwordConfirm.value)){
      if (passwordNew.value != passwordConfirm.value){ rslt = false; myerrors.value = 'Passwords not matching!'; }
    }
  }

  if (!(rslt)){
      showErrorMessage.value = true;
      setTimeout(() => {  showErrorMessage.value = false; }, 3000);
  }
  return rslt
}





// Base64 Encode (Simple encryption)
const encrypt = (text) => btoa(text);
// Base64 Decode (Simple decryption)
const decrypt = (text) => {
  try {
    return atob(text);
  } catch {
    return 'basicdetails'; // Default if decoding fails
  }
};

// Get encrypted tab from URL and decode it
const getTabFromURL = () => {
  const pathSegments = window.location.pathname.split('/');
  const encodedTab = pathSegments.length > 2 ? pathSegments[2] : '';
  return encodedTab ? decrypt(encodedTab) : 'basicdetails';
};

// Update URL with encrypted tab value
const updateURL = (tab) => {
  const encryptedTab = encrypt(tab);
  window.history.replaceState(null, '', `/profile-settings/${encryptedTab}`);
};

// Set active tab from URL on page load
onMounted(() => {
  profilsetting.value = getTabFromURL();
});

// Watch for tab changes and update the URL
watch(profilsetting, (newTab) => {
  updateURL(newTab);
});
</script>

<template>
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
  <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
  <v-row class="border-bottom">
    <v-col cols="12" class="border-bottom-custom">
      <h3 class="text-h3 mb-0 border-top">My Profile</h3>
    </v-col>
    <v-col cols="12" md="2" class="border-right removeLine">
      <v-tabs v-model="profilsetting" direction="vertical">
        <v-tab value="basicdetails" color="secondary">
          <UserIcon stroke-width="1.7" width="18" class="v-icon--start" /> Basic Details
        </v-tab>
        <v-tab value="changepassword" color="secondary">
          <LockIcon stroke-width="1.7" width="18" class="v-icon--start" /> My Account
        </v-tab>
        <v-tab value="business" color="secondary" @click="checkeditr()">
          <IdIcon stroke-width="1.7" width="18" class="v-icon--start" /> Business Details
        </v-tab>

        <v-tab value="portfolios" color="secondary">
          <AlbumIcon stroke-width="1.7" width="18" class="v-icon--start" /> Portfolios
        </v-tab>
        <v-tab value="user_wallet" color="secondary">
          <AlbumIcon stroke-width="1.7" width="18" class="v-icon--start" /> My Wallet
        </v-tab>
        <v-tab value="mypackage" color="secondary">
          <PackageIcon stroke-width="1.7" width="18" class="v-icon--start" /> My Subscription
        </v-tab>
        <v-tab value="payments" color="secondary">
          <CreditCardIcon stroke-width="1.7" width="18" class="v-icon--start" /> Payments
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12" md="10" class="border-start">
      <v-window v-model="profilsetting">
        <v-window-item value="basicdetails">
          <v-row>
            <v-col cols="12" class="">
              <div class="border-bottom-custom pa-4">
                <div class="d-sm-flex d-block justify-space-between align-center">
                  <div class="mb-sm-0 mb-1">
                    <h3 class="text-h5"> Basic Details </h3>
                    <p class="text-body-2 font-weight-medium  mb-0 text-13">Update Your Basic Details</p>
                  </div>
                  <div> <v-btn color="primary" class="rounded-sm" @click="updprofile()">Update</v-btn> </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="8" class="order-sm-1 order-2">
              <v-card elevation="0" class="border mb-6">
                <div class="bg-grey200 border-bottom px-4 py-3">
                  <h5 class="font-weight-semibold">Personal Information</h5>
                </div>
                <v-card-item class="pa-4">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-label class="text-subtitle-1 font-weight-medium pb-2">First Name<span class="text-error ma-1">*</span></v-label>
                      <VTextField v-model="f_name"  type="text" maxlength="30"  hide-details="auto" class="mb-3" :rules='reqrules' required
                        placeholder="Enter First Name"></VTextField>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-label class="text-subtitle-1 font-weight-medium pb-2">Last Name<span class="text-error ma-1">*</span></v-label>
                      <VTextField v-model="l_name" type="text" maxlength="30"  hide-details="auto" class="mb-3" :rules='reqrules' required
                        placeholder="Enter Last Name"></VTextField>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div>
                        <v-row class="align-center justify-space-between">
                          <v-col cols="9"> <v-label class="text-subtitle-1 font-weight-medium pb-2">Email<span class="text-error ma-1">*</span></v-label></v-col>
                        </v-row>
                        <VTextField v-model="u_email" maxlength="100" hide-details="auto" type="email" class="mb-3" :rules='reqrulese' required placeholder="Enter Email" @keyup="checklength()">
                        </VTextField>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-label class="text-subtitle-1 font-weight-medium pb-2">Phone Number<span class="text-error ma-1">*</span></v-label>
                      <v-row class="mt-0">
                        <!-- <v-col cols="5" class="pt-0">
                          <v-select v-model="ccode" :items="countrynameIssuanceOpt" item-title="state" item-value="abbr"
                            label="Select" return-object single-line variant="outlined"></v-select>
                        </v-col> -->
                        <v-col cols="12" class="pt-0 ps-0">
                          <VTextField v-model="u_phone" type="text" maxlength="10" hide-details="auto" class="mb-3" :rules='phonenoRules' required placeholder="Enter Phone" @keyup="checklength()"></VTextField>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-item>
              </v-card>
              <v-card elevation="0" class="border mb-6">
                <div class="bg-grey200 border-bottom px-4 py-3">
                  <h5 class="font-weight-semibold">Address</h5>
                </div>
                <v-card-item class="pa-4">
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="">
                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Country<span class="text-error ma-1">*</span></v-label>
                        <v-select v-model="country" :items="countryitem" item-title="text" item-value="value"
                          label="Select Country" single-line variant="outlined" hide-details return-object :rules='reqrules' required
                          @update:modelValue="getstate()"></v-select>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="">
                        <v-label class="text-subtitle-1 font-weight-medium pb-2">State<span class="text-error ma-1">*</span></v-label>

                        <v-select v-model="state" :items="stateitem" item-title="text" item-value="value"
                        label="Select State" single-line variant="outlined" hide-details return-object :rules='reqrules' required
                          @update:modelValue="getcity()">
                        </v-select>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="">
                        <v-label class="text-subtitle-1 font-weight-medium pb-2">City<span class="text-error ma-1">*</span></v-label>
                        <v-select v-model="city" :items="cityitem" item-title="text" item-value="value"
                        label="Select City" single-line variant="outlined" hide-details return-object :rules='reqrules' required @update:modelValue="setzipcode()">
                        </v-select>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0" v-if="showsearch">
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Search zipcode</v-label><span @click="showsearch = !showsearch" class="text-error ma-1"><CircleXIcon width="18" class="v-icon--start" /></span>
                            <VTextField v-model="izipcode" required placeholder="Enter zipcode to search" hide-details @keyup="fetch_add()" maxlength="5"></VTextField>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0" v-else>
                        <div class="">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Zipcode<span
                                    class="text-error ma-1">*</span></v-label><span @click="showsearch = !showsearch" class="text-error ma-1"><SearchIcon width="18"/></span>
                            <!-- <VTextField v-model="zipcode" type="number" hide-details="auto" class="mb-3" required
                                placeholder="Must be 5 digits" 
                                @input=fetch_add()
                                ></VTextField> -->
                            <v-select v-model="zipcode" :items="zipcodeitem" label="Select Zipcode" single-line variant="outlined" hide-details required :rules="reqrules">
                            </v-select>
                        </div>
                    </v-col>
                  </v-row>
                </v-card-item>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4" class="order-sm-2 order-1">
              <v-card elevation="10" class="bg-grey200 sticky-top">
                <v-card-item>
                  <div class="text-center">
                    <div class="imageGroupMain profileGroup">
                      
                      <label for="profilePicInput" class="labelStImgPro d-flex align-end justify-end">
                        <span class="bg-dark ShowPencil d-flex align-center justify-center text-primary">
                          <v-tooltip activator="parent" location="top">Edit Logo</v-tooltip>
                          <PencilIcon stroke-width="2" size="16" class="" />
                        </span>
                        <input type="file" id="profilePicInput" class="d-none"
                          @change="handleImageUploadd($event, 'profile_pic')" accept="image/*">
                      </label>
                      <div class="imageSizeMain">
                        <img :src="profile.profileImage" alt="Uploaded Image" style="max-width: 300px;">
                      </div>
                    </div>
                  </div>
                  <div class="text-center mt-3">
                    <h5 class="font-weight-medium text-h4 mb-1 " data-v-41289019="">{{ f_name }} {{ l_name }}</h5>
                    <h5 class="font-weight-medium mb-1 text-body-2" data-v-41289019="">{{ u_email }}</h5>
                    <h5 class="font-weight-medium mb-1 text-body-2" data-v-41289019="">+1 {{ u_phone }}</h5>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item value="changepassword">
          <v-row>
            <v-col cols="12" class="">
              <div class="border-bottom-custom pa-4">
                <div class="d-sm-flex d-block justify-space-between align-center">
                  <div class="mb-sm-0 mb-1">
                    <h3 class="text-h5">
                      Password & Security
                    </h3>
                    <p class="text-body-2 font-weight-medium  mb-0 text-13">Update Your Password</p>
                  </div>
                  <div>
                    <v-btn color="primary" class="rounded-sm" @click="changep()">Update</v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="8">
              <v-card elevation="0" class="border mb-6">
                <div class="bg-grey200 border-bottom px-4 py-3">
                  <h5 class="font-weight-semibold">Password</h5>
                </div>
                <v-card-item class="pa-4">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Current
                        Password<span class="text-error ma-1">*</span></v-label>
                      <VTextField v-model="passwordCurrent" :rules='reqrules' required hide-details="auto" class="pwdInput"
                        color="primary" variant="outlined" placeholder="*********"
                        :type="showCurrent ? 'text' : 'password'"
                        :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showCurrent = !showCurrent"></VTextField>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">New Password<span class="text-error ma-1">*</span></v-label>
                      <VTextField v-model="passwordNew" :rules='reqrules' required hide-details="auto" class="pwdInput" color="primary"
                        variant="outlined" placeholder="*********" :type="showNew ? 'text' : 'password'"
                        :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showNew = !showNew">
                      </VTextField>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">Confirm New
                        Password<span class="text-error ma-1">*</span></v-label>
                      <VTextField v-model="passwordConfirm" :rules='reqrules' required hide-details="auto" class="pwdInput"
                        color="primary" variant="outlined" placeholder="*********"
                        :type="showConfirm ? 'text' : 'password'"
                        :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showConfirm = !showConfirm"></VTextField>
                    </v-col>
                  </v-row>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item value="business">
          <v-row>
            <v-col cols="12" class="">
              <div class="border-bottom-custom pa-4">
                <div class="d-sm-flex d-block justify-space-between align-center">
                  <div class="mb-sm-0 mb-1">
                    <h3 class="text-h5">
                      Business
                    </h3>
                    <p class="text-body-2 font-weight-medium  mb-0 text-13">Update Your Business Details</p>
                  </div>
                  <div>
                    <v-btn color="primary" class="rounded-sm" @click='updbuissprofile()'>Update</v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="8" class="order-sm-1 order-2">
              <v-card elevation="0" class="border mb-6">
                <div class="bg-grey200 border-bottom px-4 py-3">
                  <h5 class="font-weight-semibold">Business Information</h5>
                </div>
                <v-card-item class="pa-4">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-label class="text-subtitle-1 font-weight-medium pb-2">Category<span class="text-error ma-1">*</span></v-label>
                      <v-select v-model="cats" :items="catItems" item-title="text" item-value="value"
                        label="Select Category" single-line variant="outlined" hide-details return-object :rules='reqrules' required
                        multiple>
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-label class="text-subtitle-1 font-weight-medium pb-2">Your Brand/Business
                        Name<span class="text-error ma-1">*</span></v-label>
                      <VTextField v-model="brandValue" :rules='reqrules' required placeholder="Enter Brand name" hide-details>
                      </VTextField>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-label class="text-subtitle-1 font-weight-medium pb-2">States you've planned weddings
                        in<span class="text-error ma-1">*</span></v-label>
                      <v-select v-model="statesvalues" :items="allstateItems" item-title="text" item-value="value"
                        label="Select Category" single-line variant="outlined" hide-details return-object :rules='reqrules' required
                        multiple>
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-label class="text-subtitle-1 font-weight-medium pb-2">Business Location<span class="text-error ma-1">*</span></v-label>
                      <VTextField v-model="businesslocation" :rules='reqrules' required placeholder="Enter Business Location"
                        hide-details>
                      </VTextField>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-label class="text-subtitle-1 font-weight-medium pb-2">No. of Events We Have covered<span class="text-error ma-1">*</span></v-label>
                      <VTextField v-model="EventCovered" type="number" hide-details="auto" class="mb-3" :rules='reqrules' required
                        placeholder="Enter No. of wedding covered"></VTextField>
                    </v-col>
                    <v-col cols="12" md="12">
                      <div class="">
                        <v-label class="text-subtitle-1 font-weight-medium pb-2">About My
                          Business(Introduction)<span class="text-error ma-1">*</span></v-label>
                        <div class="border rounded">
                          <div v-if="editor">
                            <EditorMenubar :editor="editor" />
                          </div>
                          <editor-content :editor="editor" ref="editorContentRef" />
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-item>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4" class="order-sm-2 order-1">
              <v-card elevation="10" class="bg-grey200 sticky-top">
                <v-card-item>
                  <div class="text-center">
                    <div class="imageGroupMain businessGroup">
                      <label for="businessLogoInput" class="labelStImgPro d-flex align-end justify-end">
                        <span class="bg-dark ShowPencil d-flex align-center justify-center text-primary">
                          <v-tooltip activator="parent" location="top">Edit Logo</v-tooltip>
                          <PencilIcon stroke-width="2" size="16" class="" />
                        </span>
                        <input type="file" id="businessLogoInput" class="d-none"
                          @change="handleImageUploadd($event, 'business_logo')" accept="image/*">
                      </label>
                      <div class="imageSizeMain New">
                        <img :src="profile.blogo" alt="Uploaded Image" style="max-width: 300px;">
                      </div>
                    </div>
                  </div>
                  <div class="text-center mt-3">
                    <h5 class="font-weight-medium text-h4 mb-1 " data-v-41289019="">{{ brandValue }}</h5>
                    <h5 class="font-weight-medium mb-1 text-body-2" data-v-41289019="">{{ u_email }}</h5>
                    <h5 class="font-weight-medium mb-1 text-body-2" data-v-41289019="">+1 {{ u_phone }}</h5>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item value="portfolios">
          <div class="">
            <v-dialog v-model="imageUpload" max-width="900">
              <v-card>
                <v-card-text>
                  <v-label class="text-h5 pb-2">Portfolio Name</v-label>
                  <VTextField v-model="albumTitle" :value="albumTitle" hide-details="auto" class="mb-3" required
                    placeholder="Enter Portfolio Name"></VTextField>
                  <div class="">
                    <h3 class="text-h5 pb-4">Upload Your Cover Photo</h3>
                    <div class="imageGroupMain businessGroup withoutRadius">
                      <label for="logoImageLbl2" class="labelStImgPro ">
                        <input type="file" id="logoImageLbl2" class="d-none" @change="handleImageUploadd"
                          accept="image/*">
                      </label>
                      <div class="imageSizeMain">
                        <img :src="profile.logo" alt="Uploaded Image" style="max-width: 300px;">
                      </div>
                    </div>
                  </div>
                  <h3 class="text-h5 mt-5 mb-3">Upload Your Photos</h3>
                  <div class="">
                    <label for="file-upload" class="labelStyleImage">
                      <input id="file-upload" type="file" multiple @change="uploadImage($event, 'image')"
                        accept="image/*" />
                      <div class="innrContentTitle">
                        <span class="iconTitleUpld d-block text-center">
                          <PlusIcon size="24" />
                        </span>
                        Add New Photos
                      </div>
                    </label>

                    <div class="mainImageRow mt-4" v-if="productImages.length > 0">
                      <div class="image-holder" v-for="(image, index) in productImages" :key="image.id">


                        <!-- <img :ref="'delete_album_image' + image.id" alt="" :src="image.url" /> -->

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



                        <span v-if="image.id"></span>
                        <button type="button" class="btnTrash"
                          @click="singleAlbumFuc(image.id, action = 'delete_album_image', album = image.album, iurl = image.url)">
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

            <div class="">
              <div class="border-bottom-custom pa-4">
                <div class="d-sm-flex d-block justify-space-between align-center">
                  <div class="mb-sm-0 mb-1">
                    <h3 class="text-h5">
                      Portfolios
                    </h3>
                    <p class="text-body-2 font-weight-medium  mb-0 text-13">Add photos of weddings and pre-wedding shot
                      that you've covered.</p>
                  </div>
                  <div>
                    <v-btn color="primary" class="rounded-sm" @click="additionallinks = true; Linkfield = '';">Add Website
                      Links</v-btn>
                    <v-dialog v-model="additionallinks" class="dialog-mw on-top" max-width="500">
                      <v-card class="postion-relative overflow-hidden" elevation="10">
                        <v-card-item class="">
                          <div class="d-flex justify-space-between">
                            <h4 class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary"> Add
                              Additional Links</h4>
                            <v-btn icon color="" @click="additionallinks = false;" flat variant="outlined" size="x-small"
                              class="bg-error">
                              <XIcon width="20" />
                            </v-btn>
                          </div>
                          <v-label class="text-subtitle-1 font-weight-medium pb-2">Add Links</v-label>
                          <v-row class="mb-4">
                            <v-col cols="10" class="pb-0">
                              <VTextField v-model="Linkfield" hide-details="auto" class="mb-3" required
                                placeholder="Enter website Link"></VTextField>
                            </v-col>
                            <v-col cols="2" class="d-flex align-center">
                              <v-btn color="error" variant="flat" size="small" class="me-2 rounded-sm h-100"
                                @click="Linkfield = ''">
                                <TrashIcon size="14" />
                              </v-btn>
                            </v-col>
                          </v-row>
                          <div class="d-flex justify-start pb-5">
                            <v-btn color="success" class="rounded-sm" @click="handlewlinks()">Add</v-btn>
                          </div>
                        </v-card-item>
                      </v-card>
                    </v-dialog>
                  </div>
                </div>
              </div>
              <v-row>
                <v-col cols="12" :md="weblinks.length ? '8' : '12'" class="border-right">
                  <v-row class="mt-4">
                    <v-col cols="12" :sm="albumlist.length > 0 ? '6' : '12'" :md="albumlist.length > 0 ? '4' : '12'">
                      <label class="labelStyleImage h-100" @click="createalbum_btn('create_album')">
                        <div class="innrContentTitle">
                          <span class="iconTitleUpld d-block text-center">
                            <PlusIcon size="24" />
                          </span>
                          Add New Portfolio
                        </div>
                      </label>
                    </v-col>

                    <!-- get_album_data -->


                    <template v-if="albumlist.length > 0">
                      <v-col cols="12" sm="6" md="4" v-for="(album, index) in albumlist" :key="album.id">

                        <v-card elevation="10" class="vendor-card-background d-flex align-end overflow-hidden" :style="{
                          backgroundImage: album.album_bckpic ? `url(${BASE_URL + album.album_bckpic})` : `url(${folderName})`
                        }">

                          <!-- Content goes here -->
                          <div class="buttonGroupMain">
                            <div class="btnMainCol">
                              <v-btn color="success" size="small" @click="singleAlbumFuc(album.id, 'get_album_data')">
                                <PencilIcon size="18" color="white" class="me-1" /> Edit
                              </v-btn>
                            </div>
                            <div class="btnMainCol">
                              <v-btn color="error" size="small" @click="singleAlbumFuc(album.id, 'delete_album_data')">
                                <TrashIcon size="18" color="white" class="me-1" /> Delete
                              </v-btn>
                            </div>
                          </div>
                          <div class="pa-6 text-left text-white position-relative">
                            <h3 class="text-h6 text-no-wrap font-weight-semibold text-white mb-1">{{ album.name }}</h3>
                            <p class="mb-0 text-subtitle-1">{{ album.image_urls.length }} Photos</p>
                          </div>
                        </v-card>
                      </v-col>
                    </template>




                  </v-row>
                </v-col>
                <v-col cols="12" md="4" v-if="weblinks.length" class="website-col scroll-style">
                  <h3 class="text-h5 py-4 ps-4">
                    Website Links
                  </h3>
                  <div class="pa-2" v-for="link in weblinks" :key="index">



                    <v-card elevation="10" rounded="md" class="bg-grey200 border">
                      <v-card-item class="pa-5">
                        <a class="text-decoration-none" :href="link.url" target="_blank">
                          <h5 class="text-body-3 mb-2 font-weight-semibold text-dark">{{ link.url }}</h5>
                        </a>
                        <div class="d-flex">

                          <v-btn color="secondary" variant="flat" size="small" class="me-1 rounded-sm"
                            @click="handlewlinks('openedit', link.id)">
                            <EditIcon size="14" />
                          </v-btn>

                          <v-btn color="error" variant="flat" size="small" class="rounded-sm"
                            @click="handlewlinks('del', link.id)">
                            <TrashIcon size="14" />
                          </v-btn>
                        </div>
                      </v-card-item>
                    </v-card>




                  </div>
                  <v-dialog v-model="editlinks" class="dialog-mw on-top" max-width="500">
                    <v-card class="postion-relative overflow-hidden" elevation="10">
                      <v-card-item class="">
                        <div class="d-flex justify-space-between">
                          <h4 class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary"> Edit
                            Additional Links</h4>
                          <v-btn icon color="" @click="editlinks = false;" flat variant="outlined" size="x-small"
                            class="bg-error">
                            <XIcon width="20" />
                          </v-btn>
                        </div>
                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Edit Link</v-label>
                        <v-row class="mb-4">
                          <v-col cols="12" class="pb-0">
                            <VTextField v-model="Linkfield" hide-details="auto" class="mb-3" required
                              placeholder="Enter website Link"></VTextField>
                          </v-col>
                        </v-row>

                        <div class="d-flex justify-start pb-5">
                          <v-btn color="success" class="rounded-sm" @click="handlewlinks('edt', eLinkId)">Update</v-btn>
                        </div>
                      </v-card-item>
                    </v-card>
                  </v-dialog>


                </v-col>
              </v-row>
            </div>

          </div>
        </v-window-item>
        <v-window-item value="user_wallet">
          <v-row>
            <v-col cols="12" class="">
              <div class="border-bottom-custom pa-4">
                <div class="d-sm-flex d-block justify-space-between align-center">
                  <div class="mb-sm-0 mb-1">
                    <h3 class="text-h5">
                      My Wallet
                    </h3>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-4 px-2">
            <v-col cols="12" md="12" sm="12" class="mb-md-0 mb-10">
              <div>
                <v-card elevation="10" class="mb-4 bg-grey100">
                  <v-card-text>
                    <v-row class="d-flex justify-space-between align-center py-4">
                      <v-col cols="12" md="7">
                        <h3 class="text-h5 mb-1">Available Balance</h3>
                        <p class="text-h5 mb-1">${{ wallet_amt }}</p>
                        <p>Wallet money can be used for unlocking all Bookings,Customers information </p>
                      </v-col>
                     
                      <v-col cols="12" md="5" class="text-md-end text-start">
                        <v-dialog v-model="addbalance" scrollable class="dialog-mw" max-width="500">
                          <template v-slot:activator="{ props }">
                            <v-btn color="primary" v-bind="props" flat> Add Balance </v-btn>
                          </template>
                          <v-card>
                            <v-card-title class="py-4">Add Balance</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text >
                              <div>
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Enter Amount<span class="text-error ma-1"></span></v-label>
                                <VTextField v-model="balanceAmount"
                                 :rules="[amount => amount >= 1 || 'Amount must be at least 1']"
                                 type="text"
                                  maxlength="10" hide-details="auto" class="mb-3" placeholder="Enter Amount"></VTextField>
                              </div>
                              <v-radio-group inline hide-details v-model="balanceRadio" class="d-flex justify-start balanceRadio">
                                <label for="radio1" class="py-0 px-2 ps-0 text-primary d-flex align-center">
                                  <v-radio id="radio1" color="primary" value="50" size="small"></v-radio>
                                  <span>
                                    $50

                                  </span>
                                </label>

                                <label for="radio3" class="py-0 pb-3 px-2 ps-0 text-primary d-flex align-center position-relative overflow-hidden">
                                  <v-radio selected id="radio3" color="primary" value="80" size="small"></v-radio>
                                  <span>
                                    $80
                                  </span>
                                  <span class="bg-primary popTag">
                                    Popular
                                  </span>
                                </label>

                                <label for="radio2" class="py-0 px-2 ps-0 text-primary d-flex align-center">
                                  <v-radio id="radio2" color="primary" value="100" size="small"></v-radio>
                                  <span >
                                    $100

                                  </span>
                                </label>

                              </v-radio-group>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions class="justify-end d-flex">
                              <v-btn color="error"  @click="addbalance = false">
                                Close
                              </v-btn>
                              <v-btn color="primary" class="bg-primary"   @click="add_wallet_amount(balanceAmount)">
                                Add Balance
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-col>

                      <template>
                        <v-container>
                          <v-row>
                            <v-col cols="12" md="5" class="text-md-end text-start">
                              <v-btn color="secondary" size="large" @click="dialog = true">
                                Add Balance
                              </v-btn>
                            </v-col>
                          </v-row>

                          <!-- Dialog for Adding Balance -->
                          <v-dialog v-model="dialog" max-width="400">
                            <v-card>
                              <v-card-title class="text-h5">Add Balance</v-card-title>
                              <v-card-text>
                                <v-row justify="center" class="mt-2">
                                  <v-btn v-for="amount in [100, 200, 300]" :key="amount" class="ma-2" color="primary" @click="selectAmount(amount)">
                                    {{ amount }}
                                  </v-btn>
                                  <v-btn class="ma-2" color="success" @click="customInput = true">
                                    +
                                  </v-btn>
                                </v-row>
                                <v-text-field v-if="customInput" v-model="customAmount" label="Enter Custom Amount" type="number"></v-text-field>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="grey" @click="dialog = false">Cancel</v-btn>
                                <v-btn color="green" @click="confirmAmount">Confirm</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-container>
                      </template>

                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>




          </v-row>
        </v-window-item>

        <v-window-item value="mypackage">


          <v-row>
            <v-col cols="10" class="">
              <div class="border-bottom-custom pa-4">
                <div class="d-sm-flex d-block justify-space-between align-center">
                  <div class="mb-sm-0 mb-1">
                    <h3 class="text-h5">
                      My Subscription
                    </h3>
                    <p class="text-body-2 font-weight-medium  mb-0 text-13">Your Selected Subscription</p>
                   
                  </div>
                  <!-- <div> <v-btn color="primary" class="rounded-sm">Update</v-btn> </div> -->
                </div>
              </div>
            </v-col>
           

           

            <template v-if="ven_pkg_type == 'subscription'">
             
            <v-col cols="2" lg="" class="mb-md-0 mb-10" v-if="venmypack">
              <v-btn color="error" variant="flat" class="d-block py-1 rounded-sm textPrimary" size="small" @click="showcancel=!showcancel">Cancel Subscription</v-btn>
              <v-dialog v-model="showcancel" class="dialog-mw on-top" max-width="500">
                <v-card class="postion-relative overflow-hidden" elevation="10">
                  <v-card-item class="">
                    <div class="d-flex justify-space-between  border-bottom border-danger">
                      <h4 class="text-subtitle-3 mb-5 text-no-wrap font-weight-semibold textSecondary">Cancel package subscription</h4>
                      <v-btn icon color="" @click="showcancel = false" flat variant="outlined" size="x-small"
                        class="bg-error">
                        <XIcon width="20" />
                      </v-btn>
                    </div>
                    <p class="text-subtitle-1 font-weight-medium py-5">Are you sure you want to cancel your subscription? You will lose your access to our services. </p>
                    <div class="d-flex justify-end pb-5">
                      <v-btn color="error" class="rounded-sm" @click="updatepackage('cancelit','pkg_type')">Yes, I'm sure</v-btn>
                      <v-btn color="primary" class="rounded-sm mx-3" @click="showcancel = false">No, take me back</v-btn>
                    </div>
                  </v-card-item>
                </v-card>
              </v-dialog>
            </v-col>

          </template>
          </v-row>
       
          <v-row justify="center" class="mt-14 packageDesign mb-10 px-lg-0 px-10">

            <template v-for="pack in packages" :key="pack.id" >
              <v-col v-if="pack.show_hide" cols="12" :md="extraPackage ? 3 : 4" :class="extraPackage ? 'mb-md-0 mb-10 cardPrice extrapackageStyle' : 'mb-md-0 mb-10 cardPrice'" class="mb-md-0 mb-10 cardPrice">
             <div >

               <v-card class="pricing-card pricing-card-new pb-4 overflow-hidden bg-lightprimary border border-primary" elevation="10">
                 <!-- :class="{ 'bg-dark activePack': pack.status === 'active' }"> -->
                 <div class="wpo-pricing-itemm">
                   <div class="wpo-pricing-top signUp rounded">
                     <div class="wpo-pricing-img signUp "> <img :src="packageIcon" alt="" class="w-100"> </div>
                     <div class="">
                       <h4
                         class="text-subtitle-3 font-weight-semibold textSecondary mt-3 text-start forCenter">
                         {{ pack.name }}</h4>

                          <div class="my-3">                                         
                            <div class="carousel">
                                <VSlickCarousel v-bind="settingsss">
                                <h2 v-if="pack.onetime_toggle == true" class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.one_time_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">One Time Payment</span>
                                </h2>
                                <h2 v-if="pack.subscrption_toggle == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Automatically charged ${{ pack.price }} /month </span>
                                </h2>
                                <h2 v-if="pack.yearly_toggle == true" class="dabbe d-flex flex-column custom-size-font text-no-wrap  font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.yearly_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Annual Subscription price</span>
                                </h2>
                                <h2 v-if="pack.lifetime_membership == true" class="dabbe d-flex flex-column custom-size-font   font-weight-semibold textSecondary forCenter text-start" :class="{ 'text-primary': pack.status === 'active' }">${{ pack.lifetime_price }}<span class="text-10" :class="{ 'text-primary': pack.status === 'active' }">Lifetime Membership                                                        : ${{ pack.lifetime_price }} </span>
                                </h2>
                                </VSlickCarousel>
                            </div>                   
                          </div>

                         <div class="py-3 d-flex justify-start flex-column gap-2">
                           <v-btn color="primary" v-if="pack.isSpecificActive" 
                           variant="flat"
                             class="d-block py-1 rounded-sm textPrimary" size="small" disabled>
                           Active Package
                           </v-btn>
                           <template  v-else>
                             <v-btn color="primary"  @click="updatepackage(pack.id,'one_time_payment')"  variant="flat" class="d-block py-1 rounded-sm pkgbtn" size="small">
                               One Time Payment
                               <v-tooltip activator="parent" location="top">Make a single, fixed payment with no recurring charges. <br> Ideal for those who prefer a one-time cost.</v-tooltip>
                             </v-btn>

                             <v-btn color="primary"  @click="updatepackage(pack.id,'subscription')"  variant="flat" class="d-block py-1 rounded-sm pkgbtn" size="small">
                               Monthly Subscription
                               <v-tooltip activator="parent" location="top" >This option will deduct a monthly payment from your account,<br> making it ideal for those who prefer a regular, ongoing payment plan.</v-tooltip>
                             </v-btn>

                             <v-btn color="primary"  variant="flat" class="d-block py-1 rounded-sm pkgbtn" size="small"  @click="updatepackage(pack.id,'one_time_payment_yearly')">
                               Annual Subscription
                               <v-tooltip activator="parent" location="top" >Make a single, fixed annual payment with no recurring monthly charges.<br> Perfect for those who prefer the convenience of a yearly subscription.</v-tooltip>
                             </v-btn>
                       
                             <v-btn color="primary"  @click="updatepackage(pack.id,'lifetime_membership')"  variant="flat" class="d-block py-1 rounded-sm pkgbtn" size="small">
                               Lifetime Yearly Membership
                               <v-tooltip activator="parent" location="bottom">This option offers unlimited access with a fixed annual payment of $600 for life. <br>Ideal for those who value long-term benefits and prefer consistent, predictable<br> costs without any changes.</v-tooltip>
                             </v-btn>
                           </template>
                         </div>
                     </div>
                   </div>
                   <div class="px-5 py-3 pack-des font-weight-medium text-start forCenter">
                     <div v-html="pack.description" class="styleforEditorcode"></div>
                   </div>
                 </div>
               </v-card>
             </div>
           </v-col>

            </template>

           



          </v-row>
        </v-window-item>
        <v-window-item value="payments">
          <v-row>
            <v-col cols="12" class="">
              <div class="border-bottom-custom pa-4">
                <div class="d-sm-flex d-block justify-space-between align-center">
                  <div class="mb-sm-0 mb-1">
                    <h3 class="text-h5">
                      Payments
                    </h3>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-4 px-2">


            <v-col cols="12" md="12" sm="12" class="mb-md-0 mb-10">
              <div>
                <v-card elevation="10" class="mb-4 bg-grey100">
                  <v-card-text>
                    <v-row class="d-flex justify-space-between align-center py-4">
                      <v-col cols="12" md="7">
                        <h3 class="text-h5 mb-1">Stripe</h3>
                        <p>Easily Collect credit card payments with Stripe. For getting started and more information</p>
                      </v-col>
                      <!-- <v-col cols="5" class="text-end">
                        <v-btn color="secondary" size="small"> Connect With Stripe
                        </v-btn>
                      </v-col> -->

                      <v-col cols="12" md="5" class="text-md-end text-start" v-if="strp_status == 'verified'">
                        <v-btn color="primary" size="large">Connected</v-btn>
                      </v-col>
                      <v-col cols="12" md="5" class="text-md-end text-start" v-else-if="strp_status == 'pending'">
                        <v-btn color="success" size="large" @click="connect_stripe()">Continue connecting</v-btn>
                      </v-col>
                      <v-col cols="12" md="5" class="text-md-end text-start" v-else="strp_status == 'none'">
                        <v-btn color="secondary" size="large" @click="connect_stripe()">Connect With Stripe</v-btn>
                      </v-col>

                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>




          </v-row>
        </v-window-item>
      </v-window>

    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.border-right {
  border-right: 1px solid #efefef;
}

.border-bottom-custom {
  border-bottom: 1px solid #efefef;
}

.v-slide-group--vertical .v-tab__slider {
  opacity: 0 !important;
}

.v-tabs .v-slide-group-item--active {
  background: rgb(var(--v-theme-primary));
  color: #fff !important;
  font-weight: 400 !important;
}

.v-tabs .v-slide-group-item--active .v-btn__content {
  color: #fff;
}

.v-slide-group--vertical .v-tab {
  font-size: 13px;
  font-weight: 500;
}

.ShowPencil {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.sticky-top {
  position: sticky;
  top: 0px;
}

.imageSizeMain.New img {
  object-fit: cover;
}




// package se phale

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

.innrContentTitle {
  font-size: 16px;
}

// Package new code start here
.imageSizeMain {
  width: 90px;
  height: 90px;
}

.wpo-pricing-img.signUp {
      width: 60px;
    height: 60px;
    padding: 4px;
    position: relative;
    background: #131314;
    box-shadow: 0 0 30px #0000001f;
    overflow: hidden;
}

.wpo-pricing-img.signUp img,
.packselectimg img {
  height: 100%;
  object-fit: cover;
}

.wpo-pricing-top.signUp {
  padding: 25px;
}
.pricing-card{
      box-shadow: 0 0 30px #00000024 !important;
    border-radius: 15px !important;
}
.pricing-card-new {
  // border: 2px solid #171718;
  box-shadow: 0 0 30px #0000001f !important;

}

.custom-size-font {
  font-size: 25px;
}

.custom-size-font span {
  font-size: 14px;
}

.pack-des p {
  font-size: 13px;
}

.pack-des {
  font-size: 13px;
  padding: 4px 0px;
}

.activePack .pack-des {
  color: rgb(var(--v-theme-primary)) !important;
  border-bottom: 1px solid #00000017;
}

.activePack .wpo-pricing-top {
  border-bottom: 1px solid #00000017;
}

.packageDesign .cardPrice:nth-child(2) .pricing-card-new {
  background: #131314 !important;
    transform: scale(1.1);
    position: relative;
    z-index: 1;
}
.packageDesign .cardPrice:nth-child(2) .pricing-card-new .pkgbtn{
   background: rgb(var(--v-theme-primary)) !important; 
}
.packageDesign .cardPrice:nth-child(2) .wpo-pricing-top {
    border-bottom: 1px solid #cccccc42;
}
.packageDesign .cardPrice:nth-child(2) .forCenter {
    color: #fff !important;
}
.styleforEditorcode {
  font-size: 12px;
}
.packageDesign .cardPrice:nth-child(2) .pricing-card-new .wpo-pricing-img.signUp{
  background: #353535 !important;
}

.website-col{
  height: 100vh;
  overflow-y: scroll;
}
.pkgbtn {
    background: #131314 !important;
}

.packageDesign .cardPrice:nth-child(2) .RecuText{
  color: #fff !important;
  font-weight: 500;
}


.packageDesign .cardPrice.extrapackageStyle:nth-child(2) .pricing-card-new{
  transform: scale(1);
}
.extrapackageStyle .styleforEditorcode {
  font-size: 12px;
}
.extrapackageStyle .pack-name {
  font-size: 20px;
}
.balanceRadio label{
  border: 1px solid #b4801c;
  border-radius: 10px;
  margin-right: 5px;
}
.balanceRadio input[type="radio"]:checked + span {
    color: white;
    background-color: #1976D2; /* Primary background color */
    border-color: #1976D2;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 6px;
}
.popTag {
    position: absolute;
    font-size: 9px;
    padding: 1px 10px !important;
    bottom: 0;
    width:100%;
    text-align: center;
}
.image-holder video{
    max-width: 100%;
    width: 100%;
    height: 150px;
    object-fit: cover;
    display: block;
}
</style>
