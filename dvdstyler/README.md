# Dvd Styler Template Stuff

This is still a work in progress.  I plan on using a source dvdstyler template and filling it with the necessary library items I need.  I am making a lot of assumptions here, so if you want to use this for your own video library, you will need to be sure that you understand what is going on with the template and the template filling logic.  I'll do my best to document what is going, so if there is something missing, submit a pull request for documentation.

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
* Hardware Virtualization Enabled (on host machine)

## Use

### Install dvdstyler

* (https://www.dvdstyler.org/en/downloads)[https://www.dvdstyler.org/en/downloads]
* (http://ubuntuhandbook.org/index.php/2016/07/dvdstyler-3-0-ubuntu-16-04-via-ppa/)[http://ubuntuhandbook.org/index.php/2016/07/dvdstyler-3-0-ubuntu-16-04-via-ppa/]
* (https://launchpad.net/~ubuntuhandbook1/+archive/ubuntu/dvdstyler/)[https://launchpad.net/~ubuntuhandbook1/+archive/ubuntu/dvdstyler/]
* `sudo add-apt-repository ppa:ubuntuhandbook1/dvdstyler`
* `sudo apt update`
* `sudo apt install dvdstyler`

### `yarn run backup-config`

Backup the configuration files.  Useful for representing the state of a particular project or iso.

### `yarn run generate [/path/to/order_filename.js]`

Running this will generate as many dvdstyler files are are passed in via the config that is exported from the file.  Each of those templates will be opened in dvdstyler.  From these open dvdstyler windows, you can confirm that everything looks good.  When you're ready, use the dvdstyler GUI to write the iso file.

### `yarn run generateCatalog`

Running this will generate the Master Spreadsheet used to represent the current state of the library to clients.


## Adding a new title to the library

@see - `brainthinks/linux_tools` for demux/conversion utilities
@see - individual `mmmd/DVDs/Demuxed Masters/current` directories for demux/conversion implementations

1. rename video file to be just the ID, e.g. CU001
1. make a note of what ID you're updating, such as by highlighting the row in the most current spreadsheet
1. move the file that has that ID from `mmmd/DVDs/Master Video Files` to `mmmd/DVDs/Master Video Files/_legacy/[current_year]/[series]/[month]`
1. move the new file to `mmmd/DVDs/Master Video Files`
1. navigate to `mmmd/DVDs/Demuxed Masters/current`
1. move the necessary files from `mmmd/DVDs/Demuxed Masters/current/[series]` to `mmmd/DVDs/Demuxed Masters/legacy/[year]/[series]/[month]`
1. add the new video and audio entries to be demuxed/converted into `mmmd/DVDs/Demuxed Masters/current/[series]/demux_[year].sh`
1. note that any files will be overwritten!  the tools currently only account for one audio track, so be sure that if you are converting for English, you move the necessary files now.  If you are converting for Spanish, ensure the files have an `S` at the end of the file name.  Also, you only need to demux Spanish video if the Spanish video is higher quality than the English video.
1. run the `demux` script
1. update each title in the config files
1. repeat the steps above for all updated `series`
1. `yarn run generateCatalog`
1. open the new catalog in `./build`, adjust the column widths, and save it (also, compare the exact times from the last catalog)
1. update the order form in google docs with the new details
1. navigate to the orders directory in Dropbox
1. copy and paste the most recent folder, rename it to have the correct date, with a client name of `PACKAGE`
1. delete everything except `case_insert`, `disc_face`, and `order.js`
1. `yarn run generate [path to order config file in dropbox]`
1. ensure everything looks correct
1. confirm and update any intro times in the config
1. update the case insert and disk face images
1. update the order form
1. update the invoice template
1. send out updated order form and Master Catalog

## Fulfilling an order

1. navigate to the orders directory in Dropbox
1. copy and paste the most recent folder, rename it to have the correct date
1. delete everything except `case_insert`, `disc_face`, and `order.js`
1. modify `order.js` to meet the needs of the new order
1. `yarn run generate [path to order config file in dropbox]`
1. generate the isos from all open dvdstyler instances
1. by default, all isos save to `/home/user/dvds`
1. update the case insert and disk face images as necessary
1. transfer isos to dvd burning tower over the network
    1. `cd /home/user/dvds`
    1. `windows-share` (defined in `~/.bash_aliases`)
    1. `recurse ON`
    1. `prompt OFF`
    1. `mput [directory]` (no trailing slash!)
    1. wait a while
    1. `exit`
1. print all case inserts
1. print all disk faces
1. burn ONE OF EACH `series` iso
1. test each burned copy
1. burn all remaining isos
1. create invoice
1. send out invoice


### Get time

`ffmpeg -i "/path/to/file" 2>&1 | grep -i duration`

## Development

### Docker

@todo

### Vagrant

1. Enable Hardware Virtualization in your BIOS
1. `sudo apt install -y virtualbox-qt vagrant`
1. `vagrant destroy -f && vagrant up && vagrant ssh`
1. `cd /vagrant/dvdstyler`
1. `sudo ./scripts/deploy/provision-bootstrap.sh`


## References
* https://stackoverflow.com/questions/38890480/smbclient-send-all-files-in-directory


## @todo

* The disc iso name for HH should be SCETTF_HH1_2019 and SCETTF_HH2_2019, not SCETTF_HH_2019 for both
* allow navigating backwards in playall
* allow the client name and maybe year to be specified in the configs/index
* docker
* edit xcf files from the command line
