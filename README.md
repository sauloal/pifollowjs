# Pi Follow JS
A NodeJS API for uploading time lapse photos coupled with a series of scripts using cron for downloading the photos and making daily movies.

# Config
## Server
### Create rng.cfg with a random (alphanum) id

## Raspberry-pi
### Edit api/conf.sh
```bash
URL_BASE=http://pifollowjs-sauloal.c9.io #server URL
APV=2                                    #api version
RNG='54628'                              #random project id (alphanum)
PI_NAME=piname                           #raspberry pi name
```

## Home computer
### Edit linux/cron.sh and replace project_path with the correct path
### Edit linux/conf.sh
```bash
PI_NAME=pi2
RNG=54628

URL_PATH=https://pifollowjs-sauloal.c9.io
```
By default all images will be downloaded to ./site folder, the desired images will be copied to ./src.

The images with dates burned in are saved in /tmp/conv and the images with deflickering are saved in /tmp/conv/Deflickered

The movies will be created in the current folder

### Install timelapse-deflicker.pl requirements
### Add cron rule as described in linux/cron.sh

