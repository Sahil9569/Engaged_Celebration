<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';


const editdialog = ref(false);
const fullpageloader = ref(false)
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const myerrors = ref('')
const cid               = ref()
const alldata           = ref([])
const datacard          = ref([])
const pagevalue         = ref("");
const pageitem          = ref([])
const sectionvalue      = ref("");
const sectionitem       = ref([])
const titlevalue        = ref("");
const ctitlevalue       = ref("");
const contentvalue      = ref("");
const splitcontentvalue = ref("");
const footerDialog      = ref(false);
const headerDialog      = ref(false);
const imageGroups       = ref<(string | null)[]>([null, null, null, null]);
const protfolioFooter   = ref<(string | null)[]>([null, null, null, null, null, null]);
const videoGroups = ref<string[]>([]);
const uploadedVideoFile = ref<(File | null)[]>([]);
const showQuestionForm = ref(false);

import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';




//Footer Dyanmic Values For admin Backend Start Here
const menuListFooter = ref([
  { text: 'None', value: '' }, // Placeholder with no value
  { text: 'For Couples', value: 'For Couples' },
  { text: 'For Vendors', value: 'For Vendors' },
  { text: 'How it Works', value: 'How it Works' },
  { text: 'FAQ', value: 'Faq' },
  { text: 'Contact', value: 'Contact' }
]);
const menuFooterModel1   = ref();
const menuFooterModel2   = ref();
const menuFooterModel3   = ref();
const menuFooterModel4   = ref();
const menuFooterModel5   = ref();

//Footer Dyanmic Values For admin Backend End Here

//Header Dyanmic Values For admin Backend Start Here

const menuListHeader = ref([
  { text: 'None', value: '' }, // Placeholder with no value
  { text: 'About Us', value: 'AboutUs' },
  { text: 'For Couples', value: 'For Couples' },
  { text: 'For Vendors', value: 'For Vendors' },
  { text: 'How it Works', value: 'How it Works' },
  { text: 'FAQ', value: 'Faq' },
  { text: 'Contact', value: 'Contact' }
]);


// const menuHeaderModel1   = ref();
// const menuHeaderModel2   = ref();
// const menuHeaderModel3   = ref();
// const menuHeaderModel4   = ref();
// const menuHeaderModel5   = ref();
// const menuHeaderModel6   = ref();
//Header Dyanmic Values For admin Backend End Here
const uploadedFiles = ref<File[]>([]);
const hfuploadedFiles = ref<File[]>([]); 




const handleVideoUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  console.log("Input clicked:", target);
  console.log("File selected:", target.files?.[0]);
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Ensure the video preview is updated correctly
      videoGroups.value[index] = {
        url: e.target?.result as string, // Data URL for immediate preview
        file: file, // Store the file reference
      };
      uploadedVideoFile.value[index] = file;
    };
    reader.readAsDataURL(file);
  }
};



const videoFilesToRemove = ref('');


const removevideos = (index: number,id) => {
    videoGroups.value[index] = null; 
    uploadedVideoFile.value[index] = null; 
    videoFilesToRemove.value = id;
};




const handleImageUpload = (event: Event, index: number, group: 'imageGroups' | 'protfolioFooter') => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0]; // Get the first uploaded file
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (group === 'imageGroups') {
        imageGroups.value[index] = e.target?.result as string; // Update imageGroups
        uploadedFiles.value[index] = file; //  original file
      } else if (group === 'protfolioFooter') {
        protfolioFooter.value[index] = e.target?.result as string; // Update protfolioFooter
        hfuploadedFiles.value[index] = file;
      }
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
};



const removeImage = (index: number, group: 'imageGroups' | 'protfolioFooter') => {
  if (group === 'imageGroups') {
    imageGroups.value[index] = null; // Set the specified index to null in imageGroups
  } else if (group === 'protfolioFooter') {
    protfolioFooter.value[index] = null; // Set the specified index to null in protfolioFooter
  }
};


import user1 from "@/assets/images/profile/defaultuserimg.png";
const panel = ref([0]);
const box_title = ref();
const box_content = ref();
const theme_text = ref();
const term_id = ref();
const term_content = ref();
const footer_id = ref();
const header_id = ref();



import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import { PlusIcon, TrashIcon } from 'vue-tabler-icons';





const editor = useEditor({
    editorProps: {
    attributes: {
      class: 'custom-tiptap-style',
    }
    },
    extensions: [StarterKit],
    content: ``
}); 


onMounted(() => {
    loadcontent(); // Initial load on component mount
});

// Watch for editor initialization
watch(editor, (newVal) => {
    if (newVal) {
        // Call setContent here if `term_content` has already been loaded
        if (term_content.value) {
            editor.value.commands.setContent(term_content.value);
        }
    }
});

const title                      = ref("");
const facebook_or_vendors        = ref("");
const twitter_or_couples         = ref("");
const instgram                   = ref("");
const whatsapp                   = ref("");

const pinterest                  = ref("");
const indeed                     = ref("");
const youtube                    = ref("");
const discord                    = ref("");
const tiktok                     = ref("");

const title1                     = ref();
const title2                     = ref();
const title3                     = ref();
const title4                     = ref();
const title5                     = ref();
const title6                     = ref();

const htitle                      = ref("");
const hfacebook_or_vendors        = ref("");
const htwitter_or_couples         = ref("");
const htitle1                     = ref();
const htitle2                     = ref();
const htitle3                     = ref();
const htitle4                     = ref();
const htitle5                     = ref();
const htitle6                     = ref();





