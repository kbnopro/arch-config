#!/bin/bash

MONITOR_NAMES=$(hyprctl monitors -j | jq 'map(select(.["name"] != "eDP-1")) | map({name}) | .[].name' | sed 's/"//g')

for item in $MONITOR_NAMES; do
  echo "Toggling monitor: $item"
  hyprctl dispatch dpms off $item
  hyprctl dispatch dpms on $item
  wlr-randr --output $item --toggle
  wlr-randr --output $item --toggle
done
