test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

build:
	@component build \
		--standalone routington \
		--out dist \
		--name routington

.PHONY: test build