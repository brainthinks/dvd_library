#!/usr/bin/env bash

source "./scripts/utils.sh"

NODE_VERSION="10.15"

function updateSources () {
  dps "Adding yarn repository key"
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  ec "Successfully added yarn respository key" "Failed to add yarn respository key"

  dps "Adding yarn respository"
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  ec "Successfully added yarn respository" "Failed to add yarn respository"

  return 0
}

function installPackages () {
  dps "Running 'apt update'"
  apt update -y
  ec "Successfully updated ubuntu repositories" "Failed to update ubuntu repositories"

  dps "Running 'apt upgrade'"
  apt upgrade -y
  ec "Successfully upgraded installed ubuntu packages" "Failed to upgrade installed ubuntu packages"

  dps "Installing linux dependencies"
  apt install -y \
    htop \
    git \
    curl \
    make \
    g++
  ec "Successfully installed all linux dependencies" "Failed to install all linux dependencies"

  dps "Installing yarn"
  apt install --no-install-recommends -y yarn
  ec "Successfully installed yarn" "Failed to install yarn"

  return 0
}

function installNode () {
  # By default, n-installer will install its executables only for the current user.
  # The environment variables and the subsequent cp command make these executables
  # available for all users.
  dps "Installing Node via tj/n"
  curl -L https://git.io/n-install | PREFIX="/usr/local" N_PREFIX="/usr/local/n" bash -s -- -y "$NODE_VERSION"
  ec "Successfully installed Node via tj/n" "Failed to install Node via tj/n"

  dps "Making node executables available..."
  cp --symbolic-link /usr/local/n/bin/* /usr/local/bin
  ec "Successfully added node executables" "Failed to add node executables"

  return 0
}

enforceRoot
updateSources
installPackages
installNode

APPLICATION_NAME="$(getApplicationName)"

dpsuc "Successfully bootstrapped this $APPLICATION_NAME environment!"

exit 0
