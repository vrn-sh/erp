# ✨ project voron

voron (or ворон in ukrainian) is a web platform for pentest, designed to maximize compliance and collaboration between pentesters.

It comes in the form of a dashboard, where pentesters can share notes, tasks and findings. This will then be bundled into a report
at the end of the pentest. It will (see roadmap) also come with a set of automation to automate passive recon.

We are a team of students, building this as our graduation project. If you wish to get in contact, feel free to contact us at
`voron@djnn.sh` !


## installation

### using docker-compose

Currently supported docker-compose version:
```bash
$ docker-compose version
docker-compose version 1.29.2, build unknown
docker-py version: 5.0.3
CPython version: 3.10.9
OpenSSL version: OpenSSL 3.0.7 1 Nov 2022
```

```bash
# go to the `api` directory and set the .env appropriately
cd api && cp .env-dist .env

# add your own secrets, domain name, etc ...
vim .env

# go back to the root directory
cd ..

# run the containers
docker-compose up
```

### locally

Please have a look at the various `README` located in the `web` and `api`
directories, as they will provide more informations regarding how to run the app locally.

## how to contribute ?

We would really appreciate any help you can send our way! Wether it is free pizza, reporting a bug, or improving a feature!
Please have a look at the (hopefully helpful) guides below before contributing, to make the process smoother.

### feature requests

If you want us to add a specific feature to the application, please submit an issue with the `feature-request` label.
When submitting your request, please be as specific as possible! Who is it aimed at ? How should it be used ? What kind of
UI would you think is better suited for this project ?

Please also have a look at our roadmap before submitting your issue, it might already be here!

### report an issue

If you want to report an issue with application, please add the `bug` label to your issue. If you know where in the app
is the bug (back-end/front-end/third-party service), you can also add the related labels.

Please describe in detail what exactly where you doing on the application, and add screenshots & logging if possible.

## features

TBD

## roadmap

TBD

## known-issues and caveats

TBD
