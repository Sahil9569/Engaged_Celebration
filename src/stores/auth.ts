import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

import axios from '@/stores/axios';
import BASE_URL from '@/stores/myVar';
import notif from '@/stores/notify';
// 

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

const config = { headers: { "Content-Type": "application/json" }}
export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        // @ts-ignore
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async login(username: string, password: string) {

            const response = await axios.post(`/home/login_page`, { username:username, password:password }, config);
            console.log("login check____ - ", response.data.status, this.returnUrl)
            if (response.data.status === "SUCCESS") {
                this.user = JSON.stringify(response.data.cuser);
                localStorage.setItem('user', JSON.stringify(response.data.cuser));
                localStorage.setItem('role', response.data.role);

                localStorage.setItem('access_token', response.data.access_token);
                // to be removed after live

                localStorage.setItem('vpack', response.data.vpack);
                localStorage.setItem('vpackname', response.data.vpackname);
                localStorage.setItem('vpackactive', response.data.vpackactive);
                localStorage.setItem('well_pack', response.data.well_pack); 
                // localStorage.setItem('acs', response.data.acs);
                
                setTimeout(()=>{window.location.reload()},100) // so as to reload the side bar counts
                if (localStorage.getItem('itodo_bid') && response.data.role == "customer")
                    router.push(`/booking-single/${localStorage.getItem('itodo_bid')}`); //pending anonymous booking continue after login
                else{   
                    if (response.data.role == "customer")   router.push(this.returnUrl || '/customer-dashboard');
                    if (response.data.role == "vendor")     router.push(this.returnUrl || '/vendor-dashboard');
                    if (response.data.role == "admin")      router.push(this.returnUrl || '/admin-dashboard');
                }
                
            }
            else {
                this.user = null;
                this.returnUrl = null;
                localStorage.clear();
                router.push('/login');
            }
        },
        async logout() {
            const response = await axios.post('/home/logmeout', {'extra':'extra'}, config)
            console.log("auth check____ - ", response.data.status)
            if (response.data.status == "DONE")
            {
                this.user = null;
                this.returnUrl = null;
                localStorage.clear()
                router.push('/login');
            }
        },
        async authenticate(extra=null)
        {
            var user = localStorage.getItem('user')
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true }
            if (user){

                try { var response = await axios.post('/home/authenticateit', {'extra':extra, 'access_token': localStorage.getItem('access_token')}, config) }
                catch(error:any) { if (error.response.status == 401) { this.user = null; localStorage.clear(); return false } }
                
                console.log("auth check____ - ", response.data)
                if (response.data.status == "VALID"){
                    notif['not_list'].value   = response.data.not_list
                    notif['not_count'].value  = response.data.not_count
                    notif['msg_count'].value  = response.data.msg_count
                    notif['cart_count'].value  = response.data.cart_count
                    // this.is_authenticated = true;
                    // update pinia state
                    // this.user = response.data['user'];
                    localStorage.setItem('role', response.data.role);
                    localStorage.setItem('vpack', response.data.vpack);
                    localStorage.setItem('vpackname', response.data.vpackname);
                    localStorage.setItem('vpackactive', response.data.vpackactive);
                    return true
                }
                else if (response.data.status == "INVALIDRL"){
                    localStorage.setItem('role', response.data.role);
                    this.returnUrl = null;
                    return 'NOTALLOWED'
                }
                else{
                    // this.is_authenticated = false;
                    console.log("Token expired___________")
                    const response = await axios.post('/home/logmeout', {'extra':'extra'}, config)
                    console.log("auth check____ - ", response.data.status)
                    if (response.data.status == "DONE")
                    {
                        this.user = null;
                        this.returnUrl = null;
                        localStorage.clear()
                        router.push('/login');
                        return false
                    }
                }
            }
            else { 
                // this.is_authenticated = false; 
                return false 
            }
        }
    }
});
