#!/bin/sh
#echo "Killing everything on :4000 port..."
#kill $( lsof -i:4000 -t ) 
echo "Starting local server..."
jekyll serve --watch --drafts &
sleep 5
#ngrok http 4000 
osascript -e 'tell application "System Events" to keystroke "t" using command down' -e 'delay 1' -e 'tell application "System Events" to keystroke "ngrok http 4000"' -e 'tell application "System Events" to keystroke return'