from django.contrib import admin

from .models import Post, PostAttachment, Like, Trend

admin.site.register(Post)
admin.site.register(Like)
admin.site.register(PostAttachment)
admin.site.register(Trend)