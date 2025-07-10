<script setup lang="ts">
import { ref, computed ,watch,toRaw  } from 'vue';
import 'v-calendar/dist/style.css';
import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import { TrashIcon } from 'vue-tabler-icons';



const fullpageloader = ref(true)
const myerrors                      = ref('');
const showSuccessMessage            = ref(false);
const showErrorMessage              = ref(false);



const cid               = ref()
const alldata           = ref([])
const datacard          = ref([])
const pagevalue         = ref("");
const pageitem          = ref([])
const sectionvalue      = ref("");
const sectionitem       = ref([])
const titlevalue        = ref("");
const ctitlevalue       = ref("");
const questionvalue       = ref("");
const answervalue       = ref("");
const category_data     = ref([]);
const categoryvalue     = ref("");
const location_data     = ref([]);
const locationvalue     = ref("");
const contentvalue      = ref("");
const splitcontentvalue = ref("");
const faqsitem          = ref([]);

// for create variable
const category_create_data     = ref([]);
const categorycreatevalue     = ref("");
const location_create_data     = ref([]);
const locationcreatevalue     = ref("");

// for filter
const category_filter_data     = ref([]);
const categoryfiltervalue     = ref("");
const location_filter_data     = ref([]);
const locationfiltervalue     = ref("");


const itemsPerPage = 5;
const currentPage = ref(1);
const search = ref('');
const editdialog = ref(false);


import { nextTick } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import 'v-calendar/dist/style.css';

const reqrules   = ref([(v: string) => !!v || 'This field is required']);


async function loadcontent() {
    fullpageloader.value = true;
    try {
  
        const response = await axios.get(`/home/handle_faqcontent`);
        console.log(response.data, "response data >>>>>>>>>>>>>>>>>>>>>>>>>>>");
        
        if (response.data.status === "SENT") {
            console.log("Content:", response.data);
            // for display
            datacard.value = response.data.content; 
            alldata.value = response.data.alldata; 
           
            pageitem.value = response.data.pageitems;
            location_data.value = response.data.all_loc_state;
            category_data.value = response.data.catsrl_data;

            // for create and edit 
            category_create_data.value = response.data.catsrl_data
            location_create_data.value = response.data.all_loc_state

            // for filter
            // category_filter_data.value = response.data.catsrl_data
            // location_filter_data.value  = response.data.all_loc_state

            category_filter_data.value = [{ id: null, name: "All Categories" }, ...response.data.catsrl_data];
            location_filter_data.value = [{ value: null, text: "All Locations" }, ...response.data.all_loc_state];
        }
    } catch (error) {
        console.error("Error loading content:", error);
    } finally {
        fullpageloader.value = false;
    }
}
loadcontent()



const filteredList = computed(() => {
  const searchTerm = search.value.toLowerCase();

  return alldata.value.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const matchSearch = title.includes(searchTerm);

    const matchCategory = categoryfiltervalue.value
      ? item.category?.id === categoryfiltervalue.value
      : true;

    const matchLocation = locationfiltervalue.value
      ? item.states?.id === locationfiltervalue.value
      : true;

    return matchSearch && matchCategory && matchLocation;
  });
});



const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.value.slice(start, end);
});



const editor = useEditor({
    editorProps: {
    attributes: {
      class: 'custom-tiptap-style',
    }
    },
    extensions: [StarterKit],
    content: ``
});


function getEditorText(html = true) {
    try {
        return (html && editor.value) ? editor.value.getHTML() : editor.value?.getText() || '';
    } catch (e) {
        console.log("got error in editor________________________", e);
        return '';
    }
}