async function loadcontent() {
    fullpageloader.value = true;
    try {
        const response = await axios.get(`/home/handle_wcontent`);
        console.log(response.data, "response data >>>>>>>>>>>>>>>>>>>>>>>>>>>");
        
        if (response.data.status === "SENT") { 
            if (response.data.terms_data)  { 
                term_id.value = response.data.terms_data['id'];
                term_content.value = response.data.terms_data['content'];
                
                // If editor is initialized, set content
                if (editor.value && editor.value.commands) {
                    editor.value.commands.setContent(term_content.value);
                }
            }
            if (response.data.footer_data) {
                console.log('----data----',response.data.footer_data)
                footer_id.value = response.data.footer_data['id'];

                console.log(footer_id.value,"valueeeeeeeeeeeeeeeeeeeee")
                
                // display data show in frontend
                const ddata = response.data.footer_data;
                {console.log('--dddta---',ddata)}
                if (ddata){
                    
                    console.log(ddata.image1,'----IIIIIIIIIIIIIII-----')
                    title.value = response.data.footer_data['title'];
                    facebook_or_vendors.value = response.data.footer_data['facebook_or_vendors'];
                    twitter_or_couples.value = response.data.footer_data['twitter_or_couples'];
                    whatsapp.value = response.data.footer_data['whatsapp'];
                    pinterest.value = response.data.footer_data['pinterest'];
                    indeed.value = response.data.footer_data['indeed'];
                    youtube.value = response.data.footer_data['youtube'];
                    discord.value = response.data.footer_data['discord'];
                    tiktok.value = response.data.footer_data['tiktok'];
                    instgram.value = response.data.footer_data['instgram'];
                    title1.value = response.data.footer_data['title1'];
                    title2.value = response.data.footer_data['title2'];
                    title3.value = response.data.footer_data['title3'];
                    title4.value = response.data.footer_data['title4'];
                    title5.value = response.data.footer_data['title5'];
                    // images shown in frontend admin
                    protfolioFooter.value = [
                        ddata.image1 ? `${BASE_URL}${ddata.image1}` : '',
                        ddata.image2 ? `${BASE_URL}${ddata.image2}` : '',
                        ddata.image3 ? `${BASE_URL}${ddata.image3}` : '',
                        ddata.image4 ? `${BASE_URL}${ddata.image4}` : '',
                        ddata.image5 ? `${BASE_URL}${ddata.image5}` : '',
                        ddata.image6 ? `${BASE_URL}${ddata.image6}` : '',
                    ];
                }
               
            } 
        if (response.data.header_data) {
                console.log('----data----',response.data.header_data)
                header_id.value = response.data.header_data['id'];

                console.log(header_id.value,"hhhhhhhhhvalueeeeeeeeeeeeeeeeeeeee--hhhh")
                
                // display data show in frontend
                const hdata = response.data.header_data;
                {console.log('--dddta---',hdata)}
                if (hdata){

                    htitle.value = response.data.header_data['title'];
                    hfacebook_or_vendors.value = response.data.header_data['facebook_or_vendors'];
                    htwitter_or_couples.value = response.data.header_data['twitter_or_couples'];

                    htitle1.value = response.data.header_data['title1'];
                    htitle2.value = response.data.header_data['title2'];
                    htitle3.value = response.data.header_data['title3'];
                    htitle4.value = response.data.header_data['title4'];
                    htitle5.value = response.data.header_data['title5'];
                    htitle6.value = response.data.header_data['title6'];
                    
                }
               
            }   

            datacard.value = response.data.content; 
            alldata.value = response.data.alldata; 
            pageitem.value = response.data.pageitems;
        }
    } catch (error) {
        console.error("Error loading content:", error);
    } finally {
        fullpageloader.value = false;
    }
}




 
async function submitForm(type='',footer_id='',header_id=''){
    try {
        const formdata = new FormData();
        if (type == 'header'){
            console.log('header','----hhhhhh')

        fullpageloader.value = true;

        // const formdata = new FormData();
        formdata.append('title', htitle.value);
        formdata.append('facebook_or_vendors', hfacebook_or_vendors.value);
        formdata.append('twitter_or_couples', htwitter_or_couples.value);
        formdata.append('title1', htitle1.value);
        formdata.append('title2', htitle2.value);
        formdata.append('title3', htitle3.value);
        formdata.append('title4', htitle4.value);
        formdata.append('title5', htitle5.value);
        formdata.append('title6', htitle6.value);
        formdata.append('footer_id', footer_id);
        formdata.append('header_id',header_id)
        formdata.append('type', type);
        }

        
        else {
            
        fullpageloader.value = true;

        // const formdata = new FormData();
        formdata.append('title', title.value);
        formdata.append('facebook_or_vendors', facebook_or_vendors.value);
        formdata.append('twitter_or_couples', twitter_or_couples.value);
        formdata.append('instgram', instgram.value);
        formdata.append('whatsapp', whatsapp.value);
        formdata.append('pinterest', pinterest.value);
        formdata.append('indeed', indeed.value);
        formdata.append('youtube', youtube.value);
        formdata.append('discord', discord.value);
        formdata.append('tiktok', tiktok.value);
        formdata.append('title1', title1.value);
        formdata.append('title2', title2.value);
        formdata.append('title3', title3.value);
        formdata.append('title4', title4.value);
        formdata.append('title5', title5.value);
        formdata.append('footer_id', footer_id);
        formdata.append('header_id',header_id)
        formdata.append('type', type);

        hfuploadedFiles.value.forEach((file, index) => {
            if (file) {
                formdata.append(`image${index + 1}`, file);
            }
        });
    
        }

        const response = await axios.post('/home/create_header_footer', formdata);
        if (response.data.status === 'UPDATED') {
            showSuccessMessage.value = true;
            myerrors.value = 'Data Update successfully.';
            setTimeout(() => {
                showSuccessMessage.value = false;
                fullpageloader.value = false;
            }, 3000);   
        } 
        else if (response.data.status === 'SENT') {
            showSuccessMessage.value = true;
            myerrors.value = 'Data save successfully.';
            setTimeout(() => {
                showSuccessMessage.value = false;
                fullpageloader.value = false;
            }, 3000);   
        } else {
            myerrors.value = 'Failed to create the data.';
            setTimeout(() => {
                showSuccessMessage.value = false;
                fullpageloader.value = false;
            }, 3000);
        }

    } catch (error) {
        console.error("Error for data store:", error);
        myerrors.value = 'An error occurred while data create.';
        setTimeout(() => {
            showSuccessMessage.value = false;
            fullpageloader.value = false;
        }, 3000);
    } finally {
        fullpageloader.value = false;
    }
}



