# localspot

Local version of NetSpot server to test wireless upload/download speed during active site surveys.

You need a **server computer** with working Apache + PHP web server, and a **survey computer** that will run the NetSpot application.

## Installation

Clone this repository to a `speed` directory under the root directory of you web server.

	# Under Mac OS X
	git clone https://github.com/gjherbiet/localspot.git /Library/WebServer/Documents/speed
	# Under Debian/Ubuntu
	git clone https://github.com/gjherbiet/localspot.git /var/www/speed

## Configuration

By default, the NetSpot application will try to connect to `http://www.netspotapp.com/speed/` to do the upload/download speed testing.

We need to fool the **survey computer** to connect to the **server computer** instead. This is done by editing your `/etc/hosts` file.

Assuming your **server computer** is has IP `10.1.0.1` during the survey, add or modify the following line on the `/etc/hosts` file of the **survey computer**:

	10.1.0.1 www.netspotapp.com

Then flush your DNS cache:

	# Under Mac OS X prior to Lion
	sudo dscacheutil -flushcache
	# Under Mac OS X Lion and above
	sudo killall -HUP mDNSResponder
	# Under Debian/Ubuntu
	sudo /etc/init.d/dns-clean
