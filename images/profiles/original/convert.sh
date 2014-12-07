#!/bin/sh

echo convert to 128x128...
for i in *; do echo convert $i -resize "128x128^" -gravity center -crop 128x128+0+0 +repage ../$i; done | sh
