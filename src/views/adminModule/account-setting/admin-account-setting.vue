<script setup lang="ts">
import { ref,watch, onMounted } from 'vue';
import { UserCircleIcon,ArticleIcon } from 'vue-tabler-icons';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar'


import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const tab                   = ref(null);



watch(tab, (newTab) => {
  router.push({ query: { tab: newTab } }); // Push tab to the URL
});

onMounted(() => {
  if (route.query.tab) {
    tab.value = route.query.tab;
  }
});


const adminValue            = ref();
const adminPacks            = ref([]);
const vendorValue           = ref();
const vendorPacks           = ref([]);

const categorySortadmin     = ref([]);
const categorySortvendor    = ref([]);
const categoryItems         = ref([]);
const config                = { headers:{'Content-Type':'application/json'}, withCredentials:true }
const ipic                  = JSON.parse(localStorage.getItem('user')).profile_pic
const upic                  = (ipic) ? BASE_URL + ipic : '/src/assets/images/profile/user-1.jpg'

const fullpageloader        = ref(false)
const showSuccessMessage    = ref(false)
const showErrorMessage      = ref(false)
const myerrors              = ref('')
const currentpwd            = ref('');
const newpwd                = ref('');
const confirmpwd            = ref('');
const show2                 = ref(false);
const show3                 = ref(false);
const show4                 = ref(false);

const imagePreview          = ref<HTMLImageElement | null>(null);

const handleImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
        if (imagePreview.value) {
            imagePreview.value.src = reader.result as string;
        }
    };
    reader.readAsDataURL(file);
    changepic({pic:file})
  }
};
const resetImagePreview = async () => {
    if (imagePreview.value) { imagePreview.value.src = upic; }
    const input = document.getElementById('imageInput') as HTMLInputElement;
    if (input) { input.value = ''; }
    changepic({reset:true})
};
async function changepic(data){
    const response = await axios.post('home/update_pic', data, {headers:{'Content-Type':'multipart/form-data'}, withCredentials:true})
    fullpageloader.value = true
    if (response.data.status == 'SAVED'){ 
        localStorage.setItem('user',JSON.stringify(response.data.user)); 
        showSuccessMessage.value = true;
        myerrors.value = 'Image updated.';
        setTimeout(() => { window.location.reload();}, 1500); 
    }
}
async function changep(){
    if (!(ivalidate('B'))){return null}
    const response = await axios.post('home/change_password', {password0:currentpwd.value, password1:newpwd.value, password2:confirmpwd.value}, config)
    console.log("response_________________", response.data)
    if (response.data.status == 'DONE'){
        showSuccessMessage.value = true;
        myerrors.value = response.data.msg;
        setTimeout(() => { showSuccessMessage.value = false; }, 3000); 
    }else{
        showErrorMessage.value = true;
        myerrors.value = response.data.msg;
        setTimeout(() => { showErrorMessage.value = false; }, 3000); 
    }
}

function ivalidate(section=null){
    myerrors.value = 'Please fill all required fields!';
    var rslt = false
    if(section == 'B'){
        if (!(currentpwd.value && newpwd.value && confirmpwd.value)){ myerrors.value = 'Please fill all required fields!'; rslt = false }
        else if (newpwd.value != confirmpwd.value){ myerrors.value = 'Passwords not matching!'; rslt = false }
        else rslt = true
    }
    if (!(rslt)){ showErrorMessage.value = true; setTimeout(() => {  showErrorMessage.value = false; }, 3000); }
    return rslt
}


        //   fr admin 

