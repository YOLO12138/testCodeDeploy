#!/bin/bash
echo "Installing dependencies (Ubuntu)"
sudo apt update -y
sudo apt install -y apache2
sudo systemctl enable apache2
