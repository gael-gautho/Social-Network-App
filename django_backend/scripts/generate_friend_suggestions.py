# -*- coding: utf-8 -*-

import django
import os
import sys

from datetime import timedelta
from collections import Counter
from django.utils import timezone


sys.path.append(os.path.join(os.path.abspath(os.path.dirname(__file__)), '..'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_backend.settings")
django.setup()


from account.models import User


users = User.objects.all()

for user in users:
    user.friends_suggestions.clear()
    for friend in user.friends.all():
        for friendsfriend in friend.friends.all():
            if friendsfriend not in user.friends.all() and friendsfriend != user:
                user.friends_suggestions.add(friendsfriend)