#!/bin/bash

set -u

DUPLICATE_FIRST=0
LINK_FILES=0
CONVERT=0
DEFLICKER=0
MAKE_MOVIE=1

REP_FOLDER=$PWD/site
SRC_FOLDER=$PWD/src
TMP_FOLDER=$PWD/conv
TMP_FOLDER=/tmp/conv
TMP_FOLDER_D=${TMP_FOLDER}/Deflickered

#COPY FIRST IMAGE SEVERAL TIMES
#if [[ "$DUPLICATE_FIRST" -eq "1" ]]; then
#	for i in $(seq -w 1 40); do
#		ln --verbose ${REP_FOLDER}/2015_05_15_15_06.jpg ${SRC_FOLDER}/2015_05_15_15_06.${i}.jpg
#	done
#else
#	echo "NO DUPLICATION REQUESTED"
#fi


#LINK IMAGES
if [[ "$LINK_FILES" -eq "1" ]]; then
	#ONLY BETWEEN 8H AND 18H
	ln --verbose ${REP_FOLDER}/*_{08,09,10,11,12,13,14,15,16,17,18}_??.jpg ${SRC_FOLDER}/
#	ln --verbose ${REP_FOLDER}/*15_15_{03,05,06,07}*.jpg ${SRC_FOLDER}/
#	ln --verbose ${REP_FOLDER}/*15_15_{1,2,3,4,5}?.jpg ${SRC_FOLDER}/
#	ln --verbose ${REP_FOLDER}/*15_{16,17,18}_*.jpg ${SRC_FOLDER}/
#	ln --verbose ${REP_FOLDER}/*{01,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31}_{08,09,10,11,12,13,14,15,16,17,18}_??.jpg ${SRC_FOLDER}/
#	ln --verbose ${REP_FOLDER}/*_19_{0,1,2,3}?.jpg ${SRC_FOLDER}/
#	ln --verbose ${REP_FOLDER}/*_19_4{0,1,2,3,4,5}?.jpg ${SRC_FOLDER}/
#	#ln --verbose ${REP_FOLDER}/*_06_??_??_??.jpg ${SRC_FOLDER}/
else
	echo "NO LINK FILES REQUESTED"
fi

#exit 0
#rm -rf ${TMP_FOLDER}

if [[ "$CONVERT" -eq "1" ]]; then
	TMP_FOLDER=/tmp/conv
	TMP_FOLDER_D=${TMP_FOLDER}/Deflickered

	j=0
	for i in ${SRC_FOLDER}/*.jpg; do
		j=$((j+1))
		echo -n "$j IN $i "
		tim=$(basename $i | cut -d . -f 1 | cut -d \/ -f 2 | tr '_' ' ' )
		echo -n "TIME $tim "
		OF=${TMP_FOLDER}/mod-`basename $i`
		echo "OUT $OF"

		if [[ ! -f "$OF" ]]; then
			#-resize 1920x1080
			convert -pointsize 30 -fill white -draw "text 630,750 \"${tim} #${j}\"" $i $OF.tmp && mv $OF.tmp $OF
		fi
	done
else
	echo "NO CONVERSION REQUESTED"

fi

if [[ "$DEFLICKER" -eq "1" ]]; then
	#exit 0
	ln -s $PWD/timelapse-deflicker.pl ${TMP_FOLDER}

	(cd ${TMP_FOLDER}; perl timelapse-deflicker.pl)
	#exit 0
else
	echo "NO DEFLICKERING REQUESTED"
	TMP_FOLDER_D=${TMP_FOLDER}

fi


if [[ "$MAKE_MOVIE" -eq "1" ]]; then

set -x
#exit 0

# http://ubuntuforums.org/showthread.php?t=2022316
ON=output
EXT=avi
DESC='raw.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -pattern_type glob -i '${SRC_FOLDER}/*.jpg' -c:v copy ${TMP_FOLDER_D}/${ON}.tmp/${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}
# Change -r 25 to define the frame rate. 25 here means 25 fps.


# Alternative commands, but your jpeg images will be recompressed (maybe you want to use one of these if you have png or any other kind of images, or you want a smaller sized video)
EXT=avi
DESC='mjpg.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -pattern_type glob -i '${SRC_FOLDER}/*.jpg' -c:v mjpeg -q:v 2 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}
# -q:v can get a value between 2-31. 2 is best quality and bigger size, 31 is worst quality and least size)

EXT=avi
DESC='ljpg.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -pattern_type glob -i '${SRC_FOLDER}/*.jpg' -c:v ljpeg ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}
# Lossless jpeg resulting in a huuuuuuuge file. Even larger in size than the sum of all of the input pictures together in the case of jpg images.


EXT=mp4
DESC='x264.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -framerate 24 -pattern_type glob -i '${SRC_FOLDER}/*.jpg' -c:v libx264 -q:v 2 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER}/${ON}.${DESC}${EXT} ${ON}.${DESC}${EXT}

EXT=avi
DESC='date.deflicker.mjpeg.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -framerate 24 -pattern_type glob -i "${TMP_FOLDER_D}/*.jpg" -c:v mjpeg -q:v 2 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}

EXT=mp4
DESC='date.deflicker.x264.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -framerate 24 -pattern_type glob -i "${TMP_FOLDER_D}/*.jpg" -c:v libx264 -q:v 2 -bf 0 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}

EXT=mp4
DESC='date.deflicker.x265.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -framerate 24 -pattern_type glob -i "${TMP_FOLDER_D}/*.jpg" -c:v libx265 -q:v 2 -bf 0 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}

EXT=mp4
DESC='date.deflicker.x264.HD.'
rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
rm ${ON}.${DESC}${EXT}
ffmpeg -r 24 -framerate 24 -pattern_type glob -i "${TMP_FOLDER_D}/*.jpg" -c:v libx264 -preset veryslow -movflags +faststart \
-x264-params crf=24 -crf 24 -level 3.0 -q:v 2 -bf 0 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}

EXT=mp4
DESC='date.deflicker.x265.HD.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -framerate 24 -pattern_type glob -i "${TMP_FOLDER_D}/*.jpg" -c:v libx265 -preset veryslow -movflags +faststart \
#-x265-params crf=24 -crf 24 -level 3.0 -q:v 2 -bf 0 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}

EXT=mp4
DESC='date.deflicker.x264.HD.1080p.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -framerate 24 -pattern_type glob -i "${TMP_FOLDER_D}/*.jpg" -c:v libx264 -preset veryslow -movflags +faststart \
#-x264-params crf=24 -crf 24 -level 3.0 -q:v 2 -s hd1080 -bf 0 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}

EXT=mp4
DESC='date.deflicker.x265.HD.1080p.'
#rm ${TMP_FOLDER_D}/${ON}.tmp.${EXT}
#rm ${ON}.${DESC}${EXT}
#ffmpeg -r 24 -framerate 24 -pattern_type glob -i "${TMP_FOLDER_D}/*.jpg" -c:v libx265 -preset veryslow -movflags +faststart \
#-x265-params crf=24 -crf 24 -level 3.0 -q:v 2 -s hd1080 -bf 0 ${TMP_FOLDER_D}/${ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}

#ffmpeg -r 25 -framerate 25 -pattern_type glob -i '${TMP_FOLDER_D}/*.jpg' -c:v libx265 -preset veryslow -movflags +faststart \
#-x265-params crf=24 -crf 24 -level 3.0 -q:v 2 ${TMP_FOLDER_D}/%{ON}.tmp.${EXT} && mv ${TMP_FOLDER_D}/${ON}.tmp.${EXT} ${ON}.${DESC}${EXT}

else
	echo "NO MAKING MOVIE REQUESTED"

fi
