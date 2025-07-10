import { ref } from 'vue';
import BASE_URL from './myVar';
// for updating extra variables between different views and components
// const bell_count        = ref();
// const msgs_count        = ref();
var extravar      = {   'mdomain' : BASE_URL,   } 
export default extravar;