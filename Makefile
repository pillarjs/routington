test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

build:
	@component build \
		--standalone routington \
		--out dist \
		--name routington

gzip: build
	@mkdir -p build
	@uglifyjs dist/routington.js -m -c hoist_vars=true -o build/routington.min.js
	@gzip -c -9 build/routington.min.js > build/routington.min.js.gz

.PHONY: test build gzip