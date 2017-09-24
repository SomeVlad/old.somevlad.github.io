#!/bin/sh
echo 'Build started...'
cd cv/
echo 'Initiating CV build...'
yarn build
echo 'Done'
cd ..
echo 'Removing old CV template...'
rm -f _includes/cv.html
echo 'Done'
echo 'Moving new CV template to _includes folder...'
cp -a cv/build/index.html _includes/cv.html
echo 'Done'
echo 'CV build completed. Initiating tags build...'
python ./generate_tags.py
echo 'Done'
echo 'Jekyll build starting...'
jekyll build --incremental
echo 'Done'