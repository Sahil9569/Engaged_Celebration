<script setup lang="ts">
import { ref } from 'vue';
    const dialog1 = ref(false);
</script>
<template>
   
    <div class="ct-video position-relative">
        <v-container class="container-width py-md-16 py-10">
            <v-row class="justify-center">
                <v-col cols="12" lg="8" sm="10" class="z-index">
                    <div class="d-sm-flex align-center text-center justify-center">
                        <h6 class="text-h6 ml-2 text-primary">Register</h6>
                    </div>
                    <h2 class="text-center mt-4 sailFont ctm_h2 font-weight-bold">
                        How To <span class="text-secondary">Register Vendor</span>
                    </h2>
                    <div class="section-title-img text-center" bis_skin_checked="1">
                        <img src="@/assets/images/website/section-title.png" alt="">
                    </div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col>
                    <div class="wpo-video-item" bis_skin_checked="1">
                    <div class="wpo-video-img" bis_skin_checked="1">
                        <img src="@/assets/images/website/banner.jpg" alt="" class="w-100">
                            <v-btn variant="flat" class="video-btn">
                                             <PlayerPlayIcon stroke-width="1.5" size="40" />
                                             <v-dialog v-model="dialog1" activator="parent"  class="dialog-mw">
                                                <v-card class="px-4 py-4">
                                                   <v-card-actions class="ctm-close">
                                                      <v-btn icon color="" @click="dialog1 = false" flat variant="outlined" size="x-small" class="bg-error">
                                                    <XIcon  width="20" />
                                                </v-btn>
                                                   </v-card-actions>
                                                   <v-card-text class="rounded">
                                                      <iframe width="100%" height="315" src="https://www.youtube.com/embed/B0TjyJIIWLA?si=9cLoF7OgzsqRPxQW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>                                                   </v-card-text>
                                                   
                                                </v-card>
                                              </v-dialog>
                               </v-btn>
                        
                    </div>
                </div>
                   
                </v-col>
                <!-- <div class="wpo-video-item" bis_skin_checked="1">
                    <div class="wpo-video-img" bis_skin_checked="1">
                        <img src="@/assets/images/website/banner.jpg" alt="" class="w-100">
                        <a href="https://www.youtube.com/embed/teLhLLlhfzc" target="_blank" class="video-btn"
                            data-type="iframe"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-player-play">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M7 4v16l13 -8z" />
                            </svg></a>
                        
                    </div>
                </div> -->
            </v-row>
        </v-container>
    </div>

</template>


<style scoped>
    .wpo-video-img {
        position: relative;
    }

    .wpo-video-img .video-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 70px;
        height: 70px;
        border: 2px solid #86a0b6;
        text-align: center;
        border-radius: 50%;
        line-height: 76px;
        background: rgba(255, 255, 255, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ct-video:before {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 70%;
        content: "";
        background-color: #edf3f8;
    }

    .wpo-video-img .video-btn svg {
        color: #86a0b6;
    }

    .z-index {
        z-index: 9;
    }
</style>