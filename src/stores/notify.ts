import { ref } from 'vue';
// for updating notifications and messages list and count
const all_notifications = ref([]);
const bell_count        = ref();
const cart_count        = ref();
const msgs_count:any    = ref(0);
var notif               = {'not_list' : all_notifications, 'not_count' : bell_count, 'msg_count' : msgs_count ,'cart_count':cart_count} 
export default notif;
