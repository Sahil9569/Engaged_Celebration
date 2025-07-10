<script setup lang="ts">
// import { hasIn } from 'lodash';
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';

import dummyLogo from '@/assets/images/wedding/no-image-available.png'
import { router } from '@/router';

const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
import folderName from '@/assets/images/wedding/No_Image_Available.jpg'
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
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const myerrors = ref('')


const stepnumver = ref('FourthNextStep')
const bg_img = ref([]);
const profile = ref({
  logo: dummyLogo
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
  } catch (error) {
    console.error("Error creating album:", error);
  }
}

async function create_album() {
  try {
    console.log(category.value,"category.valuecategory.value")
    console.log(category.value.value,"category.value['value']category.value['value']")
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

async function vendor_fourth_step(emitNext: () => void) {
  var formdata = new FormData();
  formdata.append("FourthNextStep", stepnumver.value,)
  formdata.append("videourls1", videourls1.value,)
  formdata.append("videourls2", videourls2.value,)
  formdata.append("videourls3", videourls3.value,)

  var response = await axios.post(`/home/create_vendor`, formdata, config);
  console.log("Responce data >>>>", response.data)
  if (response.data.status == "SAVED") {
    emitNext();
    window.location.href = '/vendor-dashboard';

  }
}
const category = ref();
const categoryitem = ref([])
async function basic_detailfirst() {
  try {
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
    const response = await axios.post(`/home/vendor_onboard_data`, {}, config);
    console.log(response.data, "final all data>>>>>>>>>>>>>>>>> 4th last step::::::::::::::::::::::")

    if (response.data.serialized_albums) {
      albumlist.value = response.data.serialized_albums
      console.log(albumlist.value, "albumlist.valuealbumlist.valuealbumlist.value..basic")
    }

    if (response.data.category) {
      console.log(response.data.category); // Log the category data to inspect it
      categoryitem.value = response.data.category.map(cat => ({ 
        'text': cat.text,
        'value': cat.value 
      }));
      console.log(categoryitem.value, "categoryitem.value");
    }





    // if (response.data.category) {
    //   console.log(response.data.category, "response.data.category")
    //   categoryitem.value = response.data.category.map(cat => ({ 
    //     name: cat.name,
    //      value: cat.id 
    //     }));
    // }


    if (response.data.serialized_videos) {
      const serializedVideos = response.data.serialized_videos;
      serializedVideos.forEach((video, index) => {
        videourls1.value.push(video.vidos_urls[0]);
        videourls2.value.push(video.vidos_urls[1]);
        videourls3.value.push(video.vidos_urls[2]);

      });
    }


  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
basic_detailfirst();

</script>
<template>

  <div class="alertWrap" v-show="showSuccessMessage || showErrorMessage">
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

  <div>
    <h2 class="text-center text-secondary text-h2 mb-8">Past Work</h2>
    <div class="">
    </div>
    <div class="">

      <v-dialog v-model="imageUpload" max-width="900">
        <v-card>
          <v-card-text>
            <v-label class="text-h5 pb-2">Album Name</v-label>
            <VTextField v-model="albumTitle" :value="albumTitle" hide-details="auto" class="mb-3" required
              placeholder="Enter Album Name"></VTextField>

              <!-- <div class="mb-3">
                  <v-label class="text-subtitle-1 font-weight-medium pb-2">Category</v-label>
                  <v-select multiple v-model="category" :items="categoryitem" item-text="text"
                      item-value="value" label="Select Category" single-line
                      variant="outlined" hide-details return-object required>
                  </v-select>
              </div>

              <div class="mb-3">
                  <v-label class="text-subtitle-1 font-weight-medium pb-2">Category 2</v-label>
                  <v-autocomplete v-model="category" :items="categoryitem" item-text="text" item-value="value" 
                    variant="outlined" color="primary" multiple hide-details >

                    <template v-slot:chip>
                      <v-chip label color="secondary" size="large" class="mb-1 text-subtitle-1 font-weight-regular"></v-chip>
                    </template>
                  </v-autocomplete>

                </div> -->


            <div class="">
              <h3 class="text-h5 pb-4">Upload Your Cover Photo</h3>
              <div class="imageGroupMain businessGroup withoutRadius">
                <label for="logoImageLbl2" class="labelStImgPro ">
                  <input type="file" id="logoImageLbl2" class="d-none" @change="handleImageUploadd" accept="image/*">
                </label>
                <div class="imageSizeMain">
                  <img :src="profile.logo" alt="Uploaded Image" style="max-width: 300px;">
                </div>
              </div>
            </div>

            <h3 class="text-h5 mt-5 mb-3">Upload Your Photos</h3>
            <div class="">
              <label for="file-upload" class="labelStyleImage">
                <input id="file-upload" type="file" multiple @change="uploadImage($event, 'image')" accept="image/*" />
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
                <div class="image-holder" v-for="(image, index) in productImages" :key="image.id">
                  <img :ref="'delete_album_image' + image.id" alt="" :src="image.url" />

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
            <v-btn color="secondary" variant="flat" @click="photoAddedFuc()">Save Album</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="">
        <div class="">
          <h3 class="text-h4 mb-2">Wedding Photos</h3>
          <p class="mb-3 text-subtitle-1">Add photos of weddings and pre-wedding shot that you've covered.</p>
        </div>
        <v-row>

          <v-col cols="12" :sm="albumlist.length > 0 ? '6' : '12'" :md="albumlist.length > 0 ? '3' : '12'">

            <!-- <label class="labelStyleImage h-100"  @click="imageUpload = true">
              <div class="innrContentTitle">
                <span class="iconTitleUpld d-block text-center">
                  <PlusIcon size="24"/></span>
                    Add New Album
              </div>
            </label> -->

            <label class="labelStyleImage h-100" @click="createalbum_btn('create_album')">
              <div class="innrContentTitle">
                <span class="iconTitleUpld d-block text-center">
                  <PlusIcon size="24" />
                </span>
                Add New Album
              </div>
            </label>


          </v-col>

          <!-- get_album_data -->


          <template v-if="albumlist.length > 0">
            <v-col cols="12" sm="6" md="3" v-for="(album, index) in albumlist" :key="album.id">

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
      </div>

    </div>








    <div class="mt-8">
      <h3 class="text-h4 mb-2">Wedding Videos URL</h3>
      <p class="mb-3 text-subtitle-1">Add videos of wedding that you have planned..</p>


      <div class="">
        <div class="mb-3">
          <v-label class="text-subtitle-1 font-weight-medium pb-2">Video URL1</v-label>
          <VTextField v-model="videourls1" hide-details="auto" class="mb-3" required placeholder="My Website URL">
          </VTextField>
        </div>
        <div class="mb-3">
          <v-label class="text-subtitle-1 font-weight-medium pb-2">Video URL2</v-label>
          <VTextField v-model="videourls2" hide-details="auto" class="mb-3" required placeholder="My Website URL">
          </VTextField>
        </div>
        <div class="mb-3">
          <v-label class="text-subtitle-1 font-weight-medium pb-2">Video URL3</v-label>
          <VTextField v-model="videourls3" hide-details="auto" class="mb-3" required placeholder="My Website URL">
          </VTextField>
        </div>




        <!-- <div class="mb-3" v-for="(item, index) in items" :key="index">
            <v-label class="text-subtitle-1 font-weight-medium pb-2">Video URL{{index+1}}</v-label>
            <VTextField  hide-details="auto" class="mb-3" required placeholder="My Website URL"></VTextField>
          </div> -->
        <!-- <v-btn color="secondary" @click="appendItem" :disabled="items.length > 3"><PlusIcon size="16" class="me-1"/> Add Video</v-btn> -->


      </div>



    </div>
    <!-- Your step content here -->
    <div class="justify-end mt-3 d-flex gap-2">
      <v-btn color="secondary" class="px-6" size="large" variant="outlined" @click="$emit('prev')">Previous</v-btn>
      <v-btn color="secondary" class="px-6" size="large" @click="vendor_fourth_step(() => $emit('next'))"
        variant="outlined">Submit</v-btn>
      <!-- <v-btn color="secondary" class="px-6" size="large" @click="$emit('next')">Next</v-btn> -->
    </div>


  </div>
</template>

<style>
.withoutRadius .imageSizeMain {
  border-radius: 16px;
  border: 1px solid #dde8f1;
}

.withoutRadius .imageSizeMain img {
  object-fit: cover;
  width: 100%;
  height: 100%;
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
</style>