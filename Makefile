test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

bench:
	@./node_modules/.bin/matcha benchmark

.PHONY: test