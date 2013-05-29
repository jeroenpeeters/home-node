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

Build and install Mochad:
- sudo apt-get install libusb-1.0-0-dev
- wget http://sourceforge.net/projects/mochad/files/mochad-0.1.15.tar.gz
- tar xf mochad-0.1.15.tar.gz
- cd mochad-0.1.15
- ./configure
- make
- sudo make install


Install Home-Node
- Download or checkout sources from git
- node app.js


Publisher/Subscriber
====================

Home-Node uses a publisher/subscriber message bus style to let modules internally communicate.
Currently the following pubsub topics/endpoints are available:

- /sensor/thermostat

