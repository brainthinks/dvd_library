#!/usr/bin/env bash

source "./scripts/utils.sh"

APPLICATION_NAME="$(getApplicationName)"
VERSION="$(getNodePackageVersion)"

TARGET_DIR="../configs/"
DATE=$($(echo date +'%Y_%m_%d_%s'))

# @todo - this version may not indicate the actual version of the application
# it was used with, such as when running a db restore
FILE_NAME="${APPLICATION_NAME}_${VERSION}_${DATE}"

function getParameters () {
  while :; do
    case "$1" in
      -s|--suffix)
        shift
        FILE_NAME="${FILE_NAME}_${1}"
        ;;
      *)
        break
    esac

    shift
  done

  return 0
}

getParameters "$@"

FULL_FILE_NAME="$TARGET_DIR/$FILE_NAME.tar.gz"

dps "Ensuring the dbdumps directory exists..."
mkdir -p $TARGET_DIR
ec "Successfully created dump directory" "Failed to create dump directory"

dps "Creating a tar.gz of the dump..."
tar -czvf "$FULL_FILE_NAME" configs*
ec "Successfully tar'd the dump" "Failed to tar the dump"

if [ ! -f "$FULL_FILE_NAME" ]; then
  dpe "Config backup FAILED!!!"
  exit 1
fi

dpsuc "Config backed up at '$FULL_FILE_NAME'!"

exit 0