async function editme(uid:any=null, show=true,section=null){
   
    fullpageloader.value = true
    if (show){

        sectionitem.value=[]
        imageGroups.value =[]
        videoGroups.value = []
        // questionList.value = [{ question: '', answer: '' }];


       

        let item = alldata.value.find((a:any)=>(parseInt(a.id)==parseInt(uid)))
        console.log(item,"itemmmmmmmmmmmm")
        console.log(item.image1,"itemmmmmmmmmmmm")

        
        cid.value               = uid
        sectionitem.value       = item.page.sections.map((a:any)=>({'text':a.section, 'value':a.id}))
        // pagevalue.value     = pageitem.value.find((a:any)=>(a.value==item.page.id))
        // sectionvalue.value  = sectionitem.value.find((a:any)=>(a.value==item.section.id))
        pagevalue.value         = item.page.page
        sectionvalue.value      = item.section.section
        titlevalue.value        = item.title
        ctitlevalue.value       = item.ctitle
        contentvalue.value      = item.content
        splitcontentvalue.value = item.splitcontent
        editdialog.value        = true
        fullpageloader.value    = false
       

      

        const sectionImages = {


        'best big day': item.image1 ? [`${BASE_URL}${item.image1}`, item.image2 ? `${BASE_URL}${item.image2}` : item.image2] : [item.image1, item.image2],

        'about us': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],

        'faq': item.image1 ? [`${BASE_URL}${item.image1}`, item.image2 ? `${BASE_URL}${item.image2}` : item.image2] : [item.image1, item.image2],


        'get to know us': item.image1 ? [`${BASE_URL}${item.image1}`, item.image2 ? `${BASE_URL}${item.image2}` : item.image2, item.image3 ? `${BASE_URL}${item.image3}` : item.image3, item.image4 ? `${BASE_URL}${item.image4}` : item.image4] : [item.image1, item.image2, item.image3, item.image4],


        'onboarding options': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],


        'dashboard overview': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],


        'booking system': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],



        'revenue management': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],


        'calendar': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],

        'chats': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],


        'step1': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],


        'step2': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],


        'step3': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],


        'faqven': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],


        'faqcst': item.image1 ? [`${BASE_URL}${item.image1}`] : [item.image1],
    };

   
    if (sectionImages[section]) {
        imageGroups.value = sectionImages[section];
    }

    if (item.page.sections) {
        const additionalImages = item.page.sections
            .filter((sec: any) => sec.section === section && sec.images) // Ensure to check for images
            .flatMap((sec: any) => sec.images.map((img: string) => img ? `${BASE_URL}${img}` : img)); // Prepend 
        imageGroups.value = [...imageGroups.value, ...additionalImages];
    }

    const sectionvideos = {
    'about us': item.bvideo ? [{ url: `${BASE_URL}${item.bvideo.video}`, id: item.bvideo.id }] : [null],
    'get to know us': item.bvideo ? [{ url: `${BASE_URL}${item.bvideo.video}`, id: item.bvideo.id }] : [null],
    'vendor management': item.bvideo ? [{ url: `${BASE_URL}${item.bvideo.video}`, id: item.bvideo.id }] : [null],
};

    
    if (sectionvideos[section]) {
        console.log('section---',section)
        videoGroups.value = sectionvideos[section];
    }

    }else{
        console.log( 'vvv-----',uploadedVideoFile.value)
        const fd = new FormData
        fd.append("cid", cid.value)
        fd.append("title", titlevalue.value)
        fd.append("ctitle", ctitlevalue.value)
        fd.append("content", contentvalue.value)
        fd.append("splitcontent", splitcontentvalue.value)

        uploadedFiles.value.forEach((file, index) => {
            if (file) {
                fd.append(`image${index + 1}`, file); 
            }
        });
        

        uploadedVideoFile.value.forEach((file, index) => {
        if (file) {
        fd.append(`bvideo`, file);
        }
    });
    fd.append('videos_to_remove', JSON.stringify(videoFilesToRemove.value));
       
        const response = await axios.post('/home/handle_wcontent',fd)
        if (response.data.status=="UPDATED"){ 
            fullpageloader.value = false
            myerrors.value = "Section Updated."
            showSuccessMessage.value = true;
            setTimeout(() => { showSuccessMessage.value = false; }, 3000);
            editdialog.value    = false
            loadcontent();
        }
    }
}



function getEditorText(html=true) {
    try {return (html) ? document.querySelector('.tiptap').innerHTML : document.querySelector('.tiptap').textContent;}
    catch (e) { console.log("got error in editor________________________", e); return '' }
}


