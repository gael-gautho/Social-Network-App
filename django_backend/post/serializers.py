from rest_framework import serializers

from .models import Post, PostAttachment, Comment, Trend
from account.serializers import UserSerializer


class PostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAttachment
        fields = ('id', 'get_image',)


class PostSerializer(serializers.ModelSerializer):
    
    created_by = UserSerializer(read_only = True )
    has_liked = serializers.BooleanField(read_only=True)
    attachments = PostAttachmentSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = ('id','attachments', 'body','has_liked','is_private', 'comments_count', 'likes_count','created_by', 'created_at_formatted')



class CommentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'body', 'created_by', 'created_at_formatted',)


class PostDetailSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    comments = CommentSerializer(read_only=True, many=True)
    has_liked = serializers.BooleanField(read_only=True)
    attachments = PostAttachmentSerializer(read_only=True, many=True)


    class Meta:
        model = Post
        fields = ('id','attachments', 'is_private','body', 'likes_count', 'has_liked','comments_count', 'created_by', 'created_at_formatted', 'comments', 'attachments',)


class TrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trend
        fields = ('id', 'hashtag', 'occurences',)