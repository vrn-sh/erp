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

# if you just use the basic .env, you will need to add voron.lan to your hosts file
#
# Please note this step is optionnal (and only to run locally)
sudo echo "127.0.0.1   voron.lan" >> /etc/hosts

# add your own secrets, domain name, etc ...
vim .env

# go back to the root directory
cd ..

# run the containers
docker-compose up
```

### locally

Please follow [this link](./toolbox/docs/CONTRIBUTE.md).

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

For now, our dashboard does not come with many features. There are two roles users can have, which are `Manager` and `Pentester`.
Each `Manager` can create a team of `Pentester` for a specific mission. Both roles can be edited, and users can be added or removed
from a mission.

Once the mission has started, `Pentester`s can share notes, findings & prepare their report through the dashboard.

## roadmap

We want to provide a set of automation to make the process of pentests easiers:

### Recon automation
- [ ] add a `Censys` or `Shodan` API integration that can automatically fetch recon info from a specified IP range.
- [ ] add a `crt.sh` module that will fetch SSL certificate info from a domain name
- [ ] add a `hunter.io` module to get email patterns for specific companies

More are to come and be expected of course, but this is our main features

### Compliance
- [ ] automatically block recon-requests on IP ranges / certs that are not in the rules of engagement
- [ ] generate final pentest report automatically

## known-issues and caveats

We do not plan on providing active recon tools & scanning for now, as it may be illegal depending on the countries.
