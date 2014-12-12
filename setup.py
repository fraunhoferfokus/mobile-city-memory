import ez_setup
ez_setup.use_setuptools()

from setuptools import setup, find_packages

setup(
    name = "mobile-city-history",
    version = "1.0.0b2",
    author = "Jan-Christopher Pien",
    author_email = "jan_christopher.pien@fokus.fraunhofer.de",
    url = "http://www.foo.bar",
    license = "MIT",
    description = "A mobile city history to enable citizens to explore the history of their surroundings.",
    packages = find_packages(),
    zip_safe = False,
    include_package_data = True,

    install_requires = [
        "sparqlwrapper",
        "django == 1.6.2",
        "jsonpickle >= 0.7.0",
        "django-apptemplates",
        "djangorestframework == 2.3.13",
        "schedule",
        "django-cache-machine >= 0.8",
        "mysql-python"
        ],

    classifiers = [
        "Programming Language :: Python",
        "Development Status :: 4 - Beta",
        "Environment :: Web Environment",
        "Intended Audience :: Other Audience",
        "Framework :: Django",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content :: News/Diary",
    ],

    )