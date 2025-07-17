from rest_framework import serializers

from .models import Post, PostAttachment
from account.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    
    created_by = UserSerializer(read_only = True )
    has_liked = serializers.BooleanField(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'body','has_liked', 'likes_count','created_by', 'created_at_formatted')

