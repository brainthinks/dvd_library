# Dvd Styler Template Stuff

This is still a work in progress.  I plan on using a source dvdstyler template and filling it with the necessary library items I need.  I am making a lot of assumptions here, so if you want to use this for your own video library, you will need to be sure that you understand what is going on with the template and the template filling logic.  I'll do my best to document what is going, so if there is something missing, submit a pull request for my documentation.

## System Requirements

### Production

* OS: Ubuntu 18.04
* RAM: 4GB
* CPUs: 4
* HDD: ???

### Development

* OS: Ubuntu 18.04
* RAM: 4GB
* CPUs: 4
* HDD: ???
* Hardware Virtualization Enabled


## Development

### Docker

@todo

### Vagrant

1. Enable Hardware Virtualization in your BIOS
1. `sudo apt install -y virtualbox-qt vagrant`
1. `vagrant destroy -f && vagrant up && vagrant ssh`
1. `cd /vagrant/dvdstyler`
1. `sudo ./scripts/deploy/provision-bootstrap.sh`


## @todo

* docker
* properly encode videos (ffmpeg?) - currently, it seems like I was able to do this, but they are written to disk wrong :(
* allow navigating backwards in playall
* generate assets without using dvdstylers, just use the stock dvdauthor tools
* edit xcf files from the command line