async function add_term_conditions(term_id='') {
    try {
        
        const editorContent = getEditorText(true); 
        fullpageloader.value = true;

        // Validate that the content is not empty
        if (!editorContent.trim() || editorContent == '<p><br class="ProseMirror-trailingBreak"></p>') {
            myerrors.value = 'Please provide content for Privay Policy.';
            showErrorMessage.value = true;
            setTimeout(() => {
                showErrorMessage.value = false;
                fullpageloader.value = false;
            }, 3000);
            return;
        }

        const formdata = new FormData();
        formdata.append('term_conditions', editorContent);
        formdata.append('terms_id', term_id);

        const response = await axios.post('/home/term_conditions', formdata);

        if (response.data.status === 'UPDATED') {
            showSuccessMessage.value = true;
            myerrors.value = 'Terms and conditions successfully updated.';
            setTimeout(() => {
                showSuccessMessage.value = false;
                fullpageloader.value = false;
            }, 3000);

            if (response.data.term_conditions) {
                editor?.commands.setContent(response.data.term_conditions);
            }
        } else {
            myerrors.value = 'Failed to update terms and conditions.';
            setTimeout(() => {
                showSuccessMessage.value = false;
                fullpageloader.value = false;
            }, 3000);
        }

    } catch (error) {
        console.error("Error updating terms and conditions:", error);
        myerrors.value = 'An error occurred while updating the terms and conditions.';
        setTimeout(() => {
            showSuccessMessage.value = false;
            fullpageloader.value = false;
        }, 3000);
    } finally {
        fullpageloader.value = false;
    }
}



