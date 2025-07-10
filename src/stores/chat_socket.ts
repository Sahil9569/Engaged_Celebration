import { ref } from 'vue';
// var iurl                    = new URL(window.location.href)
// var urlSearchParams         = iurl.searchParams;
// var chatSocket = new WebSocket(`ws://127.0.0.1:8000/room_initiate?march=${urlSearchParams.get("march")}&time=${localStorage.getItem('at')}`);
var chatSocket:any = ref(null);

export default chatSocket;