async function editme(uid:any=null, show=true,section=null){
   
    fullpageloader.value = true
    if (show){

        sectionitem.value=[]
        questionList.value = [{ question: '', answer: '' }];

        let item = alldata.value.find((a:any)=>(parseInt(a.id)==parseInt(uid)))
        console.log(item,"itemmmmmmmmmmmm")

        cid.value               = uid
        sectionitem.value       = item.page.sections.map((a:any)=>({'text':a.section, 'value':a.id}))
        pagevalue.value         = item.page.page
        sectionvalue.value      = item.section.section
        titlevalue.value        = item.title
        // ctitlevalue.value       = item.ctitle
        faqsitem.value          = item.faqs 
        questionvalue.value     = item.faqs.question
        answervalue.value       = item.faqs.answer

        console.log("category_data:", category_data.value); // Check if categories exist
        console.log("item.category:", item.category); // Check item category value
        console.log("Main Content here----",item.ctitle)
        if (item.ctitle) {
            await nextTick(); 
            if (editor.value) {
                editor.value.commands.setContent(item.ctitle);
            } else {
                console.warn("Editor is not ready yet");
            }
        }

        if (category_create_data.value.length > 0 && item.category?.id) {
                categorycreatevalue.value = parseInt(item.category.id);
            }

        if (location_create_data.value.length > 0 && item.states?.id) {
        setTimeout(() => {
            locationcreatevalue.value = parseInt(item.states.id);
            console.log('Set locationcreatevalue:', locationcreatevalue.value);
        }, 100);}


        editdialog.value        = true
        fullpageloader.value    = false
       

    }else{
        console.log("faqsitem_______Ye part chala_________", faqsitem.value)
        console.log("New Questions________________", questionList.value);
        const fd = new FormData
        fd.append("cid", cid.value)
        fd.append("title", titlevalue.value)
        // fd.append("ctitle", ctitlevalue.value)
        fd.append("ctitle",getEditorText())
        fd.append("categoryvalue", categorycreatevalue.value?.id || categorycreatevalue.value || '');
        fd.append("locationvalue", locationcreatevalue.value?.value || locationcreatevalue.value || '');


        const allFAQs = [
        ...faqsitem.value.map((a) => [a.id, a.question, a.answer]),  // Existing FAQs with IDs
        ...questionList.value.filter(q => q.question && q.answer).map((q) => [null, q.question, q.answer])  // New questions (ID null)
        ];
        fd.append("faqs", JSON.stringify(allFAQs));
        const response = await axios.post('/home/handle_faqcontent',fd)
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


async function delete_faq_data(id){
    console.log("delete_faq_data part___")
    fullpageloader.value = true;
    const fd = new FormData
    fd.append("delete_faq","delete_faq");
    fd.append("cid",id)
    const response = await axios.post('/home/handle_faqcontent',fd)
    if (response.data.status == "DELETED"){
        fullpageloader.value = false;
        myerrors.value = "Section Deleted"
        showSuccessMessage.value = true;
        setTimeout(() => { showSuccessMessage.value = false;}, 3000);
        loadcontent();
    }
}



async function create_faq_data() {
    fullpageloader.value = true;
    console.log('data--craete funct--')
    
    const fd = new FormData();
    fd.append("faq_data", "faq_data");
    fd.append("title", titlevalue.value || "");
    // fd.append("ctitle", ctitlevalue.value || "")
    fd.append("ctitle", getEditorText())
    fd.append("categoryvalue", categorycreatevalue.value || ""); 
    fd.append("locationvalue", locationcreatevalue.value || "" )
    console.log('titlevalue---',titlevalue.value)
    console.log('categoryvalue---',categoryvalue.value)
    
    // Convert new FAQs to JSON string
    fd.append("newfaqs", JSON.stringify(questionList.value.map(q => ({
        question: q.question, 
        answer: q.answer
    }))));

    try {
        const response = await axios.post('/home/handle_faqcontent', fd);
        
        if (response.data.status === "CREATED") { 
            fullpageloader.value = false;
            myerrors.value = "Section Created.";
            showSuccessMessage.value = true;
            
            setTimeout(() => { showSuccessMessage.value = false; 
                window.location.reload();
            }, 1000);
            
            editdialog.value = false;
        }
    } catch (error) {
        console.error("Error creating FAQ:", error);
        fullpageloader.value = false;
        myerrors.value = "Failed to create section.";
    }
}




function openCreateDataDialog() {
     if (editor.value) {
    editor.value.commands.clearContent();
  }
  titlevalue.value = '';
  ctitlevalue.value = '';
 categorycreatevalue.value = null;
  locationcreatevalue.value = null;
  contentvalue.value = '';
  splitcontentvalue.value = '';

  faqsitem.value = [];         
  questionList.value = [{ question: '', answer: '' }];

  pagevalue.value = 'faq';       
  sectionvalue.value = 'faqcust';

  editdialog.value = true;  
}



const questionList = ref([
  { question: '', answer: '' } 
]);


const addQuestion = () => {
  questionList.value.push({ question: '', answer: '' });
};



const usedLocationByCategory = computed(() => {
  const map = {};

  for (const item of alldata.value) {
    const catId = item.category?.id;
    const stateId = item.states?.id; // Corrected: it was item.state?.id (wrong path)

    if (catId && stateId) {
      if (!map[catId]) map[catId] = new Set();
      map[catId].add(stateId);
    }
  }

  return map;
});


// This disables only locations already used for the selected category
const getLocationItemProps = (item) => {
  const currentCategoryId = categorycreatevalue.value;
  const usedLocations = usedLocationByCategory.value[currentCategoryId] || new Set();

  return {
    disabled: usedLocations.has(item.value) && item.value !== locationcreatevalue.value,
  };
};


// Optional: Reset location when category changes
watch(categorycreatevalue, () => {
  locationcreatevalue.value = null;
});



const dialogVisible = ref(false);
const selectedItem = ref(null);

function openDialog(item) {
    console.log('Opening dialog with:', item);
    selectedItem.value = item;
    dialogVisible.value = true;
    console.log('rrrrrrr dialog with:', dialogVisible.value);
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
        <v-alert type="error" v-show="showErrorMessage"
         density="" class="mb-4">
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
                    <v-row class="justify-space-between  pt-3 test gap-2 ma-1">
                        <v-col cols="12" md="4"> <v-card-title class="text-h4 ">FAQ Data</v-card-title> </v-col>




                        <div class="d-flex">  


                        <v-btn color="primary" @click="openCreateDataDialog">
                            <PlusIcon size="14"  />Create FAQ Question
                        </v-btn> 

                         <v-dialog v-model="editdialog" scrollable class="dialog-mw" :max-width="800">
                                 <!-- Condition for Customer page and package secton change heading -->
                                 <v-card v-if="pagevalue === 'faq' && sectionvalue === 'faqcust'" class="pa-6" >
                                    <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                        <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize"> Edit Content </h4>
                                        <v-btn icon color="" @click="editdialog = false" flat variant="outlined" size="x-small" class="bg-error">
                                            <XIcon width="13" />
                                        </v-btn>
                                    </div>
                                    <div class="mt-3">
                                        <div class="mb-2">
                                            <p class="text-Darklight font-weight-semibold text-body-1 text-capitalize">Page Name  : {{pagevalue}}</p>
                                            <p class="text-Darklight font-weight-semibold text-body-1 mb-3 text-capitalize">Section Name  : {{sectionvalue}}</p>
                                        </div>
                                        <v-row>
                                                <v-col cols="12" class="ma-2">
                                                    <v-row class="bg-grey100 pa-2 rounded-md">
                                                        <v-col cols="12">
                                                            <label class="text-subtitle-1 font-weight-medium d-block mb-3">Category</label>
                                                            <v-select
                                                                v-model="categorycreatevalue"
                                                                :items="category_create_data"
                                                               
                                                                item-value="id"
                                                                item-title="name"
                                                                label="Select Category"
                                                                solo
                                                                hide-details
                                                            
                                                                
                                                            ></v-select>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <label class="text-subtitle-1 font-weight-medium d-block mb-3">Location</label>
                                                            <v-select
                                                                v-model="locationcreatevalue"
                                                                :items="location_create_data"
                                                                item-value="value"
                                                                item-title="text"
                                                                label="Select location"
                                                                solo
                                                                hide-details
                                                                 :item-props="getLocationItemProps"
                                                            ></v-select>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                                    
                                                <v-col cols="12">
                                                    <label class="text-subtitle-1 font-weight-medium pb-2">Main Heading</label>
                                                    <VTextField v-model="titlevalue" hide-details placeholder="Enter title" color="secondary" ></VTextField>
                                                </v-col>

                                    
                                                    <!-- <v-col cols="12">
                                                    <label class="text-subtitle-1 font-weight-medium pb-2">Main Content</label>
                                                    <VTextarea
                                                    v-model="ctitlevalue"
                                                        auto-grow
                                                        rows="4"
                                                        color="primary"
                                                        row-height="25"
                                                        shaped
                                                        hide-details
                                                    ></VTextarea>
                                                </v-col> -->
                                                <v-col cols="12">
                                                    <v-label
                                                        class="font-weight-medium mb-2 d-block">
                                                        Main Content </v-label>
                                                        <div class="rounded custom-border">
                                                            <div v-if="editor">
                                                            <EditorMenubar :editor="editor"  :rules="reqrules"/>
                                                            </div>
                                                        <editor-content :editor="editor"  ref="editorContentRef"  :rules="reqrules"/>
                                                        </div>
                                                </v-col>
                                        </v-row>
                                        <v-row v-if="faqsitem.length">
                                            <v-col cols="12"><v-label class="text-subtitle-1 font-weight-medium">Faq Question/Answer</v-label></v-col>
                                            <v-col cols="12" v-for="ifaq in faqsitem">
                                                <v-card elevation="0" class="border border-dark">
                                                    <v-card-item class="pa-4">
                                                        <v-row class="pt-4">
                                                            <v-col cols="12" lg="12">
                                                            <VTextField hide-details="auto" label="Enter Question" v-model="ifaq.question" class="" required color="secondary" ></VTextField>
                                                            </v-col>
                                                            <v-col cols="12" lg="12">
                                                            <v-textarea v-model="ifaq.answer" label="Enter Answer"  outlined name="Note" hide-details color="secondary" ></v-textarea>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        

                                        </v-row>  
                                        <v-row v-if="faqsitem.length === 0 || (faqsitem.length > 0 && faqsitem.length < 5)">
                                            
                                            
                                            <v-container >
                                                <v-card v-for="(item, index) in questionList" :key="index" elevation="0" class="border border-dark mb-2">
                                                    <v-card-item class="pa-4">
                                                        <v-row >
                                                            <v-col cols="12" class="py-5">
                                                                <VTextField 
                                                                v-model="item.question" 
                                                                hide-details="auto" 
                                                                placeholder="Enter Question"
                                                                label="Enter Question" 
                                                                color="secondary">
                                                                </VTextField>
                                                            </v-col>
                                                            <v-col cols="12">
                                                                <VTextField 
                                                                v-model="item.answer" 
                                                                hide-details="auto" 
                                                                label="Enter Answer"
                                                                placeholder="Enter Answer" 
                                                                color="secondary">
                                                                </VTextField>
                                                            </v-col>
                                                        </v-row>
                                                        
                                                    </v-card-item>
                                                </v-card>
                                                <v-btn v-if="faqsitem.length + questionList.length < 5 && 
                                                        (questionList.length === 0 || 
                                                        (questionList[questionList.length - 1].question && questionList[questionList.length - 1].answer))"
                                                    @click="addQuestion">
                                                    <plus-icon size="14" /> Add New Question
                                                </v-btn>

                                            </v-container>
                                            

                                        </v-row>      
                                    </div>
                                    <v-card-actions class="px-0 d-flex justify-end w-100">

                                        <v-btn class="bg-error rounded-sm me-2" text @click="editdialog=false" flat>
                                            Close
                                        </v-btn>
                                        <!-- <div v-if="faqsitem.length">
                                            <v-btn class="bg-secondary rounded-sm" @click="editme(0, false)" text flat >
                                            Save
                                        </v-btn> -->
                                        <div v-if="cid">
                                            <v-btn class="bg-secondary rounded-sm" @click="editme(0, false)" text flat >
                                            Save
                                        </v-btn>
                                        </div>
                                        <div v-else>
                                        <v-btn class="bg-secondary rounded-sm" @click="create_faq_data" text flat >
                                            Save
                                        </v-btn>
                                    </div>

                                    </v-card-actions>
                                </v-card>
                                </v-dialog>

                    </div>
                       
                </v-row>
                <v-row class="justify-content-between pt-3">
                        <v-col cols="12" md="12" >
                            <v-card elevation="0" class="border bg-lightsecondary">
                                <v-card-item class="py-4 pa-sm-6 pa-3">
                                    <p class="text-subtitle-1 text-no-wrap font-weight-semibold textSecondary mb-2 ">Filters</p>
                                    <v-row class="justify-end py-5">
                                        <v-col cols="12" md="4">
                                            <v-text-field density="compact" color="secondary" v-model="search" label="Search By heading" hide-details variant="outlined" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-select :items="category_filter_data" item-title="name" item-value="id" v-model="categoryfiltervalue" label="Filter By category" hide-details class="" density="compact">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-select :items="location_filter_data"  item-title="text" item-value="value" v-model="locationfiltervalue" label="Filter By location" hide-details class="" density="compact">
                                            </v-select>
                                        </v-col>                                        
                                    </v-row>
                                </v-card-item>
                            </v-card>
                        </v-col>
                    </v-row>
                    
                    <div id="itable">
                        <v-table class="month-table mt-6 border rounded">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Sno</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">ID</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Main Heading</th>
                                        <!-- <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Main Content</th> -->
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Category</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-no-wrap">Location</th>
                                        <th class="text-subtitle-1 textPrimary font-weight-semibold text-center text-no-wrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, index) in paginatedList" :key="index">
                                    <td>
                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</h5>
                                    </td>

                                    <td>
                                    <h5 class="text-no-wrap text-body-1 font-weight-medium">#{{ item.id }}</h5>
                                    </td>

                                    <td>
                                    <h6 class="text-subtitle-2 font-weight-medium">{{ item.title }}</h6>
                                    </td>
                                 
                                    <td>
                                    <h6 class="text-subtitle-2 font-weight-medium">
                                        {{ item.category?.name || '—' }}
                                    </h6>
                                    </td>

                                    <td>
                                    <h6 class="text-subtitle-2 font-weight-medium">
                                        {{ item.states?.state || '—' }}
                                    </h6>
                                    </td>

                                    <td class="text-center">
                                        <div class="d-flex gap-1 justify-center">
                                            <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                <!-- <v-tooltip text="View">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" v-bind="props"  @click="openDialog(item)">
                                                            <EyeIcon stroke-width="2.5" size="18" class="text-success"/>
                                                        </v-btn>
                                                    </template>
                                                    </v-tooltip> -->
                                                    <v-btn icon flat size="small" @click="openDialog(item)">
                                                <EyeIcon stroke-width="2.5" size="18" class="text-success" />
                                                </v-btn>
                                            </h5>
                                
                                            <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                <!-- <v-tooltip text="Edit">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn icon flat size="small" v-bind="props"  @click="editme(item.id, true,item.section.section)">
                                                            <PencilIcon stroke-width="2.5" size="18" class="text-primary"/>
                                                        </v-btn>                             
                                                    </template>
                                                </v-tooltip> -->
                                                <v-btn icon flat size="small" @click="editme(item.id, true, item.section.section)">
                                            <PencilIcon stroke-width="2.5" size="18" class="text-primary" />
                                            </v-btn>

                                            </h5>
                                              <h5 class="text-no-wrap text-body-1 d-flex justify-center">
                                                <v-btn icon flat size="small"  @click="delete_faq_data(item.id)">
                                                    <TrashIcon stroke-width="2.5" size="18" class="text-error"/>
                                                </v-btn>

                                              </h5>
                                        </div>
                                    </td>
             
                                </tr>
                                <tr v-if="paginatedList.length < 1">
                                    <td colspan="6">
                                        <v-card elevation="0" class="text-center mt-6 border" color="">
                                            <v-card-item class="mx-auto">
                                                <AlertCircleIcon stroke-width="1.5" size="50" class="mr-2 text-error" />
                                                <h5 class="pt-2 text-error font-weight-semibold">Currently, there are no Faq data available!</h5>
                                            </v-card-item>
                                        </v-card>                                   
                                    </td>                              
                                </tr>
                                </tbody>

                            </template>
                        </v-table>
                        <v-dialog v-model="dialogVisible" scrollable max-width="600px">
                            <v-card  class="pa-6">
                                <div class="d-flex justify-space-between align-center pb-3 modal-header-border">
                                    <h4 class="text-subtitle-3 text-no-wrap font-weight-semibold textSecondary text-capitalize"> View Questions </h4>
                                    <v-btn icon color="" @click="dialogVisible = false" flat variant="outlined" size="x-small" class="bg-error">
                                        <XIcon width="13" />
                                    </v-btn>
                                </div>
                                <v-card-text class="py-3 px-0">
                                <div v-if="selectedItem">
                                    <div class="mb-3 bg-grey100 pa-4 rounded-md">
                                        <h5>{{ selectedItem.title }}</h5>
                                        <!-- <h5>{{ selectedItem.ctitle }}</h5> -->
                                        <div v-html="selectedItem?.ctitle"></div>
                        
                                    </div>
                                    <div v-if="selectedItem.faqs && selectedItem.faqs.length > 0">
                                    <div
                                        v-for="(faq, idx) in selectedItem.faqs"
                                        :key="faq.id"
                                        class="mb-3 pa-3 border-bottom pb-4"
                                    >
                                        <h5><strong>Q{{ idx + 1 }}:</strong> {{ faq.question }}</h5>
                                        <p class="text-body-1"><strong>A:</strong> {{ faq.answer }}</p>
                                    </div>
                                    </div>
                                    <div v-else>
                                    <em>No FAQs available.</em>
                                    </div>
                                </div>
                                </v-card-text>
                                <v-card-actions class="px-0 d-flex justify-end w-100">
                                    <v-btn class="bg-error rounded-sm me-2" @click="dialogVisible=false" flat>
                                        Close
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                    <v-pagination v-model="currentPage" :length="Math.ceil(filteredList.length / itemsPerPage)"
                        rounded="circle"></v-pagination>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<style>
.v-field__outline {
    color: rgb(115 122 135);
}

label.v-label.v-field-label {
    color: #000;
    font-size: 12px;
    font-weight: 500;
}
.custom-border {
    border: 1px solid #bcc3c9;
}
.menuBar {
    border-bottom: 1px solid #bcc3c9;
}
.modal-header-border {
    border-bottom: 2px solid #ccc;
}
.labelStImgPro {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.imageGroupMain {
    position: relative;
    display: inline-block;
}
.imageSizeMain {
    width: 220px;
    height: 220px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #fff;
    background-color: #e1e7ed;
    display: flex;
    justify-content: center;
    align-items: center;
}
.imageSizeMain {
    inline-size: 70px;
    block-size: 70px;
}
.floatPlus {
    position: absolute;
    inset-inline-end: -10px;
    inset-block-end: 3px;
    transform: translate(-50%);
    inline-size: 25px;
    block-size: 25px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #b4801c;
    font-weight: 700;
}
.border-bottomCstm {
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
}
</style>