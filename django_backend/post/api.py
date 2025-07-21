from django.http import JsonResponse
from django.db.models import Exists, OuterRef

from rest_framework.decorators import api_view, authentication_classes, permission_classes

from .models import Post, User, Like, Comment
from .serializers import PostSerializer, UserSerializer, PostDetailSerializer, CommentSerializer
from .forms import PostForm


@api_view(['GET'])
def post_list(request):

    user_ids = []

    for user in request.user.friends.all():
        user_ids.append(user.id)


    posts = Post.objects.filter(
    created_by_id__in=list(user_ids)).annotate(
    has_liked=Exists(Like.objects.filter(related_post=OuterRef('id'),
                            created_by=request.user)
    )
)

    serializer = PostSerializer(posts, many=True)

    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def post_list_profile(request, id):   
    
    user = User.objects.get(pk=id)
    posts = Post.objects.filter(created_by_id=id).annotate(
        has_liked=Exists(
        Like.objects.filter(related_post=OuterRef('id'),
                            created_by=request.user)))

    posts_serializer = PostSerializer(posts, many=True)
    user_serializer = UserSerializer(user)

    
    return JsonResponse({
        'posts': posts_serializer.data,
        'user': user_serializer.data,
    }, safe=False)


@api_view(['GET'])
def post_detail(request, pk):
    
    post = Post.objects.filter(pk=pk).annotate(
        has_liked=Exists(
        Like.objects.filter(related_post=OuterRef('id'),
                            created_by=request.user))).first()


    return JsonResponse({
        'post': PostDetailSerializer(post).data
    })



@api_view(['POST'])
def post_create(request):
    form = PostForm(request.data)

    if form.is_valid():
        post = form.save(commit=False)
        post.created_by = request.user
        post.save()

        user = request.user
        user.posts_count = user.posts_count + 1
        user.save()
        
        serializer = PostSerializer(post)

        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'error': 'add somehting here later!...'})



@api_view(['POST'])
def post_like(request, pk):
    post = Post.objects.get(pk=pk)
    existing_like = Like.objects.filter(created_by=request.user, related_post=post)

    if not existing_like:
        like = Like.objects.create(created_by=request.user, related_post=post)
        post.likes_count = post.likes_count + 1
        message='post liked'

    else:
        post.likes_count = post.likes_count - 1
        existing_like.delete()
        message='post disliked'

    post.save()        
    
    post = Post.objects.filter(pk=pk).annotate(
        has_liked=Exists(
        Like.objects.filter(related_post=OuterRef('id'),
                            created_by=request.user))).first()

    serializer = PostSerializer(post)


    return JsonResponse({
            'message': message,
            'post': serializer.data
        })


@api_view(['POST'])
def post_create_comment(request, pk):

    post = Post.objects.get(pk=pk)
    comment = Comment.objects.create(body=request.data.get('body'), created_by=request.user, related_post=post)

    post.comments_count = post.comments_count + 1
    post.save()

    serializer = CommentSerializer(comment)

    return JsonResponse({'comment': serializer.data,
                         'comments_count': post.comments_count   
                        }, safe=False)



