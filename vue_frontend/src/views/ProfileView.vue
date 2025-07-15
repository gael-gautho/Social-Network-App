<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                <img src="https://i.pravatar.cc/300?img=70" class="mb-6 rounded-full">
                
                <p><strong>{{user.name}}</strong></p>

                <div class="mt-6 flex space-x-8 justify-around">
                    <p class="text-xs text-gray-500">182 friends</p>
                    <p class="text-xs text-gray-500">120 posts</p>
                </div>

                <div class="mt-6">
                    <button 
                        class="inline-block py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        @click="sendFriendshipRequest"
                        v-if="userStore.user.id !== user.id"
                    >
                        Send friendship request
                    </button>
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
                id: ''
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
    
    
    }


}



</script>