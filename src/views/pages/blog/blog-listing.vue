<script setup lang="ts">
import { ref, computed } from 'vue';
import Header from '@/components/landingpage/layout/Header.vue';
import Footer from '@/components/landingpage/layout/Footer.vue';
import CallToAction from '@/components/landingpage/section/calltoaction.vue';
import vendormainimg from "@/assets/images/website/decoration1.jpg";

const page = ref({ title: 'Blog' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '#'
    },
    {
        text: 'Blog Listing',
        disabled: true,
        href: '#'
    },
]);

</script>
<template>
  <Header />
    <div class="position-relative mainbanner">
        <v-card class="elevation-0 rounded-md mb-8">
            <div class="px-8 py-8 py-lg-0 d-flex justify-center">
                <div class="d-flex justify-space-between">
                    <div class="d-flex py-0 align-center">
                        <div>
                            <h3 class="ctm_h2 mb-2 text-white sailFont text-center">{{ page.title }}</h3>
                            <v-breadcrumbs :items="breadcrumbs"
                                class="text-h6 font-weight-medium pa-0 d-flex justify-center">
                                <template v-slot:divider>
                                    <div class="d-flex align-center text-h3 mt-n4 text-white">.</div>
                                </template>
                            </v-breadcrumbs>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </div>
  <div class="pricing-section blog-section py-md-12 py-6">
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
                    <div class="wpo-blog-content" bis_skin_checked="1">
                      <ul>
                        <li class="link-text">By Wedding Planner</li>
                        <li>25 Sep 2021</li>
                      </ul>
                      <h2 class="blog-title text-h4 text-secondary">Best
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
                    <div class="wpo-blog-content" bis_skin_checked="1">
                      <ul>
                        <li class="link-text">By Wedding Planner</li>
                        <li>25 Sep 2021</li>
                      </ul>
                      <h2 class="blog-title text-h4 text-secondary">Photography
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
                      <img src="@/assets/images/website/blog1.jpg" alt="" class="w-100">
                    </div>
                    <div class="wpo-blog-content" bis_skin_checked="1">
                      <ul>
                        <li class="link-text">By Wedding Planner</li>
                        <li>25 Sep 2021</li>
                      </ul>
                      <h2 class="blog-title text-h4 text-secondary">Best
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
                      <img src="@/assets/images/website/decoration1.jpg" alt="" class="w-100">
                    </div>
                    <div class="wpo-blog-content" bis_skin_checked="1">
                      <ul>
                        <li class="link-text">By Wedding Planner</li>
                        <li>25 Sep 2021</li>
                      </ul>
                      <h2 class="blog-title text-h4 text-secondary">Top 10
                          wedding fresh flower decoration idea.
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
                      <img src="@/assets/images/website/blog1.jpg" alt="" class="w-100">
                    </div>
                    <div class="wpo-blog-content" bis_skin_checked="1">
                      <ul>
                        <li class="link-text">By Wedding Planner</li>
                        <li>25 Sep 2021</li>
                      </ul>
                      <h2 class="blog-title text-h4 text-secondary">Best
                        wedding
                        gift you may like &amp; choose.
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
  <Footer/>
</template>
<style scoped></style>
