Home-Node
=========

Home-Node is a NodeJs application that offers a configurable dashboard to control home appliances, such a lighting devices.
Secondly this NodeJs application is targeted to run on the RaspberryPi, creating a powerfull but low powered home 
automation device.

Home-Node uses Mochad to control the devices (http://sourceforge.net/apps/mediawiki/mochad/index.php?title=Main_Page).

My setup:
- RaspberryPi with Mochad-0.1.15 + Home-Node
- Marmitek CM15Pro X10 + RF controller
- 2x LMM32 Lamp/Dimmer Module

Setup on RaspberryPi
====================

I assume you've already installed an OS (such as Raspbian) and NodeJs on your Pi. If not please do so first. 
This guide is not about that.

Build an install Mochad
1. sudo apt-get install libusb-1.0-0-dev
2. wget http://sourceforge.net/projects/mochad/files/mochad-0.1.15.tar.gz
3. tar xf mochad-0.1.15.tar.gz
4. cd mochad-0.1.15
5. ./configure
6. make
7. sudo make install


Install Home-Node
1. Download or checkout sources from git
2. node app.js


