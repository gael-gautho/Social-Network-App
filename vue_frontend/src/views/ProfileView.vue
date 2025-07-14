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


export default {

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

    mounted() {
        this.getFeed()
    },

    methods: {
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