<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

import 'v-calendar/dist/style.css';
import imagePath from '@/assets/images/vendor/servicedummy.png'
import folderName from '@/assets/images/wedding/No_Image_Available.jpg'
import dummyLogo from '@/assets/images/wedding/no-image-available.png'
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';


const slider5 = ref(40);


const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }

interface ImageFile {
    url: string;
    file: File;
}
// const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const myerrors = ref('')
const categoryvalue = ref([]);
const categoryItem = ref([
    'Makeup Artist',
    'Photographers',
    'Caterers',
    'DJs',
]);


import albumone from '@/assets/images/website/decoration6.jpeg'
import albumtwo from '@/assets/images/website/decoration7.jpg'
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


const multipleValues = ref([]);
const multipleItems = ref([
    'Mumbai',
    'Delhi',
]);


const items2 = ref([
    'Customized music',
    'Lighting packages',
    'Backup equipment',
]);
const multi_value = ref(['Customized music',
    'Lighting packages']);


const profile = ref({
    profileImage: imagePath,
    logo: dummyLogo
})


const profile_img = ref();

const handleImageUpload = (event: InputEvent, type: string) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            profile_img.value = input.files[0]; // Assuming profile_img is a ref
            profile.value.profileImage = reader.result as string;
        };
        reader.readAsDataURL(input.files[0]);
    }
};