</script>
<template>
     <div class="loader" v-if="fullpageloader"><span class="loader-17"> </span><div class="loaderinner"><img src="@/assets/images/wedding/mainloader.png" /></div></div>
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
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" rounded="md" class="bg-grey100 border-0 h-100">
                <v-card-item class="pa-sm-6 pa-3">
                    <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="8">
                            <v-card-title class="text-h4 ">
                                Website Data
                            </v-card-title>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-sm-end justify-start">
                           

                            <v-dialog v-model="editdialog" scrollable class="dialog-mw" :max-width="800">

                                <!-- Condition for Customer page and package secton change heading -->
                                <v-card v-if="pagevalue === 'customer' && sectionvalue === 'packages'" class="pa-6" >
                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                        <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize"> Edit Content </h4>
                                        <v-btn icon color="" @click="editdialog = false" flat variant="outlined" size="x-small" class="bg-error">
                                            <XIcon width="13" />
                                        </v-btn>
                                    </div>
                                    <div class="mt-3">
                                        <p class="text-Darklight font-weight-semibold text-body-1 text-capitalize">Page Name  : {{pagevalue}}</p>
                                        <p class="text-Darklight font-weight-semibold text-body-1 mb-3 text-capitalize">Section Name  : {{sectionvalue}}</p>
                                        <v-row>
                                           
                                            <v-col cols="12">
                                                <div class="">
                                                    <!-- <v-label class="text-subtitle-1 font-weight-medium pb-2">Main Heading</v-label>
                                                    <v-textarea v-model="titlevalue" outlined name="Note" placeholder="Enter title" hide-details color="secondary"></v-textarea> -->
                                                    <v-col cols="12" class="pb-0">
                                                        <label class="text-subtitle-1 font-weight-medium pb-2">Main Heading</label>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <VTextField v-model="titlevalue" hide-details="auto" placeholder="Enter title" color="secondary" ></VTextField>
                                                    </v-col>
                                                </div>
                                            </v-col>
                                        </v-row>        
                                    </div>
                                    <v-card-actions class="px-0 d-flex justify-end w-100">

                                        <v-btn class="bg-error rounded-sm" text @click="editdialog=false" flat>
                                            Close
                                        </v-btn>

                                        <v-btn class="bg-secondary rounded-sm" @click="editme(0, false)" text flat >
                                            Save
                                        </v-btn>

                                    </v-card-actions>
                                </v-card>
                           
                                <v-card v-else class="pa-6" >
                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                        <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize"> Edit Content </h4>
                                        <v-btn icon color="" @click="editdialog = false" flat variant="outlined" size="x-small" class="bg-error">
                                            <XIcon width="13" />
                                        </v-btn>
                                    </div>
                                    <div class="mt-3">
                                        <p class="text-Darklight font-weight-semibold text-body-1 text-capitalize">Page Name  : {{pagevalue}}</p>
                                        <p class="text-Darklight font-weight-semibold text-body-1 mb-3 text-capitalize">Section Name  : {{sectionvalue}}</p>
                                        <v-row>
                                           
                                            <v-col cols="12">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Main Heading</v-label>
                                                    <v-textarea v-model="titlevalue" outlined name="Note" placeholder="Enter title" hide-details color="secondary"></v-textarea>
                                                </div>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-label class="text-subtitle-1 font-weight-medium pb-2">Theme Text</v-label>
                                                <VTextField hide-details="auto" label="Enter Coloured Title" v-model="ctitlevalue" class="" required color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="12">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Banner Content</v-label>
                                                    <v-textarea v-model="contentvalue" outlined name="Note" placeholder="Enter paragraph content" hide-details color="secondary" ></v-textarea>
                                                </div>
                                            </v-col>
                                            <v-col cols="12">
                                                <div class="">
                                                    <v-label class="text-subtitle-1 font-weight-medium pb-2">Splitted Content (Optional)</v-label>
                                                    <v-textarea v-model="splitcontentvalue" outlined name="Note" placeholder="Enter splitted paragraph content" hide-details color="secondary" ></v-textarea>
                                                </div>
                                            </v-col>
                                        </v-row>
                                       
                                        <v-row>
                                            <v-col v-for="(imageSec, index) in imageGroups" :key="'group-' + index" cols="6" md="3">
                                                <h4 class="text-subtitle-1 font-weight-medium mb-3">
                                                    Upload Image {{ index + 1 }} 
                                                    <span style="color: red;"> * </span>
                                                </h4>
                                            <div class="image-preview-custom">
                                                <!-- Show the uploaded image if available -->
                                                <div class="innerImagesCol" v-if="imageSec">
                                                <img :src="imageSec" alt="Image preview"  style="max-width: 100%;" />
                                                
                                                <div class="d-flex mt-2">
                                                <v-btn variant="flat" icon color="grey200" size="x-small" class="floatEditBtn">
                                                    <PencilIcon stroke-width="2" size="18" />
                                                    <v-tooltip activator="parent" location="top">Upload Image</v-tooltip>
                                                    
                                                    <!-- Hidden file input styled to cover the button area -->
                                                    <input
                                                    type="file"
                                                    accept="image/*"
                                                    @change="(event) => handleImageUpload(event, index, 'imageGroups')"
                                                    style="position: absolute; opacity: 0; left: 0; top: 0; width: 100%; height: 100%; cursor: pointer;"
                                                    />
                                                </v-btn>
                                                </div>
                                                
                                                
                                                </div>
                                                <!-- Input for image upload -->
                                                <label v-if="!imageSec" :for="'group-labelInput' + index" class="labelImageStyleHere">
                                                <PlusIcon size="18" />
                                                <input
                                                    :id="'group-labelInput' + index"
                                                    type="file"
                                                    accept="image/*"
                                                    @change="(event) => handleImageUpload(event, index, 'imageGroups')"
                                                />
                                                </label>
                                            </div>
                                            </v-col>

                                        </v-row>
                                                             
                                        <v-row v-if="(pagevalue === 'about' || pagevalue === 'customer' || pagevalue === 'vendor') && (sectionvalue === 'about us' || sectionvalue === 'get to know us' || sectionvalue === 'vendor management')">
                                        <v-col v-for="(videoSec, index) in videoGroups" :key="'group-' + index" cols="12" md="12">
                                            <h4 class="text-subtitle-1 font-weight-medium mb-3">
                                            Upload Video <span style="color: red;">*</span>
                                            </h4>

                                            <div class="video-preview-custom" style="position: relative;">
                                            <!-- Show uploaded video if available -->
                                            <div class="innerVideosCol" v-if="videoSec && videoSec.url">
                                                <video controls style="max-width: 100%; position: relative;">
                                                <source :src="videoSec.url" type="video/mp4" />
                                                Your browser does not support the video tag.
                                                </video>
                                            </div>

                                            <!-- Fallback video -->
                                            <div v-else>
                                                <video autoplay loop muted controls style="max-width: 100%; position: relative;">
                                                <source src="@/assets/images/website/file_bg.mp4" type="video/mp4">
                                                </video>
                                            </div>

                                            <!-- Video Controls -->
                                            <div class="d-flex mt-2" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                                                <div class="position-relative">
                                                <v-btn variant="flat" icon color="grey200" size="x-small">
                                                    <PencilIcon stroke-width="2" size="18" />
                                                    <v-tooltip activator="parent" location="top">Upload Video</v-tooltip>
                                                    <input
                                                    type="file"
                                                    accept="video/*"
                                                    class="ctm_videoo"
                                                    @change="(event) => handleVideoUpload(event, index)"
                                                    />
                                                </v-btn>
                                                </div>

                                                <v-btn v-if="videoSec" variant="flat" size="x-small" class="ml-2 refreshbtn v-btn--icon bg-secondary" @click="removevideos(index,videoSec.id)">
                                                <RefreshIcon stroke-width="2" size="18" />
                                                <v-tooltip activator="parent" location="top">Reset Video</v-tooltip>
                                                </v-btn>
                                            </div>
                                            <!-- If no static vido -->
                                            <!-- <label v-if="!videoSec" :for="'group-labelInput' + index" class="labelVideoStyleHere"> 
                                                <input
                                                :id="'group-labelInput' + index"
                                                type="file"
                                                accept="video/*"
                                                @change="(event) => handleVideoUpload(event, index)"
                                                style="position: absolute; opacity: 0; left: 0; top: 0; width: 100%; height: 100%; cursor: pointer;"
                                                />
                                            </label> -->
                                            </div>
                                        </v-col>
                                        </v-row>
                                       

                                    </div>
                                    <v-card-actions class="px-0 d-flex justify-end w-100">

                                        <v-btn class="bg-error rounded-sm" text @click="editdialog=false" flat>
                                            Close
                                        </v-btn>

                                        <v-btn class="bg-secondary rounded-sm" @click="editme(0, false)" text flat >
                                            Save
                                        </v-btn>

                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                        </v-col>
                    </v-row>
                    <!-- Footer Modal Start-->
                    <v-dialog v-model="footerDialog" scrollable class="dialog-mw" :max-width="800">
                        <v-card class="pa-6" >
                            <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize"> Footer Content</h4>
                                <v-btn icon color="" @click="footerDialog = false" flat variant="outlined" size="x-small" class="bg-error">
                                    <XIcon width="13" />
                                </v-btn>
                            </div>

                            <div class="">
                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <label class="text-h5 text-primary">Branding Column</label>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea v-model="title" outlined name="Note" label="Branding Content" placeholder="Enter title" hide-details color="secondary"></v-textarea>
                                    </v-col>
                                    <v-col cols="6">
                                        <VTextField v-model="facebook_or_vendors " hide-details="auto" label="Enter Facebook URL" color="secondary" ></VTextField>
                                    </v-col>
                                    <v-col cols="6">
                                        <VTextField v-model="twitter_or_couples " hide-details="auto" label="Enter Twitter URL" color="secondary" ></VTextField>
                                    </v-col>
                                    <v-col cols="6">
                                        <VTextField v-model="instgram " hide-details="auto" label="Enter Instagram URL" color="secondary" ></VTextField>
                                    </v-col>
                                    <!-- <v-col cols="6">
                                        <VTextField v-model="whatsapp " hide-details="auto" label="Enter Whats App Number" color="secondary" ></VTextField>
                                    </v-col> -->

                                    
                                    <v-col cols="6">
                                        <VTextField v-model="pinterest " hide-details="auto" label="Enter Pinterest Url" color="secondary" ></VTextField>
                                    </v-col>
                                    <v-col cols="6">
                                        <VTextField v-model="indeed " hide-details="auto" label="Enter Linkedin Url" color="secondary" ></VTextField>
                                    </v-col>
                                    <v-col cols="6">
                                        <VTextField v-model="youtube " hide-details="auto" label="Enter YouTube Url" color="secondary" ></VTextField>
                                    </v-col><v-col cols="6">
                                        <VTextField v-model="discord " hide-details="auto" label="Enter Discord Url" color="secondary" ></VTextField>
                                    </v-col>
                                    <v-col cols="6">
                                        <VTextField v-model="tiktok " hide-details="auto" label="Enter TikTok Url" color="secondary" ></VTextField>
                                    </v-col>

                                </v-row>
                                <!-- <hr class="mt-8 mb-8"> -->
                                <!-- <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <label class="text-h6 text-primary">Information</label>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row>
                                            <v-col cols="6">
                                                <VTextField v-model="title1" hide-details="auto" label="Enter First Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select v-model="url1" :items="menuListFooter" item-title="text" item-value="value"
                                                    label="Select First Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <VTextField v-model="title2" hide-details="auto" label="Enter Second Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select v-model="url2" :items="menuListFooter" item-title="text" item-value="value"
                                                    label="Select Second Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <VTextField v-model="title3" hide-details="auto" label="Enter Third Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select v-model="url3" :items="menuListFooter" item-title="text" item-value="value"
                                                    label="Select Third Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <VTextField v-model="title4" hide-details="auto" label="Enter Fourth Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select v-model="url4" :items="menuListFooter" item-title="text" item-value="value"
                                                    label="Select Fourth Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <VTextField v-model="title5" hide-details="auto" label="Enter Fifth Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select v-model="url5" :items="menuListFooter" item-title="text" item-value="value"
                                                    label="Select Fifth Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row> -->
                                <!-- <hr class="mt-8 mb-8"> -->
                                <!-- <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <label class="text-h6 text-primary">Contact Detail</label>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Email</v-label>
                                        <v-row>
                                            <v-col cols="6">
                                                <VTextField hide-details="auto" label="Enter Email Content" color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <VTextField hide-details="auto" label="Enter Email URL" color="secondary" ></VTextField>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Phone</v-label>
                                        <v-row>
                                            <v-col cols="6">
                                                <VTextField hide-details="auto" label="Enter Phone Content" color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <VTextField hide-details="auto" label="Enter Phone URL" color="secondary" ></VTextField>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-label class="text-subtitle-1 font-weight-medium pb-2">Address</v-label>
                                        <v-row>
                                            <v-col cols="6">
                                                <VTextField hide-details="auto" label="Enter Address Content" color="secondary" ></VTextField>
                                            </v-col>
                                            <v-col cols="6">
                                                <VTextField hide-details="auto" label="Enter Address URL" color="secondary" ></VTextField>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row> -->
                                <hr class="mt-8 mb-8">

                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <label class="text-h6 text-primary">Portfolios</label>
                                    </v-col>
                                    <v-col v-for="(image, index) in protfolioFooter" :key="'footer-' + index" cols="6" md="4">
                                    <h4 class="text-subtitle-1 font-weight-medium mb-3">Portfolio Upload Image {{ index + 1 }}</h4>
                                    <div  class="image-preview-custom">
                                        <!-- Show the uploaded image if available -->
                                        <div class="innerImagesCol" v-if="image">
                                            <img :src="image" alt="Image preview" style="max-width: 100%;" />
                                            <!-- Remove button to clear the uploaded image -->
                                            <!-- <v-btn  @click="removeImage(index, 'protfolioFooter')" variant="flat"  icon color="grey200" size="x-small" class="floatEditBtn">
                                                <PencilIcon stroke-width="2" size="18"  />
                                                <v-tooltip activator="parent" location="top">Edit Image</v-tooltip>
                                            </v-btn> -->
                                             
                                            
                                            <v-btn  variant="flat"  icon color="grey200" size="x-small" class="floatEditBtn">
                                            <PencilIcon stroke-width="2" size="18" />
                                            <v-tooltip activator="parent" location="top">Upload Image</v-tooltip>

                                            <!-- Hidden file input -->
                                            <input 
                                                :id="'footer-labelInput' + index"
                                                type="file"
                                                accept="image/*"
                                                 @change="(event) => handleImageUpload(event, index, 'protfolioFooter')"
                                                 style="position: absolute; opacity: 0; left: 0; top: 0; width: 100%; height: 100%; cursor: pointer;"
                                               
                                            />
                                            </v-btn>
                                        </div>
                                        <!-- Input for image upload -->
                                        <label v-if="!image" :for="'footer-labelInput' + index" class="labelImageStyleHere">
                                        <PlusIcon size="18" />
                                        <input 
                                            :id="'footer-labelInput' + index"
                                            type="file"
                                            accept="image/*"
                                            @change="(event) => handleImageUpload(event, index, 'protfolioFooter')"
                                        />
                                        </label>


                                       
                                    </div>
                                    </v-col>


                                </v-row>
                            </div>
                            
                            <v-card-actions class="px-0 d-flex justify-end w-100">

                                <v-btn class="bg-error rounded-sm" text @click="footerDialog = false" flat>
                                    Close
                                </v-btn>

                                <v-btn class="bg-secondary rounded-sm"  text @click="submitForm('footer',footer_id,'')" flat >
                                    Save 
                                </v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!--Footer Modal End-->

                    <!-- Header Modal Start-->
                    <v-dialog v-model="headerDialog" scrollable class="dialog-mw" :max-width="800">
                        <v-card class="pa-6" >
                            <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize"> Header Content</h4>
                                <v-btn icon color="" @click="headerDialog = false" flat variant="outlined" size="x-small" class="bg-error">
                                    <XIcon width="13" />
                                </v-btn>
                            </div>

                            <div class="">
                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <label class="text-h5 text-primary">Top Header</label>
                                    </v-col>
                                    <v-col cols="12">
                                        <VTextField v-model="htitle" hide-details="auto" label="Enter Welcome Text" color="secondary" ></VTextField>
                                    </v-col>
                                    <v-col cols="12">
                                        <VTextField v-model="hfacebook_or_vendors" hide-details="auto" label="Become a vendor" color="secondary" ></VTextField>
                                    </v-col>
                                    <!-- <v-col cols="6">
                                        <VTextField hide-details="auto" label="Enter  URL" color="secondary" ></VTextField>
                                    </v-col> -->
                                    <v-col cols="12">
                                        <VTextField v-model="htwitter_or_couples" hide-details="auto" label="Vendor Packages" color="secondary" ></VTextField>
                                    </v-col>
                                    <!-- <v-col cols="6">
                                        <VTextField hide-details="auto" label="Enter URL" color="secondary" ></VTextField>
                                    </v-col> -->
                                </v-row>
                                <hr class="mt-8 mb-8">
                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <label class="text-h6 text-primary">Header Navigation</label>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row>
                                            <v-col cols="12">
                                                <VTextField v-model="htitle1" hide-details="auto" label="Enter First Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <!-- <v-col cols="6">
                                                <v-select v-model="menuHeaderModel1" :items="menuListHeader" item-title="text" item-value="value"
                                                    label="Select First Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col> -->
                                            <v-col cols="12">
                                                <VTextField v-model="htitle2" hide-details="auto" label="Enter Second Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <!-- <v-col cols="6">
                                                <v-select v-model="menuHeaderModel2" :items="menuListHeader" item-title="text" item-value="value"
                                                    label="Select Second Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col> -->
                                            <v-col cols="12">
                                                <VTextField v-model="htitle3" hide-details="auto" label="Enter Third Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <!-- <v-col cols="6">
                                                <v-select v-model="menuHeaderModel3" :items="menuListHeader" item-title="text" item-value="value"
                                                    label="Select Third Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col> -->
                                            <v-col cols="12">
                                                <VTextField v-model="htitle4" hide-details="auto" label="Enter Fourth Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <!-- <v-col cols="6">
                                                <v-select v-model="menuHeaderModel4" :items="menuListHeader" item-title="text" item-value="value"
                                                    label="Select Fourth Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col> -->
                                            <v-col cols="12">
                                                <VTextField v-model="htitle5" hide-details="auto" label="Enter Fifth Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <!-- <v-col cols="6">
                                                <v-select v-model="menuHeaderModel5" :items="menuListHeader" item-title="text" item-value="value"
                                                    label="Select Fifth Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col> -->
                                            <v-col cols="12">
                                                <VTextField v-model="htitle6" hide-details="auto" label="Enter Sixth Menu Text" color="secondary" ></VTextField>
                                            </v-col>
                                            <!-- <v-col cols="6">
                                                <v-select v-model="menuHeaderModel6" :items="menuListHeader" item-title="text" item-value="value"
                                                    label="Select Fifth Menu" single-line variant="outlined" hide-details>
                                                </v-select>
                                            </v-col> -->
                                            <!-- <v-col cols="12">
                                                <VTextField hide-details="auto" label="Button Text" color="secondary" ></VTextField>
                                            </v-col> -->
                                            <!-- <v-col cols="6">
                                                <VTextField hide-details="auto" label="Button URL" color="secondary" ></VTextField>
                                            </v-col> -->
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </div>
                            
                            <v-card-actions class="px-0 d-flex justify-end w-100">

                                <v-btn class="bg-error rounded-sm" text @click="headerDialog = false" flat>
                                    Close
                                </v-btn>
                                
                                <v-btn class="bg-secondary rounded-sm" text @click="submitForm('header','',header_id)" flat >
                                    Save
                                </v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!--Header Modal End-->

                    <v-row>
                        <v-col cols="12">
                            <v-expansion-panels v-model="panel">
                                <v-expansion-panel elevation="10" class="mb-3" v-for="(value, key) in datacard" :key="key">
                                    <v-expansion-panel-title class="text-capitalize text-h6 py-6">{{key}}</v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <v-row class="py-4 px-2">
                                            <template v-if="value.find(item => item.page.page === 'faq')">
                                                <v-col cols="12" md="4" class="">
                                                    <v-card elevation="10" class="border bg-lightprimary h-100 d-flex align-center justify-center">
                                                        <!-- <v-btn color="primary" @click="openCreateDataDialog">
                                                            <PlusIcon size="14"  />Create FAQ Question
                                                        </v-btn>  -->
                                                        <v-btn color="primary" @click="$router.push('/faq_content')">
                                                        Manage Category Faq data
                                                        </v-btn>
                                                    </v-card>
                                                </v-col>
                                            </template>
                                            <!-- <v-btn color="primary" @click="$router.push('/faq_content')">
                                                Manage Category Faq data
                                            </v-btn> -->

                                            <v-col cols="12" md="4" v-for="item in value" :key="item">
                                                <v-card elevation="10" class="border pageCardDesign h-100">
                                                    <v-card-item class="">
                                                        <p class="font-weight-semibold text-h5">
                                                            Section : {{item.section.section}}
                                                        </p>
                                                        <p class="text-Darklight font-weight-semibold text-body-1" v-if="item.title || item.ctitle">
                                                            Title : {{item.title}} {{ item.ctitle }}
                                                        </p>
                                                        <div class="d-flex mt-2">
                                                            <v-btn  @click="editme(item.id, true,item.section.section)" variant="flat"  icon color="grey200" size="x-small" class="floatEditBtn">
                                                                <PencilIcon stroke-width="2" size="18"  />
                                                                <v-tooltip activator="parent" location="top">Edit Section Content</v-tooltip>
                                                            </v-btn>
                                                        </div>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>



                                <!-- Header and Footer Start Here-->
                               <v-expansion-panel elevation="10" class="mb-3">
                                    <v-expansion-panel-title class="text-h6 py-6">Header & Footer</v-expansion-panel-title>
                                    <v-expansion-panel-text> 
                                        <v-row class="py-4 px-2">
                                            <v-col cols="12" md="6">
                                                <v-card elevation="10" class="border pageCardDesign">
                                                    <v-card-item class="">
                                                        <p class="font-weight-semibold text-h5">
                                                            All Header  Content Here 
                                                        </p>
                                                      
                                                        <div class="d-flex mt-2">
                                                            <v-btn  @click="headerDialog = true" variant="flat"  icon color="grey200" size="x-small" class="floatEditBtn">
                                                                <PencilIcon stroke-width="2" size="18"  />
                                                                <v-tooltip activator="parent" location="top">Edit Section Content</v-tooltip>
                                                            </v-btn>
                                                        </div>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-card elevation="10" class="border pageCardDesign">
                                                    <v-card-item class="">
                                                        <p class="font-weight-semibold text-h5">
                                                            All Footer  Content Here 
                                                        </p>
                                                      
                                                        <div class="d-flex mt-2">
                                                            <v-btn  @click="footerDialog = true" variant="flat"  icon color="grey200" size="x-small" class="floatEditBtn">
                                                                <PencilIcon stroke-width="2" size="18"  />
                                                                <v-tooltip activator="parent" location="top">Edit Section Content</v-tooltip>
                                                            </v-btn>
                                                        </div>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-text>
                                </v-expansion-panel> 
                                <!-- Header and Footer End Here-->


                                

                               <v-expansion-panel elevation="10" class="mb-3">
                                    <v-expansion-panel-title class="text-h6 py-6">Privacy Policy</v-expansion-panel-title>
                                    <v-expansion-panel-text> 
                                        <v-row>
                                            <v-col cols="12">
                                                <v-label class="font-weight-medium mb-2 d-block">
                                                Edit Privacy Policy Text Editor
                                                </v-label>
                                                <div class="rounded custom-border">
                                                <div v-if="editor">
                                                    <EditorMenubar :editor="editor" />
                                                </div>
                                                <editor-content :editor="editor" ref="editorContentRef" />
                                                </div>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" class="text-start">
                                                <v-btn @click="add_term_conditions(term_id)" flat color="primary" class="submit_btn text-white mb-5">Save</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-text>
                                    </v-expansion-panel> 


                                <!--<v-expansion-panel elevation="10" class="mb-3">
                                    <v-expansion-panel-title  class="text-h6 py-6">For Couple Page</v-expansion-panel-title>
                                    <v-expansion-panel-text> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</v-expansion-panel-text>
                                </v-expansion-panel>


                                <v-expansion-panel elevation="10" class="mb-3">
                                    <v-expansion-panel-title  class="text-h6 py-6">For Vendor Page</v-expansion-panel-title>
                                    <v-expansion-panel-text> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</v-expansion-panel-text>
                                </v-expansion-panel>


                                <v-expansion-panel elevation="10" class="mb-3">
                                    <v-expansion-panel-title  class="text-h6 py-6">How It Works Page</v-expansion-panel-title>
                                    <v-expansion-panel-text> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</v-expansion-panel-text>
                                </v-expansion-panel>


                                <v-expansion-panel elevation="10" class="mb-3">
                                    <v-expansion-panel-title  class="text-h6 py-6">FAQ Page</v-expansion-panel-title>
                                    <v-expansion-panel-text> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</v-expansion-panel-text>
                                </v-expansion-panel>


                                <v-expansion-panel elevation="10" class="mb-3">
                                    <v-expansion-panel-title  class="text-h6 py-6">Contact Page</v-expansion-panel-title>
                                    <v-expansion-panel-text> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</v-expansion-panel-text>
                                </v-expansion-panel> -->
                                
                            </v-expansion-panels>
                        </v-col>
                    </v-row>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.floatEditBtn {
    position: absolute;
    top: 5px;
    right: 5px;
}
.pageCardDesign {
    border: 2px solid #ccc !important;
    border-radius: 12px !important;
    border-left: 7px solid #b4801c !important;
    background: #ffffff;
}
.sectionIMg {
    
    width : 50px;
    height: 50px;
    object-fit: cover;
    border-radius : 50%;
}
.image-preview {
  position: relative;
  margin-bottom: 10px;
}
.image-preview img {
  max-width: 100%; /* Adjust according to your needs */
}
.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
.innerImagesCol {
    position: relative;
}
.innerImagesCol {
    position: relative;
}
.labelImageStyleHere {
    width: 100%;
    height: 150px;
    border: 2px dashed #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor:pointer;
    overflow: hidden;
}
.labelImageStyleHere > input[type="file"] {
    opacity: 0;
    visibility: hidden;
}
.labelImageStyleHere svg {
    position: absolute;
    width: 40px;
    height: 40px;
    stroke: #c7c7c7;
}
.delete-icon > svg {
    stroke: #ff0a0a;
}
.v-field--active label.v-label.v-field-label {
    color: #000000;
}
.ctm_videoo{
    opacity: 0;
    position: absolute;
    right: 10px;
    width: 39px;
    z-index: 9;
}
</style>