from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.forms import PasswordChangeForm
from django.core.mail import send_mail
from rest_framework import status
# from rest_framework_simplejwt.tokens import RefreshToken


from rest_framework.decorators import api_view, authentication_classes, permission_classes

from .forms import SignupForm, EditProfileForm
from .models import User, FriendshipRequest
from .serializers import UserSerializer, FriendshipRequestSerializer

from notification.utils import create_notification



@api_view(['GET'])
def me(request):
    return JsonResponse({
        'id': request.user.id,
        'name': request.user.name,
        'email': request.user.email,
        'get_avatar': request.user.get_avatar
    })



@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def signup(request):
    data = request.data
    message = 'success'

    form = SignupForm({
        'email': data.get('email'),
        'name': data.get('name'),
        'password1': data.get('password1'),
        'password2': data.get('password2'),
    })

    if form.is_valid():
        user = form.save()
        # user.is_active = False
        user.save()

        # url = f'{settings.WEBSITE_URL}/api/activateemail/?email={user.email}&id={user.id}'
        # print(url)

        # send_mail(
        #     "Please verify your email",
        #     f"The url for activating your account is: {url}",
        #     "noreply@letslike.com",
        #     [user.email],
        #     fail_silently=False,
        # )

        return JsonResponse(
            {"message": "success"},
            status=status.HTTP_201_CREATED, safe=False  
        )

    else:
        message = form.errors
        return JsonResponse( message,
                            status=status.HTTP_400_BAD_REQUEST, safe=False)



@api_view(['POST'])
def send_friendship_request(request, pk):
    
    user = User.objects.get(pk=pk)

    check1 = FriendshipRequest.objects.filter(created_for=request.user).filter(created_by=user)
    check2 = FriendshipRequest.objects.filter(created_for=user).filter(created_by=request.user)


    if not check1 and not check2:
        friendrequest = FriendshipRequest.objects.create(created_for=user, created_by=request.user)
        notification = create_notification(request, 'new_friendrequest', friendrequest_id=friendrequest.id)



        return JsonResponse({'message': 'friendship request created'})
    else:
        return JsonResponse({'message': 'request already sent'})




@api_view(['GET'])
def get_friends(request, pk):
    visited_profile_user = User.objects.get(pk=pk)
    requests = []

    if visited_profile_user == request.user:
        requests = FriendshipRequest.objects.filter(created_for=request.user, status=FriendshipRequest.SENT)
        requests = FriendshipRequestSerializer(requests, many=True)
        requests = requests.data

    friends = visited_profile_user.friends.all()

    return JsonResponse({
        'user': UserSerializer(visited_profile_user).data,
        'friends': UserSerializer(friends, many=True).data,
        'requests': requests
    }, safe=False)



@api_view(['POST'])
def handle_request(request, pk, status):
    user = User.objects.get(pk=pk)
    friendship_request = FriendshipRequest.objects.filter(created_for=request.user).get(created_by=user)
    
    if friendship_request.status == 'sent':
        friendship_request.status = status
        friendship_request.save()

        if status == 'accepted':
            user.friends.add(request.user)
            user.friends_count = user.friends_count + 1
            user.save()

            request.user.friends_count = request.user.friends_count + 1
            request.user.save()

            notification = create_notification(request, 'accepted_friendrequest', friendrequest_id=friendship_request.id)


    return JsonResponse({'message': 'friendship request updated'})


@api_view(['POST'])
def editprofile(request):
    user = request.user
    email = request.data.get('email')

    if User.objects.exclude(id=user.id).filter(email=email).exists():
        return JsonResponse({'message': 'email already exists'})
    else:
        form = EditProfileForm(request.POST, request.FILES, instance=user)

        if form.is_valid():
            form.save()
        
        serializer = UserSerializer(user)

        #refresh = RefreshToken.for_user(user)

        return JsonResponse({'message': 'information updated', 
        #'refresh': str(refresh.refresh_token),
        'user': serializer.data})


@api_view(['POST'])
def editpassword(request):
    user = request.user
    
    form = PasswordChangeForm(data=request.POST, user=user)

    if form.is_valid():
        form.save()

        return JsonResponse({'message': 'success'})
    else:
        return JsonResponse({'message': form.errors.as_json()}, safe=False)


@api_view(['GET'])
def get_friends_suggestions(request):

    serializer = UserSerializer(request.user.friends_suggestions.all(), many=True)

    return JsonResponse({'data' : serializer.data}, safe=False)

