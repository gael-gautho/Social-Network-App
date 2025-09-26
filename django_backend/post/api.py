from django.http import JsonResponse
from django.db.models import Exists, OuterRef, Q

from rest_framework.decorators import api_view, authentication_classes, permission_classes

from .models import Post, User, Like, Comment, Trend
from .serializers import PostSerializer, UserSerializer, PostDetailSerializer, CommentSerializer, TrendSerializer
from .forms import PostForm, AttachmentForm

from notification.utils import create_notification



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

    trend = request.GET.get('trend', '')

    if trend:
        posts = Post.objects.filter(body__icontains='#' + trend).annotate(
    has_liked=Exists(Like.objects.filter(related_post=OuterRef('id'),
                            created_by=request.user)
    )
)

    serializer = PostSerializer(posts, many=True)

    return JsonResponse({'data':serializer.data}, safe=False)


@api_view(['GET'])
def post_list_profile(request, id):   
    
    user = User.objects.get(pk=id)
    posts = Post.objects.filter(created_by_id=id).annotate(
        has_liked=Exists(
        Like.objects.filter(related_post=OuterRef('id'),
                            created_by=request.user)))


    if not request.user in user.friends.all() and request.user != user:
        posts = posts.filter(is_private=False)


    posts_serializer = PostSerializer(posts, many=True)
    user_serializer = UserSerializer(user)

    
    return JsonResponse({
        'posts': posts_serializer.data,
        'user': user_serializer.data,
    }, safe=False)


@api_view(['GET'])
def post_detail(request, pk):
    
    user_ids = [request.user.id]

    for user in request.user.friends.all():
        user_ids.append(user.id)
    
    post = Post.objects.filter(pk=pk).annotate(
        has_liked=Exists(
        Like.objects.filter(related_post=OuterRef('id'),
                            created_by=request.user))).first()


    post = Post.objects.filter(Q(created_by_id__in=list(user_ids)) | Q(is_private=False)).get(pk=pk)



    return JsonResponse({
        'post': PostDetailSerializer(post).data
    })



@api_view(['POST'])
def post_create(request):
    form = PostForm(request.POST)
    attachment = None
    attachment_form = AttachmentForm(request.POST, request.FILES)

    if attachment_form.is_valid():
        attachment = attachment_form.save(commit=False)
        attachment.created_by = request.user
        attachment.save()

    if form.is_valid():
        post = form.save(commit=False)
        post.created_by = request.user
        post.save()

        if attachment:
            post.attachments.add(attachment)

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

        notification = create_notification(request, 'post_like', post_id=post.id)


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

    notification = create_notification(request, 'post_comment', post_id=post.id)


    return JsonResponse({'comment': serializer.data,
                         'comments_count': post.comments_count   
                        }, safe=False)



@api_view(['GET'])
def get_trends(request):
    serializer = TrendSerializer(Trend.objects.all(), many=True)

    return JsonResponse({'data':serializer.data}, safe=False)


@api_view(['DELETE'])
def post_delete(request, pk):
    post = Post.objects.filter(created_by=request.user).get(pk=pk)
    post.delete()

    user = request.user
    user.posts_count = user.posts_count - 1
    user.save()



    return JsonResponse({'message': 'post deleted'})


@api_view(['POST'])
def post_report(request, pk):
    
    post = Post.objects.get(pk=pk)

    if request.user in list(post.reported_by_users.all()): 
        return JsonResponse({'message': 'post already reported'})

    else:     
        post.reported_by_users.add(request.user)
        post.save()

        return JsonResponse({'message': 'post reported'})


