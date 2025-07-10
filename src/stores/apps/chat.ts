import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';
import { uniqueId } from 'lodash';
import { sub } from 'date-fns';
import BASE_URL from '@/stores/myVar';
import chatSocket from '@/stores/chat_socket';
import extravar from '@/stores/extravars';

interface chatType {
    chats: any;         // all chats
    // chatContent: any;   // this states which room's chat will be visible
    crum: any;          // room value which will be used by input in send message
}

export const useChatStore = defineStore({
    id: 'chat',
    state: (): chatType => ({
        chats: [],
        // chatContent: 0,
        crum: null,
    }),
    getters: {
        // Get Chats from Getters
        // getChats(state) {
        //     return state.chats;
        // }
    },
    actions: {
        async fetchChats() {
            var iurl = new URL(window.location.href)
            var urlSearchParams = iurl.searchParams;
            try {
                // const data = await axios.get('/api/data/chat/ChatData');
                let march = urlSearchParams.get("march")
                const response = await axios.post(`inbox/get_chats`,{"at":localStorage.getItem('at'), "march":march}, {withCredentials:true});
                // console.log("get_chats_response_______________________", response)
                this.chats = response.data.chts;
                this.chats.forEach((chat:any)=>{chat.lastmsgat = new Date(chat.lastmsgat)})
                // try {this.crum = response.data.chts[0].room} catch {}
                if (march) {
                    // this.crum = response.data.rmid;
                    let iid = this.chats.findIndex((chat:any)=>chat.room==response.data.rmid)+1
                    this.SelectChat((iid)?iid:this.chats.length, response.data.rmid, false)
                }
            } catch (error) {
                // alert(error);
                console.error(error);
            }
        },
        SelectChat(itemID: number, room: string, unread: boolean) {
            // console.log("itemID, room, unread____________", itemID, room, unread, this.chats)
            // console.log("this.chatContent____________", this.chatContent, this.chats)
            if (chatSocket.value){ chatSocket.value.send(JSON.stringify({ type:'marking', crum:room, unread:false}));}
            // this.chatContent = itemID;
            this.crum = room;
        },
        sendMsg(msgg: string, chid: string, mid: number, others: any) {
            const newMessage = {
                id: mid,
                msg: msgg,
                type: others[4],
                attachments: [(others[5]) ? others[5] : null],
                createdAt: sub(new Date(), { seconds: 1 }),
                senderId: others[3],  };

            let chatFound = false;
            this.chats = this.chats.filter((chat: any) => {
                if (String(chat.room) == String(chid)) {
                    // console.log("chat found, so not appended____________", chid)
                    chat.chatHistory.push(newMessage);
                    chat.lastmsgat = sub(new Date(), { seconds: 1 }),
                    chat.unread = String(this.crum) == String(chid) ? false : true;
                    // mark the chat as unread in backend
                    // console.log("attempting______________") 
                    // if (chatSocket.value){ chatSocket.value.send(JSON.stringify({ type:'marking', crum:chid, unread:true}));}
                    // console.log("attempted_______________")
                    chatFound = true;
                }
                return true;
            });
            if (!chatFound)
            {
                // console.log("chat not found, so appending____________", chid)
                this.chats.push({
                    "id"            : others[0],
                    "name"          : others[1],
                    "status"        : 'online',
                    "thumb"         : `${extravar.mdomain}${others[2]}`,
                    "recent"        : false,
                    "room"          : chid, 
                    "unread"        : true, 
                    "lastmsgat"     : sub(new Date(), { seconds: 1 }),
                    "chatHistory"   : [ newMessage ]
                })
            }
            // console.log("this.chats, chat_______________________", this.chats, this.crum)

        },
    }
});
