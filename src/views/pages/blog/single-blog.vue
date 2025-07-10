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
        text: 'Blog',
        disabled: true,
        href: '#'
    },
    {
        text: 'Blog Single',
        disabled: true,
        href: '#'
    }
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
                                <template v-slot:title="{ item }">
                                    <h6 class="text-white">{{ item.title }}</h6>
                                </template>
                            </v-breadcrumbs>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </div>
    <v-container class="container-width py-md-16 py-10 pt-10">
        <v-row>
            <v-col cols="12">
                <v-row>

                    <v-col cols="12" md="8">
                        <div class="position-relative w-100 mb-4">
                            <img :src="vendormainimg" class="main-img-vendor rounded mb-2 w-100">
                        </div>
                        <h1 class="font_32 text-secondary mb-2 sailFont">Best wedding gift you may like & choose.</h1>
                        <p class="blog-content text-justify">Choosing a wedding gift is an opportunity to express your
                            love
                            and support for the couple as
                            they embark on their journey together. Personalized gifts add a special touch, showing that
                            you've taken the time to tailor the gift specifically for them. Whether it's a set of towels
                            embroidered with their initials or a custom-made photo album filled with their favorite
                            memories, personalized gifts carry sentimental value that can't be replicated.

                            Experiences make for memorable gifts, creating moments that the couple will treasure for
                            years to come. A romantic dinner at a fancy restaurant or a weekend getaway to a cozy bed
                            and breakfast offers them a chance to relax and enjoy each other's company amidst the
                            busyness of wedding planning. These experiences not only provide a break from the hustle and
                            bustle but also strengthen the bond between the couple as they create new memories together.

                            Cash or gift cards may seem impersonal to some, but they offer practicality and flexibility,
                            allowing the couple to use the gift as they see fit. Weddings can be expensive affairs, and
                            many couples appreciate the financial assistance, whether it's to cover wedding expenses or
                            to save for their future together. Cash or gift cards give the couple the freedom to
                            allocate the gift towards whatever is most important to them at the time.

                            Home décor items add a personal touch to the couple's living space, helping them turn their
                            house into a home. Whether it's a stylish vase that matches their aesthetic or a set of
                            decorative throw pillows that adds flair to their sofa, these gifts contribute to creating a
                            warm and inviting atmosphere. Practical home essentials like luxurious candles or a chic
                            serving tray for entertaining guests are not only functional but also stylish additions to
                            their home.

                            Subscription services offer the gift of convenience and ongoing enjoyment. Whether the
                            couple are foodies, wine enthusiasts, bookworms, or fitness fanatics, there's a subscription
                            box out there to suit their interests. Each month, they'll receive a curated selection of
                            items tailored to their preferences, keeping the excitement of the wedding day alive long
                            after the event has passed.

                            In conclusion, the best wedding gifts are those that reflect your thoughtfulness and well
                            wishes for the couple. Whether you choose a personalized keepsake, an unforgettable
                            experience, a practical gift, or a subscription service, your gesture will be appreciated as
                            a token of your love and support for their future together.</p>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card elevation="10" class="stick-info-card bg-color">
                            <v-card-item>
                                <h2 class="textSecondary text-left mb-2 sailFont">
                                    Related Post
                                </h2>
                                <div class="posts">
                                    <div class="post">
                                        <div class="img-holder">
                                            <img src="@/assets/images/website/decoration1.jpg" alt="" class="w-100">
                                        </div>
                                        <div class="details">
                                            <h4 class="text-secondary">Best Wedding Gift You May Like and Prefer</h4>
                                        </div>
                                    </div>
                                    <div class="post">
                                        <div class="img-holder">
                                            <img src="@/assets/images/website/decoration1.jpg" alt="" class="w-100">
                                        </div>
                                        <div class="details">
                                            <h4 class="text-secondary">Best Hair Style Tips You May Follow in your Wedding</h4>
                                        </div>
                                    </div>
                                    <div class="post">
                                        <div class="img-holder">
                                            <img src="@/assets/images/website/decoration1.jpg" alt="" class="w-100">
                                        </div>
                                        <div class="details">
                                            <h4 class="text-secondary">How To Avoid Massive Weasting Money in Your wedding</h4>
                                        </div>
                                    </div>
                                </div>
                            </v-card-item>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
    <div class="container-width mb-md-16 mx-auto rounded-md overflow-hidden">
        <CallToAction />
    </div>

    <!--Footer-->
    <Footer />
</template>
<style>
.blog-content {
    font-size: 16px;
}

.stickynavbar {
    position: sticky;
    top: 65px;
    z-index: 1;
}

.stick-info-card {
    position: sticky;
    top: 80px;
    /* background: url(../../../assets/images/website/calltoaction.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat; */
}

.main-img-vendor {
    height: 400px;
    object-fit: cover;
}

.post {
    display: flex;
    margin: 10px 0px;
    width: 100%;
    align-items: center;
}

.post .img-holder {
    width: 30%;
}

.post .details {
    padding-left: 20px;
    width: 70%;
}

.post .img-holder img {
    border-radius: 6px;
}

.post h4 {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.3em;
    margin: 0 0 0.3em;
    transition: all 0.38s ease-in-out 0s;
}
.post h4:hover{
    color: #5880a2 !important;
}
</style>
