<template>
    <section class="calltoaction">
        <v-container>
            <section class="cta-one">
                <div class="">
                    <div class="position-relative cta-sc">
                        <div class="cta-icon_one" style="background-image:url(@/assets/images/website/cta-icon-1.png)">
                        </div>
                        <div class="cta-icon_two" style="background-image:url(@/assets/images/website/cta-icon-2.png)">
                        </div>
                        <div class="cta-one_card">
                            <img src="https://data.themeim.com/wp/braine/wp-content/uploads/2024/03/cta-card.png"
                                alt="Awesome Image">
                        </div>
                        <div class="row clearfix">
                            <!-- Column -->
                            <div class="cta-one_title-column col-lg-6 col-md-12 col-sm-12">
                                <div class="cta-one_title-outer">
                                    <h2 class="cta-one_title text-white">Craft your next great <span>content now.</span>
                                    </h2>
                                    <div class="cta-one_button">
                                        <a href="">
                                            <span class="btn-wrap">
                                                <span class="text-one text-white">Get started free</span> <span
                                                    class="text-two text-white">Get started free</span> </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!-- Column -->
                            <div class="cta-one_image-column col-lg-6 col-md-12 col-sm-12">
                                <div class="cta-one_image-outer">
                                    <div class="cta-one_cards">
                                        <img src="https://data.themeim.com/wp/braine/wp-content/uploads/2024/03/cta-cards.png"
                                            alt="Awesome Image">
                                    </div>
                                    <div class="image">
                                        <img src="https://data.themeim.com/wp/braine/wp-content/uploads/2024/03/cta.png"
                                            alt="Awesome Image">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </v-container>
    </section>
</template>

<style>
h2.text-left.mt-4.sailFont.ctm_h2.font-weight-bold,
.unlock {
    color: #fff;
}

.unlock {
    line-height: 24px;
}

.cta-one {
    position: relative;
    z-index: 10;
}

.cta-one .cta-sc::before {
    position: absolute;
    content: '';
    left: 0px;
    top: 40px;
    right: 0px;
    bottom: 0px;
    border-radius: 16px;
    background: var(--main-color);
    background: linear-gradient(to bottom, rgb(118, 31, 227) 0%, rgb(208, 147, 232) 100%);
    max-height: 350px;
}

.cta-one_card {
    position: absolute;
    /* left: 0px; */
    bottom: 135px;
    right: 0px;
    height: 178px;
    text-align: center;
    background-repeat: no-repeat;
}

.cta-one_title-outer {
    position: relative;
    padding-top: 110px;
}

.cta-one_title-column {
    position: relative;
}

.cta-one_title span {
    position: relative;
    font-style: italic;
    display: inline-block;
    font-family: 'Lora', serif;
}

.cta-one_title span::before {
    position: absolute;
    content: '';
    left: 0px;
    bottom: 8px;
    right: 0px;
    z-index: -1;
    height: 10px;
    border-radius: 50px;
    background: var(--color-five);
    background: linear-gradient(to top, rgb(208, 147, 232) 0%, rgb(118, 31, 227) 100%);
}
</style>