const strp_status = ref("");
async function connect_stripe() {
  const formData = new FormData();
  formData.append("user_role", 'admin');
  fullpageloader.value = true
  var response = await axios.post("/home/create_stripe", formData, config);
  console.log("connect_stripe_response---------", response)
  if (response.data.status == "SENT")
  { window.location.href = response.data.stripe_url }

}
const current_role = ref(""); 
async function stripe_updatee() {
  try {
    const formData = new FormData();
    fullpageloader.value = true
    const response = await axios.post(`/home/stripe_update`, formData, config);
    const res = response.data.ven_profile

    strp_status.value = res.stripe_status
    current_role.value=response.data.current_role
    fullpageloader.value=false; 
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
stripe_updatee()

const matchrules          = ref([ (v: string) => {
    if (!v) { return 'This field is required.'; } else {  return (v === newpwd.value) ? true : 'Passwords does not match';  }
}]);

const reqrules   = ref([(v: string) => !!v || 'This field is required']);




(async function () {
    const response = await axios.get(`/home/get_catsnpacks?${new URLSearchParams({cat:'', pad:'', pvn:''})}`)
    // categoryItems.value = [{'text':'All', 'value':0}].concat(response.data.cats.map((a:any)=>({'text':a.name, 'value':a.id, 'budget':a.budget})))
    categoryItems.value = response.data.cats.map((a:any)=>({
        'text': `${a.name} (${a.packages_count})`,
        'name': a.name,
        'id': a.id,
         'value':a.id,
         'price':a.price,
         'pic':a.pic ? BASE_URL + a.pic : '',

        }))
    let paid = response.data.popular_adm.map((a:any)=>(parseInt(a.category.id)))
    categorySortadmin.value = categoryItems.value.map((a:any)=>  { if (paid.includes(parseInt(a.value))) {return a.value}  }).filter(a => a !== undefined);
    searchpacks(true, response.data.popular_adm.map((a:any)=>(parseInt(a.id))))

    let vpaid = response.data.popular_ven.map((a:any)=>(parseInt(a.category.id)))
    categorySortvendor.value = categoryItems.value.map((a:any)=>  { if (vpaid.includes(parseInt(a.value))) {return a.value}  }).filter(a => a !== undefined);
    searchpacks(false, response.data.popular_ven.map((a:any)=>(parseInt(a.id))))
})();

async function searchpacks(admin:any=false, ipaid:any=[]) {
    fullpageloader.value = true
    const fd = new FormData();
    fd.append("rol", (admin) ? 'Admin' : 'Vendor')
    fd.append("cats", (admin) ? ((categorySortadmin.value) ? categorySortadmin.value : '') : ((categorySortvendor.value) ? categorySortvendor.value : '' ))
    const response = await axios.post(`/home/searchpacks`, fd, config);
    console.log("response__________", response.data)
    if (response.data.status == 'SENT') { 
        let list = response.data.packs.map((a:any)=>({'text':a.name, 'value':a.id}))
        if (admin) { 
            adminPacks.value = list
            adminValue.value = []
            if (ipaid){     adminValue.value = list.map((a:any)=> { if (ipaid.includes(parseInt(a.value))) {return a.value}  }).filter(a => a !== undefined);    }
        } else { 
            vendorPacks.value = list 
            vendorValue.value = []
            if (ipaid){     vendorValue.value = list.map((a:any)=> { if (ipaid.includes(parseInt(a.value))) {return a.value}  }).filter(a => a !== undefined);    }
        }
        fullpageloader.value        = false; 
    }
}

async function makepopular(admin:any=false) {
    let pack = (admin) ? adminValue.value : vendorValue.value
    if (pack.length > 6) {
        showErrorMessage.value = true;
        myerrors.value = "You cannot add more than 6 packages.";
        setTimeout(() => { showErrorMessage.value = false; }, 3000);
        return;
    }
    fullpageloader.value = true
    const fd = new FormData();
    console.log("pack.value___________", pack, pack.length)
    fd.append("role", (admin) ? 'Admin' : 'Vendor')
    fd.append("pack", pack)
    const response = await axios.post(`/home/makepopular`, fd, config);
    console.log("response__________", response.data)
    if (response.data.status == 'UPDATED') { 
        fullpageloader.value = false
        showSuccessMessage.value = true;
        myerrors.value = 'Popular packs updated!';
        setTimeout(() => { showSuccessMessage.value = false; }, 3000);
    }
}

const editcatdialog = ref(false);
import user1 from "@/assets/images/profile/user-1.jpg";
const imageUrl = ref(user1); 
const category_file = ref(); 


interface Category {
  text: string;
  price: number;
  id: number;
  pic: string;
}

const selectedCategory = ref<Category | null>(null);
const openEditDialog = (item: Category) => {
  selectedCategory.value = { ...item };
  editcatdialog.value = true;
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && selectedCategory.value) {
    selectedCategory.value.pic = file;  // Store the file for upload
    selectedCategory.value.previewPic = URL.createObjectURL(file);  // Show preview
  }
};

async function update_category(name: string | null, price: number | null, pic: File | string, category_id: number | null) {
  fullpageloader.value = true;
  const formdata = new FormData();
  formdata.append('update_category', 'update_category');

  if (name) formdata.append('name', name);
  if (price !== null) formdata.append('price', price.toString());
  if (category_id !== null) formdata.append('category_id', category_id.toString());
  if (pic instanceof File) {formdata.append('pic', pic);}

  try {
    const response = await axios.post(`/home/update_pic`, formdata, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    if (response.data.status === 'SAVED') {
      editcatdialog.value = false; 
      myerrors.value = "Category updated successfully!";
      showSuccessMessage.value = true;

      if (response.data.category && response.data.category.pic) {
        selectedCategory.value.pic = response.data.category.pic;
        selectedCategory.value.previewPic = response.data.category.pic;
      }

      fullpageloader.value = false;
      setTimeout(() => {
        showSuccessMessage.value = false;
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    console.error('Error updating category:', error);
  } finally {
    fullpageloader.value = false;
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
    <v-row class="justify-center">
        <!--Account Settings tabs-->
        <v-col cols="12" md="12">
            <v-card elevation="10" class="bg-grey100" rounded="md">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="8"> <v-card-title class="text-h4">Account Settings</v-card-title></v-col>
                    </v-row>
                    <v-tabs v-model="tab" bg-color="transparent" min-height="60" height="60" color="secondary"
                        class="d-flex justify-end mt-3">
                        <v-tab value="Account" class="text-medium-emphasis text-11 font-weight-medium">
                            <UserCircleIcon class="mr-2" size="20" /> Account
                        </v-tab>
                        <v-tab value="Popular_packages" class="text-medium-emphasis text-11 font-weight-medium">
                            <PackageIcon class="mr-2" size="20" /> Popular Packages
                        </v-tab>
                        <v-tab value="All_categories" class="text-medium-emphasis text-11 font-weight-medium">
                            <PackageIcon class="mr-2" size="20" />All Categories
                        </v-tab>
                    </v-tabs>
                    <v-window v-model="tab" class="mt-3">
                        <v-window-item value="Account">
                            <v-row class="ma-sm-n2 ma-n1">
                                <v-col cols="12" sm="6">
                                    <v-card elevation="10" class="mb-3">
                                        <v-card-item class="pa-sm-6 pa-3">
                                            <h5 class="text-h5 ">Change Profile</h5>
                                            <div class="text-subtitle-1 text-medium-emphasis mt-2">Change your profile
                                                picture from here</div>
                                            <div class="text-center mt-6 mb-6 d-flex align-center justify-center">
                                                <div class="position-relative">
                                                    <v-avatar size="120">
                                                        <img ref="imagePreview" :src="upic" height="120" alt="image" />
                                                    </v-avatar>
                                                    <label for="imageInput"
                                                        class="labelStImgPro2 d-flex align-center justify-center">
                                                        <p variant="flat" icon size="small" color="grey200">
                                                            <v-tooltip activator="parent" location="top">Edit
                                                                Logo</v-tooltip>
                                                            <PencilIcon stroke-width="2" size="16" class="text-white" />
                                                        </p>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="d-flex justify-center">
                                                <input type="file" id="imageInput" accept="image/*" class="d-none"
                                                    @change="handleImageUpload" />
                                                <label for="imageInput" class="mx-2 v-btn v-btn--outlined">
                                                    <a
                                                        class="v-btn v-btn--flat v-theme--BLUE_THEME bg-secondary v-btn--density-default v-btn--size-small v-btn--variant-elevated ">
                                                        Upload
                                                    </a>
                                                </label>
                                                <v-btn color="error" class="mx-2" variant="outlined" flat
                                                    @click="resetImagePreview" size="small">Reset</v-btn>
                                            </div>
                                            <!-- <div class="text-subtitle-1 text-medium-emphasis text-center my-sm-8 my-6">Allowed JPG, GIF or PNG. Max size of 800K</div> -->
                                        </v-card-item>
                                    </v-card>
                                    <v-card elevation="10" class="">
                                        <v-card-item class="pa-sm-6 pa-3">
                                            <h5 class="text-h5 ">Stripe</h5>
                                            <div class="text-subtitle-1 text-medium-emphasis mt-2">Easily Collect credit
                                                card payments with Stripe. For getting started and more information
                                            </div>
                                            <div class="mt-5">

                                                <template class="text-md-end text-start"
                                                    v-if="strp_status == 'verified'">
                                                    <v-btn color="primary" size="small">Connected</v-btn>
                                                </template>
                                                <template class="text-md-end text-start"
                                                    v-else-if="strp_status == 'pending'">
                                                    <v-btn color="success" size="small"
                                                        @click="connect_stripe()">Continue connecting</v-btn>
                                                </template>
                                                <template class="text-md-end text-start" v-else="strp_status == 'none'">
                                                    <v-btn color="secondary" size="small"
                                                        @click="connect_stripe()">Connect With Stripe</v-btn>
                                                </template>

                                            </div>
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" sm="6"><!--universal password update section-->
                                    <v-card elevation="10" class="h-100">
                                        <v-card-item class="pa-sm-6 pa-3">
                                            <h5 class="text-h5 ">Change Password</h5>
                                            <div class="text-subtitle-1 text-medium-emphasis mt-2">To change your
                                                password please confirm here</div>
                                            <div class="mt-5">
                                                <v-label class="mb-2 font-weight-medium ">Current Password<span
                                                        class="text-error ma-1">*</span></v-label>
                                                <v-text-field color="" class="mb-4" variant="outlined"
                                                    :type="show2 ? 'text' : 'password'" hide-details
                                                    :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append-inner="show2 = !show2" v-model="currentpwd"
                                                    :rules="reqrules" />
                                                <v-label class="mb-2 font-weight-medium ">New Password<span
                                                        class="text-error ma-1">*</span></v-label>
                                                <v-text-field color="" class="mb-4" variant="outlined"
                                                    :type="show3 ? 'text' : 'password'" hide-details
                                                    :append-inner-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append-inner="show3 = !show3" v-model="newpwd"
                                                    :rules="reqrules" />
                                                <v-label class="mb-2 font-weight-medium ">Confirm Password<span
                                                        class="text-error ma-1">*</span></v-label>
                                                <v-text-field color="" class="mb-4" variant="outlined"
                                                    :type="show4 ? 'text' : 'password'" hide-details
                                                    :append-inner-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append-inner="show4 = !show4" v-model="confirmpwd"
                                                    :rules="matchrules" />
                                            </div>
                                            <v-btn size="large" color="secondary" class="mr-4" flat
                                                @click="changep()">Update password</v-btn>
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <div class="d-flex justify-end mt-5">
                                <v-btn size="large" color="secondary" class="mr-4" flat @click="changebd()">Save</v-btn>
                                <v-btn size="large" class="bg-error" flat to="/customer-dashboard">Cancel</v-btn>
                            </div>
                        </v-window-item>
                        <v-window-item value="Popular_packages">
                            <v-card elevation="10" class="h-100">
                                <v-card-item class="pa-sm-6 pa-3">
                                    <h5 class="text-h5 mb-5">Admin popular packages</h5>
                                    <div class="">
                                        <v-row>
                                            <v-col cols="12">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Category
                                                    Sort</v-label>
                                                <v-select v-model="categorySortadmin" :items="categoryItems"
                                                    item-title="text" item-value="value" multiple chips
                                                    @update:modelValue="searchpacks(true)"></v-select>
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <div class="mb-4">
                                        <h5 class="text-h5 text-secondary mb-2">Admin Packages</h5>
                                        <v-autocomplete v-model="adminValue" :items="adminPacks" item-title="text"
                                            item-value="value" variant="outlined" color="primary" multiple hide-details>
                                            <template v-slot:chip>
                                                <v-chip label color="primary" size="large"
                                                    class="mb-1 text-subtitle-1 font-weight-regular"></v-chip>
                                            </template>
                                        </v-autocomplete>
                                    </div>
                                    <v-row>
                                        <v-col cols="12" sm="6" class="ms-auto">
                                            <div class="d-flex flex-wrap justify-end gap-2">
                                                <v-btn variant="flat" color="primary"
                                                    @click="makepopular(true)">Save</v-btn>
                                                <v-btn color="primary" variant="outlined">Clear</v-btn>
                                            </div>
                                        </v-col>
                                    </v-row>
                                    <h6 class="text-body-1 font-weight-semibold mb-5 text-Darklight mt-1">*You can set 6
                                        popular packages</h6>
                                </v-card-item>
                            </v-card>
                            <v-card elevation="10" class="h-100 mt-5">
                                <v-card-item class="pa-sm-6 pa-3">
                                    <h5 class="text-h5 mb-5">Vendor popular packages</h5>
                                    <div class="">
                                        <v-row>
                                            <v-col cols="12">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Category
                                                    Sort</v-label>
                                                <v-select v-model="categorySortvendor" :items="categoryItems"
                                                    item-title="text" item-value="value" multiple chips
                                                    @update:modelValue="searchpacks(false)"></v-select>
                                            </v-col>
                                        </v-row>
                                    </div>

                                    <div class="mb-4">
                                        <h5 class="text-h5 text-secondary mb-2">Vendor Packages</h5>
                                        <v-autocomplete v-model="vendorValue" :items="vendorPacks" item-title="text"
                                            item-value="value" variant="outlined" color="primary" multiple hide-details>
                                            <template v-slot:chip>
                                                <v-chip label color="primary" size="large"
                                                    class="mb-1 text-subtitle-1 font-weight-regular"></v-chip>
                                            </template>
                                        </v-autocomplete>
                                    </div>
                                    <v-row>
                                        <v-col cols="12" sm="6" class="ms-auto">
                                            <div class="d-flex flex-wrap justify-end gap-2">
                                                <v-btn variant="flat" color="primary"
                                                    @click="makepopular()">Save</v-btn>
                                                <v-btn color="primary" variant="outlined">Clear</v-btn>
                                            </div>
                                        </v-col>
                                    </v-row>
                                    <h6 class="text-body-1 font-weight-semibold mb-5 text-Darklight mt1">*You can set 6
                                        popular packages</h6>
                                </v-card-item>
                            </v-card>
                        </v-window-item>
                        <v-window-item value="All_categories">
                            <v-card elevation="10" class="h-100">
                                <v-card-item class="pa-sm-6 pa-3">
                                    <h5 class="text-h5 mb-5">All categories</h5>
                                    <div class="">
                                        <v-row>
                                            <v-row>
                                                <v-col
                                                v-for="item in categoryItems"
                                                :key="item.text"
                                                cols="12"
                                                lg="4"
                                                md="4"
                                                sm="12"
                                                xl="4"
                                                >
                                                <v-card elevation="10" class="vendor-card-hover h-100">
                                                    <v-card-item class="pa-4">
                                                    <v-row class="align-center">
                                                        <v-col cols="12">
                                                        <div class="position-relative d-flex overflow-hidden">
                                                            <img :src="item.pic" class="rounded catgroyImgSize" />
                                                        </div>
                                                        </v-col>
                                                        <v-col cols="12" lg="8" md="8" sm="12" xl="8">
                                                        <div>
                                                            <h4 class="text-subtitle-4 text-18 text-no-wrap font-weight-bold textSecondary mt-1">
                                                            {{ item.name }}
                                                            </h4>
                                                            <h5 class="text-subtitle-4 text-16 text-no-wrap font-weight-semibold textSecondary mt-1">
                                                            ${{ item.price }}
                                                            </h5>

                                                            <v-btn color="primary" class="mt-2" size="small" flat @click="openEditDialog(item)">
                                                            Edit
                                                            </v-btn>
                                                        </div>
                                                        </v-col>
                                                    </v-row>
                                                    </v-card-item>
                                                </v-card>
                                                </v-col>
                                            </v-row>
                                            <!-- Single Dialog (Outside Loop) -->
                                            <v-dialog v-model="editcatdialog" max-width="500">
                                                <v-card>
                                                <div class="d-flex px-6 py-4 justify-space-between align-center">
                                                    <h2 class="text-h4">Edit Category</h2>
                                                    <XIcon size="25" @click="editcatdialog = false" />
                                                </div>
                                                <v-card-text>
                                                    <v-label class="mb-2 font-weight-medium">Category Name</v-label>
                                                    <v-text-field variant="outlined" color="primary" v-model="selectedCategory.name">
                                                </v-text-field>
                                                <v-label class="mb-2 font-weight-medium">Category Price</v-label>
                                                    <v-text-field type="number" variant="outlined"
                                                        color="primary"
                                                        v-model="selectedCategory.price"
                                                        >
                                                </v-text-field>
                                                <v-label for="catimg" class="w-100 mb-4 position-relative">
                                                <div class="imgCatOuter">
                                                    <img :src="selectedCategory?.previewPic || selectedCategory?.pic || 'default.jpg'" alt="Uploaded Image" />
                                                </div>
                                                <span class="editCat">
                                                    <PencilIcon size="15" />
                                                </span>
                                                </v-label>
                                                <v-file-input
                                                id="catimg"
                                                accept="image/*"
                                                label="File input"
                                                hide-details
                                                variant="outlined"
                                                @change="handleFileChange"
                                                class="d-none"
                                                />
                                            </v-card-text>
                                            <v-card-actions class="justify-end d-flex">
                                                <v-btn  @click="update_category(selectedCategory.name, selectedCategory.price,selectedCategory.pic,selectedCategory.id)" color="primary" class="bg-primary">
                                                    Update
                                                </v-btn>
                                                <v-btn class="bg-primary" color="error" @click="editcatdialog = false">
                                                    Cancel
                                                </v-btn>
                                            </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-row>
                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-window-item>
                    </v-window>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.v-selection-control .v-label{
    color:#002642;
}
label.v-label.v-field-label {
    color: #002642;
}
.labelStImgPro2 {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  width: 30px;
  height: 30px;
  background: #b4801c;
  border-radius: 50%;
}
.catgroyImgSize {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
.editCat {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    width:30px;
    height: 30px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.imgCatOuter {
    background: #ccc;
    width: 100%;
    height: 140px;
    border-radius: 10px;
    margin: auto;
    display: block;
    overflow: hidden;
}

.imgCatOuter img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>