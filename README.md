mobile-city-history
===================
The mobile city memory is a persistent database for historic and contemporary stories and media. Citizens can explore and contribute to it using their smartphone wherever they are.

Features
--------
- Browse through historic photos, videos or sound files.
- Share your personal stories and photos or videos from your favorite spots of the city.
- Explore the history of your city wherever you are.
- Create a personal city memory from ancient times until today.

Contains
--------
This is a standalone django-application that comprises of both frontend and backend stadtgedaechtnis.

Please see the respective repositories for additional information.
```
https://github.com/codeforeurope/stadtgedaechtnis_backend
https://github.com/codeforeurope/stadtgedaechtnis_frontend
```

Requirements
------------
The following software is required to use the mobile city history (the version in brackets indicates the tested version):
- Python 2 (2.7.6 32-bit)

The following python packages are required (the version in brackets indicates the tested version):
- sparqlwrapper
- django (>= 1.6)
- jsonpickle (>= 0.7.0)
- django-apptemplates
- django-mssql (>= 1.5)
- pywin32 (>= 219)
- djangorestframework
- schedule
- django-cache-machine (>= 0.8)

Installation
------------
After cloning this repository, you must update the submodules using the following commands:

```
git submodule init
git submodule update
```

Make sure you have Python 2.7 or a later Python 2.x version installed. Then run setup.py install from the console.

Look at the local_settings.template.py and follow the instructions there.

Additional versions
-------------------
This version runs with an SQLite database. See the branches for additional versions.