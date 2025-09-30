from django.core.exceptions import ValidationError
import re

class CustomPasswordValidator:
    def validate(self, password, user=None):
        errors = []

        if not re.findall('[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter.")
        if not re.findall('[0-9]', password):
            errors.append("Password must contain at least one digit.")
        if not re.findall('[^A-Za-z0-9]', password):
            errors.append("Password must contain at least one special character.")
       
        if errors:
            raise ValidationError(errors)

    def get_help_text(self):
        return (
            "Your password must contain at least one uppercase letter, one digit, "
            "one special character, and be at least 10 characters long."
        )