const albumlist = ref([])

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
const albumTitle = ref()
const albumId = ref(null)
const imageUpload = ref(false)
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
            myerrors.value = "Album deleted successfully"
            showErrorMessage.value = true;
            setTimeout(() => { showErrorMessage.value = false; }, 3000);
        }
        if (response.data.status === "DeleteImage") {
            // myerrors.value="Delete Image successfully"
            //       showErrorMessage.value = true;
            //         setTimeout(() => {
            //            showErrorMessage.value=false;
            //       }, 4000);


            singleAlbumFuc(event = album, action = 'get_album_data');
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
            productImages.value = [];
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

const range = ref({
    start: new Date(2024, 3, 1),
    end: new Date(2024, 3, 5)
});
const radioGroup = ref('1');



const editor = useEditor({
    editorProps: {
    attributes: {
      class: 'custom-tiptap-style',
    }
    },
    extensions: [StarterKit],
    content: ``
});



const decreamentAll = ref('');

const bookingavailable = ref('');

const hoursitems = ref([
    'All',
    'Morning (07:00 To 12:00)',
    'Afternoon (13:00 To 18:00)',
    'Evening (19:00 To 22:00)',
]);
const hours = ref(['All']);
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="">
                    <v-row class="justify-content-between">
                        <v-col cols="12" sm="12"> <v-card-title class="text-h4">Add New Package
                            </v-card-title>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <div class="mb-3">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Package Name
                                </v-label>
                                <VTextField hide-details="auto" class="mb-3" required
                                    placeholder="Enter Your Package Name" color="secondary"></VTextField>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="mb-3">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Package Category
                                </v-label>
                                <v-select :items="categoryItem" v-model="categoryvalue" placeholder="Select Category"
                                    hide-details class="me-2" color="secondary">
                                </v-select>
                            </div>
                        </v-col>
                        <!-- <v-col cols="12" sm="6">
                            <div class="mb-3">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Included
                                    Service</v-label>
                                <v-autocomplete v-model="multi_value" :items="items2" item-value="value"
                                    item-text="name" variant="outlined" color="secondary" multiple hide-details
                                    placeholder="Select Services" >
                                    <template v-slot:chip>
                                        <v-chip label color="secondary" size="x-small"
                                            class="mb-1 text-subtitle-2 font-weight-bold pa-3"></v-chip>
                                    </template>
</v-autocomplete>
</div>
</v-col> -->
                        <v-col cols="12" sm="6">
                            <div class="mb-3">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Location</v-label>
                                <v-autocomplete v-model="multipleValues" :items="multipleItems" item-value="value"
                                    item-text="name" variant="outlined" color="secondary"
                                    placeholder="Select Location For This Package" multiple hide-details >

                                    <template v-slot:chip>
                                        <v-chip label color="secondary" size="x-small"
                                            class="mb-1 text-subtitle-2 font-weight-bold"></v-chip>
                                    </template>
                                </v-autocomplete>

                            </div>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Package Price
                                </v-label>
                                <VTextField hide-details="auto" required placeholder="Enter Package Price"
                                    color="secondary">
                                </VTextField>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Deposit Amount
                                </v-label>
                                <v-text-field variant="outlined" color="secondary" type="text"
                                    placeholder="Enter Payment %" hide-details>
                                    <template v-slot:prepend-inner>
                                        <PercentageIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                                    </template>
                                </v-text-field>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">No of Booking Available
                                </v-label>
                                <VTextField v-model="bookingavailable" hide-details="auto" required placeholder="No of Booking Available" color="secondary" type="number"></VTextField>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Set Hours
                                </v-label>
                                <v-autocomplete
                                    v-model="hours"
                                    :items="hoursitems"
                                    variant="outlined"
                                    color="primary"
                                    multiple
                                    hide-details
                                    
                                >
                                    <template v-slot:chip>
                                        <v-chip label color="primary" size="x-small" class="mb-1 text-subtitle-2 font-weight-semibold"></v-chip>
                                    </template>
                                </v-autocomplete>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">
                                    Max Number of Couples Allowed
                                </v-label>
                                <VTextField type="number" hide-details="auto" class="mb-3" required
                                    placeholder="Enter No. of couple allowed">
                                </VTextField>

                            </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Cutoff Date
                                </v-label>
                                <VTextField type="number" hide-details="auto" class="mb-3" required
                                    placeholder="Enter Cutoff Date">
                                </VTextField>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Decreament
                                    Payment
                                </v-label>
                                <v-row>
                                    <v-col cols="12" sm="2">
                                        <v-card elevation="10" class="">
                                            <v-card-item class="pa-2">
                                                <div class="d-flex gap-5 align-center flex-column flex-sm-row">
                                                    <div class="d-flex gap-3 align-center flex-column flex-sm-row">
                                                        <v-radio-group  hide-details v-model="radioGroup" column
                                                        class=" justify-start">
                                                            <v-radio color="secondary" value="1" label="For All"></v-radio>
                                                            <v-radio color="secondary" value="2" label="Custom"></v-radio>
                                                        </v-radio-group>
                                                    </div>
                                                </div>
                                            </v-card-item>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" sm="10">
                                        <v-card elevation="10" class="border">
                                            <v-card-item class="py-2">
                                                <v-row class="pt-3">
                                                    <v-col cols="6" v-if="radioGroup === '1'">
                                                        <div class="forall">
                                                            <v-label class="text-subtitle-1 font-weight-medium pb-2">Decreament
                                                                Price For All
                                                            </v-label>
                                                            <VTextField v-model="decreamentAll" type="number" hide-details="auto" class="mb-3" required
                                                                placeholder="Decreament Price For All">
                                                            </VTextField>
                                                        </div>
                                                    </v-col>
                                                    <v-col cols="12" class="pb-10" v-else-if="radioGroup === '2'">
                                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Decreament
                                                            Custom Price
                                                        </v-label>
                                                        <v-row class="align-center border-bottom">
                                                            <v-col cols="12" sm="6">
                                                                
                                                                <v-row class="border d-flex align-center rounded ma-1">
                                                                    <v-col cols="3" class="pa-1">
                                                                        <p class="text-subtitle-3 text-center intvalue">0</p>
                                                                    </v-col>
                                                                    <v-col cols="4" class="pa-1">
                                                                        <p class="text-subtitle-3 text-center">To
                                                                        </p>
                                                                    </v-col>
                                                                    <v-col cols="5" class="pa-1">
                                                                        <VTextField type="number" hide-details="auto"
                                                                            class="mb-0 person" required placeholder="Number">
                                                                        </VTextField>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-col>
                                                            <v-col cols="12" sm="4">
                                                                <v-slider class="mt-3" v-model="slider5" hide-details color="primary" step="1" thumb-label="always"></v-slider>

                                                            </v-col>
                                                            <v-col cols="12" sm="2">
                                                                <v-btn color="success" variant="flat" size="small"
                                                                 class="me-2 rounded-sm">
                                                                    <PlusIcon  size="14"/>
                                                                </v-btn>
                                                                <v-btn color="error" variant="flat" size="small"
                                                                 class="me-2 rounded-sm">
                                                                    <MinusIcon size="14"/>
                                                                </v-btn>
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </v-row>
                                            </v-card-item>
                                    </v-card>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <v-label class="text-subtitle-1 font-weight-medium pb-2"> Package
                                Availability
                            </v-label>
                            <v-date-picker v-model="range" is-range class="w-100 bookingModalStyle" />
                        </v-col>
                        <v-col cols="12" sm="12">


                        </v-col>
                        <v-col cols="12" sm="12">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Package
                                    Description
                                </v-label>
                                <div class="custom-border  rounded">
                                    <div v-if="editor" class="borderNew">
                                        <EditorMenubar :editor="editor" />
                                    </div>
                                    <editor-content :editor="editor" />
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <div class="">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Terms &
                                    Conditions
                                </v-label>
                                <v-textarea outlined name="Note" placeholder="Enter terms & Conditions" hide-details
                                    color="secondary"></v-textarea>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="text-start">
                                <h3 class="text-subtitle-1 font-weight-medium pb-2">Package logo
                                </h3>
                                <div class="imageGroupMain profileGroup w-100">
                                    <label for="profilePicInput" class="labelStImgPro">
                                        <input type="file" id="profilePicInput" class="d-none"
                                            @change="handleImageUpload($event, 'profile_pic')" accept="image/*">
                                    </label>
                                    <div class="imageSizeMain new">
                                        <img :src="profile.profileImage" alt="Uploaded Image" style="max-width: 300px;">
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
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

                                                <!-- <div class="mainImageRow mt-4" v-if="productImages.length > 0 ">
                                                <div class="image-holder" v-for="(image, index) in productImages" :key="index">
                                                    <img :ref="'image' + index" alt="" :src="image.url" />
                                                    <button type="button" class="btnTrash" @click="removeImage(index, 'image')">
                                                    <TrashIcon size="18" color="white"/>
                                                    </button>
                                                </div>
                                                </div> -->

                                                <div class="mainImageRow mt-4" v-if="productImages.length > 0">
                                                    <div class="image-holder" v-for="(image, index) in productImages"
                                                        :key="image.id">
                                                        <img :ref="'delete_album_image' + image.id" alt=""
                                                            :src="image.url" />

                                                        <!-- <button type="button" class="btnTrash" @click="removeImage(image.id, 'image')">
                                                    <TrashIcon size="18" color="white"/>
                                                    </button> -->

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
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Add
                                            New Albums
                                        </v-label>
                                    </div>
                                    <v-row>

                                        <v-col cols="12" :sm="albumlist.length > 0 ? '6' : '12'"
                                            :md="albumlist.length > 0 ? '3' : '12'">

                                            <!-- <label class="labelStyleImage h-100"  @click="imageUpload = true">
                                        <div class="innrContentTitle">
                                        <span class="iconTitleUpld d-block text-center">
                                            <PlusIcon size="24"/></span>
                                            Add New Album
                                        </div>
                                    </label> -->
                                            <div class="heightSameToo"> 
                                                <label class="labelStyleImage h-100 text-primary"
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

                                        <!-- get_album_data -->


                                        <template v-if="albumlist.length > 0">
                                            <v-col cols="12" sm="6" md="3" v-for="(album, index) in albumlist"
                                                :key="album.id">

                                                <v-card elevation="10"
                                                    class="vendor-card-background d-flex align-end overflow-hidden"
                                                    :style="{
                                                        backgroundImage: album.album_bckpic ? `url(${BASE_URL + album.album_bckpic})` : `url(${folderName})`
                                                    }">

                                                    <!-- Content goes here -->
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
                                            </v-col>
                                        </template>




                                    </v-row>
                                </div>

                            </div>
                        </v-col>
                        <v-col cols="12">
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
                        </v-col>
                        <v-col cols="12">
                            
                        </v-col>
                        <v-col cols="12" class="d-flex justify-end">
                            <v-btn class="bg-secondary" text flat>
                                Save
                            </v-btn>
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
.heightSameToo {
    height: 195px;
    border: 4px solid #fff;
    border-radius: 10px !important;
}
.imageSizeMain.new {
    width: 100%;
    height: 200px;
    border-radius: 10px !important;
    overflow: hidden !important;

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

.custom-border {
    border: 1px solid #bcc3c9;
}
.menuBar {
    border-bottom: 1px solid #bcc3c9;
}
.vc-light.vc-attr, .vc-light .vc-attr {
    --vc-highlight-light-bg : rgb(var(--v-theme-lightsecondary)) !important;
    --vc-highlight-solid-bg: rgb(var(--v-theme-secondary)) !important;
}
.font-size {
    font-size: 14px;
}
</style>