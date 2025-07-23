<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                <img :src="user.get_avatar" class="mb-6 rounded-full">
                
                <p><strong>{{user.name}}</strong></p>

                <div class="mt-6 flex space-x-8 justify-around">
                    <RouterLink :to="{name: 'friends', params:{'id': user.id}}" class="text-xs text-gray-500">{{ user.friends_count }} friends</RouterLink>
                    <p class="text-xs text-gray-500">{{ user.posts_count }} posts</p>
                </div>

                <div class="mt-6">
                    <button 
                        class="inline-block py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        @click="sendFriendshipRequest"
                        v-if="userStore.user.id !== user.id"
                    >
                        Send friendship request
                    </button>

                    <button 
                        class="inline-block mt-4 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        @click="sendDirectMessage"
                        v-if="userStore.user.id !== user.id"
                    >
                        Send direct message
                    </button>

                    <button 
                        class="inline-block mr-2 py-4 px-3 bg-red-600 text-xs text-white rounded-lg" 
                        @click="logout"
                        v-if="userStore.user.id === user.id"
                    >
                        Log out
                    </button>
                    
                    
                    <RouterLink 
                        class="inline-block py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        to="/profile/edit"
                        v-if="userStore.user.id === user.id"
                    >
                        Edit profile
                    </RouterLink>


                </div>


            </div>
        </div>

        <div class="main-center col-span-3 space-y-4">

            <div class="p-4 bg-white border border-gray-200 rounded-lg"
            v-for="post in posts"
            :key=post.id
            >
                <FeedItem :post="post" />

            </div>
        </div>

    </div>
</template>


<script>
import FeedItem from '@/components/FeedItem.vue';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow.vue';
import Trends from '@/components/Trends.vue';
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'


export default {

    setup() {
        const userStore = useUserStore()
        const toastStore = useToastStore()

        return {
            userStore,
            toastStore
        }
    },

    name : 'ProfileView',
    components : {
        PeopleYouMayKnow,
        Trends,
        FeedItem
    },

    data() {
        return {
            posts: [],
            user: {
                id: null
            },
        }
    },

    watch: { 
        '$route.params.id': {
            handler: function() {
                this.getFeed()
            },
            deep: true,
            immediate: true
        }
    },

    mounted() {
        this.getFeed()
    },

    methods: {
        sendFriendshipRequest() {
            axios
                .post(`/api/friends/${this.$route.params.id}/request/`)
                .then(response => {
                    console.log('data', response.data)

                    this.can_send_friendship_request = false

                    if (response.data.message == 'request already sent') {
                        this.toastStore.showToast(5000, 'The request has already been sent!', 'bg-red-300')
                    } else {
                        this.toastStore.showToast(5000, 'The request was sent!', 'bg-emerald-300')
                    }

                })
                .catch(error => {
                    console.log('error', error)
                })
        },
        getFeed() {
            axios
                .get(`/api/posts/profile/${this.$route.params.id}/`)
                .then(response => {
                    console.log('data', response.data)

                    this.posts = response.data.posts
                    this.user = response.data.user

                })
                .catch(error => {
                    console.log('error', error)
                })
        },
        submitForm() {
            console.log('submitForm', this.body)

            axios
                .post('/api/posts/create/', {'body': this.body}, {
                })
                .then(response => {
                    console.log('data', response.data)
                    this.posts.unshift(response.data)
                    
                    this.body = ''
                    
                })
                .catch(error => {
                    console.log('error', error)
                })
        },

        logout() {
            console.log('Log out')

            this.userStore.removeToken()

            this.$router.push('/login')
        },

        sendDirectMessage() {
            console.log('sendDirectMessage')

            axios
                .get(`/api/chat/${this.$route.params.id}/get-or-create/`)
                .then(response => {
                    console.log(response.data)

                    this.$router.push('/chat')
                })
                .catch(error => {
                    console.log('error', error)
                })
        },
    
    
    }


}



</script>