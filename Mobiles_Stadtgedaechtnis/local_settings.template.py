__author__ = 'jpi'

# This file contains sensitive settings that should never be shared via a version control system.
# Note that before using this app, you need to set these values respectively and rename this file
# to local_settings.py. Django will not work unless doing so. Never put the resulting file under version control!

# User settings, not Django settings from here
GOOGLE_API_KEY = 'paste_your_google_api_key_here'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'use_a_unique_secret_key'

# This is used to determine the authentication mode for posting new stories. Refer to the API documentation
# for further information.
# Can be either "user_authentication" or "moderation"
AUTHENTICATION_MODE = 'user_authentication'

# This points to the SMTP server to use for sending emails.
EMAIL_HOST = "localhost"

# This is the port that will be used to connect to the SMTP server.
EMAIL_PORT = 1025

# This is used to authenticate against the SMTP server.
EMAIL_HOST_USER = "username"

# This is used to authenticate against the SMTP server.
EMAIL_HOST_PASSWORD = "password"

# This specifies the E-mail recipient for a new entry
NEW_ENTRY_EMAIL_RECIPIENT = "some@email.com"

# This specifies the sender e-mail address
NEW_ENTRY_EMAIL_SENDER = "some@email.com"