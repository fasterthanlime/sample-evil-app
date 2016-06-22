
ITCHY=./node_modules/.bin/itchy

all:
	$(ITCHY) build win32
	$(ITCHY) build linux
	$(ITCHY) build osx
	$(MAKE) -j4 win32 linux osx

win32: build
	cp itch.toml 'build/Sample Evil App-win32-ia32/.itch.toml'
	$(ITCHY) publish release win32
	
linux: build
	cp itch.toml 'build/Sample Evil App-linux-x64/.itch.toml'
	$(ITCHY) publish release linux

osx: build
	cp itch.toml 'build/Sample Evil App-darwin-x64/.itch.toml'
	$(ITCHY) publish release osx
