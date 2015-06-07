#!/usr/bin/env python
#https://bitbucket.org/fotosyn/fotosynlabs/src/9819edca892700e459b828517bba82b0984c82e4/RaspiLapseCam/raspiLapseCam.py?at=master
#http://www.instructables.com/id/Simple-timelapse-camera-using-Raspberry-Pi-and-a-c/#step1

every_minutes=10
HOME_FOLDER="/home/pi/"
sender='bin/send_file.sh'
sender_endpoint='pifollow'
sender_rnd='54628'
sender_piname='pi2'

#
#  raspiLapseCam.py
#
#  Created by James Moore on 28/07/2013.
#  Copyright (c) 2013 Fotosyn. All rights reserved.
#
#  Raspberry Pi is a trademark of the Raspberry Pi Foundation.

#  Redistribution and use in source and binary forms, with or without
#  modification, are permitted provided that the following conditions are met:

#  1. Redistributions of source code must retain the above copyright notice, this
#  list of conditions and the following disclaimer.
#  2. Redistributions in binary form must reproduce the above copyright notice,
#  this list of conditions and the following disclaimer in the documentation
#  and/or other materials provided with the distribution.>

#  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
#  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
#  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
#  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
#  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
#  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
#  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
#  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
#  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
#  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

#  The views and conclusions contained in the software and documentation are those
#  of the authors and should not be interpreted as representing official policies,
#  either expressed or implied, of the FreeBSD Project.

# This script sets up and runs a Python Script which, at intervals invokes a capture 
# command to the Raspberry Pi camera, and stores those files locally in a dynamically
# named folder.

# To invoke, copy this script to an easy to find file location on your Raspberry Pi
# (eg. /home/pi/), log into your Raspberry Pi via terminal and type:
#
# sudo python /your/file/location/raspiLapseCam.py (add &) if you wish to run as a
# background task. A process ID will be shown which can be ended with

# sudo kill XXXX (XXXX = process number)

# Based on your settings the application will no begin capturing images
# saving them to your chose file location (same as current location of this file as default.

# Import some frameworks
import os
import sys
import time
import RPi.GPIO as GPIO
from datetime import datetime

sender_path=os.path.join(HOME_FOLDER,sender)

every_seconds=every_minutes*60

if __name__ == '__main__':
    if len(sys.argv) > 1:
        every_minutes = int(sys.argv[1])

do_loop = True
if every_minutes == 0:
    do_loop = False

# Grab the current datetime which will be used to generate dynamic folder names
d = datetime.now()
initYear  = d.year
initMonth = d.month
initDate  = d.day
initHour  = d.hour
initMins  = d.minute

# Define the location where you wish to save files. Set to HOME as default. 
# If you run a local web server on Apache you could set this to /var/www/ to make them 
# accessible via web browser.
folderToSave = HOME_FOLDER + "timelapse_%(yr)04d_%(mo)02d_%(da)02d_%(hr)02d_%(mi)02d" % {
'yr':initYear,'mo':initMonth,'da':initDate,'hr':initHour,'mi':initMins }

if not do_loop:
    folderToSave = HOME_FOLDER + "timelapse"

if not os.path.exists(folderToSave):
    os.mkdir(folderToSave)

# Set the initial serial for saved images to 1
fileSerial = 1

# Run a WHILE Loop of infinitely
while True:
    d = datetime.now()
    if True:
        # Set FileSerialNumber to 000X using four digits
        fileSerialNumber = fileSerial
        
        # Capture the CURRENT time (not start time as set above) to insert into each capture image filename
        mins  = d.minute
        hour  = d.hour
        day   = d.day
        month = d.month
        year  = d.year
        
        # Define the size of the image you wish to capture. 
        imgWidth  = 1024 # Max = 2592 
        imgHeight =  768 # Max = 1944
        print " ====================================== Saving file at %02d:%02d" % ( hour, mins )

        outfile = "%(fd)s/%(yr)04d_%(mo)02d_%(da)02d_%(hr)02d_%(mi)02d.jpg" % {
            'fd':folderToSave,'se':fileSerialNumber,'yr':year,'mo':month,'da':day,'hr':hour,'mi':mins}

        # Capture the image using raspistill. Set to capture with added sharpening, auto white balance and average metering mode
        # Change these settings where you see fit and to suit the conditions you are using the camera in
        print "capturing file"
        os.system( "raspistill -w %(wi)d -h %(he)d -o %(of)s -sh 40 -awb auto -mm average -v -vf 2>%(lo)s 1>>%(lo)s && %(se)s %(see)s %(ser)s %(sep)s %(of)s 2>>%(lo)s 1>> %(lo)s" % {
            'wi':imgWidth,'he':imgHeight,'of':outfile,'lo':outfile+'.log', 
            'se':sender_path,'see':sender_endpoint,'ser':sender_rnd,
            'sep':sender_piname} )

        print "captured"

        # Increment the fileSerial
        fileSerial += 1
       
        if not do_loop:
            break
        
        else:
            # Wait 60 seconds (1 minute) before next capture
            time.sleep(every_seconds)
       
    else:
        
        # Just trapping out the WHILE Statement
        print " ====================================== Doing nothing at this time"
