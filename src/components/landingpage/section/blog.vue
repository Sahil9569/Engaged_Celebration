<script setup lang="ts">
import { ref } from 'vue';
import { demosMegamenu, appsMegamenu, productsSlider } from '@/_mockApis/landingpage/lpPage';
</script>
<template>
  <v-container class="container-width py-md-8 py-4" id="demos">
    <v-row class="justify-center">
      <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
        <div class="text-center">
          <span class="text-secondary about_heading font-weight-bold">Blog</span>
          <h2 class="text-center sailFont ctm_h2 font-weight-bold">Big Day Insights & <span class="">Inspirations</span>
          </h2>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <div class="pricing-section blog-section pb-mb-12 pb-6">
    <v-container class="container-width">
      <v-row justify="center">
        <v-col cols="12">
          <v-row justify="center">
            <v-col cols="12" lg="4" sm="6">
              <v-card>
                <router-link to="/single-blog" class="text-decoration-none">
                  <div class="wpo-blog-item" bis_skin_checked="1">
                    <div class="wpo-blog-img overflow-hidden" bis_skin_checked="1">
                      <img src="@/assets/images/website/blog1.jpg" alt="" class="w-100">
                    </div>
                    <div class="wpo-blog-content d-flex" bis_skin_checked="1">
                      <ul>
                        <li class="link-text">By Wedding Planner</li>
                        <li>25 Sep 2021</li>
                      </ul>
                      <h2 class="blog-title text-h4">Best
                        wedding
                        gift you may like &amp; choose.
                      </h2>
                    </div>
                  </div>
                </router-link>
              </v-card>
            </v-col>
            <v-col cols="12" lg="4" sm="6">
              <v-card>
                <router-link to="/single-blog" class="text-decoration-none">
                  <div class="wpo-blog-item" bis_skin_checked="1">
                    <div class="wpo-blog-img overflow-hidden" bis_skin_checked="1">
                      <img src="@/assets/images/website/photograph.jpg" alt="" class="w-100">
                    </div>
                    <div class="wpo-blog-content d-flex" bis_skin_checked="1">
                      <ul>
                        <li class="link-text">By Wedding Planner</li>
                        <li>25 Sep 2021</li>
                      </ul>
                      <h2 class="blog-title text-h4">Photography
                        is the important part of wedding.
                      </h2>
                    </div>
                  </div>
                </router-link>
              </v-card>
            </v-col>
            <v-col cols="12" lg="4" sm="6">
              <v-card>
                <router-link to="/single-blog" class="text-decoration-none">
                  <div class="wpo-blog-item" bis_skin_checked="1">
                    <div class="wpo-blog-img overflow-hidden" bis_skin_checked="1">
                      <img src="@/assets/images/website/decoration1.jpg" alt="" class="w-100">
                    </div>
                    <div class="wpo-blog-content d-flex" bis_skin_checked="1">
                      <ul>
                        <li class="link-text">By Wedding Planner</li>
                        <li>25 Sep 2021</li>
                      </ul>
                      <h2 class="blog-title text-h4">Top 10
                        wedding fresh flower decoration idea.
                      </h2>
                    </div>
                  </div>
                </router-link>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style scoped></style>
